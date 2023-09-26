import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthConfigService } from '../authentication/auth-config.service';
import { DataService } from '../services/data/data-request.service';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AadhaarKycStatusComponent } from '../aadhaar-kyc-status/aadhaar-kyc-status.component';
import { IInteractEventInput } from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';
import { race } from 'rxjs';

@Component({
  selector: 'app-aadhar-kyc',
  templateUrl: './aadhar-kyc.component.html',
  styleUrls: ['./aadhar-kyc.component.scss']
})
export class AadharKycComponent implements OnInit {
  showForm = false;
  isGetOTPClicked = false
  showKYCStatus = false;
  isAadhaarVerified: boolean;
  state: any;


  aadhaarFormControl = new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]{12}$')]);
  otpFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]);

  @ViewChild("otpModel") otpModel: ElementRef;

  @Output() kycCompleted = new EventEmitter<boolean>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly authConfigService: AuthConfigService,
    private readonly dataService: DataService,
    private readonly modalService: NgbModal,
    private readonly activatedRoute: ActivatedRoute,
    private readonly telemetryService: TelemetryService
  ) { }

  ngOnInit(): void {
    this.aadhaarFormControl.valueChanges.subscribe((value: any) => {
      this.aadhaarFormControl.setValue(value.replace(/\D/g, ''), { emitEvent: false });
    });

    this.otpFormControl.valueChanges.subscribe((value: any) => {
      this.otpFormControl.setValue(value.replace(/\D/g, ''), { emitEvent: false });
    });
  }

  getOTP() {
    this.raiseInteractEvent('aadhaar-kyc-get-otp');
    this.isGetOTPClicked = true;
  }

  submitOTP() {
    this.raiseInteractEvent('aadhaar-kyc-submit-otp');
    const payload = {
      aadhaar_id: this.aadhaarFormControl.value,
    }
    this.authService.aadhaarKYC(payload).subscribe((res: any) => {
      this.getDetails();
      this.isAadhaarVerified = true;
      this.openStatusModal();
      this.kycCompleted.emit(true);
    }, (error) => {
      this.isAadhaarVerified = false;
      this.openStatusModal();
    });
  }

  getDetails() {
    let headerOptions = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });

    let apiUrl;
    if (localStorage.getItem('isDigilockerUser') === 'true') {
      apiUrl = `${this.authConfigService.config.bffUrl}/v1/learner/digi/getdetail`;
    } else {
      apiUrl = `${this.authConfigService.config.bffUrl}/v1/learner/getdetail`;
    }

    this.dataService.get({ url: apiUrl, header: headerOptions }).pipe(map((res: any) => {
      localStorage.setItem('currentUser', JSON.stringify(res.result));
      return res;
    })).subscribe();
  }

  startKYC() {
    this.showForm = true;
    this.raiseInteractEvent('start-kyc');
  }

  openStatusModal() {
    const modalRef = this.modalService.open(AadhaarKycStatusComponent, {
      windowClass: 'round-corner-border',
      centered: true,
      size: 'sm'
    });

    modalRef.componentInstance.isVerified = this.isAadhaarVerified;
    modalRef.componentInstance.tryAgain.subscribe(() => {
      this.raiseInteractEvent('aadhaar-kyc-try-again');
      modalRef.dismiss();
    });

    race(modalRef.closed, modalRef.dismissed).subscribe(res => {
      this.kycCompleted.emit(true);
      this.router.navigate(['/home']);
    });

    modalRef.componentInstance.close
      .subscribe(() => {
        this.raiseInteractEvent('aadhaar-kyc-success-goto-wallet');
        this.kycCompleted.emit(true);
        modalRef.dismiss();
        this.router.navigate(['/home']);
      });
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


}
