import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Alias } from '../alias';
import { AliasService } from '../alias.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AliasConstants } from '../alias.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-alias-detail',
  templateUrl: 'alias-detail.component.html'
})
export class AliasDetailComponent implements OnInit {

  private subscription: Subscription;
  alias: Alias;
  private aliasId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private aliasService: AliasService,
      private headerService: HeaderService,
      private _titleService: Title) { }

  ngOnInit() {
    this._titleService.setTitle('View Alias');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.aliasId = params['aliasId'];
       //this.authorizationService.getAuthorizationDataByTableId(AliasConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AliasConstants.featureId, AliasConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AliasConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AliasConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AliasConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.aliasService.getAlias(this.aliasId).subscribe(data => {
                this.alias = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(AliasConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AliasConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(AliasConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AliasConstants.featureId, field, "Read");
  }

}
