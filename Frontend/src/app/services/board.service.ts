import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private apiUrl = `${environment.apiUrl}/api/boards`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrl, this.getHttpOptions()).pipe(
      map((response: any) => {
        // Handle response structure based on your API
        return response.$values ? response.$values : response;
      })
    );
  }

  getBoard(id: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, board, this.getHttpOptions());
  }

  updateBoard(id: number, board: Board): Observable<Board> {
    return this.http.put<Board>(
      `${this.apiUrl}/${id}`,
      board,
      this.getHttpOptions()
    );
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.getHttpOptions()
    );
  }
}
