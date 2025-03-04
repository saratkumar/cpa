import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CpaApiService {

  constructor(private apiService: ApiService) { }


  generateCPA(payload: any): Observable<any>  {
    return this.apiService.createPost("/cpa/critical-path", payload);
  }

  getJobHistories(payload: any) {
    return this.apiService.createPost("/job-history", payload);
  }
}
