import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { ListService } from '../../../services/list.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { LicenceConditionService } from '../licence-condition.service';
import { LicenceConditionConstants } from '../licence-condition.constants';
import { LicenceCondition } from '../licence-condition';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
import { Title } from "@angular/platform-browser";
import { ExtraValidators } from "../../process-contact/extraValidator.component";
@Component({
    selector: 'tr-licence-condition-edit',
    templateUrl: 'licence-condition-add.component.html'
})
export class LicenceConditionAddComponent implements OnInit {

    private subscription: Subscription;
    private licenceConditionId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    childAnswers: any = [];
    private MainTypeId: number;
    private SubTypeId: number;
    licenceConditionAddForm: FormGroup;
    private licenceCondition: LicenceCondition = new LicenceCondition();
    private action;
    private orgs: any = [];
    private teams: any = [];
    private officerIds: any = [];
    private team: string = null;
    private officer: string = null;
    private id;
    private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private licenceConditionService: LicenceConditionService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('eventId')) {
                this.licenceCondition.eventId = params['eventId'];
            }
            if (params.hasOwnProperty('profileId')) {
                this.licenceCondition.profileId = params['profileId'];
            }

            if (!params.hasOwnProperty('licenceConditionId')) {
                this.action = "Create";
                this.titleService.setTitle('Add Licence Condition');
            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit Licence Condition');
            }
        });

        this.listService.getListDataByLookupAndPkValue(263, 533, localStorage.getItem("loggedInUserId")).subscribe(listObj => {
            this.orgs = listObj;
            if (this.orgs.length > 0) {
                this.listService.getListDataByLookupAndPkValue(445, 2, this.orgs[0].key).subscribe(listObj => {
                    this.teams = listObj;
                })
            }
        })

        this.authorizationService.getAuthorizationData(LicenceConditionConstants.featureId, LicenceConditionConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(LicenceConditionConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(LicenceConditionConstants.featureId, authorizationData[1]);
            }
            this.initForm();
            if (this.action == "Update") {
                this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('licenceConditionId')) {
                        this.id = params['licenceConditionId'];
                    }
                });
            } else {
                this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('profileId')) {
                        this.id = params['profileId'];
                    }
                });
            }
            this.licenceConditionService.isAuthorize(this.id, this.action).subscribe((response: any) => {
                this.authorizedFlag = response;
                if (response) {
                    this.initForm();
                    this.subscription = this.route.params.subscribe((params: any) => {
                        if (params.hasOwnProperty('licenceConditionId')) {
                            this.licenceConditionId = params['licenceConditionId'];
                            this.licenceConditionService.getLicenceCondition(this.licenceConditionId).subscribe((data: any) => {
                                if (data.locked == "false") {
                                    this.previousNotes = data.note;
                                    data.note = "";
                                    data.lcResponsibleTeam = data.lcResponsibleTeam.split("/")[1].split("(")[0].split("[")[0];
                                    data.lcResponsibleOfficer = this.parseOfficer(data.lcResponsibleOfficer);

                                    this.licenceConditionAddForm.patchValue(data);
                                    if (this.action == "Update") {

                                        this.MainTypeId = data.licCondTypeMainCategoryId;
                                        this.SubTypeId = data.licCondTypeSubCategoryId;
                                        this.listService.getDependentAnswers(422, data.licCondTypeMainCategoryId).subscribe((childAnswers: any) => {
                                            this.childAnswers = childAnswers;
                                        })
                                    }
                                }
                                else {
                                    this.headerService.setAlertPopup("The record is locked");

                                }

                                if (this.action == "Update") {
                                    this.licenceConditionAddForm.controls['licCondTypeMainCategoryId'].disable();
                                    this.licenceConditionAddForm.controls['licCondTypeSubCategoryId'].disable();
                                    this.licenceConditionAddForm.controls['lcResponsibleTeam'].disable();
                                    this.licenceConditionAddForm.controls['lcResponsibleOfficer'].disable();
                                }
                            });
                        }
                    })

                } else {
                    this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
                }
            });
        });
    }
    navigateTo(url) {
        if (this.licenceConditionAddForm.touched) {
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
    change(option) {
        if (option.selectedIndex > 0) {
            let selectedTeamId = this.orgs[option.selectedIndex - 1].key;
            this.listService.getListDataByLookupAndPkValue(270, 538, selectedTeamId).subscribe(listObj => {
                this.officerIds = listObj;
                if (this.officerIds.length == 0) {
                    this.licenceConditionAddForm.value.officerIds = null;
                }
            })
        }
    }
    updateAnswers(childAnswers) {
        this.licenceConditionAddForm.controls['licCondTypeSubCategoryId'].setValue("");
        this.childAnswers = childAnswers;
    }
    onSubmit() {
        if (this.licenceConditionAddForm.valid) {
            this.licenceConditionAddForm.patchValue(Utility.escapeHtmlTags(this.licenceConditionAddForm.value));

            let licenceCondition: LicenceCondition = new LicenceCondition();
            this.route.params.subscribe((params: any) => {
                if (params.hasOwnProperty('eventId')) {
                    licenceCondition.eventId = params['eventId'];
                }
            });
            if (this.licenceConditionId != null) {
                this.licenceConditionAddForm.value.licCondTypeMainCategoryId = this.MainTypeId;
                this.licenceConditionAddForm.value.licCondTypeSubCategoryId = this.SubTypeId;
                this.licenceConditionService.getDisposalByEventId(this.licenceCondition.eventId).subscribe((response: any) => {
                    this.licenceConditionAddForm.value.lcProviderId = response['osProviderId'];
                    this.licenceConditionService.updateLicenceCondition(this.licenceConditionId, this.licenceConditionAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../../..'], { relativeTo: this.route });
                    });
                });
            } else {
                this.licenceConditionService.getDisposalByEventId(this.licenceCondition.eventId).subscribe((response: any) => {
                    this.licenceConditionAddForm.value.lcProviderId = response['osProviderId'];
                    this.licenceConditionService.addLicenceCondition(this.licenceConditionAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../..'], { relativeTo: this.route });
                    });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(LicenceConditionConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(LicenceConditionConstants.featureId, field, this.action);
    }
    initForm() {
        this.licenceConditionAddForm = this._fb.group({

            licCondTypeMainCategoryId: [this.licenceCondition.licCondTypeMainCategoryId, Validators.compose([Validators.required, , ,])],
            licCondTypeSubCategoryId: [this.licenceCondition.licCondTypeSubCategoryId, Validators.compose([Validators.required, , ,])],
            sentenceDate: [this.licenceCondition.sentenceDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            expectedStartDate: [this.licenceCondition.expectedStartDate, Validators.compose([, ValidationService.dateValidator, ,])],
            actualStartDate: [this.licenceCondition.actualStartDate, Validators.compose([, ValidationService.dateValidator, ,])],
            expectedEndDate: [this.licenceCondition.expectedEndDate, Validators.compose([, ValidationService.dateValidator, ,])],
            note: [this.licenceCondition.note, Validators.compose([, , ,])],
            eventId: [this.licenceCondition.eventId, Validators.compose([Validators.required, , ,])],
            licenceConditionId: [this.licenceCondition.licenceConditionId],
            spgVersion: [this.licenceCondition.spgVersion],
            spgUpdateUser: [this.licenceCondition.spgUpdateUser],
            spgLicenceConditionId: ['0'],
            lcResponsibleTeam: [this.licenceCondition.lcResponsibleTeam, Validators.compose([Validators.required, , ,])],
            lcResponsibleOfficer: [this.licenceCondition.lcResponsibleOfficer, Validators.compose([Validators.required, , ,])],
        });
    }
    parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
    }
}
