import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';``

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrl: './create-appointment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatDialogModule],
})
export class CreateAppointmentDialogComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogData: { date: Date } = inject<{ date: Date }>(MAT_DIALOG_DATA);
  private readonly dialogRef: MatDialogRef<CreateAppointmentDialogComponent> = 
    inject<MatDialogRef<CreateAppointmentDialogComponent>>(MatDialogRef);

  protected readonly date: Date = this.dialogData.date;

  protected readonly formGroup = this.formBuilder.group({
    description: [null],
  });

  protected onClose(): void {
    this.dialogRef.close(this.formGroup.value.description);
  }
}
