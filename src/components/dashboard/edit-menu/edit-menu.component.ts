import { ChangeDetectionStrategy, Component, signal, model, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TestGoal } from '../../../services/test-goal.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Goal } from '../../../models/goal.model';

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
  templateUrl: './edit-menu.component.html',
  styleUrl: './edit-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMenuComponent {
  data: Goal = inject(MAT_DIALOG_DATA);
  testService = inject(TestGoal);
  datePicker = model<Date | null>(null);
  readonly goalName = signal('');
  readonly goalTarget = signal('');
  readonly frequency = signal('');
  readonly timeframe = signal('');
  readonly startDate = signal<Date | null>(null);
  readonly endDate = signal<Date | null>(null);
  goalFreq: String[] = ['Daily', 'Weekly', 'Biweekly', 'Monthly'];

  freqOptions: String[] = [];

  constructor() {
    for (let i = 0; i < 10; i++) {
      this.freqOptions.push(i.toString() + 'x');
    }
    this.goalName.set(this.data.name);
    this.goalTarget.set(this.data.target);
    this.frequency.set(this.data.frequency);
    this.timeframe.set(this.data.timeframe);
    this.startDate.set(this.data.start);
    this.endDate.set(this.data.end);
  }

  editGoal() {
    const goal: Goal = {
      name: this.goalName(),
      target: this.goalTarget(),
      frequency: this.frequency(),
      timeframe: this.timeframe(),
      start: this.startDate()!,
      end: this.endDate()!,
      completed: false,
      id: this.data.id,
    };

    const prevIndex = this.testService.goals.findIndex((c) => c.id == this.data.id);
    this.testService.goals.splice(prevIndex, 1, goal);
  }
}
