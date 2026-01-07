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
import { AlertDialogService } from '../../../services/alert-dialog.service';

@Component({
  selector: 'app-delete-menu.component',
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './delete-menu.component.html',
  styleUrl: './delete-menu.component.css',
})
export class DeleteMenuComponent {
  constructor(private alertService: AlertDialogService) {}
  data: Goal = inject(MAT_DIALOG_DATA);
  testService = inject(TestGoal);
}
