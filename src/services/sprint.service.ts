import { Injectable, signal } from '@angular/core';
import { Sprint } from '../models/models';
import { Signal } from '@angular/core';
@Injectable({
  providedIn: 'root', // Enables the service to be accessible throughout the entire application.
})
export class SprintService {
  currSprint = signal<Sprint | null>(null);
  pastSprints = signal<Sprint[]>([]);
  msPerDay = 1000 * 60 * 60 * 24;

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
    }
  }

  endSprint() {
    const current = this.currSprint();
    if (current && current.status === 'active') {
      const completed = { ...current, status: 'completed' as const };
      this.pastSprints.update((sprints) => [...sprints, completed]);
      this.currSprint.set(null);
    }
  }
}
