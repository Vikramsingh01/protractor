import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CommunityRequirementService } from '../community-requirement.service';
import { CommunityRequirementConstants } from '../community-requirement.constants';
import { ListService } from '../../../services/list.service';
import { CommunityRequirement } from '../community-requirement';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
import { Title } from "@angular/platform-browser";
import { ExtraValidators } from "../../process-contact/extraValidator.component";
@Component({
    selector: 'tr-community-requirement-edit',
    templateUrl: 'community-requirement-add.component.html'
})
export class CommunityRequirementAddComponent implements OnInit {

    private subscription: Subscription;
    private communityRequirementId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    communityRequirementAddForm: FormGroup;
    private communityRequirement: CommunityRequirement = new CommunityRequirement();
    private action;
    private team: string = null;
    private officer: string = null;
    private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private communityRequirementService: CommunityRequirementService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private listService: ListService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('communityRequirementId')) {
                this.action = "Create";
                this.titleService.setTitle('Add Requirement Details');
            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit Requirement Details');
            }
        });

        this.authorizationService.getAuthorizationData(CommunityRequirementConstants.featureId, CommunityRequirementConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(CommunityRequirementConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(CommunityRequirementConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(CommunityRequirementConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CommunityRequirementConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('communityRequirementId')) {
                        this.communityRequirementId = params['communityRequirementId'];
                        this.communityRequirementService.getCommunityRequirement(this.communityRequirementId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.previousNotes = data.note;
                                data.note = "";
                                this.team = data.rqResponsibleTeam;
                                this.officer = data.rqResponsibleOfficer;
                                data.rqResponsibleTeam = data.rqResponsibleTeam.split("/")[1].split("(")[0].split("[")[0];
                                data.rqResponsibleOfficer = this.parseOfficer(data.rqResponsibleOfficer);

                                this.communityRequirementAddForm.patchValue(data);

                                this.communityRequirementAddForm.controls['requirementTypeMainCategoryId'].disable();
                                this.communityRequirementAddForm.controls['requirementTypeSubCategoryId'].disable();
                                this.communityRequirementAddForm.controls['rqResponsibleTeam'].disable();
                                this.communityRequirementAddForm.controls['rqResponsibleOfficer'].disable();
                                this.communityRequirementAddForm.controls['unitsCode'].patchValue(data['unitsCode']);
                                if (data.length != null) {
                                    this.communityRequirementAddForm.controls['length'].disable();
                                }
                                else {

                                    this.communityRequirementAddForm.removeControl('length');
                                }

                            }
                            else {
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
        if (this.communityRequirementAddForm.touched) {
            this.confirmService.confirm(
                {
                    message: 'Do you want to leave this page without saving?',
                    header: 'Confirm',
                    accept: () => {
                        this.router.navigate(url, { relativeTo: this.route });
                    }
                });
        } else {
            this.router.navigate(url, { relativeTo: this.route });
            return false;
        }
    }
    onSubmit() {
        if (this.communityRequirementAddForm.valid) {
            this.communityRequirementAddForm.patchValue(Utility.escapeHtmlTags(this.communityRequirementAddForm.value));

            if (this.communityRequirementId != null) {
                this.communityRequirementAddForm.controls['rqResponsibleTeam'].setValue(this.team);
                this.communityRequirementAddForm.controls['rqResponsibleOfficer'].setValue(this.officer);
                this.communityRequirementService.updateCommunityRequirement(this.communityRequirementId, this.communityRequirementAddForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                });
            } else {
                this.communityRequirementService.addCommunityRequirement(this.communityRequirementAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CommunityRequirementConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CommunityRequirementConstants.featureId, field, this.action);
    }
    initForm() {
        this.communityRequirementAddForm = this._fb.group({
            communityRequirementId: [this.communityRequirement.communityRequirementId, Validators.compose([Validators.required, , ,])],
            eventId: [this.communityRequirement.eventId, Validators.compose([Validators.required, , ,])],
            additionalRequirementTypeMainCategoryId: [{ value: this.communityRequirement.additionalRequirementTypeMainCategoryId, disabled: true }, Validators.compose([, , ,])],
            additionalRequirementTypeSubCategoryId: [{ value: this.communityRequirement.additionalRequirementTypeSubCategoryId, disabled: true }, Validators.compose([, , ,])],
            expectedStartDate: [this.communityRequirement.expectedStartDate, Validators.compose([, ValidationService.dateValidator, ,])],
            note: [this.communityRequirement.note, Validators.compose([, , ,])],
            expectedEndDate: [this.communityRequirement.expectedEndDate, Validators.compose([, ValidationService.dateValidator, ,])],
            terminationReasonId: [this.communityRequirement.terminationReasonId, Validators.compose([, , ,])],
            attendanceCount: [this.communityRequirement.attendanceCount, Validators.compose([, , ,])],
            spgCommunityRequirementId: ['0', Validators.compose([Validators.required, , ,])],
            imposedDate: [{ value: this.communityRequirement.imposedDate, disabled: true }, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            requirementTypeMainCategoryId: [this.communityRequirement.requirementTypeMainCategoryId, Validators.compose([, , ,])],
            requirementTypeSubCategoryId: [this.communityRequirement.requirementTypeSubCategoryId, Validators.compose([, , ,])],
            length: [this.communityRequirement.length + this.communityRequirement.unitsCode, Validators.compose([Validators.required, , ,])],
            actualStartDate: [this.communityRequirement.actualStartDate, Validators.compose([, ValidationService.dateValidator, ,])],
            actualEndDate: [this.communityRequirement.actualEndDate, Validators.compose([, ValidationService.dateValidator, ,])],
            unitsCode: [{ value: this.communityRequirement.unitsCode, disabled: true }, Validators.compose([, , ,])],
            rqResponsibleTeam: [this.communityRequirement.rqResponsibleTeam, Validators.compose([, , ,])],
            rqResponsibleOfficer: [this.communityRequirement.rqResponsibleOfficer, Validators.compose([, , ,])],
        });
    }

    parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }
}

