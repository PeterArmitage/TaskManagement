export interface Card {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  listId: number;
  priority: 'low' | 'medium' | 'high';
}
