import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { UpwAdjustment } from '../upw-adjustment';
import { UpwAdjustmentService } from '../upw-adjustment.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwAdjustmentConstants } from '../upw-adjustment.constants';


@Component({
  selector: 'tr-upw-adjustment-detail',
  templateUrl: 'upw-adjustment-detail.component.html'
})
export class UpwAdjustmentDetailComponent implements OnInit {

  private subscription: Subscription;
  upwAdjustment: UpwAdjustment;
  private upwAdjustmentId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private upwAdjustmentService: UpwAdjustmentService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Community Payback Adjustment");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.upwAdjustmentId = params['upwAdjustmentId'];
       //this.authorizationService.getAuthorizationDataByTableId(UpwAdjustmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(UpwAdjustmentConstants.featureId, UpwAdjustmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(UpwAdjustmentConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(UpwAdjustmentConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwAdjustmentConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAdjustmentConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.upwAdjustmentService.getUpwAdjustment(this.upwAdjustmentId).subscribe(data => {
                this.upwAdjustment = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(UpwAdjustmentConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(UpwAdjustmentConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(UpwAdjustmentConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(UpwAdjustmentConstants.featureId, field, "Read");
  }

}
