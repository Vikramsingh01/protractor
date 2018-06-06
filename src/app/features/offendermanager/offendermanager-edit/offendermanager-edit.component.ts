import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { OffenderManager } from '../offendermanager';
import { OffenderManagerService } from '../offendermanager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { OffenderManagerConstants } from '../offendermanager.constants';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-offendermanager-edit',
  templateUrl: 'offendermanager-edit.component.html',
  providers: [OffenderManagerService]
})
export class OffenderManagerEditComponent implements OnInit {

  private subscription: Subscription;
  offenderManager: OffenderManager = new OffenderManager();
  private offenderManagerId: number;

  offenderManagerForm: FormGroup;
private action;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private offenderManagerService: OffenderManagerService) { }

  ngOnInit() {
	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
    this.authorizationService.getAuthorizationData(OffenderManagerConstants.featureId, OffenderManagerConstants.tableId).subscribe(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(OffenderManagerConstants.featureId, res[0]);
        this.dataService.addFeatureFields(OffenderManagerConstants.featureId, res[1]);
      }
    });
    this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('profileId')) {
          this.offenderManager.profileId = params['profileId'];
        }
      });
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.offenderManagerId = params['id'];
        this.offenderManagerService.getOffenderManager(this.offenderManagerId).subscribe((data: OffenderManager) => {
          this.offenderManager = data;
          this.offenderManagerForm.patchValue(this.offenderManager);
        });
      }

      
    })
  }

  onSubmit() {
    if (this.offenderManagerForm.valid) {
		this.offenderManagerForm.patchValue(Utility.escapeHtmlTags(this.offenderManagerForm.value));
      this.subscription = this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('id')) {
          this.offenderManagerId = params['id'];
          this.offenderManagerService.updateOffenderManager(this.offenderManagerId, this.offenderManagerForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user',this.offenderManager.profileId]);
          });
        } else {
          this.offenderManagerService.addOffenderManager(this.offenderManagerForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user',this.offenderManager.profileId]);
          });
        }
      });
    }
    else {
      alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(OffenderManagerConstants.featureId, field, "Create");
  }

  initForm() {
    this.offenderManagerForm = this._fb.group({
      offenderManagerId: [this.offenderManager.offenderManagerId],
      allocationDate: [this.offenderManager.allocationDate],
      allocationReasonId: [this.offenderManager.allocationReasonId],
      endDate: [this.offenderManager.endDate],
      profileId: [this.offenderManager.profileId],
      providerId: [this.offenderManager.providerId],
      responsibleOfficer: [this.offenderManager.responsibleOfficer],
      responsibleTeam: [this.offenderManager.responsibleTeam],
      spgOffenderManagerId: [0],
      spgVersion: [this.offenderManager.spgVersion],
      spgUpdateUser: [this.offenderManager.spgUpdateUser],
      // createdDate: [this.offenderManager.createdDate],
      // createdBy: [this.offenderManager.createdBy],
      // createdByUserId: [this.offenderManager.createdByUserId],
      // modifiedDate: [this.offenderManager.modifiedDate],
      // modifiedBy: [this.offenderManager.modifiedBy],
      // modifiedByUserId: [this.offenderManager.modifiedByUserId],
      // deleted: [this.offenderManager.deleted],
      // deletedDate: [this.offenderManager.deletedDate],
      // deletedBy: [this.offenderManager.deletedBy],
      // deletedByUserId: [this.offenderManager.deletedByUserId],
      // locked: [this.offenderManager.locked],
      // version: [this.offenderManager.version],
    });
  }
}
