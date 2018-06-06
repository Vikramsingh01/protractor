import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Cohort } from '../cohort';
import { CohortService } from '../cohort.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { CohortConstants } from '../cohort.constants';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-cohort-edit',
  templateUrl: 'cohort-edit.component.html',
  providers: [CohortService]
})
export class CohortEditComponent implements OnInit {

  private subscription: Subscription;
  cohort: Cohort = new Cohort();
  private cohortId: number;
  private profileId;
  cohortForm: FormGroup;
private action;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private cohortService: CohortService) { }

  ngOnInit() {
    	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
      if (params.hasOwnProperty('eventId')) {
        this.cohort.eventId = params['eventId'];
      }
    })

    this.authorizationService.getAuthorizationData(CohortConstants.featureId, CohortConstants.tableId).subscribe(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(CohortConstants.featureId, res[0]);
        this.dataService.addFeatureFields(CohortConstants.featureId, res[1]);
      }
    });
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.cohortId = params['id'];
        this.cohortService.getCohort(this.cohortId).subscribe((data: Cohort) => {
          this.cohort = data;
          this.cohortForm.patchValue(this.cohort);
        });
      }
    })
  }

  onSubmit() {
    if (this.cohortForm.valid) {
		this.cohortForm.patchValue(Utility.escapeHtmlTags(this.cohortForm.value));
      
      this.subscription = this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('id')) {
          this.cohortId = params['id'];
          this.cohortService.updateCohort(this.cohortId, this.cohortForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.profileId, 'event', this.cohort.eventId]);
          });
        } else {
          this.cohortService.addCohort(this.cohortForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.profileId, 'event', this.cohort.eventId]);
          });
        }
      });
    }
    else {
      alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(CohortConstants.featureId, field, "Create");
  }

  initForm() {
    this.cohortForm = this._fb.group({
      cohortId: [this.cohort.cohortId],
      caseReferenceNumber: [this.cohort.caseReferenceNumber],
      cohortCode: [this.cohort.cohortCode],
      cohortProviderId: [this.cohort.cohortProviderId],
      eventId: [this.cohort.eventId],
      sentenceReleaseDate: [this.cohort.sentenceReleaseDate],
      spgCohortId: [0],
      startDate: [this.cohort.startDate],
      spgVersion: [this.cohort.spgVersion],
      spgUpdateUser: [this.cohort.spgUpdateUser],
      // createdDate: [this.cohort.createdDate],
      // createdBy: [this.cohort.createdBy],
      // createdByUserId: [this.cohort.createdByUserId],
      // modifiedDate: [this.cohort.modifiedDate],
      // modifiedBy: [this.cohort.modifiedBy],
      // modifiedByUserId: [this.cohort.modifiedByUserId],
      // deleted: [this.cohort.deleted],
      // deletedDate: [this.cohort.deletedDate],
      // deletedBy: [this.cohort.deletedBy],
      // deletedByUserId: [this.cohort.deletedByUserId],
      // locked: [this.cohort.locked],
      // version: [this.cohort.version],
    });
  }
}
