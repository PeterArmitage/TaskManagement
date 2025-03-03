import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';
import { Card } from '../models/card.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  cards: Card[] = [];
  listId: number;
  boardId: number = 0;

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService
  ) {
    this.listId = +this.route.snapshot.params['id'];
    this.loadBoardId();
  }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.cardService.getCards().subscribe((cards) => {
      this.cards = cards.filter((card) => card.listId === this.listId);
    });
  }

  deleteCard(id: number): void {
    if (confirm('Are you sure you want to delete this card?')) {
      this.cardService.deleteCard(id).subscribe(() => {
        this.loadCards();
      });
    }
  }

  openCard(id: number): void {
    console.log('Opening card with ID:', id);
    console.log('Current list ID:', this.listId);
    this.router.navigate(['/lists', this.listId, 'cards', 'edit', id]);
  }

  goBack(): void {
    if (this.boardId) {
      this.router.navigate(['/boards', this.boardId, 'lists']);
    } else {
      console.error('Board ID is not available');
    }
  }

  loadBoardId(): void {
    this.listService.getList(this.listId).subscribe((list) => {
      this.boardId = list.boardId;
    });
  }
}
