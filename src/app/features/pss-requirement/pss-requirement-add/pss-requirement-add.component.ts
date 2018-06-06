import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { PssRequirementService } from '../pss-requirement.service';
import { PssRequirementConstants } from '../pss-requirement.constants';
import { PssRequirement } from '../pss-requirement';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Title } from "@angular/platform-browser";
import { Utility } from '../../../shared/utility';
import { ExtraValidators } from "../../process-contact/extraValidator.component";
@Component({
    selector: 'tr-pss-requirement-edit',
    templateUrl: 'pss-requirement-add.component.html'
})
export class PssRequirementAddComponent implements OnInit {

    private subscription: Subscription;
    private pssRequirementId: number;
    private authorizationData: any;
    private nsrdData: any = [];
    private imposed_release_date: any = [];
    private length_is_mandatory: boolean = false;
    private commencemcent_date: any = [];
    private PssReqMainTypeId: number;
    private PssReqSubTypeId: number;
    private authorizedFlag: boolean = false;
    private hideLength: boolean = false;
    private childAnswers: any = [];
    pssRequirementAddForm: FormGroup;
    private pssRequirement: PssRequirement = new PssRequirement();
    private action;
    private orgs: any = [];
    private teams: any = [];
    private officerIds: any = [];
    private team: string = null;
    private officer: string = null;
    private previousNotes: string = "";
    private profileId: number;
    constructor(
        private _titleService: Title,
        private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private pssRequirementService: PssRequirementService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private titleService: Title) { }

