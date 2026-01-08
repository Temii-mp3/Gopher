import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { TestGoal } from '../../services/goal.service';
import { NgClass } from '@angular/common';
import { Goal } from '../../models/models';
import { EditMenuComponent } from './edit-menu/edit-menu.component';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { AddSprintComponent } from '../add-sprint.component/add-sprint.component';
import { SprintService } from '../../services/sprint.service';
import { EditSprintComponent } from './edit-sprint.component/edit-sprint.component';
import { Sprint } from '../../models/models';
import { AlertDialogService } from '../../services/alert-dialog.service';

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
})
export class Dashboard implements OnInit {
  constructor(private alertService: AlertDialogService) {}
  ngOnInit(): void {
    console.log(this.sprintService.currSprint());
  }
  msPerDay = 1000 * 60 * 60 * 24;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //paginator props
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5];
  sprintService = inject(SprintService);

  viewMode: boolean = true;
  editMode: boolean = false;
  currDate: string = new Date().toLocaleDateString();
  readonly dialog = inject(MatDialog);

  completeCheckBox: String = 'Complete';

  testService = inject(TestGoal);

  get paginatedGoals() {
    const sprint = this.sprintService.currSprint();
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return sprint?.goals.slice(startIndex, endIndex);
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
    const infoMsg1 = 'Cannot add goal';
    const infoMsg2 = 'You need to create a sprint before adding goals';
    if (this.sprintService.currSprint() == null) {
      this.alertService.openInfo(infoMsg1, infoMsg2);
    } else {
      this.dialog.open(AddGoalComponent);
    }
  }

  createSprint() {
    this.dialog.open(AddSprintComponent);
  }

  editSprint(sprint: Sprint) {
    this.dialog.open(EditSprintComponent, { data: sprint });
  }

  startSprint() {
    const currSprint = this.getCurrSprint();
    if (currSprint && currSprint.goals.length == 0) {
      console.log('No goals added');
      this.alertService.openInfo(
        'Cannot start sprint',
        'Please add at least one goal before starting the sprint.'
      );
    } else {
      this.alertService
        .openConfirmation('Start Sprint', 'Sprints cannot be edited once started. Continue?')
        .subscribe((result) => {
          if (result) {
            this.sprintService.startSprint();
          }
        });
    }
  }

  endSprint() {
    this.sprintService.endSprint();
  }

  getCurrSprint() {
    return this.sprintService.currSprint();
  }

  editGoal(goal: Goal) {
    this.dialog.open(EditMenuComponent, { data: goal });
  }

  deleteGoal(goal: Goal) {
    this.alertService
      .openConfirmation('Delete Item', 'Are you sure you want to delete this item?')
      .subscribe((result) => {
        if (result) {
          this.testService.deleteGoal(goal.id, goal);
        }
      });
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

  isSprintActive(): boolean {
    return this.sprintService.currSprint()?.status === 'active';
  }

  lineChartData = computed<ChartConfiguration<'line'>['data']>(() => ({
    labels: this.sprintService.pastSprints().map((s) => s.name),
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Completion Rate (%)',
        fill: false,
        tension: 0.5,
        borderColor: 'black',
      },
    ],
  }));
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;

  getPastSprints(): string[] {
    return this.sprintService.pastSprints().map((s) => s.name);
  }
}
