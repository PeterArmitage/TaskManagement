import { Component, OnInit } from '@angular/core';
import { ListService } from '../services/list.service';
import { List } from '../models/list.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  lists: List[] = [];
  boardId: number;

  constructor(private listService: ListService, private route: ActivatedRoute) {
    this.boardId = +this.route.snapshot.params['id'];
    console.log('Initial boardId:', this.boardId);
  }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.listService.getLists().subscribe((response) => {
      console.log('Lists response:', response);
      console.log('Current boardId:', this.boardId);

      this.lists = response
        .filter((list) => list.boardId === this.boardId)
        .map((list) => ({
          ...list,
          cards: { $values: list.cards?.$values || [] },
        }));
    });
  }

  deleteList(id: number): void {
    if (confirm('Are you sure you want to delete this list?')) {
      this.listService.deleteList(id).subscribe(() => {
        this.loadLists();
      });
    }
  }
}
