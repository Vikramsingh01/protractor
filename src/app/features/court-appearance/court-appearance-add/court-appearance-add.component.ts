import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CourtAppearanceService } from '../court-appearance.service';
import { CourtAppearanceConstants } from '../court-appearance.constants';
import { CourtAppearance } from '../court-appearance';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-court-appearance-edit',
    templateUrl: 'court-appearance-add.component.html'
})
export class CourtAppearanceAddComponent implements OnInit {

    private subscription: Subscription;
    private courtAppearanceId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    courtAppearanceAddForm: FormGroup;
    private courtAppearance: CourtAppearance = new CourtAppearance();
    private action;
    private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private courtAppearanceService: CourtAppearanceService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('courtAppearanceId')) {
                this.action = "Create";
                this.titleService.setTitle('Add Court Appearance');
            }else{
                this.action = "Update";
                this.titleService.setTitle('Edit Court Appearance');
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(CourtAppearanceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CourtAppearanceConstants.featureId, CourtAppearanceConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CourtAppearanceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CourtAppearanceConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtAppearanceConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CourtAppearanceConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('courtAppearanceId')) {
                        this.courtAppearanceId = params['courtAppearanceId'];
                        this.courtAppearanceService.getCourtAppearance(this.courtAppearanceId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.previousNotes = data.note;
                                data.note = "";
                                this.courtAppearanceAddForm.patchValue(data);
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
        if (this.courtAppearanceAddForm.touched) {
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
        if (this.courtAppearanceAddForm.valid) {
			this.courtAppearanceAddForm.patchValue(Utility.escapeHtmlTags(this.courtAppearanceAddForm.value));
            if (this.courtAppearanceId != null) {
                this.courtAppearanceService.updateCourtAppearance(this.courtAppearanceId, this.courtAppearanceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.courtAppearanceService.addCourtAppearance(this.courtAppearanceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CourtAppearanceConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CourtAppearanceConstants.featureId, field, this.action);
    }
    initForm() {
        this.courtAppearanceAddForm = this._fb.group({
                        note:[ this.courtAppearance.note ,  Validators.compose([, , , ]) ],
                        remandStatusId:[ this.courtAppearance.remandStatusId ,  Validators.compose([, , , ]) ],
                        courtAppearanceId:[ this.courtAppearance.courtAppearanceId ,  Validators.compose([ Validators.required , , , ]) ],
                        eventId:[ this.courtAppearance.eventId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgVersion:[ this.courtAppearance.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
                        spgUpdateUser:[ this.courtAppearance.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
                        pleaId:[ this.courtAppearance.pleaId ,  Validators.compose([, , , ]) ],
                        spgCourtAppearanceId:[ this.courtAppearance.spgCourtAppearanceId ,  Validators.compose([ Validators.required , , , ]) ],
                        createdBy:[ this.courtAppearance.createdBy , ],
                        createdByUserId:[ this.courtAppearance.createdByUserId , ],
                        createdDate:[ this.courtAppearance.createdDate , ],
                        modifiedBy:[ this.courtAppearance.modifiedBy , ],
                        modifiedByUserId:[ this.courtAppearance.modifiedByUserId , ],
                        modifiedDate:[ this.courtAppearance.modifiedDate , ],
                        deleted:[ this.courtAppearance.deleted , ],
                        deletedBy:[ this.courtAppearance.deletedBy , ],
                        deletedByUserId:[ this.courtAppearance.deletedByUserId , ],
                        deletedDate:[ this.courtAppearance.deletedDate , ],
                        locked:[ this.courtAppearance.locked , ],
                        version:[ this.courtAppearance.version , ],
                        courtId:[ this.courtAppearance.courtId ,  Validators.compose([ Validators.required , , , ]) ],
                        courtAppearanceTypeId:[ this.courtAppearance.courtAppearanceTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        courtDate:[ this.courtAppearance.courtDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        outcomeId:[ this.courtAppearance.outcomeId ,  Validators.compose([, , , ]) ],
                    });
    }
}

