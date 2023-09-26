import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ClaimGrievanceService } from '../services/claim-grievance.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { GeneralService } from '../services/general/general.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, race } from 'rxjs';
import { Router } from '@angular/router';
import { CredentialService } from '../services/credential/credential.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-request-correction',
  templateUrl: './request-correction.component.html',
  styleUrls: ['./request-correction.component.scss']
})
export class RequestCorrectionComponent implements OnInit {

  credentialList: any[] = [];
  showCorrectionRequest = false;
  selectedCredential: any;
  currentUser: any;
  grievanceMessage: string;
  isLoading = false;

  successModalRef: NgbModalRef;
  @ViewChild('successModal') successModal: TemplateRef<any>;

  constructor(
    private readonly authService: AuthService,
    private readonly claimGrievanceService: ClaimGrievanceService,
    private readonly credentialService: CredentialService,
    private readonly toastMessageService: ToastMessageService,
    private readonly generalService: GeneralService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    console.log("currentUser", this.currentUser);
    this.getIssuedCredentials();
    // setTimeout(() => {
    //   this.successModalRef = this.modalService.open(this.successModal);
    // }, 5000);
  }

  cancelCorrection() {
    this.showCorrectionRequest = false;
    this.selectedCredential = null;
    this.grievanceMessage = "";
  }


  confirmCorrection() {
    const request = {
      "credential_schema_id": this.selectedCredential.id,
      "grv_school_id": this.selectedCredential.credentialSubject.orgId,
      "grv_school_name": this.selectedCredential.credentialSubject.orgName,
      "grvSubject": `Correction of Class “${this.selectedCredential.credentialSubject.unitAssociatedWith} Marksheet“`,
      "grvDesc": this.grievanceMessage
  }
    this.claimGrievanceService.raiseGrievance(request).subscribe((res: any) => {
      this.successModalRef = this.modalService.open(this.successModal);
      race(this.successModalRef.closed, this.successModalRef.dismissed).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }, error => {
      this.toastMessageService.error('', this.generalService.translateString('SOMETHING_WENT_WRONG'));
    });
  }

  closeModal() {
    if (this.successModalRef) {
      this.successModalRef.close();
    }
  }

  getIssuedCredentials() {
    this.isLoading = true;
    this.credentialService.getSchemaList().pipe(switchMap((res: any) => {
      const enrollmentSchema = res.find((item: any) => item.schema_name.toLowerCase().includes('enrollment'));
      if (enrollmentSchema) {
        return this.credentialService.getCredentials().pipe(map((res: any) => res.filter((item: any) => item.credentialSchemaId === enrollmentSchema.schema_id)));
      }
      return of([]);
    })).subscribe((res: any) => {
      this.isLoading = false;
      console.log("res", res);
      this.credentialList = res
    }, error => {
      this.isLoading = false;
    });
  }

  selectCredential(item) {
    this.showCorrectionRequest = true;
    this.selectedCredential = item;
  }
}
