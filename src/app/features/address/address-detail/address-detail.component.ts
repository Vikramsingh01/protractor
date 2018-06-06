import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Address } from '../address';
import { addressService } from '../address.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { addressConstants } from '../address.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-address-detail',
  templateUrl: 'address-detail.component.html'
})
export class addressDetailComponent implements OnInit {

  private subscription: Subscription;
  address: Address;
  private addressId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private addressService: addressService,
      private headerService: HeaderService,
      private _titleService: Title) { }

  ngOnInit() {
        this._titleService.setTitle('View Address');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.addressId = params['offenderAddressId'];
       //this.authorizationService.getAuthorizationDataByTableId(addressConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(addressConstants.featureId, addressConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(addressConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(addressConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(addressConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(addressConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.addressService.getaddress(this.addressId).subscribe(data => {
                this.address = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(addressConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(addressConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(addressConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(addressConstants.featureId, field, "Read");
  }

}
