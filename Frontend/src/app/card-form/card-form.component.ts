import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../services/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css'],
})
export class CardFormComponent {
  cardForm: FormGroup;
  listId: number;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.listId = +this.route.snapshot.params['id']; // Get the list ID from the route
    this.cardForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      listId: [this.listId], // Set the list ID
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const cardData = {
        title: this.cardForm.value.title,
        description: this.cardForm.value.description,
        dueDate: new Date(this.cardForm.value.dueDate),
        listId: this.listId,
      };

      this.cardService.createCard(cardData).subscribe({
        next: () => {
          this.router.navigate(['/lists', this.listId, 'cards']);
        },
        error: (err) => {
          console.error('Error creating card:', err);
          alert('Failed to create card. Please try again.');
        },
      });
    }
  }
}
