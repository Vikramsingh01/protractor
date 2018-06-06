import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { Recall } from '../recall';
import { RecallService } from '../recall.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { RecallConstants } from '../recall.constants';


@Component({
  selector: 'tr-recall-detail',
  templateUrl: 'recall-detail.component.html'
})
export class RecallDetailComponent implements OnInit {

  private subscription: Subscription;
  recall: Recall;
  private recallId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private recallService: RecallService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Recall");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.recallId = params['recallId'];
       //this.authorizationService.getAuthorizationDataByTableId(RecallConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(RecallConstants.featureId, RecallConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(RecallConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(RecallConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(RecallConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RecallConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.recallService.getRecall(this.recallId).subscribe(data => {
                this.recall = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(RecallConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(RecallConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(RecallConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(RecallConstants.featureId, field, "Read");
  }

}
