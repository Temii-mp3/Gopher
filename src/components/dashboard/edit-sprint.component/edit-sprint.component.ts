import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, signal, model, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Sprint } from '../../../models/models';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { SprintService } from '../../../services/sprint.service';
@Component({
  selector: 'app-edit-sprint',
  imports: [
    MatSelectModule,
    MatDialogActions,
    MatDialogTitle,
    MatFormFieldModule,
    MatDialogClose,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCard,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-sprint.component.html',
  styleUrl: './edit-sprint.component.css',
})
export class EditSprintComponent implements OnInit {
  data: Sprint = inject(MAT_DIALOG_DATA);
  editedSprintForm!: FormGroup;
  sprintService = inject(SprintService);
  currDate: number = new Date().getDate();
  datePicker = model<Date | null>(null);
  allowedDays: Set<number> = new Set([7, 14, 21, 28]);
  readonly dialogRef = inject(MatDialogRef<EditSprintComponent>);
  errorMessage = signal('');

  constructor(private fb: FormBuilder) {
    this.editedSprintForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    this.editedSprintForm.patchValue({
      startDate: this.data.start,
      endDate: this.data.end,
    });
  }

  editSprint() {
    const sprint = this.sprintService.currSprint();
    if (this.editedSprintForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    } else if (sprint && sprint.status == 'active') {
      alert('Only one active sprints are allowed at a time.');
    } else {
      const formValue = this.editedSprintForm.value;

      const sprint = this.sprintService.currSprint();

      if (sprint) {
        const updatedSprint: Sprint = {
          ...sprint,
          start: formValue.startDate,
          end: formValue.endDate,
        };

        this.sprintService.uploadSprint(updatedSprint);
        this.dialogRef.close();
      }
    }
  }

  startFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).getDate();
    if (!date) return true;
    return this.currDate <= date;
  };

  endFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const startDateValue = this.editedSprintForm.get('startDate')!.value as Date;

    const startDay = startDateValue.getDay();
    const endDay = d?.getDay();

    const isAfterStart = d > startDateValue;
    if (!isAfterStart) return false;

    const isSameDay = endDay == startDay;
    if (!isSameDay) return false;

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = d.getTime() - startDateValue.getTime();
    const diffDays = diffMs / msPerDay;

    const isValidWeeks = this.allowedDays.has(diffDays);

    return isValidWeeks;
  };

  onCancelClick(): void {
    this.dialogRef.close();
  }

  updateErrorMessage() {
    if (this.editedSprintForm.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('YOLO');
    }
  }
}
