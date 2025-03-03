import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = 'http://localhost:5041/api/cards';

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http
      .get<{ $values: Card[] }>(this.apiUrl)
      .pipe(map((response) => response.$values));
  }

  getCard(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`);
  }

  createCard(card: {
    title: string;
    description: string;
    dueDate: string;
    listId: number;
  }): Observable<Card> {
    return this.http
      .post<Card>(this.apiUrl, {
        title: card.title,
        description: card.description,
        dueDate: card.dueDate,
        listId: card.listId,
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
}
