import { Injectable } from '@angular/core';
import { DataService } from './data/data-request.service';
import { AppConfig } from '../app.config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClaimGrievanceService {

  bffUrl = this.config.getEnv('bffUrl');
  constructor(
    private readonly dataService: DataService,
    private readonly config: AppConfig
  ) { }

  raiseClaim(payload): Observable<any> {
    const request = {
      url: `${this.bffUrl}/v1/claim/sent`,
      data: payload
    }

    return this.dataService.post(request).pipe(map(res => res.result));
  }

  raiseGrievance(payload): Observable<any> {
    const request = {
      url: `${this.bffUrl}/v1/grievance/sent`,
      data: payload
    }
    return this.dataService.post(request).pipe(map(res => res.result));
  }

  getClaimStatus(): Observable<any> {
    const request = {
      url: `${this.bffUrl}/v1/claim/search`,
      data: {
        type: 'student'
      }
    }
    return this.dataService.post(request).pipe(map(res => {
      console.log("getClaimStatus", res);
      return res.result;
    }));
  }
}
