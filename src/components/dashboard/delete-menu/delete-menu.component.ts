import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Goal } from '../../../models/models';
import { TestGoal } from '../../../services/goal.service';

@Component({
  selector: 'app-delete-menu.component',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './delete-menu.component.html',
  styleUrl: './delete-menu.component.css',
})
export class DeleteMenuComponent {
  data: Goal = inject(MAT_DIALOG_DATA);
  testService = inject(TestGoal);

  deleteGoal() {
    const index = this.testService.goals.findIndex((c) => c.id == this.data.id);
    this.testService.goals.splice(index);
  }
}
