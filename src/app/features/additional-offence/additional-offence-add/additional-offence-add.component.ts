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
import { AdditionalOffenceService } from '../additional-offence.service';
import { AdditionalOffenceConstants } from '../additional-offence.constants';
import { AdditionalOffence } from '../additional-offence';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';

import { Utility } from '../../../shared/utility';
@Component({
    selector: 'tr-additional-offence-edit',
    templateUrl: 'additional-offence-add.component.html'
})
export class AdditionalOffenceAddComponent implements OnInit {

    private subscription: Subscription;
    private additionalOffenceId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    additionalOffenceAddForm: FormGroup;
    private additionalOffence: AdditionalOffence = new AdditionalOffence();
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private additionalOffenceService: AdditionalOffenceService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('additionalOffenceId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Additional Offence");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Additional Offence");
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(AdditionalOffenceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AdditionalOffenceConstants.featureId, AdditionalOffenceConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AdditionalOffenceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AdditionalOffenceConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AdditionalOffenceConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdditionalOffenceConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('additionalOffenceId')) {
                        this.additionalOffenceId = params['additionalOffenceId'];
                        this.additionalOffenceService.getAdditionalOffence(this.additionalOffenceId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.additionalOffenceAddForm.patchValue(data);
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
        if (this.additionalOffenceAddForm.touched) {
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
        if (this.additionalOffenceAddForm.valid) {
            this.additionalOffenceAddForm.patchValue(Utility.escapeHtmlTags(this.additionalOffenceAddForm.value));
            if (this.additionalOffenceId != null) {
                this.additionalOffenceService.updateAdditionalOffence(this.additionalOffenceId, this.additionalOffenceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.additionalOffenceService.addAdditionalOffence(this.additionalOffenceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(AdditionalOffenceConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(AdditionalOffenceConstants.featureId, field, this.action);
    }
    initForm() {
        this.additionalOffenceAddForm = this._fb.group({
                        eventId:[ this.additionalOffence.eventId ,  Validators.compose([ Validators.required , , , ]) ],
                        additionalOffenceId:[ this.additionalOffence.additionalOffenceId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgVersion:[ this.additionalOffence.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
                        spgUpdateUser:[ this.additionalOffence.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
                        spgAdditionalOffenceId:[ this.additionalOffence.spgAdditionalOffenceId ,  Validators.compose([ Validators.required , , , ]) ],
                        createdBy:[ this.additionalOffence.createdBy , ],
                        createdByUserId:[ this.additionalOffence.createdByUserId , ],
                        createdDate:[ this.additionalOffence.createdDate , ],
                        modifiedBy:[ this.additionalOffence.modifiedBy , ],
                        modifiedByUserId:[ this.additionalOffence.modifiedByUserId , ],
                        modifiedDate:[ this.additionalOffence.modifiedDate , ],
                        deleted:[ this.additionalOffence.deleted , ],
                        deletedBy:[ this.additionalOffence.deletedBy , ],
                        deletedByUserId:[ this.additionalOffence.deletedByUserId , ],
                        deletedDate:[ this.additionalOffence.deletedDate , ],
                        locked:[ this.additionalOffence.locked , ],
                        version:[ this.additionalOffence.version , ],
                        offenceCodeId:[ this.additionalOffence.offenceCodeId ,  Validators.compose([ Validators.required , , , ]) ],
                        offenceDate:[ this.additionalOffence.offenceDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        offenceCount:[ this.additionalOffence.offenceCount ,  Validators.compose([ Validators.required , , , ]) ],
                    });
    }
}

