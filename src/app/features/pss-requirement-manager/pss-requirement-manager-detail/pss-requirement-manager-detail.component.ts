import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { PssRequirementManager } from '../pss-requirement-manager';
import { PssRequirementManagerService } from '../pss-requirement-manager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { PssRequirementManagerConstants } from '../pss-requirement-manager.constants';

@Component({
  selector: 'tr-pss-requirement-manager-detail',
  templateUrl: 'pss-requirement-manager-detail.component.html',
  providers: [PssRequirementManagerService, TokenService]
})
export class PssRequirementManagerDetailComponent implements OnInit {

  private subscription: Subscription;
  pssRequirementManager: PssRequirementManager;
  private pssRequirementManagerId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private pssRequirementManagerService: PssRequirementManagerService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.pssRequirementManagerId = params['id'];
      this.pssRequirementManagerService.getPssRequirementManager(this.pssRequirementManagerId).subscribe((data: PssRequirementManager) => {
      this.pssRequirementManager = data;
      //console.log(this.pssRequirementManager);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(PssRequirementManagerConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(PssRequirementManagerConstants.featureId, field, "Read");
  }

}
