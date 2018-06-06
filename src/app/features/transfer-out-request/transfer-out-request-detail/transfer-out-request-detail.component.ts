import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { TransferOutRequest } from '../transfer-out-request';
import { TransferOutRequestService } from '../transfer-out-request.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { TransferOutRequestConstants } from '../transfer-out-request.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-transfer-out-request-detail',
  templateUrl: 'transfer-out-request-detail.component.html'
})
export class TransferOutRequestDetailComponent implements OnInit {

  private subscription: Subscription;
  transferOutRequest: TransferOutRequest;
  private transferOutRequestId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private transferOutRequestService: TransferOutRequestService,
      private headerService: HeaderService,
      private _titleService: Title) { }

  ngOnInit() {
    this._titleService.setTitle('View Transfer Out Request');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.transferOutRequestId = params['transferOutRequestId'];
       //this.authorizationService.getAuthorizationDataByTableId(TransferOutRequestConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(TransferOutRequestConstants.featureId, TransferOutRequestConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(TransferOutRequestConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(TransferOutRequestConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(TransferOutRequestConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TransferOutRequestConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.transferOutRequestService.getTransferOutRequest(this.transferOutRequestId).subscribe(data => {
                this.transferOutRequest = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(TransferOutRequestConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(TransferOutRequestConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(TransferOutRequestConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(TransferOutRequestConstants.featureId, field, "Read");
  }

}
