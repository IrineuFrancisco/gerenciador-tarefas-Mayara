export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  manager: string;
  client: string;
  operationType: string;
  value?: number;
  progressText?: string;
  createdAt: number;
}
