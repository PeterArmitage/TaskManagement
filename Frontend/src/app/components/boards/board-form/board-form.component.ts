import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardService } from '../../../services/board.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss'],
})
export class BoardFormComponent {
  boardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    public router: Router
  ) {
    this.boardForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.boardForm.valid) {
      this.boardService.createBoard(this.boardForm.value).subscribe(() => {
        this.router.navigate(['/boards']); // Navigate back to the board list
      });
    }
  }
}
