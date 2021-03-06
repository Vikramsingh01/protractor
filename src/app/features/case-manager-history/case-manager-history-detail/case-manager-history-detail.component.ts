import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { CaseManagerHistory } from '../case-manager-history';
import { CaseManagerHistoryService } from '../case-manager-history.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CaseManagerHistoryConstants } from '../case-manager-history.constants';


@Component({
  selector: 'tr-case-manager-history-detail',
  templateUrl: 'case-manager-history-detail.component.html'
})
export class CaseManagerHistoryDetailComponent implements OnInit {

  private subscription: Subscription;
  caseManagerHistory: CaseManagerHistory;
  private caseManagerHistoryId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private caseManagerHistoryService: CaseManagerHistoryService,
      private headerService: HeaderService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.caseManagerHistoryId = params['caseManagerHistoryId'];
       //this.authorizationService.getAuthorizationDataByTableId(CaseManagerHistoryConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CaseManagerHistoryConstants.featureId, CaseManagerHistoryConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CaseManagerHistoryConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CaseManagerHistoryConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CaseManagerHistoryConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CaseManagerHistoryConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.caseManagerHistoryService.getCaseManagerHistory(this.caseManagerHistoryId).subscribe(data => {
                this.caseManagerHistory = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(CaseManagerHistoryConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CaseManagerHistoryConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(CaseManagerHistoryConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CaseManagerHistoryConstants.featureId, field, "Read");
  }

}
