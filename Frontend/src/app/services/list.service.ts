import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List } from '../models/list.model';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private apiUrl = 'http://localhost:5041/api/lists';

  constructor(private http: HttpClient) {}

  getLists(): Observable<List[]> {
    return this.http.get<List[]>(this.apiUrl);
  }

  getList(id: number): Observable<List> {
    return this.http.get<List>(`${this.apiUrl}/${id}`);
  }

  createList(list: List): Observable<List> {
    return this.http.post<List>(this.apiUrl, list);
  }

  updateList(id: number, list: List): Observable<List> {
    return this.http.put<List>(`${this.apiUrl}/${id}`, list);
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
