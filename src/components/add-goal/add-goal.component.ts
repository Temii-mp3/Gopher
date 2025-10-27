import { ChangeDetectionStrategy, Component, signal, model, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TestGoal } from '../../services/test-goal.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Goal } from '../../models/goal.model';

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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-goal.component.html',
  styleUrl: './add-goal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGoalComponent {
  testService = inject(TestGoal);
  datePicker = model<Date | null>(null);
  readonly goalName = signal('');
  readonly goalTarget = signal('');
  readonly frequency = signal('');
  readonly timeframe = signal('');
  readonly date = signal<Date | null>(null);
  goalFreq: String[] = ['Daily', 'Weekly', 'Biweekly', 'Monthly'];

  createNewGoal() {
    const goal: Goal = {
      name: this.goalName(),
      target: this.goalTarget(),
      frequency: this.frequency() + this.timeframe(),
      start: this.date()!,
      completed: false,
    };

    console.log(goal.start.toLocaleDateString('en-US'));
    this.testService.goals.push(goal);
  }
}
