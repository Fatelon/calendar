import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import * as weekUils from '@common/utils/week.utils';

import { TimelineComponent } from './timeline';
import { AppointmentService } from './services';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatButtonModule, TimelineComponent],
})
export default class CalendarComponent {
  private readonly appointmentService: AppointmentService = inject(AppointmentService);
  
  protected currentDate: Date = new Date();
  protected selectedDate: Date = new Date();
  protected previousMonthDays: Date[] = [];
  protected daysInMonth: Date[] = [];
  protected nextMonthDays: Date[] = [];
  protected weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  protected get previousMonth(): Date {
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
  }

  protected get nextMonth(): Date {
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
  }

  public ngOnInit(): void {
    this.loadMonth(this.currentDate);
  }

  protected isCurrentDay(day: Date): boolean {
    return this.isDaysEqual(day, new Date());
  }

  protected isSelectedDay(day: Date): boolean {
    return this.isDaysEqual(day, this.selectedDate);
  }

  protected selectDay(date: Date, isCurrentMonth = true): void {
    if (this.isDaysEqual(date, this.selectedDate)) {
      return;
    }

    this.selectedDate = date;

    if (!isCurrentMonth) {
      this.loadMonth(this.selectedDate);
    }

    this.appointmentService.setCurrentDate(this.selectedDate);
  }

  protected loadMonth(date: Date): void {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const startDay = weekUils.START_OF_WEEK_DAY;
    const diff = (firstDay >= startDay) ? firstDay - startDay : 7 - (startDay - firstDay);
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
    this.previousMonthDays = Array.from(
      { length: diff },
      (_, i) => new Date(date.getFullYear(), date.getMonth() - 1, prevMonthLastDate - diff + 1 + i)
    );
    
    this.daysInMonth = Array.from(
      { length: lastDate },
      (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
    );
    
    const remainingDays = 7 - (this.previousMonthDays.length + this.daysInMonth.length) % 7;
    
    this.nextMonthDays = Array.from(
      { length: remainingDays },
      (_, i) => new Date(date.getFullYear(), date.getMonth() + 1, i + 1)
    );

    this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private isDaysEqual(day1: Date, day2: Date): boolean {
    return day1.getDate() === day2.getDate() && 
           day1.getMonth() === day2.getMonth() &&
           day1.getFullYear() === day2.getFullYear();
  }
}
