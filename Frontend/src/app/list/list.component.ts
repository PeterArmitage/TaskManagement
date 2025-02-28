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
  }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.listService.getLists().subscribe((response) => {
      this.lists = response.filter((list) => list.boardId === this.boardId);
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
