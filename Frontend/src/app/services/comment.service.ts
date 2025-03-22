import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comment } from '../models/comment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  getCommentsForCard(cardId: number): Observable<Comment[]> {
    return this.http.get<any>(`${this.apiUrl}/card/${cardId}`).pipe(
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
        console.error('Error fetching comments:', error);
        return of([]);
      })
    );
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  addComment(comment: {
    content: string;
    cardId: number;
  }): Observable<Comment> {
    return this.http
      .post<Comment>(this.apiUrl, comment)
      .pipe(catchError(this.handleError));
  }

  getComments(cardId: number): Observable<Comment[]> {
    return this.http.get<any>(`${this.apiUrl}/card/${cardId}`).pipe(
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
        console.error('Error fetching comments:', error);
        return of([]);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
