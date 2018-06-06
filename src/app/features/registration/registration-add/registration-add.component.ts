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
import { RegistrationService } from '../registration.service';
import { RegistrationConstants } from '../registration.constants';
import { Registration } from '../registration';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { IDate, IMonth, IWeek, IDayLabels, IMonthLabels, IOptions } from "../../../generic-components/date-picker/index";
import { Utility } from "../../../shared/utility";
import { AssociatedPTO } from '../associated-pto';

@Component({
    selector: 'tr-registration-edit',
    templateUrl: 'registration-add.component.html'
})
export class RegistrationAddComponent implements OnInit {

    private subscription: Subscription;
    private registrationId: number;
    private nsrdData: any = [];
    childAnswers: any = [];
     childParentAnswers: any = [];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    registrationAddForm: FormGroup;
    private registerTypeIds=[];
    private registration: Registration = new Registration();
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
        private registrationService: RegistrationService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
          if (params.hasOwnProperty('profileId')) {
                this.registration.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('registrationId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Registration");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Registration");
            }
        });
     
        //this.authorizationService.getAuthorizationDataByTableId(RegistrationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(RegistrationConstants.featureId, RegistrationConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(RegistrationConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(RegistrationConstants.featureId, authorizationData[1]);
      }

      this.initForm();
       let currentDate= new Date();
                    let dd=currentDate.getDate();
                    let mm=currentDate.getMonth()+1;
                    let yyyy=currentDate.getFullYear();
                   
                    let defaultDate=dd+"/"+mm+"/"+yyyy;
                    this.registration.registrationDate=defaultDate;
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, this.action, this.authorizationData);
            this.registrationService.isAuthorize(this.registration.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
                if (response) {
                  this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {

                    this.registrationAddForm.controls['registeringTeam'].disable();
                    this.registrationAddForm.controls['registeringOfficer'].disable();
                    this.registrationAddForm.controls['registrationProviderId'].disable();

                    if (!params.hasOwnProperty('registrationId')) {
                        this.registrationService.getPTOfficer().subscribe(data => {
                          this.associatedPTO = data
                          this.registrationAddForm.controls['registeringOfficer'].setValue(this.associatedPTO.officer.split("/")[1]);
                          this.registrationAddForm.controls['registeringTeam'].setValue(this.associatedPTO.team.split("/")[1]);
                          this.registrationAddForm.controls['registrationProviderId'].setValue(this.associatedPTO.provider);
                        
                            this.registrationService.getParentDependentAnswers(193, this.associatedPTO.provider).subscribe((childParentAnswers: any) => {
                                this.childParentAnswers  = childParentAnswers;

                                        this.registrationService.getFilteredRegistrationList(this.registration.profileId, this.registrationId).subscribe(data => {
                                    this.registerTypeIds = data.registerTypeIds;
                                    var registerTypeArr: string[] = [];
                                    this.registerTypeIds.forEach(element => {
                                        registerTypeArr.push(element+"");
                                    });
                                    this.registerTypeIds = registerTypeArr;
                                });

                                })
                        });
                    }

                    if (params.hasOwnProperty('registrationId')) {
                        this.registrationId = params['registrationId'];
                        this.registrationAddForm.controls['registrationProviderId'].disable();
                        this.registrationAddForm.controls['registerTypeId'].disable();
                        this.registrationAddForm.controls['registrationDate'].disable();
                        this.registrationAddForm.controls['nextReviewDate'].disable();
                        this.registrationAddForm.controls['registeringTeam'].disable();
                        this.registrationAddForm.controls['registeringOfficer'].disable();
                        this.registrationAddForm.controls['registrationCategoryId'].disable();
                        this.registrationAddForm.controls['registrationLevelId'].disable();
                        this.registrationService.getRegistration(this.registrationId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.previousNotes = data.registrationNote;
                                data.registrationNote = "";
                                this.officer = data.registeringOfficer;
                                this.team = data.registeringTeam;
                                data.registeringOfficer = data.registeringOfficer.split("/")[1];
                                data.registeringTeam = data.registeringTeam.split("/")[1];
                                  //  this.registrationService.getRegistrationCrd(data).subscribe((breResponse: any)=>{
                                 //   this.updateNsrd(breResponse.resultMap.fieldDataObjectList);
                                    this.registrationAddForm.patchValue(data);
                                    

                              //  });
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");
                                
                            }
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
            }    
            });

        //this.authorizedFlag = this.authorizationService.isTableAuthorized(RegistrationConstants.tableId, this.action, this.authorizationData);
      //  this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RegistrationConstants.featureId, this.action);
           // if (this.authorizedFlag) {
            //     this.initForm();
            //     this.subscription = this.route.params.subscribe((params: any) => {

            //         this.registrationAddForm.controls['registeringTeam'].disable();
            //         this.registrationAddForm.controls['registeringOfficer'].disable();
            //         this.registrationAddForm.controls['registrationProviderId'].disable();

            //         if (!params.hasOwnProperty('registrationId')) {
            //             this.registrationService.getPTOfficer().subscribe(data => {
            //               this.associatedPTO = data
            //               this.registrationAddForm.controls['registeringOfficer'].setValue(this.associatedPTO.officer.split("/")[1]);
            //               this.registrationAddForm.controls['registeringTeam'].setValue(this.associatedPTO.team.split("/")[1]);
            //               this.registrationAddForm.controls['registrationProviderId'].setValue(this.associatedPTO.provider);
                        
            //                 this.registrationService.getParentDependentAnswers(193, this.associatedPTO.provider).subscribe((childParentAnswers: any) => {
            //                     this.childParentAnswers  = childParentAnswers;

            //                             this.registrationService.getFilteredRegistrationList(this.registration.profileId, this.registrationId).subscribe(data => {
            //                         this.registerTypeIds = data.registerTypeIds;
            //                         var registerTypeArr: string[] = [];
            //                         this.registerTypeIds.forEach(element => {
            //                             registerTypeArr.push(element+"");
            //                         });
            //                         this.registerTypeIds = registerTypeArr;
            //                     });

            //                     })
            //             });
            //         }

            //         if (params.hasOwnProperty('registrationId')) {
            //             this.registrationId = params['registrationId'];
            //             this.registrationAddForm.controls['registrationProviderId'].disable();
            //             this.registrationAddForm.controls['registerTypeId'].disable();
            //             this.registrationAddForm.controls['registrationDate'].disable();
            //             this.registrationAddForm.controls['nextReviewDate'].disable();
            //             this.registrationAddForm.controls['registeringTeam'].disable();
            //             this.registrationAddForm.controls['registeringOfficer'].disable();
            //             this.registrationAddForm.controls['registrationCategoryId'].disable();
            //             this.registrationAddForm.controls['registrationLevelId'].disable();
            //             this.registrationService.getRegistration(this.registrationId).subscribe((data: any) => {
            //                 if(data.locked == "false"){
            //                     this.previousNotes = data.registrationNote;
            //                     data.registrationNote = "";
            //                     this.officer = data.registeringOfficer;
            //                     this.team = data.registeringTeam;
            //                     data.registeringOfficer = data.registeringOfficer.split("/")[1];
            //                     data.registeringTeam = data.registeringTeam.split("/")[1];
            //                       //  this.registrationService.getRegistrationCrd(data).subscribe((breResponse: any)=>{
            //                      //   this.updateNsrd(breResponse.resultMap.fieldDataObjectList);
            //                         this.registrationAddForm.patchValue(data);
                                    

            //                   //  });
            //                 }
            //                 else{
            //                     this.headerService.setAlertPopup("The record is locked");
                                
            //                 }
            //             });
            //         }
            //     })
            // } else {
            //     this.headerService.setAlertPopup("Not authorized");
            // }
        });

         

         let today = Utility.getToday();
            
            this.registrationAddForm.controls['registrationDate'].setValue(today.day+"/" + today.month + "/"+today.year);
            
    }

    navigateTo(url) {
        if (this.registrationAddForm.touched) {
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

    updateDataNsrd(nsrdData) {
      
        var data= nsrdData.fieldDataObjectList
            data.forEach(element => {
                this.nsrdData[element.fieldName] = {};
                this.nsrdData[element.fieldName].active = element.active;
                this.nsrdData[element.fieldName].mandatory = element.mandatory;
                
                this.registrationAddForm.controls[element.fieldName].setValue(element.value);

                let reviewPeriod = Utility.getDifferenceBetweenDatesInMonths(this.registrationAddForm.controls['registrationDate'].value, this.registrationAddForm.controls['nextReviewDate'].value)
                this.registrationAddForm.controls['reviewPeriod'].setValue(reviewPeriod);

        });
    }

    updateNextReviewDate(){

        let months = this.registrationAddForm.controls['reviewPeriod'].value;

        if(months){
            let registrationDate: Date = Utility.convertStringToDate(this.registrationAddForm.controls['registrationDate'].value);
            let nextReviewDate = new Date(registrationDate.setMonth(registrationDate.getMonth() + parseInt(months)));
            this.registrationAddForm.controls['nextReviewDate'].setValue(Utility.convertDateToString(nextReviewDate));
        }else{
            this.registrationAddForm.controls['nextReviewDate'].setValue('');
        }
       
    }

    updateAnswers(childAnswers) {
        this.childAnswers = childAnswers;
    }

    updateParentAnswers(childParentAnswers) {
        this.childParentAnswers = childParentAnswers;
    }

    onSubmit() {
        if (this.registrationAddForm.valid) {
			this.registrationAddForm.patchValue(Utility.escapeHtmlTags(this.registrationAddForm.value));
            if (this.registrationId != null) {

                 this.registrationAddForm.value.registrationProviderId = this.registrationAddForm.controls['registrationProviderId'].value;
                 this.registrationAddForm.value.registerTypeId = this.registrationAddForm.controls['registerTypeId'].value;
                 this.registrationAddForm.value.registrationDate = this.registrationAddForm.controls['registrationDate'].value;
                 this.registrationAddForm.value.nextReviewDate = this.registrationAddForm.controls['nextReviewDate'].value;
                 this.registrationAddForm.value.registeringTeam = this.team;
                 this.registrationAddForm.value.registeringOfficer = this.officer;
                 this.registrationAddForm.value.registrationCategoryId = this.registrationAddForm.controls['registrationCategoryId'].value;
                 this.registrationAddForm.value.registrationLevelId = this.registrationAddForm.controls['registrationLevelId'].value;
                 this.registrationAddForm.value.reviewPeriod = this.registrationAddForm.controls['reviewPeriod'].value;


                this.registrationService.updateRegistration(this.registrationId, this.registrationAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            } else {
                this.registrationAddForm.value.registeringTeam = this.associatedPTO.team;
                this.registrationAddForm.value.registeringOfficer = this.associatedPTO.officer;
                this.registrationAddForm.value.registrationProviderId = this.registrationAddForm.controls['registrationProviderId'].value;
                this.registrationService.addRegistration(this.registrationAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], {relativeTo: this.route});
                       this.registrationService.getRegistrationColourByProfileId( this.registration.profileId).subscribe(rasipJson => {
                        this.headerService.setRASIP(rasipJson);
                })     
                });
            }  
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(RegistrationConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(RegistrationConstants.featureId, field, this.action);
    }
    initForm() {
        this.registrationAddForm = this._fb.group({
                        profileId:[ this.registration.profileId ,  Validators.compose([ Validators.required , , , ]) ],
                        registrationId:[ this.registration.registrationId ],
                        spgVersion:[ this.registration.spgVersion ],
                        spgUpdateUser:[ this.registration.spgUpdateUser ],
                        registrationProviderId:[ this.registration.registrationProviderId ,  Validators.compose([ Validators.required , , , ]) ],
                        registerTypeId:[ this.registration.registerTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        registrationDate:[ this.registration.registrationDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        nextReviewDate:[ this.registration.nextReviewDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],                        
                        registeringTeam:[ this.registration.registeringTeam ,  Validators.compose([ Validators.required , ,  Validators.maxLength(60) , ]) ],
                        registeringOfficer:[ this.registration.registeringOfficer ,  Validators.compose([ Validators.required , ,  Validators.maxLength(80) , ]) ],                        
                        registrationCategoryId:[ this.registration.registrationCategoryId  ],
                        registrationLevelId:[ this.registration.registrationLevelId  ],
                        registrationNote:[ this.registration.registrationNote ,  Validators.compose([, , , ]) ],
                        spgRegistrationId:[ '0' ],
                        reviewPeriod: [ this.registration.reviewPeriod ]
                        // createdBy:[ this.registration.createdBy , ],
                        // createdByUserId:[ this.registration.createdByUserId , ],
                        // createdDate:[ this.registration.createdDate , ],
                        // modifiedBy:[ this.registration.modifiedBy , ],
                        // modifiedByUserId:[ this.registration.modifiedByUserId , ],
                        // modifiedDate:[ this.registration.modifiedDate , ],
                        // deleted:[ this.registration.deleted , ],
                        // deletedBy:[ this.registration.deletedBy , ],
                        // deletedByUserId:[ this.registration.deletedByUserId , ],
                        // deletedDate:[ this.registration.deletedDate , ],
                        // locked:[ this.registration.locked , ],
                        // version:[ this.registration.version , ],
                    });
    }
}

