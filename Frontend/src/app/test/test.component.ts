import { Component } from '@angular/core';
import { Board } from '../models/board.model';
import { List } from '../models/list.model';
import { Card } from '../models/card.model';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <h2>Test Component</h2>
    <p>Board: {{ board.name }}</p>
    <p>List: {{ list.name }}</p>
    <p>Card: {{ card.title }}</p>
  `,
  styleUrls: ['./test.component.css'],
})
export class TestComponent {
  board: Board = {
    id: 1,
    name: 'Test Board',
    description: 'This is a test board',
    lists: [],
  };

  list: List = {
    id: 1,
    name: 'Test List',
    boardId: 1,
    cards: [],
  };

  card: Card = {
    id: 1,
    title: 'Test Card',
    description: 'This is a test card',
    dueDate: '2023-12-31',
    listId: 1,
  };
}
