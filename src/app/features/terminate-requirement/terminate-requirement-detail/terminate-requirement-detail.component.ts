import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { TerminateRequirement } from '../terminate-requirement';
import { TerminateRequirementService } from '../terminate-requirement.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { TerminateRequirementConstants } from '../terminate-requirement.constants';


@Component({
  selector: 'tr-terminate-requirement-detail',
  templateUrl: 'terminate-requirement-detail.component.html'
})
export class TerminateRequirementDetailComponent implements OnInit {

  private subscription: Subscription;
  terminateRequirement: TerminateRequirement;
  private terminateRequirementId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private terminateRequirementService: TerminateRequirementService,
      private headerService: HeaderService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.terminateRequirementId = params['terminateRequirementId'];
       //this.authorizationService.getAuthorizationDataByTableId(TerminateRequirementConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(TerminateRequirementConstants.featureId, TerminateRequirementConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(TerminateRequirementConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(TerminateRequirementConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(TerminateRequirementConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TerminateRequirementConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.terminateRequirementService.getTerminateRequirement(this.terminateRequirementId).subscribe(data => {
                this.terminateRequirement = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(TerminateRequirementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(TerminateRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(TerminateRequirementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(TerminateRequirementConstants.featureId, field, "Read");
  }

}
