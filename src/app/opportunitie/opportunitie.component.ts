import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from '../services/general/general.service';

@Component({
  selector: 'app-opportunitie',
  templateUrl: './opportunitie.component.html',
  styleUrls: ['./opportunitie.component.scss']
})
export class OpportunitieComponent implements OnInit {
  opportuntie: any[];

  constructor( private readonly generalService: GeneralService,private readonly translate: TranslateService ) {
   
   }

  ngOnInit(): void {
    this.initialize();
    this.translate.onLangChange.subscribe(_ => {
      this.initialize();
    });
  }

    initialize(){this.opportuntie = [
      {
        label: this.generalService.translateString('ID_REAMCAREER'),
        imgClass:'./../../assets/icons/sarthi.svg',
        Pilot :this.generalService.translateString('PILOT'),
        subLabel:this.generalService.translateString('PREVENT_DROPOUT'),
        eligibility:this.generalService.translateString('ELIGIBILITY_CRITERIA'),
        apply:this.generalService.translateString('APPLY_NOW')

      },
      
    ];
  }


}
