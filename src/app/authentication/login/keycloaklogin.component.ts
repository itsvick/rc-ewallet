import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { GeneralService } from 'src/app/services/general/general.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from 'src/app/services/data/data-request.service';
import { AuthConfigService } from '../auth-config.service';

@Component({
  selector: 'app-keycloaklogin',
  templateUrl: './keycloaklogin.component.html',
  styleUrls: ['./keycloaklogin.component.css']
})
export class KeycloakloginComponent implements OnInit {
  user: any;
  entity: string;
  profileUrl: string = '';
  constructor(
    public keycloakService: KeycloakService,
    public router: Router,
    private config: AppConfig,
    private readonly generalService: GeneralService,
    private readonly dataService: DataService,
    private readonly authConfigService: AuthConfigService
  ) { }

  async ngOnInit() {
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    if (isLoggedIn) {
      this.keycloakService.loadUserProfile().then((res: any) => {
        console.log("res", res);
        if (res?.attributes?.entity?.[0]) {
          console.log(res['attributes'].entity[0]);
          this.entity = res.attributes.entity[0];
        }
        if (res['attributes'].hasOwnProperty('locale') && res['attributes'].locale.length) {
          localStorage.setItem('ELOCKER_LANGUAGE', res['attributes'].locale[0]);
        }
      });

      this.user = this.keycloakService.getUsername();
      this.keycloakService.getToken().then((token) => {
        console.log('keyCloak teacher token - ', token);
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', this.user);
        console.log('---------', this.config.getEnv('appType'))
        // if (this.config.getEnv('appType') && this.config.getEnv('appType') === 'digital_wallet') {
        //   this.profileUrl = this.entity + '/documents'
        // } else {
        //   this.profileUrl = '/profile/' + this.entity;
        // }
        // this.router.navigate([this.profileUrl]);
        this.getDID().subscribe((res) => {
          this.router.navigate(['/home']);
        }, (err) => {
          this.router.navigate(['/home']);
          console.log(err);
        });
      });
    }
  }

  getDID(): Observable<any> {
    // const payload = {
    //   "filters": {
    //     "username": {
    //       "eq": this.user
    //     }
    //   }
    // }

    // return this.generalService.postData(`/${this.entity}/search`, payload).pipe(map((res: any) => {
    //   if (res.length) {
    //     localStorage.setItem('currentUser', JSON.stringify(res[0]));
    //   }
    //   console.log(res);
    // }));

    let headerOptions = new HttpHeaders({
      'Accept': 'application/pdf',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });
    return this.dataService.get({ url: `${this.authConfigService.config.bffUrl}/v1/sso/learner/getdetail`, header: headerOptions }).pipe(map((res: any) => {
      console.log(res);

      localStorage.setItem('currentUser', JSON.stringify(res.result));
      return res;
    }));
  }


}
