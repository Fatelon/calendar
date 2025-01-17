import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatButtonModule],
})
export default class CalendarComponent {
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
    this.selectedDate = date;

    if (!isCurrentMonth) {
      this.loadMonth(this.selectedDate);
    }
  }

  protected loadMonth(date: Date): void {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  
    this.previousMonthDays = Array.from(
      { length: firstDay },
      (_, i) => new Date(date.getFullYear(), date.getMonth() - 1, prevMonthLastDate - firstDay + 1 + i)
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
