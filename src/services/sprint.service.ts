import { Injectable } from '@angular/core';
import { Sprint } from '../models/models';

@Injectable({
  providedIn: 'root', // Enables the service to be accessible throughout the entire application.
})
export class SprintService {
  sprint: Sprint[] = [];
  currSprint;
}
