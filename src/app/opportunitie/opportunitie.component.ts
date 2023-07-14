import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from '../services/general/general.service';
import * as opp from '../../assets/config/ui-config/opportunitie.json'

@Component({
  selector: 'app-opportunitie',
  templateUrl: './opportunitie.component.html',
  styleUrls: ['./opportunitie.component.scss']
})
export class OpportunitieComponent implements OnInit {
  opportunities: any[];

  constructor( private readonly generalService: GeneralService,private readonly translate: TranslateService ) {
   
   }

  ngOnInit(): void {
    // this.initialize();
    // this.translate.onLangChange.subscribe(_ => {
    //   this.initialize();
    // });
    this.opportunities= (opp as any).default;
  }

  //   initialize(){
  //     this.opportunities = 
  //     [
  //       {
  //         label: 'IDreamCareer | Career Counselling for Girls',
  //         img:'assets/icons/sarthi.svg',
  //         eligibilityLink:'https://sarthi-maharashtragov.in/',
  //         applyLink:"https://sarthi-maharashtragov.in/"
  //       },
  //       {
  //         label: 'IDreamCareer | Career Counselling for Girls',
  //         img:'assets/icons/sarthi.svg',
  //         eligibilityLink:'https://sarthi-maharashtragov.in/',
  //         applyLink:"https://sarthi-maharashtragov.in/"
  //       },
  //       {
  //         label: 'IDreamCareer | Career Counselling for Girls',
  //         img:'assets/icons/sarthi.svg',
  //         eligibilityLink:'https://sarthi-maharashtragov.in/',
  //         applyLink:"https://sarthi-maharashtragov.in/"
  //       },
  //   ];
  // }


}
