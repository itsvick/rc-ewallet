import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-aadhaar-kyc-status',
  templateUrl: './aadhaar-kyc-status.component.html',
  styleUrls: ['./aadhaar-kyc-status.component.scss']
})
export class AadhaarKycStatusComponent implements OnInit {

  @Input() isVerified: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
