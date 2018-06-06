import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ServiceProviderContact } from '../service-provider-contact';
import { ServiceProviderContactService } from '../service-provider-contact.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ServiceProviderContactConstants } from '../service-provider-contact.constants';


@Component({
  selector: 'tr-service-provider-contact-detail',
  templateUrl: 'service-provider-contact-detail.component.html'
})
export class ServiceProviderContactDetailComponent implements OnInit {

  private subscription: Subscription;
  serviceProviderContact: ServiceProviderContact;
  private serviceProviderContactId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private serviceProviderContactService: ServiceProviderContactService,
      private headerService: HeaderService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.serviceProviderContactId = params['serviceProviderContactId'];
       //this.authorizationService.getAuthorizationDataByTableId(ServiceProviderContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ServiceProviderContactConstants.featureId, ServiceProviderContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ServiceProviderContactConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ServiceProviderContactConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ServiceProviderContactConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ServiceProviderContactConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.serviceProviderContactService.getServiceProviderContact(this.serviceProviderContactId).subscribe(data => {
                this.serviceProviderContact = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ServiceProviderContactConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ServiceProviderContactConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ServiceProviderContactConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ServiceProviderContactConstants.featureId, field, "Read");
  }

}
