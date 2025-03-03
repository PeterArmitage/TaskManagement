import { Card } from './card.model';

export interface List {
  id: number;
  name: string;
  boardId: number;
  board?: { id: number };
  cards?: {
    $values: Card[];
  };
}
