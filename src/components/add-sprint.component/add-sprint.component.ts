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

@Component({
  selector: 'app-add-sprint.component',
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
  testService = inject(SprintService);
  datePicker = model<Date | null>(null);

  goalFreq: String[] = ['Daily', 'Weekly', 'Biweekly', 'Monthly'];
  freqOptions: String[] = [];
  readonly dialogRef = inject(MatDialogRef<AddSprintComponent>);
  errorMessage = signal('');

  constructor(private fb: FormBuilder) {
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
    if (this.newSprintForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    } else if (this.testService.sprint.length > 1) {
      alert('Only one active sprints are allowed at a time.');
    } else {
      const sprint: Sprint = {
        ...this.newSprintForm.value,
        status: 'planning',
        id: this.randomIDGenerator(),
      };

      this.testService.sprint.push(sprint);

      console.log(sprint);
      this.dialogRef.close();
      this.utilService.reloadPage();
    }
  }

  startFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).getDate();
    if (!date) return true;
    return this.currDate <= date;
  };

  endFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).getDate();
    const startDate = this.newSprintForm.get('startDate')!.value.getDate();
    return this.currDate <= date && startDate <= date;
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
