import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { LicenceConditionManager } from '../licence-condition-manager';
import { LicenceConditionManagerService } from '../licence-condition-manager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { LicenceConditionManagerConstants } from '../licence-condition-manager.constants';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-licence-condition-manager-edit',
  templateUrl: 'licence-condition-manager-edit.component.html',
  providers: [LicenceConditionManagerService]
})
export class LicenceConditionManagerEditComponent implements OnInit {

  private subscription: Subscription;
  licenceConditionManager: LicenceConditionManager = new LicenceConditionManager();
  private licenceConditionManagerId: number;

  licenceConditionManagerForm: FormGroup;
  private profileId;
  private eventId;
  private action;

  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private licenceConditionManagerService: LicenceConditionManagerService) { }

  ngOnInit() {
    let routeData: any = this.route.routeConfig.data;
    if (routeData.action === "Create") {
      this.action = "Add";
    } else {
      this.action = "Edit";
    }
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('licenceConditionId')) {
        this.licenceConditionManager.licenceConditionId = params['licenceConditionId'];
      }
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
      if (params.hasOwnProperty('eventId')) {
        this.eventId = params['eventId'];
      }
    });
    this.authorizationService.getAuthorizationData(LicenceConditionManagerConstants.featureId, LicenceConditionManagerConstants.tableId).subscribe(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(LicenceConditionManagerConstants.featureId, res[0]);
        this.dataService.addFeatureFields(LicenceConditionManagerConstants.featureId, res[1]);
      }
    });
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.licenceConditionManagerId = params['id'];
        this.licenceConditionManagerService.getLicenceConditionManager(this.licenceConditionManagerId).subscribe((data: LicenceConditionManager) => {
          this.licenceConditionManager = data;
          this.licenceConditionManagerForm.patchValue(this.licenceConditionManager);
        });
      }
    })
  }



  onSubmit() {
    if (this.licenceConditionManagerForm.valid) {
		this.licenceConditionManagerForm.patchValue(Utility.escapeHtmlTags(this.licenceConditionManagerForm.value));
      if (this.licenceConditionManagerId != null) {
        this.licenceConditionManagerService.updateLicenceConditionManager(this.licenceConditionManagerId, this.licenceConditionManagerForm.value).subscribe((response: any) => {
          this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'licence-condition', this.licenceConditionManager.licenceConditionId]);
        });
      } else {
        this.licenceConditionManagerService.addLicenceConditionManager(this.licenceConditionManagerForm.value).subscribe((response: any) => {
          this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'licence-condition', this.licenceConditionManager.licenceConditionId]);
        });
      }
    }
    else {
      alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(LicenceConditionManagerConstants.featureId, field, "Create");
  }

  initForm() {
    this.licenceConditionManagerForm = this._fb.group({
      licenceConditionManagerId: [this.licenceConditionManager.licenceConditionManagerId],
      licenceConditionId: [this.licenceConditionManager.licenceConditionId],
      allocationDate: [this.licenceConditionManager.allocationDate],
      allocationReasonId: [this.licenceConditionManager.allocationReasonId],
      endDate: [this.licenceConditionManager.endDate],
      providerId: [this.licenceConditionManager.providerId],
      responsibleOfficer: [this.licenceConditionManager.responsibleOfficer],
      responsibleTeam: [this.licenceConditionManager.responsibleTeam],
      spgLicenceConditionManagerId: [0],
      spgVersion: [this.licenceConditionManager.spgVersion],
      spgUpdateUser: [this.licenceConditionManager.spgUpdateUser],
      // createdDate: [this.licenceConditionManager.createdDate],
      // createdBy: [this.licenceConditionManager.createdBy],
      // createdByUserId: [this.licenceConditionManager.createdByUserId],
      // modifiedDate: [this.licenceConditionManager.modifiedDate],
      // modifiedBy: [this.licenceConditionManager.modifiedBy],
      // modifiedByUserId: [this.licenceConditionManager.modifiedByUserId],
      // deleted: [this.licenceConditionManager.deleted],
      // deletedDate: [this.licenceConditionManager.deletedDate],
      // deletedBy: [this.licenceConditionManager.deletedBy],
      // deletedByUserId: [this.licenceConditionManager.deletedByUserId],
      // locked: [this.licenceConditionManager.locked],
      // version: [this.licenceConditionManager.version],
    });
  }
}
