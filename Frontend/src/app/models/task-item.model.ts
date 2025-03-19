export interface TaskComment {
  id?: number;
  content: string;
  createdAt?: string;
  author?: string;
}

export interface TaskChecklistItem {
  id?: number;
  content: string;
  isCompleted: boolean;
}

export interface TaskLabel {
  id?: number;
  name: string;
  color: string;
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: string;
  status?: string;
  createdAt: string;
  priority?: string;
  assignedTo?: string;
  comments?: TaskComment[];
  checklist?: TaskChecklistItem[];
  labels?: TaskLabel[];
}
