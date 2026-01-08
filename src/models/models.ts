export interface Goal {
  name: string;
  frequency: number;
  completed: boolean;
  completionDates: Date[];
  completionTimes: number;
  done: boolean;
  id: string;
}

export interface Sprint {
  name: string;
  goals: Goal[];
  duration: number;
  start: Date;
  end: Date;
  id: string;
  completion: number;
  status: 'planning' | 'active' | 'completed';
}

export interface SprintHistory {
  pastSprints: Sprint[];
  currentSprint: Sprint | null;
}
