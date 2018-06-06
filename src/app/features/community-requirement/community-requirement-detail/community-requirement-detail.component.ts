import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { CommunityRequirement } from '../community-requirement';
import { CommunityRequirementService } from '../community-requirement.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CommunityRequirementConstants } from '../community-requirement.constants';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'tr-community-requirement-detail',
  templateUrl: 'community-requirement-detail.component.html'
})
export class CommunityRequirementDetailComponent implements OnInit {

  private subscription: Subscription;
  communityRequirement: CommunityRequirement;
  private communityRequirementId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private completedLength: any;
  private profileId: number;
  private rarCalculationList: any[];
  constructor(private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private communityRequirementService: CommunityRequirementService,
    private headerService: HeaderService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Requirement Details');
    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('communityRequirementId'))
        this.communityRequirementId = params['communityRequirementId'];
      if (params.hasOwnProperty('profileId'))
        this.profileId = params['profileId'];
      //this.authorizationService.getAuthorizationDataByTableId(CommunityRequirementConstants.tableId).subscribe(authorizationData => {
      this.authorizationService.getAuthorizationData(CommunityRequirementConstants.featureId, CommunityRequirementConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(CommunityRequirementConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(CommunityRequirementConstants.featureId, authorizationData[1]);
        }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CommunityRequirementConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CommunityRequirementConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.communityRequirementService.getCommunityRequirement(this.communityRequirementId).subscribe(data => {
            this.communityRequirement = data;
            if(data.length != null){
            this.completedLength = data.length.split(" ")[0];
            }

            
            if (data.hasOwnProperty('unitsCode')) {
              if (this.communityRequirement.length == null) {
                this.communityRequirement.length = '';
                data.unitsCode = '';

              }
              this.communityRequirement.length = this.communityRequirement.length + " " + data.unitsCode;
            }
          })

          this.communityRequirementService.getRARCountForRequirement(this.profileId, this.communityRequirementId).subscribe(data => {

            this.rarCalculationList = data;

          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CommunityRequirementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CommunityRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CommunityRequirementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CommunityRequirementConstants.featureId, field, "Read");
  }

  parseOfficer(officerName) {
    if (officerName != null && typeof officerName != undefined) {
      return officerName.substring(officerName.indexOf("/") + 1).replace(/\[[0-9]*\]/g, "");
    } else
      return officerName;
  }

}
