import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ProposedRequirement } from '../proposedrequirement';
import { ProposedRequirementService } from '../proposedrequirement.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ProposedRequirementConstants } from '../proposedrequirement.constants';

@Component({
  selector: 'tr-proposedrequirement-detail',
  templateUrl: 'proposedrequirement-detail.component.html',
  providers: [ProposedRequirementService, TokenService]
})
export class ProposedRequirementDetailComponent implements OnInit {

  private subscription: Subscription;
  proposedRequirement: ProposedRequirement;
  private proposedRequirementId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private proposedRequirementService: ProposedRequirementService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.proposedRequirementId = params['id'];
      this.proposedRequirementService.getProposedRequirement(this.proposedRequirementId).subscribe((data: ProposedRequirement) => {
      this.proposedRequirement = data;
      //console.log(this.proposedRequirement);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(ProposedRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(ProposedRequirementConstants.featureId, field, "Read");
  }

}
