import { Injectable } from '@angular/core';
import { Goal } from '../app/models/goal.model';

@Injectable({
  providedIn: 'root', // Enables the service to be accessible throughout the entire application.
})
export class TestGoal {
  incompleteGoals: Goal[] = [];
  completeGoals: Goal[] = [];
}
