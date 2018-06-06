import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { CourtAppearance } from '../court-appearance';
import { CourtAppearanceService } from '../court-appearance.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CourtAppearanceConstants } from '../court-appearance.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-court-appearance-detail',
  templateUrl: 'court-appearance-detail.component.html'
})
export class CourtAppearanceDetailComponent implements OnInit {

  private subscription: Subscription;
  courtAppearance: CourtAppearance;
  private courtAppearanceId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private courtAppearanceService: CourtAppearanceService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Court Appearance');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.courtAppearanceId = params['courtAppearanceId'];
       //this.authorizationService.getAuthorizationDataByTableId(CourtAppearanceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CourtAppearanceConstants.featureId, CourtAppearanceConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CourtAppearanceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CourtAppearanceConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtAppearanceConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CourtAppearanceConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.courtAppearanceService.getCourtAppearance(this.courtAppearanceId).subscribe(data => {
                this.courtAppearance = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(CourtAppearanceConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CourtAppearanceConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(CourtAppearanceConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CourtAppearanceConstants.featureId, field, "Read");
  }

}
