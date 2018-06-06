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
import { RegistrationReviewService } from '../registration-review.service';
import { RegistrationReviewConstants } from '../registration-review.constants';
import { ListService } from '../../../services/list.service';
import { RegistrationReview } from '../registration-review';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { AssociatedPTO } from '../associated-pto';
import { RegistrationService } from '../../registration/registration.service';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-registration-review-edit',
    templateUrl: 'registration-review-add.component.html'
})
export class RegistrationReviewAddComponent implements OnInit {

    private subscription: Subscription;
    private registrationReviewId: number;
    private authorizationData: any;
    private nsrdData: any = [];
    private authorizedFlag: boolean = false;
    registrationReviewAddForm: FormGroup;
    private registrationReview: RegistrationReview = new RegistrationReview();
    private action;
    orgs: any = [];
    providerList: any = [];
    providers: any = [];
    teams: any = [];
    officerIds: any = [];
    TeamIds: any = [];
    providerCodesList: any[];
    private previousNotes: string = "";
    private associatedPTO: AssociatedPTO;
    private team: string = "";
    private officer: string = "";
    constructor(private _fb: FormBuilder,
        private listService: ListService,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private registrationReviewService: RegistrationReviewService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private registrationService: RegistrationService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.providerCodesList = ['C10', 'C12', 'C11', 'C14', 'C13', 'C16', 'C15', 'C18', 'C17', 'C19', 'C21', 'C20', 'C01', 'C00', 'C03', 'C02', 'C05', 'C04', 'C07', 'C06', 'C09', 'C08', 'N00', 'N02', 'N01', 'N04', 'N03', 'N06', 'N05', 'N07'];
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('registrationReviewId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Registration Review");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit Registration Review");
            }
            if (params.hasOwnProperty('profileId')) {
                this.registrationReview.profileId = params['profileId'];
            }
            if (params.hasOwnProperty('registrationId')) {
                this.registrationReview.registrationId = params['registrationId'];
                this.registrationService.getRegistration(this.registrationReview.registrationId).subscribe(data => {
                    this.registrationReview.registrationType = data.registerTypeId;
                    this.registrationReviewAddForm.patchValue(this.registrationReview);
                    this.registrationReviewAddForm.controls['registrationType'].disable();
                })

            };
        });

        this.listService.getListDataWithLookup(193, 542).subscribe(listObj => {
            this.providerList = listObj;
            if (this.providerList.length > 0) {
                this.providers = listObj;
            }
        })

        // this.listService.getListDataByLookupAndPkValue(263, 533, localStorage.getItem("loggedInUserId")).subscribe(listObj => {
        //         this.orgs = listObj;
        //         if (this.orgs.length > 0) {
        //             this.listService.getListDataByLookupAndPkValue(445, 2, this.orgs[0].key).subscribe(listObj => {
        //                 this.teams = listObj;
        //             })
        //         }
        //     })

        this.authorizationService.getAuthorizationData(RegistrationReviewConstants.featureId, RegistrationReviewConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(RegistrationReviewConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(RegistrationReviewConstants.featureId, authorizationData[1]);
            }

            this.initForm();
            this.registrationReviewService.isAuthorize(this.registrationReview.profileId, this.action).subscribe((response: any) => {
                this.authorizedFlag = response;
                if (response) {
                    this.initForm();
                    this.subscription = this.route.params.subscribe((params: any) => {

                        if (params.hasOwnProperty('registrationReviewId')) {
                            this.registrationReviewId = params['registrationReviewId'];
                            this.registrationReviewService.getRegistrationReview(this.registrationReviewId).subscribe((data: any) => {
                                if (data.locked == "false") {
                                    this.previousNotes = data.note;
                                    data.note = "";

                                    let dbProviderId = data.reviewProviderId;
                                    let dbTeam = data.reviewingTeam;
                                    let dbTeamId = null;
                                    let dbOfficer = data.reviewingOfficer;

                                    this.providers.forEach((element: any) => {
                                        if (element.key == dbProviderId) {
                                            data.reviewProviderId = element.key;
                                        }
                                    });

                                    this.listService.getListDataByLookupAndPkValue(268, 543, dbProviderId).subscribe(listObj => {
                                        this.orgs = listObj;
                                        this.orgs.forEach((element: any) => {
                                            dbTeam = dbTeam.split("[")[0].split("(")[0];
                                            if (element.value.split("/")[1] == dbTeam.split("/")[1]) {
                                                data.reviewingTeam = element.value;
                                                dbTeamId = element.key;
                                            }
                                        });

                                        this.listService.getListDataByLookupAndPkValue(270, 557, dbTeamId).subscribe(listObj => {
                                            this.officerIds = listObj;
                                            this.officerIds.forEach((element: any) => {
                                                dbOfficer = this.parseOfficer(dbOfficer);
                                                if (element.value.split("/")[1] == dbOfficer.split("/")[1]) {
                                                    data.reviewingOfficer = element.value;
                                                }
                                            })
                                            this.registrationReviewAddForm.patchValue(data);
                                        });
                                    });

                                    
                                }
                                else {
                                    this.headerService.setAlertPopup("The record is locked");

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

    updateDataNsrd(nsrdData) {

        var data = nsrdData.fieldDataObjectList
        data.forEach(element => {
            this.nsrdData[element.fieldName] = {};
            this.nsrdData[element.fieldName].active = element.active;
            this.nsrdData[element.fieldName].mandatory = element.mandatory;

            this.registrationReviewAddForm.controls[element.fieldName].setValue(element.value);


        });
    }

    changeForTeam(option) {
        if (option.selectedIndex > 0) {
            this.registrationReviewAddForm.controls['reviewingTeam'].setValue(null);
            this.registrationReviewAddForm.controls['reviewingOfficer'].setValue(null);
            let selectedProviderId = this.providers[option.selectedIndex - 1].key;
            this.listService.getListDataByLookupAndPkValue(268, 543, selectedProviderId).subscribe(listObj => {
                this.orgs = listObj;
                if (this.orgs.length == 0) {
                    this.registrationReviewAddForm.value.orgs = null;
                }
            })
        }
    }

    change(option) {
        if (option.selectedIndex > 0) {
            let selectedTeamId = this.orgs[option.selectedIndex - 1].key;
            this.listService.getListDataByLookupAndPkValue(270, 557, selectedTeamId).subscribe(listObj => {
                this.officerIds = listObj;
                if (this.officerIds.length == 0) {
                    this.registrationReviewAddForm.value.officerIds = null;
                }
            })
        }
    }


    navigateTo(url) {
        if (this.registrationReviewAddForm.touched) {
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
        if (this.registrationReviewAddForm.valid) {
            this.registrationReviewAddForm.patchValue(Utility.escapeHtmlTags(this.registrationReviewAddForm.value));

            if (this.registrationReviewId != null) {
                this.registrationReviewService.updateRegistrationReview(this.registrationReviewId, this.registrationReviewAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                });
            } else {
                this.registrationReviewAddForm.value.reviewingTeam = this.associatedPTO.team;
                this.registrationReviewAddForm.value.reviewingOfficer = this.associatedPTO.officer;
                this.registrationReviewAddForm.value.reviewProviderId = this.registrationReviewAddForm.controls['reviewProviderId'].value;
                this.registrationReviewService.addRegistrationReview(this.registrationReviewAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }
    reviewCompletedRule() {
        alert("Hi..");
    }
    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(RegistrationReviewConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(RegistrationReviewConstants.featureId, field, this.action);
    }
    initForm() {
        this.registrationReviewAddForm = this._fb.group({
            registrationType: [this.registrationReview.registerType],
            registrationReviewId: [this.registrationReview.registrationReviewId, Validators.compose([Validators.required, , ,])],
            registrationId: [this.registrationReview.registrationId, Validators.compose([Validators.required, , ,])],
            dateOfReview: [this.registrationReview.dateOfReview, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            timeOfReview: [this.registrationReview.timeOfReview, Validators.compose([Validators.required, ValidationService.timeValidator, ,])],
            note: [this.registrationReview.note, Validators.compose([, , ,])],
            spgVersion: [this.registrationReview.spgVersion, Validators.compose([Validators.required, , Validators.maxLength(32),])],
            spgUpdateUser: [this.registrationReview.spgUpdateUser, Validators.compose([Validators.required, , Validators.maxLength(72),])],
            reviewCompletedYesNoId: [this.registrationReview.reviewCompletedYesNoId, Validators.compose([, , Validators.maxLength(1),])],
            reviewProviderId: [this.registrationReview.reviewProviderId, Validators.compose([Validators.required, , ,])],
            reviewingTeam: [this.registrationReview.reviewingTeam, Validators.compose([Validators.required, , Validators.maxLength(60),])],
            reviewingOfficer: [this.registrationReview.reviewingOfficer, Validators.compose([Validators.required, , Validators.maxLength(80),])],
            spgRegistrationReviewId: [this.registrationReview.spgRegistrationReviewId, Validators.compose([Validators.required, , ,])],
            nextReviewDate: [this.registrationReview.nextReviewDate, Validators.compose([, ValidationService.dateValidator, ,])],
            nextReviewTime: [this.registrationReview.nextReviewTime, Validators.compose([, ValidationService.timeValidator, ,])],

        });
    }

    parseOfficer(officerName) {
        if (officerName != null && typeof officerName != undefined) {
            return officerName.replace(/\[[0-9]*\]/g, "");
        } else
            return officerName;
    }
}

