import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { OffenderDisability } from '../offender-disability';
import { OffenderDisabilityService } from '../offender-disability.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { OffenderDisabilityConstants } from '../offender-disability.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-offender-disability-detail',
  templateUrl: 'offender-disability-detail.component.html'
})
export class OffenderDisabilityDetailComponent implements OnInit {

  private subscription: Subscription;
  offenderDisability: OffenderDisability;
  private offenderDisabilityId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private offenderDisabilityService: OffenderDisabilityService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Accessibility');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.offenderDisabilityId = params['offenderDisabilityId'];
       //this.authorizationService.getAuthorizationDataByTableId(OffenderDisabilityConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(OffenderDisabilityConstants.featureId, OffenderDisabilityConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(OffenderDisabilityConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(OffenderDisabilityConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(OffenderDisabilityConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OffenderDisabilityConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.offenderDisabilityService.getOffenderDisability(this.offenderDisabilityId).subscribe(data => {
                this.offenderDisability = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(OffenderDisabilityConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(OffenderDisabilityConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(OffenderDisabilityConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(OffenderDisabilityConstants.featureId, field, "Read");
  }

}
