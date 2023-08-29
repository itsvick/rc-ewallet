import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as CredentialHandlerPolyfill from 'credential-handler-polyfill';
import * as WebCredentialHandler from 'web-credential-handler';


console.log('Ready to work with credentials!');
@Component({
  selector: 'app-wallet-worker',
  templateUrl: './wallet-worker.component.html',
  styleUrls: ['./wallet-worker.component.scss']
})
export class WalletWorkerComponent implements OnInit {
  
  constructor(private router: Router) { }

  MEDIATOR = 'https://authn.io/mediator' + '?origin=' + window.location.origin;
  WALLET_LOCATION = window.location.origin + '/';
  
  workerUrl = this.WALLET_LOCATION + 'wallet-worker';

  ngOnInit() {
    console.log(this.workerUrl);
    setTimeout(() => {
      this.registerWalletWithBrowser().catch(e => console.error('Error in registerWalletWithBrowser:', e));
      this.activateWalletEventHandler()
    }, 2000)
  }
  async registerWalletWithBrowser() {
    try {
      await CredentialHandlerPolyfill.loadOnce(this.MEDIATOR);
    } catch(e) {
      console.error('Error in loadOnce:', e);
    }
  
    console.log('Polyfill loaded.');
    console.log('Installing wallet worker handler at:', this.workerUrl);
  
    try {
      await WebCredentialHandler.installHandler();
      console.log('Wallet installed.');
    } catch(e) {
      console.error('Wallet installation failed', e);
    }
  }
  async activateWalletEventHandler() {
    try {
      await CredentialHandlerPolyfill.loadOnce(this.MEDIATOR);
    } catch (e) {
      console.error('Error in loadOnce:', e);
    }

    console.log('Worker Polyfill loaded, mediator:', this.MEDIATOR);
    const WALLET_LOCATION = this.WALLET_LOCATION + 'wallet-worker/wallet-ui-get';
    return WebCredentialHandler.activateHandler({
      mediatorOrigin: this.MEDIATOR,
      async get(event) {
        console.log('WCH: Received get() event:', event);
        let obj = { type: 'redirect', url: WALLET_LOCATION};
        return obj;
      },
    });
  }
}
