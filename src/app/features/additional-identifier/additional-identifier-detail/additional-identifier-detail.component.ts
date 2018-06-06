import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { AdditionalIdentifier } from '../additional-identifier';
import { AdditionalIdentifierService } from '../additional-identifier.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AdditionalIdentifierConstants } from '../additional-identifier.constants';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-additional-identifier-detail',
  templateUrl: 'additional-identifier-detail.component.html'
})
export class AdditionalIdentifierDetailComponent implements OnInit {

  private subscription: Subscription;
  additionalIdentifier: AdditionalIdentifier;
  private additionalIdentifierId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private additionalIdentifierService: AdditionalIdentifierService,
      private headerService: HeaderService,
      private _titleService: Title) { }

  ngOnInit() {
        this._titleService.setTitle('View Additional Identifier');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.additionalIdentifierId = params['additionalIdentifierId'];
       //this.authorizationService.getAuthorizationDataByTableId(AdditionalIdentifierConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AdditionalIdentifierConstants.featureId, AdditionalIdentifierConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AdditionalIdentifierConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AdditionalIdentifierConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AdditionalIdentifierConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdditionalIdentifierConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.additionalIdentifierService.getAdditionalIdentifier(this.additionalIdentifierId).subscribe(data => {
                this.additionalIdentifier = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(AdditionalIdentifierConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AdditionalIdentifierConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(AdditionalIdentifierConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AdditionalIdentifierConstants.featureId, field, "Read");
  }

}
