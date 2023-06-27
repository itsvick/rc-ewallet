import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInteractEventInput } from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';
import { CredentialService } from '../services/credential/credential.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly credentialService: CredentialService
  ) { }

  ngOnInit(): void {
  }

  clearCredentials() {
    this.credentialService.credentialList = [];
    this.credentialService.selectedCategory = '';
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
        pageid: 'toolbar',
      }
    };
    this.telemetryService.interact(telemetryInteract);
  }
}
