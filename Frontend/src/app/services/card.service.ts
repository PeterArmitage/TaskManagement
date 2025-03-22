import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Card } from '../models/card.model';
import { catchError, map } from 'rxjs/operators';
import { ChecklistItem } from '../models/checklist-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/api/cards`;
  private checklistApiUrl = `${environment.apiUrl}/checklistitems`;

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        // Check if response has $values property
        if (response && response.$values) {
          return response.$values;
        }
        // If it's already an array, return it
        if (Array.isArray(response)) {
          return response;
        }
        // Default to empty array
        console.warn('Unexpected response format:', response);
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching cards:', error);
        return of([]);
      })
    );
  }

  getCard(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`);
  }

  createCard(card: {
    title: string;
    description: string;
    dueDate: string;
    listId: number;
    priority: 'low' | 'medium' | 'high';
  }): Observable<Card> {
    return this.http
      .post<Card>(this.apiUrl, {
        title: card.title,
        description: card.description,
        dueDate: card.dueDate,
        listId: card.listId,
        priority: card.priority,
      })
      .pipe(
        catchError((error) => {
          console.error('Server error:', error.error);
          throw error;
        })
      );
  }

  updateCard(id: number, card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card);
  }

  deleteCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getChecklistItems(cardId: number): Observable<ChecklistItem[]> {
    return this.http.get<any>(`${this.checklistApiUrl}/card/${cardId}`).pipe(
      map((response) => {
        // Check if response has $values property
        if (response && response.$values) {
          return response.$values;
        }
        // If it's already an array, return it
        if (Array.isArray(response)) {
          return response;
        }
        // If it's an object with a data property
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        // Default to empty array
        console.warn('Unexpected response format:', response);
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching checklist items:', error);
        return of([]);
      })
    );
  }

  createChecklistItem(item: ChecklistItem): Observable<ChecklistItem> {
    return this.http.post<ChecklistItem>(this.checklistApiUrl, item);
  }

  updateChecklistItem(item: ChecklistItem): Observable<ChecklistItem> {
    return this.http.put<ChecklistItem>(
      `${this.checklistApiUrl}/${item.id}`,
      item
    );
  }

  deleteChecklistItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.checklistApiUrl}/${id}`);
  }
}
