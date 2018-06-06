import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { LicenceCondition } from '../licence-condition';
import { LicenceConditionService } from '../licence-condition.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { LicenceConditionConstants } from '../licence-condition.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-licence-condition-detail',
  templateUrl: 'licence-condition-detail.component.html'
})
export class LicenceConditionDetailComponent implements OnInit {

  private subscription: Subscription;
  licenceCondition: LicenceCondition;
  private licenceConditionId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private licenceConditionService: LicenceConditionService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Licence Condition');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.licenceConditionId = params['licenceConditionId'];
       //this.authorizationService.getAuthorizationDataByTableId(LicenceConditionConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(LicenceConditionConstants.featureId, LicenceConditionConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(LicenceConditionConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(LicenceConditionConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(LicenceConditionConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(LicenceConditionConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.licenceConditionService.getLicenceCondition(this.licenceConditionId).subscribe(data => {
                this.licenceCondition = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(LicenceConditionConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(LicenceConditionConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(LicenceConditionConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(LicenceConditionConstants.featureId, field, "Read");
  }

  parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }

}
