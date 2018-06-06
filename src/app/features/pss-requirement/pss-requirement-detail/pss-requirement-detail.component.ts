import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { PssRequirement } from '../pss-requirement';
import { PssRequirementService } from '../pss-requirement.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { PssRequirementConstants } from '../pss-requirement.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-pss-requirement-detail',
  templateUrl: 'pss-requirement-detail.component.html'
})
export class PssRequirementDetailComponent implements OnInit {

  private subscription: Subscription;
  pssRequirement: PssRequirement;
  private pssRequirementId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  constructor(private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private pssRequirementService: PssRequirementService,
    private headerService: HeaderService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View PSS Requirements');
    this.subscription = this.route.params.subscribe((params: any) => {
      this.pssRequirementId = params['pssRequirementId'];
      //this.authorizationService.getAuthorizationDataByTableId(PssRequirementConstants.tableId).subscribe(authorizationData => {
      this.authorizationService.getAuthorizationData(PssRequirementConstants.featureId, PssRequirementConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(PssRequirementConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(PssRequirementConstants.featureId, authorizationData[1]);
        }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(PssRequirementConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PssRequirementConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.pssRequirementService.getPssRequirement(this.pssRequirementId).subscribe(data => {
            this.pssRequirement = data;
            if (data.hasOwnProperty('unitsCode')) {
              if (this.pssRequirement.length == null) {
                this.pssRequirement.length = '';
                data.unitsCode='';

              }

              this.pssRequirement.length = this.pssRequirement.length + " " + data.unitsCode;
            }

          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(PssRequirementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(PssRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(PssRequirementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(PssRequirementConstants.featureId, field, "Read");
  }

  parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }

}
