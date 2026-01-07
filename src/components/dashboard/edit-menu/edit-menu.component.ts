import { ChangeDetectionStrategy, Component, signal, model, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TestGoal } from '../../../services/goal.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Goal } from '../../../models/models';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-add-goal',
  imports: [
    MatSelectModule,
    MatDialogActions,
    MatDialogTitle,
    MatFormFieldModule,
    MatCard,
    ReactiveFormsModule,
    MatDialogClose,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-menu.component.html',
  styleUrl: './edit-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMenuComponent implements OnInit {
  editGoalForm!: FormGroup;
  errorMessage = signal('');
  data: Goal = inject(MAT_DIALOG_DATA);
  testService = inject(TestGoal);
  datePicker = model<Date | null>(null);
  readonly dialogRef = inject(MatDialogRef<EditMenuComponent>);

  freqOptions: String[] = [];

  constructor(private fb: FormBuilder) {
    for (let i = 0; i < 7; i++) {
      this.freqOptions.push(i.toString() + 'x');
    }
    console.log(this.freqOptions);

    this.editGoalForm = this.fb.group({
      name: ['', Validators.required],
      frequency: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.editGoalForm.patchValue({
      name: this.data.name,
      frequency: this.data.frequency,
    });
  }

  editGoal() {
    const formValue = this.editGoalForm.value;
    const goal: Goal | null = this.testService.goals().find((i) => i.id == this.data.id) ?? null;
    if (goal) {
      const updatedGoal: Goal = {
        ...goal,
        name: formValue.name,
        frequency: formValue.frequency,
      };

      this.testService.updateGoal(updatedGoal.id, updatedGoal);
    }

    this.dialogRef.close();
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  updateErrorMessage() {
    if (this.editGoalForm.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('YOLO');
    }
  }
}
