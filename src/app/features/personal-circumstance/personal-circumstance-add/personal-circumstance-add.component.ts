import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { PersonalCircumstanceService } from '../personal-circumstance.service';
import { PersonalCircumstanceConstants } from '../personal-circumstance.constants';
import { PersonalCircumstance } from '../personal-circumstance';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ListService } from '../../../services/list.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-personal-circumstance-edit',
    templateUrl: 'personal-circumstance-add.component.html'
})
export class PersonalCircumstanceAddComponent implements OnInit {

    private subscription: Subscription;
    private personalCircumstanceId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    childAnswers: any = [];
    personalCircumstanceAddForm: FormGroup;
    private personalCircumstance: PersonalCircumstance = new PersonalCircumstance();
    private action;
    private circumstanceTypeIds=[];
    private circumstanceSubTypeIds=[];
	private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private personalCircumstanceService: PersonalCircumstanceService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.personalCircumstance.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('personalCircumstanceId')) {
                this.action = "Create";
                this.titleService.setTitle('Add Personal Circumstance');
            }else{
                this.action = "Update";
                this.titleService.setTitle('Edit Personal Circumstance');
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(PersonalCircumstanceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(PersonalCircumstanceConstants.featureId, PersonalCircumstanceConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(PersonalCircumstanceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(PersonalCircumstanceConstants.featureId, authorizationData[1]);
      }

         this.initForm();
            this.personalCircumstanceService.isAuthorize(this.personalCircumstance.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (response) {
               // this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('personalCircumstanceId')) {
                       this.personalCircumstanceId = params['personalCircumstanceId'];
                         this.personalCircumstanceAddForm.controls['circumstanceTypeId'].disable();
                         this.personalCircumstanceAddForm.controls['circumstanceSubTypeId'].disable();
                         this.personalCircumstanceService.getPersonalCircumstance(this.personalCircumstanceId).subscribe((data: any) => {
                             if(data.locked == "false"){
		 						this.previousNotes = data.note;
                                 data.note = "";
                                 this.personalCircumstanceAddForm.patchValue(data);
                             }
                             else{
                                 this.headerService.setAlertPopup("The record is locked");
                                
                            }
                         });
                     }
                 })
             } else {
                this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");          }
       
            });
 

        //this.authorizedFlag = this.authorizationService.isTableAuthorized(PersonalCircumstanceConstants.tableId, this.action, this.authorizationData);
        // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PersonalCircumstanceConstants.featureId, this.action);
        //     if (this.authorizedFlag) {
        //         this.initForm();
        //         this.subscription = this.route.params.subscribe((params: any) => {
        //             if (params.hasOwnProperty('personalCircumstanceId')) {
        //                 this.personalCircumstanceId = params['personalCircumstanceId'];
        //                 this.personalCircumstanceAddForm.controls['circumstanceTypeId'].disable();
        //                 this.personalCircumstanceAddForm.controls['circumstanceSubTypeId'].disable();
        //                 this.personalCircumstanceService.getPersonalCircumstance(this.personalCircumstanceId).subscribe((data: any) => {
        //                     if(data.locked == "false"){
		// 						this.previousNotes = data.note;
        //                         data.note = "";
        //                         this.personalCircumstanceAddForm.patchValue(data);
        //                     }
        //                     else{
        //                         this.headerService.setAlertPopup("The record is locked");
                                
        //                     }
        //                 });
        //             }
        //         })
        //     } else {
        //         this.headerService.setAlertPopup("Not authorized");
        //     }
        });
           this.personalCircumstanceService.getPersonalFilteredCircumstanceList( this.personalCircumstance.profileId, this.personalCircumstanceId).subscribe(data=>{
            this.circumstanceSubTypeIds=data.personalCircumstanceSubTypeIds;
            this.circumstanceTypeIds=data.personalCircumstanceTypeIds;
         })
    }
    navigateTo(url) {
        if (this.personalCircumstanceAddForm.touched) {
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
 
    updateAnswers(childAnswers) {
    this.childAnswers = childAnswers;
    this.personalCircumstanceAddForm.controls['circumstanceSubTypeId'].setValue(null);
  }
    onSubmit() {
        if (this.personalCircumstanceAddForm.valid) {
			this.personalCircumstanceAddForm.patchValue(Utility.escapeHtmlTags(this.personalCircumstanceAddForm.value));
            if (this.personalCircumstanceId != null) {
                 
                 this.personalCircumstanceAddForm.value.circumstanceTypeId = this.personalCircumstanceAddForm.controls['circumstanceTypeId'].value;
                 this.personalCircumstanceAddForm.value.circumstanceSubTypeId = this.personalCircumstanceAddForm.controls['circumstanceSubTypeId'].value;
                
                this.personalCircumstanceService.updatePersonalCircumstance(this.personalCircumstanceId, this.personalCircumstanceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            } else {
                this.personalCircumstanceService.addPersonalCircumstance(this.personalCircumstanceAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(PersonalCircumstanceConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(PersonalCircumstanceConstants.featureId, field, this.action);
    }
    initForm() {
        this.personalCircumstanceAddForm = this._fb.group({
                        personalCircumstanceId:[ this.personalCircumstance.personalCircumstanceId  ],
                        profileId:[ this.personalCircumstance.profileId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgVersion:[ this.personalCircumstance.spgVersion],
                        spgUpdateUser:[ this.personalCircumstance.spgUpdateUser],
                        startDate:[ this.personalCircumstance.startDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        endDate:[ this.personalCircumstance.endDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        circumstanceTypeId:[ this.personalCircumstance.circumstanceTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        circumstanceSubTypeId:[ this.personalCircumstance.circumstanceSubTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        evidencedYesNoId:[ this.personalCircumstance.evidencedYesNoId ],
                        note:[ this.personalCircumstance.note ,  Validators.compose([, , , ]) ],
                        spgPersonalCircumstanceId:[ '0' ],
                   
                    });
    }
}

