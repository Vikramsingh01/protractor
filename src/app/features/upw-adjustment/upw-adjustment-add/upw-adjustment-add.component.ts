import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwAdjustmentService } from '../upw-adjustment.service';
import { UpwAdjustmentConstants } from '../upw-adjustment.constants';
import { UpwAdjustment } from '../upw-adjustment';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-upw-adjustment-edit',
    templateUrl: 'upw-adjustment-add.component.html'
})
export class UpwAdjustmentAddComponent implements OnInit {

    private subscription: Subscription;
    private upwAdjustmentId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    upwAdjustmentAddForm: FormGroup;
    private upwAdjustment: UpwAdjustment = new UpwAdjustment();
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private upwAdjustmentService: UpwAdjustmentService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('upwAdjustmentId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Community Payback Adjustment");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Community Payback Adjustment");
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(UpwAdjustmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(UpwAdjustmentConstants.featureId, UpwAdjustmentConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(UpwAdjustmentConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(UpwAdjustmentConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwAdjustmentConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAdjustmentConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('upwAdjustmentId')) {
                        this.upwAdjustmentId = params['upwAdjustmentId'];
                        this.upwAdjustmentService.getUpwAdjustment(this.upwAdjustmentId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.upwAdjustmentAddForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");
                                
                            }
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });
    }
    navigateTo(url) {
        if (this.upwAdjustmentAddForm.touched) {
            this.confirmService.confirm(
                {
                    message: 'Do you want to leave this page without saving?',
                    header: 'Confirm',
                    accept: () => {
                        this.router.navigate(url, {relativeTo: this.route});
                    }
                });
        }else{
            this.router.navigate(url, {relativeTo: this.route});
            return false;
        }
    }
    onSubmit() {
        if (this.upwAdjustmentAddForm.valid) {
				this.upwAdjustmentAddForm.patchValue(Utility.escapeHtmlTags(this.upwAdjustmentAddForm.value));
			
            if (this.upwAdjustmentId != null) {
                this.upwAdjustmentService.updateUpwAdjustment(this.upwAdjustmentId, this.upwAdjustmentAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.upwAdjustmentService.addUpwAdjustment(this.upwAdjustmentAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(UpwAdjustmentConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(UpwAdjustmentConstants.featureId, field, this.action);
    }
    initForm() {
        this.upwAdjustmentAddForm = this._fb.group({
                        adjustmentType:[ this.upwAdjustment.adjustmentType ,  Validators.compose([ Validators.required , ,  Validators.maxLength(20) , ]) ],
                        adjustmentDate:[ this.upwAdjustment.adjustmentDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        upwAdjustmentId:[ this.upwAdjustment.upwAdjustmentId ,  Validators.compose([ Validators.required , , , ]) ],
                        adjustmentAmount:[ this.upwAdjustment.adjustmentAmount ,  Validators.compose([ Validators.required , , , ]) ],
                        eventId:[ this.upwAdjustment.eventId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgVersion:[ this.upwAdjustment.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
                        spgUpdateUser:[ this.upwAdjustment.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
                        adjustmentReasonId:[ this.upwAdjustment.adjustmentReasonId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgUpwAdjustmentId:[ this.upwAdjustment.spgUpwAdjustmentId ,  Validators.compose([ Validators.required , , , ]) ],
                        createdBy:[ this.upwAdjustment.createdBy , ],
                        createdByUserId:[ this.upwAdjustment.createdByUserId , ],
                        createdDate:[ this.upwAdjustment.createdDate , ],
                        modifiedBy:[ this.upwAdjustment.modifiedBy , ],
                        modifiedByUserId:[ this.upwAdjustment.modifiedByUserId , ],
                        modifiedDate:[ this.upwAdjustment.modifiedDate , ],
                        deleted:[ this.upwAdjustment.deleted , ],
                        deletedBy:[ this.upwAdjustment.deletedBy , ],
                        deletedByUserId:[ this.upwAdjustment.deletedByUserId , ],
                        deletedDate:[ this.upwAdjustment.deletedDate , ],
                        locked:[ this.upwAdjustment.locked , ],
                        version:[ this.upwAdjustment.version , ],
                    });
    }
}

