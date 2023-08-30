import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthConfigService } from '../authentication/auth-config.service';
import { DataService } from '../services/data/data-request.service';
import { map } from 'rxjs/operators';

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

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly authConfigService: AuthConfigService,
    private readonly dataService: DataService
  ) {
    const navigation = this.router.getCurrentNavigation();
    // this.state = { ...navigation.extras.state };

    // if (!Object.keys(this.state).length) {
    //   if (this.authService.isLoggedIn) {
    //     this.router.navigate(['/home']);
    //   } else {
    //     this.router.navigate(['/login']);
    //   }
    // }
  }

  ngOnInit(): void {
    this.aadhaarFormControl.valueChanges.subscribe((value: any) => {
      this.aadhaarFormControl.setValue(value.replace(/\D/g, ''), { emitEvent: false });
    });

    this.otpFormControl.valueChanges.subscribe((value: any) => {
      this.otpFormControl.setValue(value.replace(/\D/g, ''), { emitEvent: false });
    });
  }

  getOTP() {
    this.isGetOTPClicked = true;
  }

  submitOTP() {
    const payload = {
      aadhaar_id: this.aadhaarFormControl.value,
    }
    this.authService.aadhaarKYC(payload).subscribe((res: any) => {
      this.getDetails();
      this.showKYCStatus = true;
      this.isAadhaarVerified = true;
    }, (error) => {
      this.showKYCStatus = true;
      this.isAadhaarVerified = false;
    });
  }

  getDetails() {
    let headerOptions = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });

    let apiUrl;
    if (localStorage.getItem('isDigilockerUser') === 'true') {
      apiUrl = `${this.authConfigService.config.bulkIssuance}/bulk/v1/learner/digi/getdetail`;
    } else {
      apiUrl = `${this.authConfigService.config.bulkIssuance}/bulk/v1/learner/getdetail`;
    }

    this.dataService.get({ url: apiUrl, header: headerOptions }).pipe(map((res: any) => {
      localStorage.setItem('currentUser', JSON.stringify(res.result));
      return res;
    })).subscribe();
  }

  startKYC() {
    this.showForm = true;
  }

}
