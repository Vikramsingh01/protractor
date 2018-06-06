import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { contactinformation } from '../contactinformation';
import { contactinformationService } from '../contactinformation.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { contactinformationConstants } from '../contactinformation.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-contactinformation-detail',
  templateUrl: 'contactinformation-detail.component.html'
})
export class contactinformationDetailComponent implements OnInit {

  private subscription: Subscription;
  contactinformation: contactinformation;
  private contactinformationId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private action;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private contactinformationService: contactinformationService,
      private headerService: HeaderService,
      private _titleService: Title) { }

  ngOnInit() {
    this._titleService.setTitle('Key Contacts');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.contactinformationId = params['profileId'];
       //this.authorizationService.getAuthorizationDataByTableId(contactinformationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(contactinformationConstants.featureId, contactinformationConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(contactinformationConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(contactinformationConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(contactinformationConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(contactinformationConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.contactinformationService.getcontactinformation(this.contactinformationId).subscribe(data => {
                this.contactinformation = data;
                this.action=this.getAction(this.contactinformation)
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }
 getAction(data){
  var action="";
    // console.log("==tele=="+data.telephoneNumber+"==mbl=="+data.mobileNumber.length+"ppppp===allow==="+data.allowSmsYesNoId+"==email=="+data.emailAddress);
  if((data.telephoneNumber==null ||   data.telephoneNumber === "undefined" ||  data.telephoneNumber === "" || data.telephoneNumber.length==0 )  && 
    (data.mobileNumber==null  ||   data.mobileNumber === "undefined" ||  data.mobileNumber === "" || data.mobileNumber.length==0)&&
    (data.allowSmsYesNoId ==null  ||   data.allowSmsYesNoId === "undefined" ||  data.allowSmsYesNoId === "" || data.allowSmsYesNoId.length==0) &&
  ( data.emailAddress ==null  ||   data.emailAddress === "undefined" ||  data.emailAddress === "" || data.emailAddress.length==0)){
    return action="Add"
  }else{
    return action="Edit"
  }
}

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(contactinformationConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(contactinformationConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(contactinformationConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(contactinformationConstants.featureId, field, "Read");
  }

}
