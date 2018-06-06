import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ApprovedPremisesReferral } from '../approvedpremisesreferral';
import { ApprovedPremisesReferralConstants } from '../approvedpremisesreferral.constants';
import { ApprovedPremisesReferralService } from '../approvedpremisesreferral.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';

@Component({
  selector: 'tr-approvedpremisesreferral-detail',
  templateUrl: 'approvedpremisesreferral-detail.component.html',
  providers: [ApprovedPremisesReferralService, TokenService]
})
export class ApprovedPremisesReferralDetailComponent implements OnInit {

  private subscription: Subscription;
  approvedPremisesReferral: ApprovedPremisesReferral;
  private approvedPremisesReferralId: number;

  constructor(private route: ActivatedRoute, private approvedPremisesReferralService: ApprovedPremisesReferralService, private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.approvedPremisesReferralId = params['approvedPremisesReferralId'];
      this.approvedPremisesReferralService.getApprovedPremisesReferral(this.approvedPremisesReferralId).subscribe((data: ApprovedPremisesReferral) => {
      this.approvedPremisesReferral = data;
      //console.log(this.approvedPremisesReferral);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(ApprovedPremisesReferralConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(ApprovedPremisesReferralConstants.featureId, field, "Read");
  }

}
