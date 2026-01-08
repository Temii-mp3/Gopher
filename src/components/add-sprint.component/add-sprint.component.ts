import { ChangeDetectionStrategy, Component, signal, model, inject } from '@angular/core';
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
import { Sprint } from '../../models/models';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { SprintService } from '../../services/sprint.service';
import { UtilService } from '../../services/util.service';
import { AlertDialogService } from '../../services/alert-dialog.service';

@Component({
  selector: 'app-add-sprint',
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
  templateUrl: './add-sprint.component.html',
  styleUrl: './add-sprint.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSprintComponent {
  newSprintForm!: FormGroup;

  utilService = inject(UtilService);
  currDate: number = new Date().getDate();
  sprintService = inject(SprintService);
  datePicker = model<Date | null>(null);
  allowedDays: Set<number> = new Set([7, 14, 21, 28]);

  goalFreq: String[] = ['Daily', 'Weekly', 'Biweekly', 'Monthly'];
  freqOptions: String[] = [];
  readonly dialogRef = inject(MatDialogRef<AddSprintComponent>);
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private alertService: AlertDialogService) {
    for (let i = 0; i < 10; i++) {
      this.freqOptions.push(i.toString() + 'x');
    }
    console.log(this.freqOptions);

    this.newSprintForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }
  randomIDGenerator(): string {
    return (Math.floor(Math.random() * (100 - 500 + 1)) + 100).toString();
  }

  createNewSprint() {
    const sprint = this.sprintService.currSprint();
    if (this.newSprintForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    } else if (sprint && sprint.status == 'active') {
      alert('Only one active sprints are allowed at a time.');
    } else {
      const formValue = this.newSprintForm.value;
      const sprintName = 'Sprint' + ' ' + this.sprintService.pastSprints().length + 1;
      console.log(sprintName);
      const sprint: Sprint = {
        name: sprintName,
        start: formValue.startDate,
        end: formValue.endDate,
        duration: 0,
        status: 'planning',
        id: this.randomIDGenerator(),
        goals: [],
        completion: 0,
      };

      this.sprintService.uploadSprint(sprint);

      console.log(sprint);
      this.dialogRef.close();
    }
  }

  startFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).getDate();
    if (!date) return true;
    return this.currDate <= date;
  };

  endFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const startDateValue = this.newSprintForm.get('startDate')!.value as Date;

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
    if (this.newSprintForm.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('YOLO');
    }
  }
}
