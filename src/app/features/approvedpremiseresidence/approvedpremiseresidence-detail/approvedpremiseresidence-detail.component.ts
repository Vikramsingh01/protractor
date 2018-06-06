import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ApprovedPremiseResidence } from '../approvedpremiseresidence';
import { ApprovedPremiseResidenceService } from '../approvedpremiseresidence.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'tr-approvedpremiseresidence-detail',
  templateUrl: 'approvedpremiseresidence-detail.component.html',
  providers: [ApprovedPremiseResidenceService, TokenService]
})
export class ApprovedPremiseResidenceDetailComponent implements OnInit {

  private subscription: Subscription;
  approvedPremiseResidence: ApprovedPremiseResidence;
  private approvedPremiseResidenceId: number;

  constructor(private route: ActivatedRoute, private approvedPremiseResidenceService: ApprovedPremiseResidenceService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.approvedPremiseResidenceId = params['id'];
      this.approvedPremiseResidenceService.getApprovedPremiseResidence(this.approvedPremiseResidenceId).subscribe((data: ApprovedPremiseResidence) => {
      this.approvedPremiseResidence = data;
      //console.log(this.approvedPremiseResidence);
    });
    })
  }

  isAuthorized(action){
    return this.approvedPremiseResidenceService.isAuthorized(action);
  }
  isFeildAuthorized(field){
    return this.approvedPremiseResidenceService.isFeildAuthorized(field, 'Read');
  }

}
