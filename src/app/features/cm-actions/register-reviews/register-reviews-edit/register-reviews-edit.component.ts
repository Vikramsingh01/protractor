import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../../services/token.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { DataService } from '../../../../services/data.service';
import { HeaderService } from '../../../../views/header/header.service';
import { RegisterRegistrationReviewService } from '../register-registration-review.service';
import { RegisterRegistrationReviewConstants } from '../register-registration-review.constants';
import { RegisterRegistrationReview } from '../register-registration-review';
import { ValidationService } from '../../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../../generic-components/confirm-box/confirm.service';
import { AssociatedPTO } from '../../../contact/associated-pto';
import { RegisterReviewService } from "../register-reviews.service"; 
import { Utility } from "../../../../shared/utility";
@Component({
    selector: 'tr-register-reviews-edit',
    templateUrl: 'register-reviews-edit.component.html'
})
export class RegisterReviewsEditComponent implements OnInit {

    private subscription: Subscription;
    private registrationReviewId: number;
    private authorizationData: any;
    private nsrdData: any = [];
    private authorizedFlag: boolean = false;
    registrationReviewEditForm: FormGroup;
    private registerRegistrationReview: RegisterRegistrationReview = new RegisterRegistrationReview();
    private action;
	private previousNotes: string = "";
    private associatedPTO: AssociatedPTO;
    private team: string = "";
    private officer: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private registerRegistrationReviewService: RegisterRegistrationReviewService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private registerReviewService:RegisterReviewService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('registrationReviewId')) {
                
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Registration Review");
            }
            if(params.hasOwnProperty('profileId')){
              this.registerRegistrationReview.profileId=params['profileId'];
            }
            if(params.hasOwnProperty('registrationId')){ 
                    this.registerRegistrationReview.registrationId=params['registrationId'];
                        this.registerReviewService.getRegistration(this.registerRegistrationReview.registrationId).subscribe(data=>{
                           this.registerRegistrationReview.registrationType=data.registerTypeId;
                            this.registrationReviewEditForm.patchValue(this.registerRegistrationReview);
                            this.registrationReviewEditForm.controls['registrationType'].disable();
                       })

            };
        });
       
        this.authorizationService.getAuthorizationData(RegisterRegistrationReviewConstants.featureId, RegisterRegistrationReviewConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(RegisterRegistrationReviewConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(RegisterRegistrationReviewConstants.featureId, authorizationData[1]);
      }

      this.initForm();
            this.registerRegistrationReviewService.isAuthorize(this.registerRegistrationReview.profileId,this.action).subscribe((response: any) => {
                 this.authorizedFlag=response;
               if(response) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {

                    this.registrationReviewEditForm.controls['reviewingTeam'].disable();
                    this.registrationReviewEditForm.controls['reviewingOfficer'].disable();
                    this.registrationReviewEditForm.controls['reviewProviderId'].disable();

                    if (!params.hasOwnProperty('registrationReviewId')) {
                        this.registerRegistrationReviewService.getPTOfficer().subscribe(data => {
                          this.associatedPTO = data
                          this.registrationReviewEditForm.controls['reviewingOfficer'].setValue(this.associatedPTO.officer.split("/")[1]);
                          this.registrationReviewEditForm.controls['reviewingTeam'].setValue(this.associatedPTO.team.split("/")[1]);
                          this.registrationReviewEditForm.controls['reviewProviderId'].setValue(this.associatedPTO.provider);
                        });
                    }

                    if (params.hasOwnProperty('registrationReviewId')) {
                        this.registrationReviewId = params['registrationReviewId'];
                        this.registerRegistrationReviewService.getRegistrationReview(this.registrationReviewId).subscribe((data: any) => {
                            if(data.locked == "false"){
								this.previousNotes = data.note;
                                data.note = "";

                                this.officer = data.reviewingOfficer;
                                this.team = data.reviewingTeam;
                                data.reviewingOfficer = data.reviewingOfficer.split("/")[1];
                                data.reviewingTeam = data.reviewingTeam.split("/")[1];

                                this.registrationReviewEditForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");
                                
                            }
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("You are currently not authorised to access this screen. Please contact your system administrator for more information.");
            }    
            });
        });
    }

    updateDataNsrd(nsrdData) {
        var data= nsrdData.fieldDataObjectList
            data.forEach(element => {
                this.nsrdData[element.fieldName] = {};
                this.nsrdData[element.fieldName].active = element.active;
                this.nsrdData[element.fieldName].mandatory = element.mandatory;
                
                this.registrationReviewEditForm.controls[element.fieldName].setValue(element.value);
        });
    }

    navigateTo(url) {
        if (this.registrationReviewEditForm.touched) {
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
        if (this.registrationReviewEditForm.valid) {
			this.registrationReviewEditForm.patchValue(Utility.escapeHtmlTags(this.registrationReviewEditForm.value));

            if (this.registrationReviewId != null) {
                this.registrationReviewEditForm.value.reviewProviderId = this.registrationReviewEditForm.controls['reviewProviderId'].value;
                this.registrationReviewEditForm.value.reviewingTeam = this.team;
                this.registrationReviewEditForm.value.reviewingOfficer = this.officer;
                this.registerRegistrationReviewService.updateRegistrationReview(this.registrationReviewId, this.registrationReviewEditForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../../..'], {relativeTo: this.route});
                });
            } 
        } 
    }

    isFeildAuthorized(field) {
        return this.authorizationService.isFeildAuthorized(RegisterRegistrationReviewConstants.featureId, field, this.action);
    }

    initForm() {
        this.registrationReviewEditForm = this._fb.group({
            registrationType:[this.registerRegistrationReview.registerType],
            registrationReviewId:[ this.registerRegistrationReview.registrationReviewId ,  Validators.compose([ Validators.required , , , ]) ],
            registrationId:[ this.registerRegistrationReview.registrationId ,  Validators.compose([ Validators.required , , , ]) ],
            dateOfReview:[ this.registerRegistrationReview.dateOfReview ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
            timeOfReview:[ this.registerRegistrationReview.timeOfReview ,  Validators.compose([ Validators.required ,  ValidationService.timeValidator, , ]) ],
            note:[ this.registerRegistrationReview.note ,  Validators.compose([, , , ]) ],
            spgVersion:[ this.registerRegistrationReview.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
            spgUpdateUser:[ this.registerRegistrationReview.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
            reviewCompletedYesNoId:[ this.registerRegistrationReview.reviewCompletedYesNoId ,  Validators.compose([, ,  Validators.maxLength(1) , ]) ],
            reviewProviderId:[ this.registerRegistrationReview.reviewProviderId ,  Validators.compose([ Validators.required , , , ]) ],
            reviewingTeam:[ this.registerRegistrationReview.reviewingTeam ,  Validators.compose([ Validators.required , ,  Validators.maxLength(60) , ]) ],
            reviewingOfficer:[ this.registerRegistrationReview.reviewingOfficer ,  Validators.compose([ Validators.required , ,  Validators.maxLength(80) , ]) ],
            spgRegistrationReviewId:[ this.registerRegistrationReview.spgRegistrationReviewId ,  Validators.compose([ Validators.required , , , ]) ],
            nextReviewDate:[ this.registerRegistrationReview.nextReviewDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
            nextReviewTime:[ this.registerRegistrationReview.nextReviewTime ,  Validators.compose([,  ValidationService.timeValidator, , ]) ],
        });
    }
}

