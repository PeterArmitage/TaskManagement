import { List } from './list.model';

export interface Board {
  id: number;
  name: string;
  description: string;
  lists: List[];
}
