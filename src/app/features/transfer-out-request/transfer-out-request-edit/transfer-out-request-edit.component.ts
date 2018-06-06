import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { TransferOutRequestService } from '../transfer-out-request.service';
import { TransferOutRequestConstants } from '../transfer-out-request.constants';
import { TransferOutRequest } from '../transfer-out-request';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-transfer-out-request-edit',
    templateUrl: 'transfer-out-request-edit.component.html'
})
export class TransferOutRequestEditComponent implements OnInit {

    private subscription: Subscription;
    private transferOutRequestId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
   
     private transferOutRequest1: TransferOutRequest = new TransferOutRequest();
    transferOutRequestEditForm: FormGroup;
    private transferOutRequest: TransferOutRequest = new TransferOutRequest();
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private transferOutRequestService: TransferOutRequestService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private _titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('profileId')) {
                this.action = "Create";
                this._titleService.setTitle('Add Transfer Out Request');
            }else{
                this.action = "Update";
                this._titleService.setTitle('Edit Transfer Out Request');
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(TransferOutRequestConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(TransferOutRequestConstants.featureId, TransferOutRequestConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(TransferOutRequestConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(TransferOutRequestConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(TransferOutRequestConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TransferOutRequestConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('profileId')) {
                        this.transferOutRequestId = params['profileId'];
                        this.transferOutRequestService.getTransferOutRequest(this.transferOutRequestId).subscribe((data: any) => {
                         
                                 this.transferOutRequest1 = data;
                                this.transferOutRequestEditForm.patchValue(data);
                          
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });
    }
    navigateTo(url) {
        if (this.transferOutRequestEditForm.touched) {
           
          this.router.navigate(url, {relativeTo: this.route});
             
        }else{
            this.router.navigate(url, {relativeTo: this.route});
            return false;
        }
    }
    onSubmit() {
     //   if (this.transferOutRequestEditForm.valid) {
            if (this.transferOutRequestId != null) {
                this.transferOutRequestService.updateTransferOutRequest(this.transferOutRequestId, this.transferOutRequestEditForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            } else {
                this.transferOutRequestService.addTransferOutRequest(this.transferOutRequestEditForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
      //  }
        // else {
        //     //alert("Invalid Form");
        // }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(TransferOutRequestConstants.tableId, field, this.action, this.authorizationData);
      //  return this.authorizationService.isFeildAuthorized(TransferOutRequestConstants.featureId, field, this.action);
      return true;
    }
    initForm() {
        this.transferOutRequestEditForm = this._fb.group({
                        transferOutRequestId:[ this.transferOutRequest.transferOutRequestId ,  Validators.compose([ , , , ]) ],
                        type:[ this.transferOutRequest.type ,  Validators.compose([ , ,  Validators.maxLength(80) , ]) ],
                        descriptionId:[ {value:this.transferOutRequest.descriptionId,disabled: true},  Validators.compose([, , , ]) ],
                        transferToProviderId:[ {value:this.transferOutRequest.transferToProviderId,disabled: true},  Validators.compose([, , , ]) ],
                        transferFromProviderId:[ this.transferOutRequest.transferFromProviderId ,  Validators.compose([, , , ]) ],
                        transferReasonId:[ this.transferOutRequest.transferReasonId ,  Validators.compose([, , , ]) ],
                        statusId:[ {value:this.transferOutRequest.statusId,disabled: true} ,  Validators.compose([ , , , ]) ],
                        profileId:[ this.transferOutRequest.profileId ,  Validators.compose([ , , , ]) ],
                        dataId:[ this.transferOutRequest.dataId ,  Validators.compose([ , , , ]) ],
                        tableId:[ this.transferOutRequest.tableId ,  Validators.compose([ , , , ]) ],
                        transferToTeam:[ this.transferOutRequest.transferToTeam ,  Validators.compose([  , , , ]) ],
                        transferWithdrawnReasonId:[ this.transferOutRequest.transferWithdrawnReasonId ,  Validators.compose([ , , , ]) ],
                        requestDate:[  {value:this.transferOutRequest.requestDate,disabled: true} ,  Validators.compose([ ,  ValidationService.dateValidator , , ]) ],
                        transferToOfficer:[ this.transferOutRequest.transferToOfficer ,  Validators.compose([, ,  Validators.maxLength(80) , ]) ],
                        teamId:[this.transferOutRequest.teamId, , , ],
                        // transferFromTeam:[ this.transferOutRequest.transferFromTeam ,  Validators.compose([ Validators.required , ,  Validators.maxLength(80) , ]) ],
                        // transferFromOfficer:[ this.transferOutRequest.transferFromOfficer ,  Validators.compose([ Validators.required , ,  Validators.maxLength(80) , ]) ],
                        // transferRequestId:[ this.transferOutRequest.transferRequestId ,  Validators.compose([ Validators.required , , , ]) ],
                        createdBy:[ this.transferOutRequest.createdBy , ],
                        createdByUserId:[ this.transferOutRequest.createdByUserId , ],
                        createdDate:[ this.transferOutRequest.createdDate , ],
                        modifiedBy:[ this.transferOutRequest.modifiedBy , ],
                        modifiedByUserId:[ this.transferOutRequest.modifiedByUserId , ],
                        modifiedDate:[ this.transferOutRequest.modifiedDate , ],
                        deleted:[ this.transferOutRequest.deleted , ],
                        deletedBy:[ this.transferOutRequest.deletedBy , ],
                        deletedByUserId:[ this.transferOutRequest.deletedByUserId , ],
                        deletedDate:[ this.transferOutRequest.deletedDate , ],
                        locked:[ this.transferOutRequest.locked , ],
                        version:[ this.transferOutRequest.version , ],
                    });
    }
}

