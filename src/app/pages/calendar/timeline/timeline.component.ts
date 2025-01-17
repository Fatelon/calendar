import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { takeUntil } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AppDestroyService } from '@common/services';

import { CreateAppointmentDialogComponent } from './create-appointment-dialog';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule],
  providers: [AppDestroyService],
})
export class TimelineComponent {
  @Input() public selectedDate: Date = new Date();
  
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroy$: AppDestroyService = inject(AppDestroyService, { self: true });

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
      console.log('Dialog closed', result);
    });
  }
}
