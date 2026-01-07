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
import { TestGoal } from '../../services/goal.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Goal } from '../../models/models';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { SprintService } from '../../services/sprint.service';
import { AlertDialogComponent } from '../alert-dialog.component/alert-dialog.component';
import { AlertDialogService } from '../../services/alert-dialog.service';

@Component({
  selector: 'app-add-goal.component',
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
  templateUrl: './add-goal.component.html',
  styleUrl: './add-goal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGoalComponent {
  newGoalForm!: FormGroup;

  currDate: number = new Date().getDate();
  testService = inject(TestGoal);
  datePicker = model<Date | null>(null);
  sprintService = inject(SprintService);

  goalFreq: String[] = ['Daily', 'Weekly', 'Biweekly', 'Monthly'];
  freqOptions: String[] = [];
  readonly dialogRef = inject(MatDialogRef<AddGoalComponent>);
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private alertService: AlertDialogService) {
    for (let i = 0; i < 7; i++) {
      this.freqOptions.push(i.toString() + 'x');
    }
    console.log(this.freqOptions);

    this.newGoalForm = this.fb.group({
      name: ['', Validators.required],
      frequency: ['', Validators.required],
    });
  }
  randomIDGenerator(): string {
    return (Math.floor(Math.random() * (100 - 500 + 1)) + 100).toString();
  }

  createNewGoal() {
    if (this.newGoalForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const goal: Goal = {
      ...this.newGoalForm.value,
      completed: false,
      id: this.randomIDGenerator(),
    };

    console.log(goal);
    this.testService.goals().push(goal);
    this.dialogRef.close();
  }

  startFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).getDate();
    if (!date) return true;
    return this.currDate <= date;
  };

  endFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).getDate();
    const startDate = this.newGoalForm.get('startDate')!.value.getDate();
    return this.currDate <= date && startDate <= date;
  };

  onCancelClick(): void {
    this.dialogRef.close();
  }

  updateErrorMessage() {
    if (this.newGoalForm.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('YOLO');
    }
  }
}
