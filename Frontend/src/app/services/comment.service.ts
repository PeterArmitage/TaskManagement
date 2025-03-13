import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:5041/api/comments';

  constructor(private http: HttpClient) {}

  getCommentsForCard(cardId: number): Observable<Comment[]> {
    return this.http
      .get<{ data: Comment[] }>(`${this.apiUrl}/card/${cardId}`)
      .pipe(
        map((response) => (Array.isArray(response.data) ? response.data : [])),
        catchError(() => of([]))
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
    return this.http
      .get<{ data: Comment[] }>(`${this.apiUrl}/card/${cardId}`)
      .pipe(
        map((response) => (Array.isArray(response.data) ? response.data : [])),
        catchError(() => of([]))
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
