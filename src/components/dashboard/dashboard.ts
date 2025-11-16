import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AddGoalComponent } from '../add-goal/add-goal.component';
import { ViewGoalComponent } from '../view-goal/view-goal.component';
import { MatAnchor } from '@angular/material/button';
import { EditGoalComponent } from '../edit-goal/edit-goal.component';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TestGoal } from '../../services/test-goal.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatAnchor, BaseChartDirective, MatButtonModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly dialog = inject(MatDialog);

  testService = inject(TestGoal);

  addGoal() {
    this.dialog.open(AddGoalComponent);
  }

  viewGoal() {
    this.dialog.open(ViewGoalComponent);
  }

  editGoal() {
    this.dialog.open(EditGoalComponent);
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
