import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
  providers: [CommentService],
})
export class CardFormComponent implements OnInit {
  cardForm: FormGroup;
  listId: number;
  isEditMode = false;
  cardId: number | null = null;
  comments: Comment[] = [];
  newComment = '';

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private route: ActivatedRoute,
    public router: Router,
    private commentService: CommentService
  ) {
    this.listId = +this.route.snapshot.params['id'];
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [null],
      listId: [this.listId],
      priority: ['medium', Validators.required],
    });
  }

  ngOnInit(): void {
    const cardId = this.route.snapshot.params['cardId'];
    console.log('Received card ID:', cardId);
    if (cardId) {
      this.isEditMode = true;
      this.cardId = +cardId;
      this.loadCardForEdit(this.cardId);
      this.loadComments();
    }
  }

  loadCardForEdit(id: number): void {
    this.cardService.getCard(id).subscribe((card) => {
      this.cardForm.patchValue({
        title: card.title,
        description: card.description,
        dueDate: new Date(card.dueDate),
        listId: card.listId,
      });
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const cardData = {
        id: this.cardId || 0,
        title: this.cardForm.value.title,
        description: this.cardForm.value.description,
        dueDate: new Date(this.cardForm.value.dueDate).toISOString(),
        listId: this.listId,
        priority: this.cardForm.value.priority,
      };

      const operation =
        this.isEditMode && this.cardId
          ? this.cardService.updateCard(this.cardId, cardData)
          : this.cardService.createCard(cardData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/lists', this.listId, 'cards']);
        },
        error: (err) => {
          console.error('Error saving card:', err);
          alert('Failed to save card. Please try again.');
        },
      });
    }
  }

  loadComments(): void {
    if (this.cardId) {
      this.commentService
        .getCommentsForCard(this.cardId)
        .subscribe((comments) => {
          this.comments = comments;
        });
    }
  }

  addComment(): void {
    if (!this.cardId) {
      console.error('Cannot add comment - cardId is null');
      return;
    }

    const comment = {
      content: this.newComment,
      cardId: this.cardId,
    };

    this.commentService.addComment(comment).subscribe({
      next: (response) => {
        this.comments.push(response);
        this.newComment = '';
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        alert(err.message);
      },
    });
  }
}
