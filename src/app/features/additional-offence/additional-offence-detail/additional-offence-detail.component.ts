import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { AdditionalOffence } from '../additional-offence';
import { AdditionalOffenceService } from '../additional-offence.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AdditionalOffenceConstants } from '../additional-offence.constants';


@Component({
  selector: 'tr-additional-offence-detail',
  templateUrl: 'additional-offence-detail.component.html'
})
export class AdditionalOffenceDetailComponent implements OnInit {

  private subscription: Subscription;
  additionalOffence: AdditionalOffence;
  private additionalOffenceId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private additionalOffenceService: AdditionalOffenceService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Additional Offence");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.additionalOffenceId = params['additionalOffenceId'];
       //this.authorizationService.getAuthorizationDataByTableId(AdditionalOffenceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AdditionalOffenceConstants.featureId, AdditionalOffenceConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AdditionalOffenceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AdditionalOffenceConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AdditionalOffenceConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdditionalOffenceConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.additionalOffenceService.getAdditionalOffence(this.additionalOffenceId).subscribe(data => {
                this.additionalOffence = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(AdditionalOffenceConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AdditionalOffenceConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(AdditionalOffenceConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AdditionalOffenceConstants.featureId, field, "Read");
  }

}
