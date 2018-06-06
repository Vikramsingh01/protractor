import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { AddressAssessment } from '../address-assessment';
import { AddressAssessmentService } from '../address-assessment.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AddressAssessmentConstants } from '../address-assessment.constants';


@Component({
  selector: 'tr-address-assessment-detail',
  templateUrl: 'address-assessment-detail.component.html'
})
export class AddressAssessmentDetailComponent implements OnInit {

  private subscription: Subscription;
  addressAssessment: AddressAssessment;
  private addressAssessmentId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private addressAssessmentService: AddressAssessmentService,
      private headerService: HeaderService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.addressAssessmentId = params['addressAssessmentId'];
       //this.authorizationService.getAuthorizationDataByTableId(AddressAssessmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AddressAssessmentConstants.featureId, AddressAssessmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AddressAssessmentConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AddressAssessmentConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AddressAssessmentConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AddressAssessmentConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.addressAssessmentService.getAddressAssessment(this.addressAssessmentId).subscribe(data => {
                this.addressAssessment = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(AddressAssessmentConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AddressAssessmentConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(AddressAssessmentConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AddressAssessmentConstants.featureId, field, "Read");
  }

}
