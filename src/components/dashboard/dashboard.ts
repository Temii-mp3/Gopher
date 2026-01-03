import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { AddGoalComponent } from '../add-goal/add-goal.component';
import { MatAnchor } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule, MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TestGoal } from '../../services/test-goal.service';
import { NgClass } from '@angular/common';
import { Goal } from '../../models/goal.model';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { DeleteMenuComponent } from './delete-menu/delete-menu.component';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatAnchor,
    BaseChartDirective,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    NgClass,
    MatDialogTitle,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatDialogContent,
    MatPaginatorModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //paginator props
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5];

  viewMode: boolean = true;
  editMode: boolean = false;
  currDate: string = new Date().toLocaleDateString();
  readonly dialog = inject(MatDialog);

  completeCheckBox: String = 'Complete';

  testService = inject(TestGoal);

  get paginatedGoals() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.testService.goals.slice(startIndex, endIndex);
  }

  // Handle page changes
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // Get total number of goals
  get totalGoals() {
    return this.testService.goals.length;
  }

  addGoal() {
    this.dialog.open(AddGoalComponent);
  }

  editGoal(goal: Goal) {
    this.dialog.open(EditMenuComponent, { data: goal });
  }
  deleteGoal(goal: Goal) {
    this.dialog.open(DeleteMenuComponent, { data: goal });
  }

  toggleView() {
    this.viewMode = !this.viewMode;
    this.editMode = false;
    console.log(this.viewMode);
  }
  toggleEdit() {
    this.editMode = !this.editMode;
    this.viewMode = false;
    console.log(this.editMode);
  }

  toggleCompletion(goal: Goal) {
    goal.completed = !goal.completed;
    this.completeCheckBox = goal.completed ? 'Completed' : 'Complete';
    this.testService.goals.sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Goals Completed',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;
}
