import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Assessment } from '../assessment';
import { AssessmentService } from '../assessment.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AssessmentConstants } from '../assessment.constants';
import { Utility } from "../../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-assessment-detail',
  templateUrl: 'assessment-detail.component.html'
})
export class AssessmentDetailComponent implements OnInit {

  private subscription: Subscription;
  assessment: Assessment;
  private assessmentId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private nsrdData: any = [];
  constructor(private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private assessmentService: AssessmentService,
    private headerService: HeaderService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Assessment');
    this.subscription = this.route.params.subscribe((params: any) => {
      this.assessmentId = params['assessmentId'];
      this.authorizationService.getAuthorizationData(AssessmentConstants.featureId, AssessmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(AssessmentConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(AssessmentConstants.featureId, authorizationData[1]);
        }
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AssessmentConstants.featureId, "Read");
        if (this.authorizedFlag) {
           
          
          this.assessmentService.getAssessment(this.assessmentId).subscribe(data => {
            this.assessment = data;
            data = this.assessmentService.removeConstantsFields(data);
            this.assessmentService.getAssessmentCrd(data).subscribe((breResponse: any) => {
              
              this.updateNsrd(breResponse.resultMap.fieldObjectList);
            });
          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  updateNsrd(nsrdData) {
        nsrdData.forEach((element: any) => {
            this.nsrdData[element.fieldName] = {};
            this.nsrdData[element.fieldName].active = element.active;
        });

    }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(AssessmentConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(AssessmentConstants.featureId, field, "Read");
  }

}
