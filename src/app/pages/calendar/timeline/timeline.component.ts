import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, takeUntil } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AppDestroyService } from '@common/services';

import { AppointmentService } from '../services';

import { CreateAppointmentDialogComponent } from './create-appointment-dialog';
import { AppointmentCardComponent } from './appointment-card';
import { IAppointment } from './interfaces';

interface IAppointmentsByDayHour {
  [day: number]: {
    [hour: number]: IAppointment[] | undefined;
  };
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, AppointmentCardComponent],
  providers: [AppDestroyService],
})
export class TimelineComponent {
  @Input() public selectedDate: Date = new Date();
  
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly appointmentService: AppointmentService = inject(AppointmentService);
  private readonly destroy$: AppDestroyService = inject(AppDestroyService, { self: true });

  protected readonly appointmentsByDayHourSignal = toSignal(
    this.appointmentService.weekAppointments$.pipe(
      map(appointments => appointments.reduce((acc, appointment) => {
        const day = appointment.date.getDay();
        const hour = appointment.date.getHours();

        if (!acc[day]) {
          acc[day] = {};
        }

        acc[day][hour] = acc[day][hour] || [];
        acc[day][hour].push(appointment); 

        return acc;
      }, {} as IAppointmentsByDayHour)),
    )
  );

  protected weekDays: number[] = Array.from({ length: 7 }, (_, i) => i);
  protected hours: { label: string, hour: number  }[] = Array.from({ length: 24 }, (_, i) => ({
    label: `${(i + 1) % 12 || 1} ${i < 12 ? 'AM' : 'PM'}`,
    hour: i,
  }));

  protected onTimeSlotClick(weekDay: number, hourData: { label: string, hour: number  }): void {
    const selectedDay = new Date(this.selectedDate);

    selectedDay.setDate(selectedDay.getDate() + weekDay - selectedDay.getDay());
    selectedDay.setHours(hourData.hour, 0, 0, 0);

    this.dialog.open(CreateAppointmentDialogComponent, {
      data: { date: selectedDay },
      width: '39rem',
    })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.appointmentService.addAppointment({ date: selectedDay, description: result });
        }
      });
  }

  protected findAppointment(weekDay: number, hour: number): IAppointment | null {
    if (!this.appointmentsByDayHourSignal()) {
      return null;
    } 
    const appointments = this.appointmentsByDayHourSignal()![weekDay]?.[hour];
    
    return appointments?.[0] || null;
  }

  protected onDeleteAppointment(appointment: IAppointment): void {
    this.appointmentService.deleteAppointment(appointment.date);
  }
}
