import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService } from '../services/list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.css'],
})
export class ListFormComponent {
  listForm: FormGroup;
  boardId: number;

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.boardId = +this.route.snapshot.params['id']; // Get the board ID from the route
    this.listForm = this.fb.group({
      name: ['', Validators.required],
      boardId: [this.boardId], // Set the board ID
    });
  }

  onSubmit(): void {
    if (this.listForm.valid) {
      const listData = {
        name: this.listForm.value.name,
        boardId: this.listForm.value.boardId,
      };
      this.listService.createList(listData).subscribe({
        next: () => {
          this.router.navigate(['/boards', this.boardId, 'lists']);
        },
        error: (err) => {
          console.error('Error creating list:', err);
          alert('Failed to create list. Please try again.');
        },
      });
    }
  }
}
