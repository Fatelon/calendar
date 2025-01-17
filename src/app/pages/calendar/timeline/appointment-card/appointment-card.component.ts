import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { IAppointment } from '../interfaces';

@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatIconModule],
})
export class AppointmentCardComponent {
  @Input() public appointment: IAppointment | null = null;
  @Output() protected readonly delete = new EventEmitter<IAppointment>();

  protected onDelete(event: MouseEvent): void {
    event.stopPropagation();

    if (this.appointment) {
      this.delete.emit(this.appointment);
    }
  }
}
