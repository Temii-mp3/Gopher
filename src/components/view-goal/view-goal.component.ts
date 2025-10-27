import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogTitle } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TestGoal } from '../../services/test-goal.service';
import { Goal } from '../../models/goal.model';
@Component({
  selector: 'app-view-goal.component',
  imports: [MatButtonModule, MatDialogModule, MatDialogTitle, MatCheckboxModule],
  templateUrl: './view-goal.component.html',
  styleUrl: './view-goal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewGoalComponent {
  testGoal = inject(TestGoal);
  currDate: string = new Date().toLocaleDateString();
  updateGoal(completed: boolean, name: string) {
    console.log(completed);
    let target = this.testGoal.goals.find((c) => c.name === name);
    if (target == undefined) {
      return;
    }

    target.completed = completed;
  }
}
