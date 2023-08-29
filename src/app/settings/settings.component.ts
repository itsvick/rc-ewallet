import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth/auth.service';
import { GeneralService } from '../services/general/general.service';
import { IInteractEventInput } from '../services/telemetry/telemetry-interface';
import { TelemetryService } from '../services/telemetry/telemetry.service';
import { ThemeService } from '../../app/services/theme/theme.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  languageSwitchRef: NgbModalRef;
  languages = [];
  currentLanguage: string;

  ELOCKER_THEME: string;
  @ViewChild('languageSwitchModal') languageSwitchModal: TemplateRef<any>;
  constructor(
    public readonly authService: AuthService,
    private readonly telemetryService: TelemetryService,
    private readonly modalService: NgbModal,
    private readonly generalService: GeneralService,
    private readonly toastMsgService: ToastMessageService,
    private readonly router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isKYCCompleted()) {
      this.toastMsgService.error('', this.generalService.translateString('COMPLETE_AADHAAR_KYC_FIRST'))
      this.router.navigate(['/aadhaar-kyc']);
      return;
    }

    this.getAllLanguages();
    this.ELOCKER_THEME = localStorage.getItem('ELOCKER_THEME');

    if (!this.ELOCKER_THEME) {
      localStorage.setItem('ELOCKER_THEME', 'default');
    }
  }

  getAllLanguages() {
    const languages = localStorage.getItem('languages');
    const selectedLanguage = localStorage.getItem('setLanguage');
    if (languages) {
      this.languages = JSON.parse(languages);

      this.languages = this.languages.map(item => {
        item.isSelected = item.code === selectedLanguage;
        return item;
      });
    }

    console.log("languages", this.languages);
  }

  showLanguageModal() {
    const options: NgbModalOptions = {
      animation: true,
      centered: false,
      size: 'sm',
    };
    this.languageSwitchRef = this.modalService.open(
      this.languageSwitchModal,
      options
    );
  }

  changeLanguage(selectedLanguage) {
    const selectedLang = localStorage.getItem('setLanguage');
    if (selectedLang !== selectedLanguage) {
      this.generalService.setLanguage(selectedLanguage);
    }
  }

  logOut() {
    this.raiseInteractEvent('logout-btn');
    this.authService.doLogout();
  }

  raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
    const telemetryInteract: IInteractEventInput = {
      context: {
        env: '',
        cdata: [],
      },
      edata: {
        id,
        type,
        subtype,
      },
    };
    this.telemetryService.interact(telemetryInteract);
  }

}
