import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogTitle } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TestGoal } from '../../services/test-goal.service';
import { Goal } from '../../app/models/goal.model';
@Component({
  selector: 'app-view-goal.component',
  imports: [MatButtonModule, MatDialogModule, MatDialogTitle, MatCheckboxModule],
  templateUrl: './view-goal.component.html',
  styleUrl: './view-goal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewGoalComponent {
  testGoal = inject(TestGoal);

  updateGoal(completed: boolean, index: number) {
    console.log(completed);
    let target = this.testGoal.incompleteGoals.at(index);
    if (target == undefined) {
      target = this.testGoal.completeGoals.at(index);
      if (target == undefined) {
        return;
      }
    }

    target.completed = completed;

    if (target.completed == false) {
      this.testGoal.completeGoals.splice(index, 1);
      this.testGoal.incompleteGoals.push(target);
    } else {
      this.testGoal.incompleteGoals.splice(index, 1);
      this.testGoal.completeGoals.push(target);
    }
  }
}
