import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { CurrentCaseManager } from '../current-case-manager';
import { CurrentCaseManagerService } from '../current-case-manager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CurrentCaseManagerConstants } from '../current-case-manager.constants';
import { CaseManagerHistoryListComponent } from '../../case-manager-history/case-manager-history-list/case-manager-history-list.component';



@Component({
  selector: 'tr-current-case-manager-detail',
  templateUrl: 'current-case-manager-detail.component.html' 
})
export class CurrentCaseManagerDetailComponent implements OnInit {

  private subscription: Subscription;
  currentCaseManager: CurrentCaseManager;
      caseManager: any;
      team: any;
      Office: any;
      contactNumber: any;
      date: any;
  private currentCaseManagerId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private currentCaseManagerService: CurrentCaseManagerService,
      private headerService: HeaderService) { }

  ngOnInit() {

      this.subscription = this.route.params.subscribe((params: any)=>{
      this.currentCaseManagerId = params['profileId'];

       //this.authorizationService.getAuthorizationDataByTableId(CurrentCaseManagerConstants.tableId).subscribe(authorizationData => {
        //this.authorizationService.getAuthorizationData(CurrentCaseManagerConstants.featureId, CurrentCaseManagerConstants.tableId).subscribe(authorizationData => {
        //this.authorizationData = authorizationData;
        //if (authorizationData.length > 0) {
           // this.dataService.addFeatureActions(CurrentCaseManagerConstants.featureId, authorizationData[0]);
           // this.dataService.addFeatureFields(CurrentCaseManagerConstants.featureId, authorizationData[1]);
     // }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CurrentCaseManagerConstants.tableId, "Read", this.authorizationData);
       // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CurrentCaseManagerConstants.featureId, "Read");
       // if (this.authorizedFlag) {
            //this.currentCaseManagerService.getCurrentCaseManagerByProfileId(this.currentCaseManagerId).subscribe(data => {
               // this.currentCaseManager = data;
           // })
       // } else {
           // this.headerService.setAlertPopup("Not authorized");
        //}
    //});
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(CurrentCaseManagerConstants.tableId, action, this.authorizationData);
    //return this.authorizationService.isFeatureActionAuthorized(CurrentCaseManagerConstants.featureId, action);
    return true;
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(CurrentCaseManagerConstants.tableId, field, "Read", this.authorizationData);
    //return this.authorizationService.isFeildAuthorized(CurrentCaseManagerConstants.featureId, field, "Read");
    return true;
  }

}
