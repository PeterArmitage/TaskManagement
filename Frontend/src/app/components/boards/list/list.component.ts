import { Component, OnInit } from '@angular/core';
import { ListService } from '../../../services/list.service';
import { List } from '../../../models/list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  lists: List[] = [];
  boardId: number;

  constructor(
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.boardId = +this.route.snapshot.params['id'];
    console.log('Initial boardId:', this.boardId);
  }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.listService.getLists().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        console.log('Current boardId:', this.boardId);

        if (Array.isArray(response)) {
          this.lists = response
            .filter((list) => list.boardId === this.boardId)
            .map((list) => ({
              ...list,
              cards: { $values: list.cards?.$values || [] },
            }));
          console.log('Filtered lists:', this.lists);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      error: (err) => {
        console.error('Error loading lists:', err);
      },
    });
  }

  deleteList(id: number): void {
    if (confirm('Are you sure you want to delete this list?')) {
      this.listService.deleteList(id).subscribe(() => {
        this.loadLists();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/boards']);
  }
}
