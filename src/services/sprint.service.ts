import { Injectable, signal } from '@angular/core';
import { Goal, Sprint } from '../models/models';
import { Signal } from '@angular/core';
@Injectable({
  providedIn: 'root', // Enables the service to be accessible throughout the entire application.
})
export class SprintService {
  currSprint = signal<Sprint | null>(null);
  pastSprints = signal<Sprint[]>([]);
  msPerDay = 1000 * 60 * 60 * 24;
  completionsPerWeek: number[][] = [];
  weeklyAverages: number[] = [];

  constructor() {
    this.loadFromStorage();
  }

  async loadFromStorage() {
    try {
      // Load current sprint
      const currentResult = await localStorage.getItem('current-sprint');
      if (currentResult) {
        const sprint = JSON.parse(currentResult);
        // Convert date strings back to Date objects
        sprint.start = new Date(sprint.start);
        sprint.end = new Date(sprint.end);
        sprint.goals.forEach((goal: any) => {
          goal.completionDates = goal.completionDates.map((d: string) => new Date(d));
        });
        this.currSprint.set(sprint);
      }

      // Load past sprints
      const pastResult = await localStorage.getItem('past-sprints');
      if (pastResult) {
        const sprints = JSON.parse(pastResult);
        // Convert dates
        sprints.forEach((sprint: any) => {
          sprint.start = new Date(sprint.start);
          sprint.end = new Date(sprint.end);
        });
        this.pastSprints.set(sprints);
      }
    } catch (error) {
      console.log('No saved data found or error loading:', error);
    }
  }

  async savePastSprints() {
    try {
      const sprints = this.pastSprints();
      await localStorage.setItem('past-sprints', JSON.stringify(sprints));
    } catch (error) {
      console.error('Failed to save past sprints:', error);
    }
  }

  async saveCurrentSprint(sprint: Sprint) {
    try {
      if (sprint) {
        await localStorage.setItem('current-sprint', JSON.stringify(sprint));
      } else {
        await localStorage.removeItem('current-sprint');
      }
    } catch (error) {
      console.error('Failed to save current sprint:', error);
    }
  }

  uploadSprint(sprint: Sprint) {
    const duration = (sprint.end.getTime() - sprint.start.getTime()) / this.msPerDay;
    this.currSprint.set({
      ...sprint,
      duration: duration,
    });

    console.log(this.currSprint());
  }

  startSprint() {
    const current = this.currSprint();
    if (current) {
      this.currSprint.set({ ...current, status: 'active' });
      this.saveCurrentSprint(current);
    }
  }

  endSprint() {
    const current = this.currSprint();
    if (current && current.status === 'active') {
      this.calculateCompletion();
      const completed = { ...current, status: 'completed' as const };
      this.pastSprints.update((sprints) => [...sprints, completed]);
      this.currSprint.set(null);
      this.savePastSprints();
      this.saveCurrentSprint(current);
    }
  }

  calculateCompletion() {
    const current = this.currSprint();
    if (!current) return;
    const numWeeks = current.duration / 7;
    for (let i = 0; i < numWeeks; i++) {
      this.completionsPerWeek[i] = [];
      const weekStart = new Date(current.start.getTime() + i * 7 * this.msPerDay);
      const weekEnd = weekStart.getTime() + 7 * this.msPerDay;

      current.goals.forEach((goal) => {
        const completionsThisWeek = goal.completionDates.filter(
          (date) => date.getTime() >= weekStart.getTime() && date.getTime() < weekEnd
        ).length;
        const completionRate = completionsThisWeek / goal.frequency;
        this.completionsPerWeek[i].push(completionRate);
      });
      const weekAvg =
        this.completionsPerWeek[i].length > 0
          ? this.completionsPerWeek[i].reduce((sum, rate) => sum + rate, 0) /
            this.completionsPerWeek[i].length
          : 0;
      this.weeklyAverages.push(weekAvg);
    }
    const sprintCompletion =
      this.weeklyAverages.reduce((sum, avg) => sum + avg, 0) / this.weeklyAverages.length;

    this.currSprint.update((sprint) =>
      sprint ? { ...sprint, completion: sprintCompletion * 100 } : sprint
    );
  }

  addGoalToCurrentSprint(goal: Goal) {
    this.currSprint.update((sprint) => {
      if (!sprint) return sprint;

      return {
        ...sprint,
        goals: [...sprint.goals, goal],
      };
    });
  }
}
