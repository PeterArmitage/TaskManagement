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
import { Card } from '../models/card.model';

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
  ],
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent implements OnInit {
  cardForm: FormGroup;
  listId: number;
  isEditMode = false;
  cardId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.listId = +this.route.snapshot.params['id'];
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      listId: [this.listId],
    });
  }

  ngOnInit(): void {
    const cardId = this.route.snapshot.params['cardId'];
    console.log('Received card ID:', cardId);
    if (cardId) {
      this.isEditMode = true;
      this.cardId = +cardId;
      this.loadCardForEdit(this.cardId);
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
}
