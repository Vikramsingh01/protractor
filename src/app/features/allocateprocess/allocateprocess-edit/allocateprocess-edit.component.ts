import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { AllocateProcess } from '../allocateprocess';
import { AllocateProcessService } from '../allocateprocess.service';
import { AllocateProcessConstants } from '../allocateprocess.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-allocateprocess-edit',
  templateUrl: 'allocateprocess-edit.component.html',
  providers: [AllocateProcessService]
})
export class AllocateProcessEditComponent implements OnInit {

  private subscription: Subscription;
  allocateProcess: AllocateProcess = new AllocateProcess();
  private allocateProcessId: number;
  private action;
  allocateProcessForm: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private allocateProcessService: AllocateProcessService, private authorizationService: AuthorizationService, private dataService: DataService) { }

  ngOnInit() {
	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
    this.authorizationService.getAuthorizationData(AllocateProcessConstants.featureId, AllocateProcessConstants.tableId).subscribe(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(AllocateProcessConstants.featureId, res[0]);
        this.dataService.addFeatureFields(AllocateProcessConstants.featureId, res[1]);
      }
    });
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.allocateProcessId = params['id'];
        this.allocateProcessService.getAllocateProcess(this.allocateProcessId).subscribe((data: AllocateProcess) => {
          this.allocateProcess = data;
          this.allocateProcessForm.patchValue(this.allocateProcess);
        });
      }
    })
  }

  onSubmit() {
    if (this.allocateProcessForm.valid) {
		 this.allocateProcessForm.patchValue(Utility.escapeHtmlTags(this.allocateProcessForm.value));
         this.subscription = this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('id')) {
          this.allocateProcessId = params['id'];
          this.allocateProcessService.updateAllocateProcess(this.allocateProcessId, this.allocateProcessForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.allocateProcess.profileId, 'additional-context']);
          });
        } else {
          this.allocateProcessService.addAllocateProcess(this.allocateProcessForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.allocateProcess.profileId, 'additional-context']);
          });
        }
      });
    }
    else {
      alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    let action;
    if (this.allocateProcessId == undefined || this.allocateProcessId == null) {
      action = "Create";
    } else {
      action = "Update";
    }
    return this.authorizationService.isFeildAuthorized(AllocateProcessConstants.featureId, field, action);
  }

  initForm() {
    this.allocateProcessForm = this._fb.group({
      allocateProcessId: [this.allocateProcess.allocateProcessId],
      processDate: [this.allocateProcess.processDate],
      processEndAttendanceCount: [this.allocateProcess.processEndAttendanceCount],
      processEndDate: [this.allocateProcess.processEndDate],
      processExpectedEndDate: [this.allocateProcess.processExpectedEndDate],
      processExpectedStartDate: [this.allocateProcess.processExpectedStartDate],
      processNote: [this.allocateProcess.processNote],
      processOutcomeId: [this.allocateProcess.processOutcomeId],
      processRefDate: [this.allocateProcess.processRefDate],
      processStageId: [this.allocateProcess.processStageId],
      processStartDate: [this.allocateProcess.processStartDate],
      processSubTypeId: [this.allocateProcess.processSubTypeId],
      processTypeId: [this.allocateProcess.processTypeId],
      profileId: [this.allocateProcess.profileId],
      spgVersion: [this.allocateProcess.spgVersion],
      spgUpdateUser: [this.allocateProcess.spgUpdateUser],
      // createdDate: [this.allocateProcess.createdDate],
      // createdBy: [this.allocateProcess.createdBy],
      // createdByUserId: [this.allocateProcess.createdByUserId],
      // modifiedDate: [this.allocateProcess.modifiedDate],
      // modifiedBy: [this.allocateProcess.modifiedBy],
      // modifiedByUserId: [this.allocateProcess.modifiedByUserId],
      // deleted: [this.allocateProcess.deleted],
      // deletedDate: [this.allocateProcess.deletedDate],
      // deletedBy: [this.allocateProcess.deletedBy],
      // deletedByUserId: [this.allocateProcess.deletedByUserId],
      // locked: [this.allocateProcess.locked],
      // version: [this.allocateProcess.version],
      processManagerProviderId: [this.allocateProcess.processManagerProviderId],
      processManagerTeam: [this.allocateProcess.processManagerTeam],
      processManagerOfficer: [this.allocateProcess.processManagerOfficer],
      spgProcessContactId: [0],
    });
  }
}
