import { inject, Injectable, signal } from '@angular/core';
import { Goal } from '../models/models';
import { SprintService } from './sprint.service';

@Injectable({
  providedIn: 'root', // Enables the service to be accessible throughout the entire application.
})
export class TestGoal {
  sprintRef = inject(SprintService);
  goals = signal<Goal[]>([]);

  updateGoal(id: string, updates: Partial<Goal>) {
    this.goals.update((current) => current.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }
  addGoal(goal: Goal) {
    this.goals.update((goals) => [...goals, goal]);

    this.sprintRef.currSprint.update((sprint) =>
      sprint ? { ...sprint, goals: [...sprint.goals, goal] } : sprint
    );

    console.log(this.sprintRef.currSprint());
  }

  deleteGoal(id: string, goal: Goal) {
    this.goals.update((goals) => goals.filter((g) => g.id !== goal.id));
  }
}
