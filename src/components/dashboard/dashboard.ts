import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddGoalComponent } from '../add-goal/add-goal.component';
import { ViewGoalComponent } from '../view-goal/view-goal.component';
import { MatAnchor } from '@angular/material/button';
import { EditGoalComponent } from '../edit-goal/edit-goal.component';

@Component({
  selector: 'app-dashboard',
  imports: [MatAnchor],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly dialog = inject(MatDialog);

  addGoal() {
    this.dialog.open(AddGoalComponent);
  }

  viewGoal() {
    this.dialog.open(ViewGoalComponent);
  }

  editGoal() {
    this.dialog.open(EditGoalComponent);
  }
}
