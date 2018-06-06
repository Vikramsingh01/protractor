import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AssessmentService } from '../assessment.service';
import { AssessmentConstants } from '../assessment.constants';
import { Assessment } from '../assessment';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from '../../../shared/utility';
import {ReferralService} from '../../referral/referral.service';
import { Referral } from '../../referral/referral';
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-assessment-edit',
    templateUrl: 'assessment-add.component.html'
})
export class AssessmentAddComponent implements OnInit {

    private subscription: Subscription;
    private assessmentId: number;
    childAnswers: any = [];
    private authorizationData: any;
    private nsrdData: any = [];
    private authorizedFlag: boolean = false;
    assessmentAddForm: FormGroup;
    private assessment: Assessment = new Assessment();
    private action;
    private referral: Referral;
    childParentAnswers: any = [];
    private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private assessmentService: AssessmentService,
        private referralService:ReferralService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.assessment.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('assessmentId')) {
                this.action = "Create";
                this.titleService.setTitle('Add Assessment');
            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit Assessment');
            }

            if(params.hasOwnProperty('referralId')){
                this.assessment.referralId=params['referralId'];
                this.referralService.getReferral(this.assessment.referralId).subscribe(data=>{
                   this.assessment.referralTypeId=data.referralTypeId;
                   if(this.assessmentAddForm){
                    this.assessmentAddForm.patchValue(this.assessment);
                     this.assessmentAddForm.controls['referralTypeId'].disable();
                   }

                })
                    
            };

        });



        //this.authorizationService.getAuthorizationDataByTableId(AssessmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AssessmentConstants.featureId, AssessmentConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(AssessmentConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(AssessmentConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AssessmentConstants.tableId, this.action, this.authorizationData);
            this.initForm();
            this.assessmentService.isAuthorize(this.assessment.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
                  if (this.authorizedFlag) {
                
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('assessmentId')) {
                        this.assessmentId = params['assessmentId'];
                        this.assessmentService.getAssessment(this.assessmentId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.previousNotes = data.note;
                                data.note = "";
                                data = this.assessmentService.removeConstantsFields(data);
                                this.assessmentService.getAssessmentCrd(data).subscribe((breResponse: any)=>{
                                    this.updateNsrd(breResponse.resultMap.fieldObjectList);
                                    this.assessmentAddForm.patchValue(data);
                                });
                                
                            }
                            else {
                                this.headerService.setAlertPopup("The record is locked");

                            }
                        });
                    }
                    
                             this.assessment.referralId=params['referralId'];
                                this.referralService.getReferral(this.assessment.referralId).subscribe(data=>{
                                this.assessment.referralTypeId=data.referralTypeId;
                                this.assessmentAddForm.patchValue(this.assessment);
                                this.assessmentService.getParentDependentAnswers(203, this.assessment.referralTypeId).subscribe((childParentAnswers: any) => {

                                    this.childParentAnswers  = childParentAnswers;
                                   
                                });

                                })


                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });
    });
    }
    navigateTo(url) {
        if (this.assessmentAddForm.touched) {
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
    
    updateNsrd(nsrdData) {
        nsrdData.forEach((element: any) => {
            this.nsrdData[element.fieldName] = {};
            this.nsrdData[element.fieldName].active = element.active;
            this.nsrdData[element.fieldName].mandatory = element.mandatory;
            this.assessmentAddForm.controls[element.fieldName].setValue(null);      
            this.assessmentAddForm.controls[element.fieldName].updateValueAndValidity();
        });

    }

    updateAnswers(childAnswers) {
        this.childAnswers = childAnswers;
    }

    updateParentAnswers(childParentAnswers) {
        this.childParentAnswers = childParentAnswers;
    }
    onSubmit() {
        if (this.assessmentAddForm.valid) {			
      this.assessmentAddForm.patchValue(Utility.escapeHtmlTags(this.assessmentAddForm.value));
            if (this.assessmentId != null) {
                this.assessmentService.updateAssessment(this.assessmentId, this.assessmentAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                });
            } else {
                this.assessmentService.addAssessment(this.assessmentAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        return this.authorizationService.isFeildAuthorized(AssessmentConstants.featureId, field, this.action);
    }
    initForm() {
        this.assessmentAddForm = this._fb.group({
            spgAssessmentId: ['0'],
            referralId: [this.assessment.referralId, Validators.compose([Validators.required, , ,])],
            assessmentId: [this.assessment.assessmentId],
            assessmentScore: [this.assessment.assessmentScore, Validators.compose([, , Validators.maxLength(20),])],
            durationInMinutes: [this.assessment.durationInMinutes, Validators.compose([, ValidationService.timeValidator ,])],
            offenderAgreementYesNoId: [this.assessment.offenderAgreementYesNoId, Validators.compose([, , Validators.maxLength(1),])],
            assessmentDate: [this.assessment.assessmentDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            assessmentTypeId: [this.assessment.assessmentTypeId, Validators.compose([Validators.required])],
            offenderRequiredToAttendYesNoId: [this.assessment.offenderRequiredToAttendYesNoId, Validators.compose([Validators.required , ,])],
            offenderAttendedYesNoId: [this.assessment.offenderAttendedYesNoId, Validators.compose([, , ,])],
            assessmentOutcomeId: [this.assessment.assessmentOutcomeId, Validators.compose([, , ,])],
            note: [this.assessment.note, Validators.compose([, , ,])],
            referralTypeId: ['',Validators.compose([, , ,])]
        });
    }
    
}

