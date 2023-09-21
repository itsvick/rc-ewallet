import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Observable, of } from 'rxjs';
import { delay, concatMap, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { DataService } from 'src/app/services/data/data-request.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { IImpressionEventInput } from 'src/app/services/telemetry/telemetry-interface';
import { TelemetryService } from 'src/app/services/telemetry/telemetry.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import * as WebCredentialHandler from 'web-credential-handler';
@Component({
  selector: 'app-browse-documents',
  templateUrl: './wallet-ui-get.component.html',
  styleUrls: ['./wallet-ui-get.component.scss']
})
export class WalletUiGetComponent implements OnInit, AfterViewInit {
  categories = [];
  isLoading = false;
  approvalModalRef: NgbModalRef;
  showApproval = false;
  isClaimRejected = false;
  allCredentials: any;
  showCredentialList = false;
  selectedCategory: string = '';
  @ViewChild('approvalModal') approvalModal: TemplateRef<any>;

  constructor(
    private router: Router,
    public generalService: GeneralService,
    public authService: AuthService,
    private dataService: DataService,
    private toastMessage: ToastMessageService,
    private activatedRoute: ActivatedRoute,
    private readonly modalService: NgbModal,
    private telemetryService: TelemetryService,
    private readonly credentialService: CredentialService
  ) { }

  ngOnInit(): void {
    this.handleGetEvent();
  }
  
  async handleGetEvent() {
    const event = await WebCredentialHandler.receiveCredentialEvent();
    console.log("Wallet processing get() event:", event);
          //placeholder credential
          const data = {
            id: "did:ulp:09960f2c-ec40-4a69-b6f7-291b4c5eed8f",
            type: [
                "VerifiableCredential",
                "UniversityDegreeCredential"
            ],
            issuer: "did:ulp:705a7f13-da2e-4305-a1ca-ac8e750e9ada",
            context: [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1"
            ],
            issuanceDate: "2023-02-06T11:56:27.259Z",
            expirationDate: "2023-02-08T11:56:27.259Z",
            credentialSubject: {
                id: "did:ulp:b4a191af-d86e-453c-9d0e-dd4771067235",
                grade: "9.23",
                programme: "B.Tech",
                certifyingInstitute: "IIIT Sonepat",
                evaluatingInstitute: "NIT Kurukshetra"
            }
          }
    console.log("Responding");
    setTimeout(() => {
      event.respondWith(
        Promise.resolve({
          dataType: "VerifiablePresentation",
          data,
        })
      ).catch((error) => console.log("error", error));
    }, 1000)
						
  }
  ngAfterViewInit() {
    if (!this.authService.currentUser?.did) {
      // const options: NgbModalOptions = {
      //   // backdrop: 'static',
      //   animation: true,
      //   centered: true,
      // };
      // this.approvalModalRef = this.modalService.open(this.approvalModal, options);
      // this.isLoading = true;
      // this.authService.getUserProfile().subscribe((res) => {
      //   this.isClaimRejected = res.detail.claim_status === 'rejected';
      //   this.showApproval = res.detail.claim_status !== 'approved';
      //   this.isLoading = false;
      //   this.fetchCredentialCategories();
      // }, error => {
      //   this.showApproval = true;
      //   this.isLoading = false;
      // });
    }
    this.raiseImpressionEvent();
  }

  raiseImpressionEvent() {
    this.telemetryService.uid = this.authService.currentUser?.did || "anonymous";
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
        // duration: this.navigationhelperService.getPageLoadTime()
      }
    };
    this.telemetryService.impression(telemetryImpression);
  }

}
