import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ClaimGrievanceService } from '../services/claim-grievance.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { GeneralService } from '../services/general/general.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { race } from 'rxjs';
import { Router } from '@angular/router';

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

  successModalRef: NgbModalRef;
  @ViewChild('successModal') successModal: TemplateRef<any>;

  constructor(
    private readonly authService: AuthService,
    private readonly claimGrievanceService: ClaimGrievanceService,
    private readonly toastMessageService: ToastMessageService,
    private readonly generalService: GeneralService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    console.log("currentUser", this.currentUser);

    // setTimeout(() => {
    //   this.successModalRef = this.modalService.open(this.successModal);
    // }, 5000);
  }

  cancel() {
    this.showCorrectionRequest = false;
  }

  confirm() {
    this.claimGrievanceService.raiseGrievance(this.grievanceMessage).subscribe((res: any) => {
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
}
