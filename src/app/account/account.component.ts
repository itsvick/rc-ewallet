import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  accountDetails: any;
  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.accountDetails = this.authService.currentUser;
    this.maskAadhaar();
  }

  maskAadhaar() {
    if (this.accountDetails?.kyc_aadhaar_token) {
      this.accountDetails.kyc_aadhaar_token = "**** **** " + this.accountDetails.kyc_aadhaar_token.slice(-4);
    }
  }

}
