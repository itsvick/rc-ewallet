import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aadhar-kyc',
  templateUrl: './aadhar-kyc.component.html',
  styleUrls: ['./aadhar-kyc.component.scss']
})
export class AadharKycComponent implements OnInit {
  showForm = false;
  aadhaarNumber: any;
  isGetOTPClicked = false
  otp: any;
  showKYCStatus = false;
  isAadhaarVerified: boolean;
  state: any;

  @ViewChild("otpModel") otpModel: ElementRef;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.state = { ...navigation.extras.state };
  }

  ngOnInit(): void {
  }

  getOTP() {
    this.isGetOTPClicked = true;
    // this.otpModel.nativeElement.focus();
  }

  submitOTP() {
    const payload = {
      "aadhaar_id": this.aadhaarNumber.toString(),
      "aadhaar_name": this.state.name,
      "aadhaar_gender": this.state.gender,
      "aadhaar_dob": this.state.dob
    }
    this.authService.aadhaarKYC(payload).subscribe((res: any) => {
      this.showKYCStatus = true;
      this.isAadhaarVerified = true;
    }, (error) => {
      this.showKYCStatus = true;
      this.isAadhaarVerified = false;
    });
  }

  startKYC() {
    this.showForm = true;
  }

}
