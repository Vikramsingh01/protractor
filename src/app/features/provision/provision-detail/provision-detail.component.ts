import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Provision } from '../provision';
import { ProvisionService } from '../provision.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ProvisionConstants } from '../provision.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-provision-detail',
  templateUrl: 'provision-detail.component.html'
})
export class ProvisionDetailComponent implements OnInit {

  private subscription: Subscription;
  provision: Provision;
  private provisionId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private provisionService: ProvisionService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Accessibility Provision');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.provisionId = params['provisionId'];
       //this.authorizationService.getAuthorizationDataByTableId(ProvisionConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ProvisionConstants.featureId, ProvisionConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ProvisionConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ProvisionConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProvisionConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ProvisionConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.provisionService.getProvision(this.provisionId).subscribe(data => {
                this.provision = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ProvisionConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ProvisionConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ProvisionConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ProvisionConstants.featureId, field, "Read");
  }

}
