import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { CredentialService } from '../services/credential/credential.service';
import {
  IImpressionEventInput,
  IInteractEventInput,
} from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';

@Component({
  selector: 'app-search-certificates',
  templateUrl: './search-certificates.component.html',
  styleUrls: ['./search-certificates.component.scss'],
})
export class SearchCertificatesComponent implements OnInit {
  credentials$: Observable<any>;
  searchKey: string = '';
  schema: any;
  credentialList = [];

  @Input() credentials: any;
  @Input() category: string;
  @Output() back = new EventEmitter();

  constructor(
    public readonly authService: AuthService,
    private readonly credentialService: CredentialService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly telemetryService: TelemetryService
  ) { }

  ngOnInit(): void {
    this.fetchCredentials();
  }

  fetchCredentials() {
    const list = this.category ? this.credentials.filter((item: any) => item.credential_schema.name === this.category) : this.credentials;
    console.log("list", list);
    this.credentialList = list;
    this.credentialService.credentialList = [...this.credentialList];
    this.credentialService.selectedCategory = this.category;
  }

  renderCertificate(credential: any) {
    const navigationExtras: NavigationExtras = {
      state: credential,
    };
    this.router.navigate(['/doc-view'], navigationExtras);
  }

  ngAfterViewInit(): void {
    this.raiseImpressionEvent();
  }

  goBack() {
    this.credentialService.selectedCategory = '';
    this.credentialService.credentialList = [];
    this.back.emit();
  }

  raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
    const telemetryInteract: IInteractEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: [],
      },
      edata: {
        id,
        type,
        subtype,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
      },
    };
    this.telemetryService.interact(telemetryInteract);
  }

  raiseImpressionEvent() {
    const telemetryImpression: IImpressionEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: [],
      },
      edata: {
        type: this.activatedRoute.snapshot?.data?.telemetry?.type,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
        uri: this.router.url,
        subtype: this.activatedRoute.snapshot?.data?.telemetry?.subtype,
      },
    };
    this.telemetryService.impression(telemetryImpression);
  }
}
