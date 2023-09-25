import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CredentialService } from '../services/credential/credential.service';
import { SchemaService } from '../services/data/schema.service';
import { IInteractEventInput } from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  sidebarFor = 'default';
  tabList: any[];
  @Input() env: string;
  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly credentialService: CredentialService,
    private readonly schemaService: SchemaService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    console.log("envvv", this.env);
    this.getRouteData();
    this.schemaService.getToolbarJson().subscribe((schemaRes) => {
      const filtered = schemaRes.sidebar.filter(obj => {
        return Object.keys(obj)[0] === this.sidebarFor;
      });
      this.tabList = filtered[0][this.sidebarFor];
    });
  }

  getRouteData() {
    console.log("router data", this.activatedRoute.snapshot.data)
    this.activatedRoute.data.subscribe((data) => {
      console.log("subscribe", data);
    });
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // this.env = this.activatedRoute.root.firstChild.snapshot.data['telemetry'].env;
      });
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
