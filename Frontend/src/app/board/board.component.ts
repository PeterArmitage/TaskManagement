import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service';
import { Board } from '../models/board.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  boards: Board[] = [];

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.boardService.getBoards().subscribe({
      next: (response) => {
        console.log('Boards:', response);
        this.boards = response || [];
      },
      error: (err) => {
        console.error('Error fetching boards:', err);
      },
    });
  }

  deleteBoard(id: number): void {
    if (confirm('Are you sure you want to delete this board?')) {
      this.boardService.deleteBoard(id).subscribe(() => {
        this.loadBoards(); // Reload the boards after deletion
      });
    }
  }

  loadBoards(): void {
    this.boardService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }
}
