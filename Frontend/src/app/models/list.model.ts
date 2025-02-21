import { Card } from './card.model';

export interface List {
  id: number;
  name: string;
  boardId: number;
  cards: Card[];
}
