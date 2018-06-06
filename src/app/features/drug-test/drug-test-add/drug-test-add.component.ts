
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { DrugTestService } from '../drug-test.service';
import { DrugTestConstants } from '../drug-test.constants';
import { DrugTest } from '../drug-test';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
import { DrugTestProfileService } from "../../drug-test-profile/drug-test-profile.service";
import { ListService } from '../../../services/list.service';
@Component({
    selector: 'tr-drug-test-edit',
    templateUrl: 'drug-test-add.component.html'
})
export class DrugTestAddComponent implements OnInit {

    private subscription: Subscription;
    private drugTestId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    drugTestAddForm: FormGroup;
    private drugTest: DrugTest = new DrugTest();
    private action;
    private flag;
    private showStructure: boolean = false;
    private hideAddButton: boolean = true;
    private futureDateNotAllowed: boolean = false;
    private drugTestResultMappingList: any[] = [];
    private previousNotes: string = "";
    private infoClicked: boolean;
    private suCompliance = null;

    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private drugTestService: DrugTestService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title,
        private listService: ListService,
        private drugTestProfileService: DrugTestProfileService) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('eventId')) {
                this.drugTest.eventId = params['eventId'];
            }
            if (params.hasOwnProperty('profileId')) {
                this.drugTest.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('drugTestId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Drug Test");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit Drug Test");
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(DrugTestConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(DrugTestConstants.featureId, DrugTestConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(DrugTestConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(DrugTestConstants.featureId, authorizationData[1]);
            }
            this.initForm();
            this.drugTestService.isAuthorize(this.drugTest.profileId, this.action).subscribe((response: any) => {
                this.authorizedFlag = response;
                if (this.authorizedFlag) {
                    this.initForm();
                    this.suCompliance = this.drugTestAddForm.controls['offenderComplianceYesNoId'];
                    if (this.action === "Create") {
                        this.drugTestProfileService.sortFilterAndPaginate({ eventId: this.drugTest.eventId }, null, null).subscribe(drugTestProfile => {
                            const control = <FormArray>this.drugTestAddForm.controls['drugTestResultList'];
                            this.drugTestService.getDrugTestResultIds(this.drugTest.eventId).subscribe(drugTestResultMappingList => {
                                this.drugTestResultMappingList = drugTestResultMappingList;
                                drugTestResultMappingList.forEach(drugTestResultId => {
                                    control.push(this._fb.group({
                                        drugsTestId: [drugTestProfile.drugTestProfileId],
                                        drugTypeId: [drugTestResultId, Validators.compose([Validators.required])],
                                        admittedUseYesNoId: [this.listService.getPkValueByTableIdAndCode(244, 'N'), Validators.compose([Validators.required])],
                                        testResultId: [this.listService.getPkValueByTableIdAndCode(2543, 'Not Tested'), Validators.compose([Validators.required])],
                                        agreedYesNoId: [this.listService.getPkValueByTableIdAndCode(244, 'N'), Validators.compose([Validators.required])],
                                        spgDrugTestResultId: ['0'],

                                    }));
                                })
                            })
                        })
                        this.onChange();
                    }else {
                        this.subscription = this.route.params.subscribe((params: any) => {
                        if (params.hasOwnProperty('drugTestId')) {
                            this.drugTestId = params['drugTestId'];
                            this.futureDateNotAllowed = false;
                            this.drugTestService.getDrugTest(this.drugTestId).subscribe((data: any) => {
                                this.drugTestAddForm.controls['dateOfTest'].disable();
                                this.drugTestAddForm.controls['testedBy'].disable();
                                this.previousNotes = data.note;
                                data.note = "";
                                this.drugTestAddForm.patchValue(data);
                                let dateOfTest = Utility.convertStringToDate(data.dateOfTest);

                                let todayDate = new Date();
                                todayDate.setHours(0);
                                todayDate.setMinutes(0);
                                todayDate.setSeconds(0);
                                if (dateOfTest.getTime() > todayDate.getTime()) {
                                    this.suCompliance.disable();
                                    const control = <FormArray>this.drugTestAddForm.controls['drugTestResultList'];
                                    let length = control.length;
                                    for (let i = length; i >= 0; i--) {
                                        control.removeAt(i);
                                    }
                                   
                                                                    
                                }
                                else{
                                    const control = <FormArray>this.drugTestAddForm.controls['drugTestResultList'];
                                    this.drugTestProfileService.sortFilterAndPaginate({ eventId: this.drugTest.eventId }, null, null).subscribe(drugTestProfile => {
                                        this.drugTestService.getDrugTest(this.drugTestId).subscribe((data: any) => {
                                            
                                                                            data.drugTestResultList.forEach(drugTestResultId => {
                                                                                control.push(this._fb.group({
                                                                                    drugsTestId: [drugTestProfile.drugTestProfileId],
                                                                                    drugTypeId: [drugTestResultId.drugTypeId, Validators.compose([Validators.required])],
                                                                                    admittedUseYesNoId: [drugTestResultId.admittedUseYesNoId, Validators.compose([Validators.required])],
                                                                                    testResultId: [drugTestResultId.testResultId, Validators.compose([Validators.required])],
                                                                                    agreedYesNoId: [drugTestResultId.agreedYesNoId, Validators.compose([Validators.required])],
                                                                                    spgDrugTestResultId: ['0'],
                                            
                                                                                }));
                                                                            })
                                                                        });
                                                                    });
                                }
                                

                            });

                        }
                    });
                    }
            } else {
                this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
            }
            });

        });
    }

    toggleInfoClicked(): void {
        if (this.infoClicked == true) {
            this.infoClicked = false;
        }
        else {
            this.infoClicked = true;
        }
    }

    navigateTo(url) {
        if (this.drugTestAddForm.touched) {
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
        if (this.drugTestAddForm.valid) {
            this.drugTestAddForm.patchValue(Utility.escapeHtmlTags(this.drugTestAddForm.value));
            if (this.drugTestId != null) {
                this.drugTestService.updateDrugTest(this.drugTestId, this.drugTestAddForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                });
            } else {
                this.drugTestService.addDrugTest(this.drugTestAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }



    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(DrugTestConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(DrugTestConstants.featureId, field, this.action);
    }

    initForm() {
        this.drugTestAddForm = this._fb.group({
            drugTestId: [this.drugTest.drugTestId],
            eventId: [this.drugTest.eventId, Validators.compose([Validators.required, , ,])],
            spgDrugTestId: ['0'],
            dateOfTest: [this.drugTest.dateOfTest, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            testedBy: [this.drugTest.testedBy, Validators.compose([Validators.required, Validators.maxLength(107),])],
            offenderComplianceYesNoId: [this.drugTest.offenderComplianceYesNoId, Validators.compose([Validators.required, , Validators.maxLength(1),])],
            note: [this.drugTest.note, Validators.compose([, , ,])],
            drugTestResultId: [this.drugTest.drugTestResultId],

            drugTestResultList: this._fb.array([])
        });
    }

    onChange(){
        this.drugTestAddForm.controls['dateOfTest'].valueChanges.subscribe(value => {
            this.futureDateNotAllowed = false;
            this.infoClicked = false;
            this.suCompliance.enable();
           this.drugTestAddForm.controls['offenderComplianceYesNoId'].patchValue('');
            if (value) {
                let dateOfTest = Utility.convertStringToDate(value);
                let todayDate = new Date();
                todayDate.setHours(0);
                todayDate.setMinutes(0);
                todayDate.setSeconds(0);
                if (dateOfTest.getTime() > todayDate.getTime()) {
                    this.suCompliance.disable();
                    this.futureDateNotAllowed = true;
                    const control = <FormArray>this.drugTestAddForm.controls['drugTestResultList'];
                    let length = control.length;
                    for (let i = length; i >= 0; i--) {
                        control.removeAt(i);
                    }
                } else {
                    this.suCompliance.enable();
                    this.futureDateNotAllowed = false;
                    this.drugTestProfileService.sortFilterAndPaginate({ eventId: this.drugTest.eventId }, null, null).subscribe(drugTestProfile => {
                        if (this.action === "Create") {
                            const control = <FormArray>this.drugTestAddForm.controls['drugTestResultList'];
                            let length = control.length;
                            for (let i = length; i >= 0; i--) {
                                control.removeAt(i);
                            }
                            this.drugTestResultMappingList.forEach(drugTestResultId => {
                                control.push(this._fb.group({
                                    drugsTestId: [drugTestProfile.drugTestProfileId],
                                    drugTypeId: [drugTestResultId, Validators.compose([Validators.required])],
                                    admittedUseYesNoId: [this.listService.getPkValueByTableIdAndCode(244, 'N'), Validators.compose([Validators.required])],
                                    testResultId: [this.listService.getPkValueByTableIdAndCode(2543, 'Not Tested'), Validators.compose([Validators.required])],
                                    agreedYesNoId: [this.listService.getPkValueByTableIdAndCode(244, 'N'), Validators.compose([Validators.required])],
                                    spgDrugTestResultId: ['0'],

                                }));
                            })
                        } else {

                            const control = <FormArray>this.drugTestAddForm.controls['drugTestResultList'];
                            let length = control.length;
                            for (let i = length; i >= 0; i--) {
                                control.removeAt(i);
                            }

                            this.drugTestService.getDrugTest(this.drugTestId).subscribe((data: any) => {

                                data.drugTestResultList.forEach(drugTestResultId => {
                                    control.push(this._fb.group({
                                        drugsTestId: [drugTestProfile.drugTestProfileId],
                                        drugTypeId: [drugTestResultId.drugTypeId, Validators.compose([Validators.required])],
                                        admittedUseYesNoId: [drugTestResultId.admittedUseYesNoId, Validators.compose([Validators.required])],
                                        testResultId: [drugTestResultId.testResultId, Validators.compose([Validators.required])],
                                        agreedYesNoId: [drugTestResultId.agreedYesNoId, Validators.compose([Validators.required])],
                                        spgDrugTestResultId: ['0'],

                                    }));
                                })
                            });

                        }
                    })

                }
            }
        })
    }
}

