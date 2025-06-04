import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;  // korábban: id?: number;
  name: string;
  email: string;
  age: number;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private serverUrl = 'http://localhost:3000/users'; // API végpont (pl. json-server)

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.serverUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.serverUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.serverUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.serverUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.serverUrl}/${id}`);
  }
}
