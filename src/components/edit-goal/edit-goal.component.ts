import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TestGoal } from '../../services/test-goal.service';
import { MatMenuModule, MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { Goal } from '../../models/goal.model';
@Component({
  selector: 'app-edit-goal.component',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDialogTitle,
    MatIconModule,
    MatCheckboxModule,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
  ],
  templateUrl: './edit-goal.component.html',
  styleUrl: './edit-goal.component.css',
})
export class EditGoalComponent {
  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly menu = inject(MatDialog);
  testGoal = inject(TestGoal);

  openMenu() {
    const dialogRef = this.menu.open(EditMenuComponent, { restoreFocus: false });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
  }

  editGoal(goal: Goal) {
    const dialogRef = this.menu.open(EditMenuComponent, { data: goal });
  }
  deleteGoal(goal: Goal) {}
}
