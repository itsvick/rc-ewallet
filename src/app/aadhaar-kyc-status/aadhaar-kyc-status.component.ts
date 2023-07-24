import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aadhaar-kyc-status',
  templateUrl: './aadhaar-kyc-status.component.html',
  styleUrls: ['./aadhaar-kyc-status.component.scss']
})
export class AadhaarKycStatusComponent implements OnInit {

  @Input() isVerified: boolean;
  @Input() kycState: any;
  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void {

  }

  tryAgain() {
    this.router.navigate(['/aadhaar-kyc'], { state: this.kycState });
  }
}
