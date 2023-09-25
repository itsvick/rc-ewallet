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

  getStateList(): Observable<any> {
    let url = `${this.bffUrl}/v1/school/stateList`;
    return this.dataService.get({ url }).pipe(
      map((res: any) => {
        console.log("states res", res);
        return res.response;
      })
    );
  }


  getDistrictList(payload: { stateCode: string }) {
    let url = `${this.bffUrl}/v1/school/districtList`;
    return this.dataService.post({ url, data: payload }).pipe(
      map((res: any) => {
        console.log("districts res", res);
        return res.response;
      })
    );
  }

  getBlockList(payload: { districtCode: string }) {
    let url = `${this.bffUrl}/v1/school/blockList`;
    return this.dataService.post({ url, data: payload }).pipe(
      map((res: any) => {
        console.log("block res", res);
        return res.response;
      })
    );
  }

  getSchoolList(payload: { "regionType": string, "regionCd": string, "sortBy": string }) {
    let url = `${this.bffUrl}/v1/school/schoolList`;
    return this.dataService.post({ url, data: payload }).pipe(
      map((res: any) => {
        console.log("schools res", res);
        return res.response;
      })
    );
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
