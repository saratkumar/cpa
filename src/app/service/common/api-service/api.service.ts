import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api/v1'; // Example API URL

  constructor(private http: HttpClient) {}

  // GET Request
  getPosts(path: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${path}`);
  }

  // POST Request
  createPost(path:string, postData: any): Observable<any> {
    return this.http.post(`${this.baseUrl + path}`, postData);
  }

  // PUT Request
  updatePost(path:string, id: number, postData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/posts/${id}`, postData);
  }

  // DELETE Request
  deletePost(path:string, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`);
  }
}
