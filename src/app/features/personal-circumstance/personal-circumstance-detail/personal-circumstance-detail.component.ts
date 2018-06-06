import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { PersonalCircumstance } from '../personal-circumstance';
import { PersonalCircumstanceService } from '../personal-circumstance.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { PersonalCircumstanceConstants } from '../personal-circumstance.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-personal-circumstance-detail',
  templateUrl: 'personal-circumstance-detail.component.html'
})
export class PersonalCircumstanceDetailComponent implements OnInit {

  private subscription: Subscription;
  personalCircumstance: PersonalCircumstance;
  private personalCircumstanceId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  constructor(private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private personalCircumstanceService: PersonalCircumstanceService,
    private headerService: HeaderService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Personal Circumstance');
    this.subscription = this.route.params.subscribe((params: any) => {
      this.personalCircumstanceId = params['personalCircumstanceId'];
      //this.authorizationService.getAuthorizationDataByTableId(PersonalCircumstanceConstants.tableId).subscribe(authorizationData => {
      this.authorizationService.getAuthorizationData(PersonalCircumstanceConstants.featureId, PersonalCircumstanceConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(PersonalCircumstanceConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(PersonalCircumstanceConstants.featureId, authorizationData[1]);
        }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(PersonalCircumstanceConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PersonalCircumstanceConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.personalCircumstanceService.getPersonalCircumstance(this.personalCircumstanceId).subscribe(data => {
            this.personalCircumstance = data;
          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(PersonalCircumstanceConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(PersonalCircumstanceConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(PersonalCircumstanceConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(PersonalCircumstanceConstants.featureId, field, "Read");
  }

}
