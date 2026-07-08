export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  order: number;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}
