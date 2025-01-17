import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, of, tap } from 'rxjs';

import * as weekUtils from '@common/utils/week.utils';

import { IAppointment } from '../timeline/interfaces';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private appointments$ = new BehaviorSubject<IAppointment[]>([
    { date: new Date('2025-01-12T08:00:00'), description: 'Meeting with Bob' },
    { date: new Date('2025-01-13T10:00:00'), description: 'Doctor Appointment' },
    { date: new Date('2025-01-15T14:00:00'), description: 'Lunch with Alice' },
  ]);
  private currentDate$ = new BehaviorSubject<Date>(new Date());

  public weekAppointments$: Observable<IAppointment[]> = combineLatest([
    this.appointments$.asObservable(),
    this.currentDate$.asObservable()
  ]).pipe(
    map(([appointments, currentDate]) => {
      const weekStart = weekUtils.getStartOfWeek(currentDate);
      const weekEnd = weekUtils.getEndOfWeek(currentDate);

      return appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        
        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
      });
    })
  );

  public addAppointment(appointment: IAppointment): void {
    const currentAppointments = this.appointments$.getValue().filter(appointment => appointment.date.getTime() === appointment.date.getTime());

    this.appointments$.next([...currentAppointments, appointment]);
  }

  public deleteAppointment(date: Date): void {
    const currentAppointments = this.appointments$.getValue();

    this.appointments$.next(currentAppointments.filter(appointment => appointment.date.getTime() !== date.getTime()));
  }

  public setCurrentDate(date: Date): void {
    this.currentDate$.next(date);
  }
}
