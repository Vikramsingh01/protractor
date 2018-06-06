import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ServiceProvider } from '../service-provider';
import { ServiceProviderService } from '../service-provider.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ServiceProviderConstants } from '../service-provider.constants';


@Component({
  selector: 'tr-service-provider-detail',
  templateUrl: 'service-provider-detail.component.html'
})
export class ServiceProviderDetailComponent implements OnInit {

  private subscription: Subscription;
  serviceProvider: ServiceProvider;
  private serviceProviderId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private selectedCrc : any[] = [];

   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private serviceProviderService: ServiceProviderService,
      private headerService: HeaderService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.serviceProviderId = params['serviceProviderId'];
       //this.authorizationService.getAuthorizationDataByTableId(ServiceProviderConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ServiceProviderConstants.featureId, ServiceProviderConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ServiceProviderConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ServiceProviderConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ServiceProviderConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ServiceProviderConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.serviceProviderService.getServiceProvider(this.serviceProviderId).subscribe(data => {
                this.serviceProvider = data;
                this.serviceProviderService.getCrcByServiceIdList(this.serviceProviderId).subscribe(data => {
                this.selectedCrc = data;
            })
            })            
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ServiceProviderConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ServiceProviderConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ServiceProviderConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ServiceProviderConstants.featureId, field, "Read");
  }

}
