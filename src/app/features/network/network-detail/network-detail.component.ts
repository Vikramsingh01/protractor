import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Network } from '../network';
import { NetworkService } from '../network.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { NetworkConstants } from '../network.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-network-detail',
  templateUrl: 'network-detail.component.html'
})
export class NetworkDetailComponent implements OnInit {

  private subscription: Subscription;
  network: Network;
  private personalcontactId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private networkService: NetworkService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Network');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.personalcontactId = params['personalContactId'];
       //this.authorizationService.getAuthorizationDataByTableId(NetworkConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(NetworkConstants.featureId, NetworkConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(NetworkConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(NetworkConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(NetworkConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(NetworkConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.networkService.getNetwork(this.personalcontactId).subscribe(data => {
                this.network = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(NetworkConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(NetworkConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(NetworkConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(NetworkConstants.featureId, field, "Read");
  }

}
