import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { CredentialService } from '../services/credential/credential.service';
import {
  IImpressionEventInput,
  IInteractEventInput,
} from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { UtilService } from '../services/util/util.service';

@Component({
  selector: 'app-search-certificates',
  templateUrl: './search-certificates.component.html',
  styleUrls: ['./search-certificates.component.scss'],
})
export class SearchCertificatesComponent implements OnInit {
  searchKey: string = '';
  isLoading = false;
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
    this.activatedRoute.params.subscribe((params: any) => {
      if (params?.schemaId) {
        this.fetchCredentials(params.schemaId);
      }
    });
  }

  fetchCredentials(schemaId) {
    this.isLoading = true;
    this.credentialService.getAllCredentials().pipe(map((res: any) => {
      return res.filter(item => item.credentialSchemaId === schemaId);
    })).subscribe((res: any) => {
      this.isLoading = false;
      this.credentialList = res;
    }, error => {
      this.isLoading = false;
      console.error("Error", error);
    });
  }

  renderCertificate(credential: any) {
    this.raiseInteractEvent('credential-view');
    const navigationExtras: NavigationExtras = {
      state: credential,
    };
    this.router.navigate(['/doc-view', credential.id], navigationExtras);
  }

  ngAfterViewInit(): void {
    this.raiseImpressionEvent();
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
