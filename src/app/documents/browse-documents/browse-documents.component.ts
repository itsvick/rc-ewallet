import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { first, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { DataService } from 'src/app/services/data/data-request.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { IImpressionEventInput } from 'src/app/services/telemetry/telemetry-interface';
import { TelemetryService } from 'src/app/services/telemetry/telemetry.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';

@Component({
  selector: 'app-browse-documents',
  templateUrl: './browse-documents.component.html',
  styleUrls: ['./browse-documents.component.scss']
})
export class BrowseDocumentsComponent implements OnInit, AfterViewInit {
  categories = [];
  isLoading = false;
  approvalModalRef: NgbModalRef;
  showApproval = false;
  isClaimRejected = false;
  allCredentials: any;
  showCredentialList = false;
  selectedCategory: string = '';

  showAadhaarKYC = false;

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
    if (!this.authService.isKYCCompleted()) {
      this.showAadhaarKYC = true;
    }
    if (this.credentialService.selectedCategory) {
      this.selectedCategory = this.credentialService.selectedCategory;
      this.showCredentialList = true;
      this.allCredentials = [...this.credentialService.credentialList];
    } else {
      this.fetchCredentialCategories();
    }
  }

  fetchCredentialCategories() {
    if (this.authService?.currentUser?.did) {
      this.showApproval = false;
      console.log("DID", this.authService.currentUser.did);
      this.isLoading = true;
      this.credentialService.getAllCredentials().pipe(
        first(),
        map((res: any) => {
        console.log("result", res);
        this.allCredentials = res;
        res.map((item: any) => {
          this.updateCategoryList(item.credential_schema.name);
        });
        console.log("this.categories", this.categories);
        return res;
      })).subscribe(res => {
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
    }
  }

  showCredentials(category) {
    this.selectedCategory = category?.name;
    this.showCredentialList = true;
    // const navigationExtras: NavigationExtras = {
    //   state: category
    // }
    // this.router.navigate(['/search-certificates'], navigationExtras);
  }

  updateCategoryList(name: string) {
    if (name) {
      const category = this.categories.find((item: any) => item.name === name);
      if (category) {
        category.count++;
      } else {
        let image: string = '';
        switch (name) {
          case 'Assessment Credentials':
            image = 'assets/images/academic.svg';
            break;
          case 'Enrollment Credentials':
            image = 'assets/images/enroll.svg';
            break;
          case 'Benefits Credentials':
            image = 'assets/images/benefit.svg';
            break;
          default:
            image = 'assets/images/enroll.svg';
        }

        this.categories.push({ name, count: 1, image });
      }
    }
  }

  onBack() {
    this.allCredentials = [];
    this.selectedCategory = '';
    this.categories = [];
    this.showCredentialList = false;
    this.fetchCredentialCategories();
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
