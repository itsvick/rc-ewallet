import { Component, OnInit } from '@angular/core';
import * as opp from '../../assets/config/ui-config/opportunities.json';
import { AuthService } from '../services/auth/auth.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { UtilService } from '../services/util/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opportunitie',
  templateUrl: './opportunitie.component.html',
  styleUrls: ['./opportunitie.component.scss']
})
export class OpportunitieComponent implements OnInit {
  opportunities: any[];

  constructor(
    private readonly authService: AuthService,
    private readonly toastMsgService: ToastMessageService,
    private readonly utilService: UtilService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isKYCCompleted()) {
      this.toastMsgService.error('', this.utilService.translateString('COMPLETE_AADHAAR_KYC_FIRST'))
      this.router.navigate(['/aadhaar-kyc']);
      return;
    }
    this.opportunities= (opp as any).default;
  }
}