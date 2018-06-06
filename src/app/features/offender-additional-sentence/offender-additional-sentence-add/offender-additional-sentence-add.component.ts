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
import { OffenderAdditionalSentenceService } from '../offender-additional-sentence.service';
import { OffenderAdditionalSentenceConstants } from '../offender-additional-sentence.constants';
import { OffenderAdditionalSentence } from '../offender-additional-sentence';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-offender-additional-sentence-edit',
    templateUrl: 'offender-additional-sentence-add.component.html'
})
export class OffenderAdditionalSentenceAddComponent implements OnInit {

    private subscription: Subscription;
    private offenderAdditionalSentenceId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    offenderAdditionalSentenceAddForm: FormGroup;
    private offenderAdditionalSentence: OffenderAdditionalSentence = new OffenderAdditionalSentence();
    private action;
    private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private offenderAdditionalSentenceService: OffenderAdditionalSentenceService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('offenderAdditionalSentenceId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Additional Sentence");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Additional Sentence");
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(OffenderAdditionalSentenceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(OffenderAdditionalSentenceConstants.featureId, OffenderAdditionalSentenceConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(OffenderAdditionalSentenceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(OffenderAdditionalSentenceConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(OffenderAdditionalSentenceConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OffenderAdditionalSentenceConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('offenderAdditionalSentenceId')) {
                        this.offenderAdditionalSentenceId = params['offenderAdditionalSentenceId'];
                        this.offenderAdditionalSentenceService.getOffenderAdditionalSentence(this.offenderAdditionalSentenceId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.previousNotes = data.note;
                                data.note = "";
                                this.offenderAdditionalSentenceAddForm.patchValue(data);
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
        if (this.offenderAdditionalSentenceAddForm.touched) {
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
        if (this.offenderAdditionalSentenceAddForm.valid) {
			this.offenderAdditionalSentenceAddForm.patchValue(Utility.escapeHtmlTags(this.offenderAdditionalSentenceAddForm.value));
            if (this.offenderAdditionalSentenceId != null) {
                this.offenderAdditionalSentenceService.updateOffenderAdditionalSentence(this.offenderAdditionalSentenceId, this.offenderAdditionalSentenceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.offenderAdditionalSentenceService.addOffenderAdditionalSentence(this.offenderAdditionalSentenceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(OffenderAdditionalSentenceConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(OffenderAdditionalSentenceConstants.featureId, field, this.action);
    }
    initForm() {
        this.offenderAdditionalSentenceAddForm = this._fb.group({
                        offenderAdditionalSentenceId:[ this.offenderAdditionalSentence.offenderAdditionalSentenceId ,  Validators.compose([ Validators.required , , , ]) ],
                        eventId:[ this.offenderAdditionalSentence.eventId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgVersion:[ this.offenderAdditionalSentence.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
                        spgUpdateUser:[ this.offenderAdditionalSentence.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
                        note:[ this.offenderAdditionalSentence.note ,  Validators.compose([, , , ]) ],
                        spgOffenderAdditionalSentenceId:[ this.offenderAdditionalSentence.spgOffenderAdditionalSentenceId ,  Validators.compose([ Validators.required , , , ]) ],
                        createdBy:[ this.offenderAdditionalSentence.createdBy , ],
                        createdByUserId:[ this.offenderAdditionalSentence.createdByUserId , ],
                        createdDate:[ this.offenderAdditionalSentence.createdDate , ],
                        modifiedBy:[ this.offenderAdditionalSentence.modifiedBy , ],
                        modifiedByUserId:[ this.offenderAdditionalSentence.modifiedByUserId , ],
                        modifiedDate:[ this.offenderAdditionalSentence.modifiedDate , ],
                        deleted:[ this.offenderAdditionalSentence.deleted , ],
                        deletedBy:[ this.offenderAdditionalSentence.deletedBy , ],
                        deletedByUserId:[ this.offenderAdditionalSentence.deletedByUserId , ],
                        deletedDate:[ this.offenderAdditionalSentence.deletedDate , ],
                        locked:[ this.offenderAdditionalSentence.locked , ],
                        version:[ this.offenderAdditionalSentence.version , ],
                        additionalSentenceId:[ this.offenderAdditionalSentence.additionalSentenceId ,  Validators.compose([ Validators.required , , , ]) ],
                        length:[ this.offenderAdditionalSentence.length ,  Validators.compose([, , , ]) ],
                        amount:[ this.offenderAdditionalSentence.amount ,  Validators.compose([, , , ]) ],
                    });
    }
}

