import { inject, Injectable, signal } from '@angular/core';
import { Goal } from '../models/models';
import { SprintService } from './sprint.service';

@Injectable({
  providedIn: 'root', // Enables the service to be accessible throughout the entire application.
})
export class TestGoal {
  currDate: Date = new Date();
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

  toggleCompletion(goal: Goal) {
    goal.done = !goal.done;
    const date = new Date();
    const sprint = this.sprintRef.currSprint();
    console.log(sprint);
    const sprintGoal = sprint?.goals.find((g) => g.id == goal.id);
    if (sprint && sprintGoal) {
      const completedToday = sprintGoal.completionDates.find(
        (d) => d.toDateString() === date.toDateString()
      );
      if (completedToday) {
        sprintGoal.completionDates = sprintGoal!.completionDates.filter(
          (d) => d !== completedToday
        );

        console.log(sprintGoal.completionDates);
      } else {
        sprintGoal.completionDates.push(new Date());
      }
      const completedNum = sprintGoal.completionDates.length || 0;
      if (completedNum >= sprintGoal.frequency) {
        sprintGoal!.completed = true;
      }
      sprint.goals.sort((a, b) => Number(a.completed) - Number(b.completed));
      this.sprintRef.saveCurrentSprint(sprint);
    }
  }
}