    ngOnInit() {

        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.pssRequirement.profileId = params['profileId'];
            }
            if (params.hasOwnProperty('eventId')) {
                this.pssRequirement.eventId = params['eventId'];;
            }
            if (!params.hasOwnProperty('pssRequirementId')) {
                this.action = "Create";
                this.titleService.setTitle('Add PSS Requirement');

            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit PSS Requirement');
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

        this.authorizationService.getAuthorizationData(PssRequirementConstants.featureId, PssRequirementConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(PssRequirementConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(PssRequirementConstants.featureId, authorizationData[1]);
            }
            // this.authorizedFlag = this.authorizationService.isTableAuthorized(PssRequirementConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PssRequirementConstants.featureId, this.action);
            this.initForm();

            let observables: Observable<any>[] = [];
            observables.push(this.pssRequirementService.getActivePssForPssReq(this.pssRequirement.eventId).catch(error => { return Observable.of({}) }));
            observables.push(this.pssRequirementService.getReleaseDateByEventId(this.pssRequirement.eventId).catch(error => { return Observable.of({}) }));
            Observable.forkJoin(observables).subscribe(data => {
                if (data[0]._body != "") {
                    let body0 = JSON.parse(data[0]._body);
                    this.commencemcent_date = body0['commencementDate'];
                }
                if (data[1]._body != "") {
                    let body1 = JSON.parse(data[1]._body);
                    this.imposed_release_date = body1['releaseDate'];
                }
                if (this.action == "Create") {
                    this.pssRequirementAddForm.controls['imposedDate'].setValue(this.imposed_release_date);

                    if (this.commencemcent_date.length != 0) {
                        this.pssRequirementAddForm.controls['actualStartDate'].setValue(this.commencemcent_date);
                    }
                    else {
                        this.pssRequirementAddForm.controls['actualStartDate'].disable();
                        this.pssRequirementAddForm.controls['actualStartDate'].setValue('');
                    }

                }
            }, error => {
                console.log(error);
            });


            this.subscription = this.route.params.subscribe((params: any) => {
                if (params.hasOwnProperty('pssRequirementId')) {
                    this.pssRequirementId = params['pssRequirementId'];
                    this.pssRequirementService.getPssRequirement(this.pssRequirementId).subscribe((data: any) => {
                        if (data.locked == "false") {
                            this.previousNotes = data.notes;
                            data.notes = "";
                            data.psResponsibleTeam = data.psResponsibleTeam.split("/")[1].split("(")[0].split("[")[0];
                            data.psResponsibleOfficer = this.parseOfficer(data.psResponsibleOfficer);
                            this.pssRequirementAddForm.patchValue(data);
                            if (this.action == "Update") {

                                if (this.imposed_release_date.length != 0) {
                                    this.pssRequirementAddForm.controls['imposedDate'].setValue(this.imposed_release_date);
                                    this.pssRequirementAddForm.controls['actualStartDate'].disable();
                                    this.pssRequirementAddForm.controls['actualStartDate'].setValue('');
                                }
                                if (this.commencemcent_date.length != 0) {
                                    this.pssRequirementAddForm.controls['actualStartDate'].setValue(this.commencemcent_date);
                                } else {
                                    this.pssRequirementAddForm.controls['actualStartDate'].disable();
                                    this.pssRequirementAddForm.controls['actualStartDate'].setValue('');
                                }
                                this.PssReqMainTypeId = data.pssRequirementTypeMainCategoryId;
                                this.PssReqSubTypeId = data.pssRequirementTypeSubCategoryId;
                                this.pssRequirementAddForm.controls['pssRequirementTypeMainCategoryId'].disable();
                                this.pssRequirementAddForm.controls['pssRequirementTypeSubCategoryId'].disable();
                                this.pssRequirementAddForm.controls['psResponsibleTeam'].disable();
                                this.pssRequirementAddForm.controls['psResponsibleOfficer'].disable();
                                this.pssRequirementAddForm.value.pssRequirementTypeMainCategoryId = this.PssReqMainTypeId;
                                this.pssRequirementAddForm.value.pssRequirementTypeSubCategoryId = this.PssReqSubTypeId;
                                this.pssRequirementService.terminatePssRequirementCRD(this.pssRequirementAddForm.value).subscribe(nsrdData => {
                                    this.updateDataNsrd(nsrdData.resultMap);
                                })
                                this.listService.getDependentAnswers(197, data.pssRequirementTypeMainCategoryId).subscribe((childAnswers: any) => {
                                    this.childAnswers = childAnswers;
                                })
                            }
                        }
                        else {
                            this.headerService.setAlertPopup("The record is locked");

                        }
                    });
                }
            })
        })
    }
    navigateTo(url) {
        if (this.pssRequirementAddForm.touched) {
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
                    this.pssRequirementAddForm.value.officerIds = null;
                }
            })
        }
    }
    updateAnswers(childAnswers) {
        this.childAnswers = childAnswers;
    }
    onSubmit() {
        if (this.pssRequirementAddForm.valid) {
            this.pssRequirementAddForm.patchValue(Utility.escapeHtmlTags(this.pssRequirementAddForm.value));

            if (this.pssRequirementId != null) {
                if (this.commencemcent_date.length != 0) {
                    this.pssRequirementAddForm.value.actualStartDate = this.commencemcent_date;
                }
                this.pssRequirementAddForm.value.pssRequirementTypeMainCategoryId = this.PssReqMainTypeId;
                this.pssRequirementAddForm.value.pssRequirementTypeSubCategoryId = this.PssReqSubTypeId;
                this.pssRequirementService.getDisposalByEventId(this.pssRequirement.eventId).subscribe((response: any) => {
                    this.pssRequirementAddForm.value.psProviderId = response['osProviderId'];
                    this.pssRequirementService.updatePssRequirement(this.pssRequirementId, this.pssRequirementAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../../..'], { relativeTo: this.route });
                    });
                });
            } else {
                this.pssRequirementService.getDisposalByEventId(this.pssRequirement.eventId).subscribe((response: any) => {
                    this.pssRequirementAddForm.value.psProviderId = response['osProviderId'];
                    this.pssRequirementService.addPssRequirement(this.pssRequirementAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../..'], { relativeTo: this.route });
                    });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isNsrdFieldActive(fieldName) {
        let obj = Utility.getObjectFromArrayByKeyAndValue(this.nsrdData, "fieldName", fieldName);
        if (!obj.active) {
            return false;
        } else {
            return true;
        }
    }

    updateDataNsrd(nsrdData) {
        if (this.action == "Create") {
            this.pssRequirementAddForm.controls['pssRequirementTypeSubCategoryId'].setValue(null);
        }
        if (nsrdData.hasOwnProperty('fieldDataObjectList')) {
            var data = nsrdData.fieldDataObjectList;
            data.forEach(element => {
                this.nsrdData[element.fieldName] = {};
                this.nsrdData[element.fieldName].active = element.active;
                this.nsrdData[element.fieldName].mandatory = element.mandatory;

                this.pssRequirementAddForm.controls[element.fieldName].setValue(element.value);
            });
        }

        if (nsrdData.hasOwnProperty('fieldObjectList')) {
            let fieldObjectList: any[] = nsrdData.fieldObjectList;
            let lengthObj = Utility.getObjectFromArrayByKeyAndValue(fieldObjectList, 'fieldName', 'length');
            if (lengthObj != null && lengthObj.mandatory) {
                this.pssRequirementAddForm.controls['length'].setValidators([Validators.required, ValidationService.NumberValidator]);
                this.pssRequirementAddForm.controls['length'].updateValueAndValidity();
                this.length_is_mandatory = true;
                this.hideLength = false;
            } else {
                this.hideLength = true;
            }
        }
    }

    updateAd(childAnswers) {
        this.childAnswers = childAnswers;
    }


    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(PssRequirementConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(PssRequirementConstants.featureId, field, this.action);
    }
    initForm() {
        this.pssRequirementAddForm = this._fb.group({
            pssRequirementTypeMainCategoryId: [this.pssRequirement.pssRequirementTypeMainCategoryId, Validators.compose([Validators.required, , ,])],
            pssRequirementTypeSubCategoryId: [this.pssRequirement.pssRequirementTypeSubCategoryId, Validators.compose([Validators.required, , ,])],
            pssRequirementId: [this.pssRequirement.pssRequirementId],
            eventId: [this.pssRequirement.eventId],
            length: [this.pssRequirement.length],
            imposedDate: [this.pssRequirement.imposedDate, Validators.compose([Validators.required, , ,])],
            notes: [this.pssRequirement.notes],
            expectedEndDate: [this.pssRequirement.expectedEndDate],
            actualEndDate: [this.pssRequirement.actualEndDate],
            expectedStartDate: [this.pssRequirement.expectedStartDate],
            actualStartDate: [this.pssRequirement.actualStartDate],
            spgVersion: [this.pssRequirement.spgVersion],
            spgUpdateUser: [this.pssRequirement.spgUpdateUser],
            spgPssRequirementId: ['0'],
            unitsCode: [],
            psResponsibleTeam: [this.pssRequirement.psResponsibleTeam, Validators.compose([Validators.required, , ,])],
            psResponsibleOfficer: [this.pssRequirement.psResponsibleTeam, Validators.compose([Validators.required, , ,])],
        });
    }

    parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }
}
