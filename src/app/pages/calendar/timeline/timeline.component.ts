import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CdkDropListGroup, CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, takeUntil } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AppDestroyService } from '@common/services';

import { AppointmentService } from '../services';

import { CreateAppointmentDialogComponent } from './create-appointment-dialog';
import { AppointmentCardComponent } from './appointment-card';
import { IAppointment } from './interfaces';

type TAppointmentsByDayHour = Record<number, Record<number, IAppointment[] | undefined>>;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, MatDialogModule, AppointmentCardComponent],
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
      }, {} as TAppointmentsByDayHour)),
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

  protected onDrop(event: CdkDragDrop<{ weekDay: number, hour: number }>): void {
    const draggedAppointment = event.item.data;
    const targetContainer = event.container;
    const targetWeekDay = targetContainer.data.weekDay;
    const targetHour = targetContainer.data.hour;
    const targetDate = this.getUpdatedDate(draggedAppointment.date, targetWeekDay, targetHour);
  
    if (this.findAppointment(targetWeekDay, targetHour)) {
      // Slot is already occupied. Appointment cannot be moved.
      // TODO: Show a notification to the user or move an old appointment to another place.
      return;
    }
  
    this.appointmentService.deleteAppointment(draggedAppointment.date);
    this.appointmentService.addAppointment({ ...draggedAppointment, date: targetDate });
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

  private getUpdatedDate(oldDate: Date, weekDay: number, targetHour: number): Date {
    const newDate = new Date(oldDate);
    const weekDayIndex = weekDay;
  
    newDate.setDate(oldDate.getDate() - oldDate.getDay() + weekDayIndex);
    newDate.setHours(targetHour, 0, 0, 0);
  
    return newDate;
  }
}
