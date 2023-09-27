import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { GeneralService } from '../services/general/general.service';
import { IImpressionEventInput, IInteractEventInput } from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';
import { environment } from 'src/environments/environment';
import { AuthConfigService } from '../authentication/auth-config.service';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss']
})
export class OnBoardingComponent implements OnInit, AfterViewInit {
  baseUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly generalService: GeneralService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly telemetryService: TelemetryService,
    private readonly authConfigService: AuthConfigService,
    private readonly keycloakService: KeycloakService
  ) {         
    // this.baseUrl = environment.baseUrl;
    this.baseUrl = this.authConfigService.config.bffUrl;
  }

  async ngOnInit() {
    // if (this.authService.isLoggedIn) {
    //   this.router.navigate(['/home']);
    // }

    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      if (isLoggedIn && !this.keycloakService.isTokenExpired()) {
        this.router.navigate(['/home']);
      } else {
        localStorage.clear();
        this.keycloakService.clearToken();
      }
    } catch(error) {
      console.error("error==>", error);
      localStorage.clear();
      this.keycloakService.clearToken();
    }
  }

  openSSO() {
    this.generalService.getData(`${this.baseUrl}/v1/sso/digilocker/authorize/ewallet`, true).subscribe((res) => {
      window.open(res.digiauthurl, "_self");
    });
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  ngAfterViewInit(): void {
    this.raiseImpressionEvent();
  }

  raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
    const telemetryInteract: IInteractEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: []
      },
      edata: {
        id,
        type,
        subtype,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
      }
    };
    this.telemetryService.interact(telemetryInteract);
  }

  raiseImpressionEvent() {
    const telemetryImpression: IImpressionEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: []
      },
      edata: {
        type: this.activatedRoute.snapshot?.data?.telemetry?.type,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot?.data?.telemetry?.subtype,
      }
    };
    this.telemetryService.impression(telemetryImpression);
  }
}
