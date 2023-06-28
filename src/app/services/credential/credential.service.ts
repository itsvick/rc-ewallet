import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data-request.service';
import { AuthConfigService } from 'src/app/authentication/auth-config.service';


@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  baseUrl: string;
  private schemas: any[] = [];
  selectedCategory: string = '';
  credentialList = [];

  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthService,
    private readonly authConfigService: AuthConfigService
  ) { 
    // this.baseUrl = environment.baseUrl;
    this.baseUrl = this.authConfigService.config.bffUrl;
  }

  private findSchema(schemaId: string) {
    if (this.schemas.length) {
      return this.schemas.find((schema: any) => schema.id === schemaId);
    }
    return false;
  }

  getCredentialSchemaId(credentialId: string): Observable<any> {
    const payload = { url: `${this.baseUrl}/v1/sso/student/credentials/schema/${credentialId}` };
    return this.dataService.get(payload).pipe(map((res: any) => res.result));
  }

  getCredentials(): Observable<any> {
    const payload = {
      url: `${this.baseUrl}/v1/sso/student/credentials/search/student`,
      data: {
        subject: { id: this.authService.currentUser?.did}
      }
    };

    return this.dataService.post(payload).pipe(map((res: any) => res.result));
  }

  getSchema(schemaId: string): Observable<any> {
    const schema = this.findSchema(schemaId);
    console.log("saved schemas", this.schemas);
    if (schema) {
      return of(schema);
    }

    const payload = { url: `${this.baseUrl}/v1/sso/student/credentials/schema/json/${schemaId}` };
    return this.dataService.get(payload).pipe(map((res: any) => {
      const schema = this.findSchema(res.result.id);
      if (!schema) {
        this.schemas.push(res.result);
      }
      return res.result;
    }));
  }

  getAllCredentials(): Observable<any> {
    return this.getCredentials().pipe(
      switchMap((credentials: any) => {
        if (credentials.length) {
          return forkJoin(
            credentials.map((cred: any) => {
              return this.getCredentialSchemaId(cred.id).pipe(
                concatMap((res: any) => {
                  console.log("res", res);
                  cred.schemaId = res.credential_schema;
                  return this.getSchema(res.credential_schema).pipe(
                    map((schema: any) => {
                      cred.credential_schema = {...schema};
                      return cred;
                    })
                  );
                })
              );
            })
          );
        }
        return of([]);
      })
    );
  }

  /**
   * Get Credential by credential Id
   * @param credentialId 
   * @returns 
   */
  getCredentialById(credentialId: string): Observable<any> {
    const payload = { url: `${this.baseUrl}/v1/credentials/get/${credentialId}` };
    return this.dataService.get(payload);
  }
}
