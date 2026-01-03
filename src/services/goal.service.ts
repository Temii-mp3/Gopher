import { Injectable } from '@angular/core';
import { Goal } from '../models/models';

@Injectable({
  providedIn: 'root', // Enables the service to be accessible throughout the entire application.
})
export class TestGoal {
  goals: Goal[] = [];
}
