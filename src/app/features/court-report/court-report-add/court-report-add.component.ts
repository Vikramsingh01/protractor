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
import { CourtReportService } from '../court-report.service';
import { CourtReportConstants } from '../court-report.constants';
import { CourtReport } from '../court-report';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from '../../../shared/utility';
import { AssociatedPTO } from '../associated-pto';

@Component({
    selector: 'tr-court-report-edit',
    templateUrl: 'court-report-add.component.html'
})
export class CourtReportAddComponent implements OnInit {

    private subscription: Subscription;
    private courtReportId: number;
    private authorizationData: any;
    private nsrdData: any = [];
    private authorizedFlag: boolean = false;
    courtReportAddForm: FormGroup;
    childAnswers: any = [];
    private courtReport: CourtReport = new CourtReport();
    private action;
    private previousNotes: string = "";
    private associatedPTO: AssociatedPTO;
    private team: string = "";
    private officer: string = "";
    private eventId: any;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private courtReportService: CourtReportService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.courtReport.profileId = params['profileId'];
            }
            if (params.hasOwnProperty('eventId')) {
                this.eventId = params['eventId'];
            }
            if (!params.hasOwnProperty('courtReportId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Court Reports");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit Court Reports");
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(CourtReportConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CourtReportConstants.featureId, CourtReportConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(CourtReportConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(CourtReportConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtReportConstants.tableId, this.action, this.authorizationData);
            this.initForm();
            this.courtReportService.isAuthorize(this.courtReport.profileId, this.action).subscribe((response: any) => {
                this.authorizedFlag = response;
                if (response) {

                    this.subscription = this.route.params.subscribe((params: any) => {


                        this.courtReportAddForm.controls['courtReportProviderId'].disable();

                        if (!params.hasOwnProperty('courtReportId')) {
                            this.courtReportService.getPTOfficer(this.eventId).subscribe(data => {
                                this.associatedPTO = data
                                this.courtReportAddForm.controls['courtReportProviderId'].setValue(this.associatedPTO.provider);
                            });
                        }

                        if (params.hasOwnProperty('courtReportId')) {
                            this.courtReportId = params['courtReportId'];
                            this.courtReportAddForm.controls['requestedDate'].disable();
                            this.courtReportAddForm.controls['requiredByCourtId'].disable();
                            this.courtReportAddForm.controls['courtReportProviderId'].disable();
                            this.courtReportAddForm.controls['courtReportTeam'].disable();
                            this.courtReportAddForm.controls['amount'].disable();
                            this.courtReportAddForm.controls['length'].disable();
                            
                            this.courtReportAddForm.controls['requestedReportTypeId'].disable()
                            this.courtReportAddForm.controls['proposalTypeId'].disable();
                            this.courtReportService.getCourtReport(this.courtReportId).subscribe((data: any) => {
                                if (data.locked == "false") {
                                    this.previousNotes = data.note;
                                    data.note = "";

                                    this.officer = data.courtReportOfficer;
                                    this.team = data.courtReportTeam;
                                    data.courtReportOfficer = this.parseOfficer(data.courtReportOfficer);
                                    data.courtReportTeam = data.courtReportTeam.split("/")[1].split("(")[0].split("[")[0];
                                    data = this.courtReportService.removeConstantsFields(data);
                                    this.courtReportAddForm.patchValue(data);
                                    this.courtReportAddForm.controls['courtReportTeam'].disable();
                                    this.courtReportAddForm.controls['courtReportOfficer'].disable();

                                    this.courtReportService.getCourtReportCrd(data).subscribe(breResponse => {

                                        this.updateNsrd(breResponse.resultMap.fieldObjectList);
                                    })
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


        });
    }
    isNsrdFieldActive(fieldName) {
        let obj = Utility.getObjectFromArrayByKeyAndValue(this.nsrdData, "fieldName", fieldName);
        if (!obj.active) {
            return false;
        } else {
            return true;
        }
    }
    isNsrdFieldMandatory(fieldName) {
        let obj = Utility.getObjectFromArrayByKeyAndValue(this.nsrdData, "fieldName", fieldName);
        if (!obj.mandatory) {
            return false;
        } else {
            this.courtReportAddForm.controls[fieldName].setValidators(Validators.required);
            return true;
        }
    }
    updateNsrd(nsrdData) {
        if (!(typeof nsrdData == "undefined")) {
            //     if (nsrdData.hasOwnProperty('resultMap')) {
            //         if (nsrdData.resultMap.hasOwnProperty('fieldObjectList')) {
            //this.nsrdData = nsrdData.resultMap.fieldObjectList;
            nsrdData.forEach((element: any) => {
                this.nsrdData[element.fieldName] = {};
                let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), "fieldName", element.fieldName);
                if (element.active) {
                    this.nsrdData[element.fieldName].active = element.active;
                    this.courtReportAddForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
                    if (element.mandatory) {
                        this.nsrdData[element.fieldName].mandatory = element.mandatory;
                        currentControl.validators.push(Validators.required);
                        this.courtReportAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                    } else {
                        this.courtReportAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                    }
                } else {
                    this.courtReportAddForm.removeControl(element.fieldName);
                }


                if (element.active) {
                    this.courtReportAddForm.controls[element.fieldName].updateValueAndValidity();
                }
            });
            //         }
            //     } 
        }


    }

    updateAnswers(childAnswers) {
        this.childAnswers = childAnswers;
    }

    ngAfterViewInit() {

    }

    navigateTo(url) {
        if (this.courtReportAddForm.touched) {
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
        if (this.courtReportAddForm.valid) {
            this.courtReportAddForm.patchValue(Utility.escapeHtmlTags(this.courtReportAddForm.value));
            if (this.courtReportId != null) {
                this.courtReportAddForm.value.courtReportProviderId = this.courtReportAddForm.controls['courtReportProviderId'].value;
                this.courtReportAddForm.controls['courtReportTeam'].setValue(this.team);
                this.courtReportAddForm.controls['courtReportOfficer'].setValue(this.officer);
                this.courtReportAddForm.value.requestedReportTypeId = this.courtReportAddForm.controls['requestedReportTypeId'].value;
                this.courtReportAddForm.value.proposalTypeId = this.courtReportAddForm.controls['proposalTypeId'].value;
                this.courtReportAddForm.value.requiredByCourtId = this.courtReportAddForm.controls['requiredByCourtId'].value;
                this.courtReportAddForm.value.requestedDate = this.courtReportAddForm.controls['requestedDate'].value;
                this.courtReportAddForm.value.amount = this.courtReportAddForm.controls['amount'].value;
                this.courtReportAddForm.value.amount = this.courtReportAddForm.controls['length'].value;
                this.courtReportService.updateCourtReport(this.courtReportId, this.courtReportAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            } else {
                this.courtReportAddForm.value.courtReportProviderId = this.courtReportAddForm.controls['courtReportProviderId'].value;
                this.courtReportService.addCourtReport(this.courtReportAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CourtReportConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CourtReportConstants.featureId, field, this.action);
    }
    initForm() {
        this.courtReportAddForm = this._fb.group({
            courtReportId: [this.courtReport.courtReportId, Validators.compose([Validators.required, , ,])],
            courtAppearanceId: [this.courtReport.courtAppearanceId, Validators.compose([Validators.required, , ,])],
            requiredByCourtId: [this.courtReport.requiredByCourtId, Validators.compose([ , , ,])],
            allocationDate: [this.courtReport.allocationDate, Validators.compose([, ValidationService.dateValidator, ,])],
            courtReportProviderId: [this.courtReport.courtReportProviderId, Validators.compose([Validators.required, , ,])],
            courtReportTeam: [this.courtReport.courtReportTeam, Validators.compose([Validators.required, , Validators.maxLength(60),])],
            note: [this.courtReport.note, Validators.compose([, , ,])],
            sentToCourtDate: [this.courtReport.sentToCourtDate, Validators.compose([, ValidationService.dateValidator, ,])],
            receivedByCourtDate: [this.courtReport.receivedByCourtDate, Validators.compose([, ValidationService.dateValidator, ,])],
            deliveredReportReasonId: [this.courtReport.deliveredReportReasonId, Validators.compose([, , ,])],
            length: [this.courtReport.length, Validators.compose([, , ,])],
            amount: [this.courtReport.amount, Validators.compose([, , ,])],
            spgCourtReportId: [0, Validators.compose([Validators.required, , ,])],
            requestedDate: [this.courtReport.requestedDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            requiredByDate: [this.courtReport.requiredByDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            requestedReportTypeId: [this.courtReport.requestedReportTypeId, Validators.compose([, , ,])],
            courtReportOfficer: [this.courtReport.courtReportOfficer, Validators.compose([Validators.required, , Validators.maxLength(80),])],
            completedDate: [this.courtReport.completedDate, Validators.compose([, ValidationService.dateValidator, ,])],
            proposalTypeId: [this.courtReport.proposalTypeId, Validators.compose([, , ,])],
            deliveredReportTypeId: [this.courtReport.deliveredReportTypeId, Validators.compose([, , ,])],
        });
    }

    parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }

    getNSRDFormObj() {
        let formObjArray: any[] = [];
        let deliveredReportReasonId: any = {};
        deliveredReportReasonId.fieldName = "deliveredReportReasonId";
        deliveredReportReasonId.field = { value: '' };
        deliveredReportReasonId.validators = [],
            formObjArray.push(deliveredReportReasonId);

        let deliveredReportTypeId: any = {};
        deliveredReportTypeId.fieldName = "deliveredReportTypeId";
        deliveredReportTypeId.field = { value: '' };
        deliveredReportTypeId.validators = [],
            formObjArray.push(deliveredReportTypeId);

        return formObjArray;
    }





}

