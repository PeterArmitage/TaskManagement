import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../../../services/card.service';
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
import { CommentService } from '../../../services/comment.service';
import { Comment } from '../../../models/comment';
import { FormsModule } from '@angular/forms';
import { ChecklistItem } from '../../../models/checklist-item.model';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

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
    MatListModule,
    MatIconModule,
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
  checklistItems: ChecklistItem[] = [];
  newChecklistItem = '';

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

    // Initialize as empty arrays to prevent template errors
    this.checklistItems = [];
    this.comments = [];

    if (cardId) {
      this.isEditMode = true;
      this.cardId = +cardId;
      this.loadCardForEdit(this.cardId);
      this.loadComments();

      console.log('Fetching checklist items for card ID:', cardId);
      this.cardService.getChecklistItems(cardId).subscribe({
        next: (items) => {
          console.log('Raw checklist items response:', items);
          if (Array.isArray(items)) {
            this.checklistItems = items;
            console.log('Processed checklist items:', this.checklistItems);
          } else {
            console.error('Checklist items is not an array:', items);
            this.checklistItems = [];
          }
        },
        error: (err) => {
          console.error('Error fetching checklist items:', err);
        },
      });
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
        next: (savedCard) => {
          console.log('Card saved successfully:', savedCard);

          // If we're in create mode, we need to save the comments and checklist items
          // after the card is created since we need the card ID
          if (!this.isEditMode && savedCard && savedCard.id) {
            this.saveCommentsAndChecklistItems(savedCard.id);
          }

          this.router.navigate(['/lists', this.listId, 'cards']);
        },
        error: (err) => {
          console.error('Error saving card:', err);
          alert('Failed to save card. Please try again.');
        },
      });
    }
  }

  saveCommentsAndChecklistItems(cardId: number): void {
    // Save any pending comments
    if (this.newComment.trim()) {
      const comment = {
        content: this.newComment,
        cardId: cardId,
      };
      this.commentService.addComment(comment).subscribe({
        next: () => console.log('Comment saved successfully'),
        error: (err) => console.error('Error saving comment:', err),
      });
    }

    // Save any pending checklist items
    if (this.newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        content: this.newChecklistItem,
        isCompleted: false,
        cardId: cardId,
      };
      this.cardService.createChecklistItem(newItem).subscribe({
        next: () => console.log('Checklist item saved successfully'),
        error: (err) => console.error('Error saving checklist item:', err),
      });
    }
  }

  loadComments(): void {
    if (!this.cardId) {
      console.error('Cannot load comments - cardId is null');
      return;
    }

    console.log('Loading comments for card ID:', this.cardId);
    this.commentService.getCommentsForCard(this.cardId).subscribe({
      next: (comments: Comment[]) => {
        console.log('Received comments from API:', comments);
        this.comments = comments;
      },
      error: (err: Error) => {
        console.error('Error loading comments:', err);
        this.comments = [];
      },
    });
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

  addChecklistItem(): void {
    if (this.newChecklistItem.trim() && this.cardId) {
      const newItem: ChecklistItem = {
        content: this.newChecklistItem,
        isCompleted: false,
        cardId: this.cardId,
      };

      this.cardService.createChecklistItem(newItem).subscribe({
        next: (item) => {
          this.checklistItems.push(item);
          this.newChecklistItem = '';
        },
        error: (err) => console.error('Error adding checklist item:', err),
      });
    }
  }

  toggleChecklistItem(item: ChecklistItem): void {
    item.isCompleted = !item.isCompleted;
    this.cardService.updateChecklistItem(item).subscribe({
      error: (err) => console.error('Error updating checklist item:', err),
    });
  }

  deleteChecklistItem(id: number): void {
    this.cardService.deleteChecklistItem(id).subscribe({
      next: () => {
        this.checklistItems = this.checklistItems.filter(
          (item) => item.id !== id
        );
      },
      error: (err) => console.error('Error deleting checklist item:', err),
    });
  }

  ngAfterViewInit(): void {
    console.log('Checklist Items:', this.checklistItems);
    console.log('Comments:', this.comments);
  }
}
