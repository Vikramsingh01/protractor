import { Component, OnInit } from '@angular/core';
 import {InstitutionalReportService} from '../institutional-report/institutional-report.service';
import { ReferralService } from '../referral/referral.service';
@Component({
  selector: 'tr-enablers',
  templateUrl: './enablers.component.html',
  providers: [ReferralService,InstitutionalReportService]
})
export class EnablersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
