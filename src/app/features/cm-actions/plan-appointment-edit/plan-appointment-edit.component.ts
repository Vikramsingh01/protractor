import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ContactService } from '../../contact/contact.service';
import { ContactConstants } from '../../contact/contact.constants';
import { Contact } from '../../contact/contact';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from '../../../shared/utility';
import { ListService } from '../../../services/list.service';
import { AssociatedPTO } from '../../contact/associated-pto';
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-plan-apoointment-edit',
    templateUrl: 'plan-appointment-edit.component.html'
})
export class PlanAppointmentEditComponent implements OnInit {

    private subscription: Subscription;
    private contactId: number;
    private authorizationData: any;
    private nsrdData: any = [];
    private sensitiveYesNoList = [];
    private authorizedFlag: boolean = false;
    contactAddForm: FormGroup;
    contactForm: FormGroup;
    childAnswers: any = [];
    alertList: any = [];
    private associatedPTO: AssociatedPTO;
    private team: string = "";
    private officer: string = "";
    showOutcome: boolean = false;
    private contact: Contact = new Contact();
    private action;
    private relateto = [];
    private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private listService: ListService,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private contactService: ContactService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {

        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('contactId')) {
                this.action = "Update";
                this.titleService.setTitle('Edit Plan Entry Details');
            } 
        });


        //this.authorizationService.getAuthorizationDataByTableId(ContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ContactConstants.featureId, ContactConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(ContactConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(ContactConstants.featureId, authorizationData[1]);
            }
            this.route.params.subscribe((params: any) => {

              
                  if (params.hasOwnProperty('appointmentId')) {
                    this.contact.contactId = params['appointmentId'];
                }
            });
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ContactConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ContactConstants.featureId, this.action);


            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    this.contactAddForm.controls['alertYesNoId'].setValue(2);
                     this.contactAddForm.controls['sensitiveContactYesNoId'].setValue(2);
                      this.contactAddForm.controls['rarDay'].setValue("No");
                    this.contactAddForm.controls['team'].disable();
                    this.contactAddForm.controls['contactOfficer'].disable();
                    this.contactAddForm.controls['providerId'].disable();

                    if (params.hasOwnProperty('appointmentId')) {
                        this.contactId = params['appointmentId'];                        
                        if(this.contact.profileId==undefined){
                            this.contactService.getProfileIdForContact(this.contactId).subscribe((data: any) => {
                                this.contact.profileId=data._body;
                                this.contactService.getRelatedToList(this.contact.profileId).subscribe(data => {
                                    this.relateto = data;
                                    this.contactService.getContact(this.contactId).subscribe((data: any) => {
                                    if(data.alertYesNoId==null){
                                        data.alertYesNoId=2;
                                    }
                                    if (data.locked == "false") {
                                        this.previousNotes = data.note;
                                        data.note = "";
                                        data = this.contactService.removeConstantsFields(data);
                                         this.officer = data.contactOfficer;
                                        this.team = data.team;
                                        data.contactOfficer = data.contactOfficer.split("/")[1];
                                        data.team = data.team.split("/")[1];
                                        this.contactAddForm.patchValue(data);
                                        this.contactService.getContactCrd(data).subscribe((breResponse: any)=>{
                                            this.contactAddForm.patchValue(data);
                                            this.updateNsrd(breResponse.resultMap.fieldObjectList);
                                        })
                                }
                                else {
                                    this.headerService.setAlertPopup("The record is locked");
                                }
                            });
                        });
                            });
                         }else{

                             this.contactService.getRelatedToList(this.contact.profileId).subscribe(data => {
                            this.relateto = data;
                            this.contactService.getContact(this.contactId).subscribe((data: any) => {
                                if(data.alertYesNoId==null){
                                    data.alertYesNoId=2;
                                }
                                if (data.locked == "false") {
                                    this.previousNotes = data.note;
                                    data.note = "";
                                    data = this.contactService.removeConstantsFields(data);

                                     this.officer = data.contactOfficer;
                                     this.team = data.team;
                                     data.contactOfficer = data.contactOfficer.split("/")[1];
                                     data.team = data.team.split("/")[1];
                                    this.contactAddForm.patchValue(data);
                                    // this.listService.getNSRDDataForChange(crdRequestData).subscribe(crddata => {
                                    //     this.updateNsrd(crddata);
                                    //     this.contactAddForm.patchValue(data);
                                    // });

                             this.contactService.getContactCrd(data).subscribe((breResponse: any)=>{
                                        this.contactAddForm.patchValue(data);
                                       this.updateNsrd(breResponse.resultMap.fieldObjectList);
                                    })
                      








                                }
                                else {
                                    this.headerService.setAlertPopup("The record is locked");

                                }
                            });
                        });


                         }

                        

                    }
                })
                this.contactAddForm.controls['contactTypeId'].disable();
                this.contactAddForm.controls['relatesTo'].disable();



            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });


    }
    navigateTo(url) {
        if (this.contactAddForm.touched) {
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
            this.contactForm.controls[fieldName].setValidators(Validators.required);
            return true;
        }
    }
    updateNsrd(nsrdData) {
        if (!(typeof nsrdData == "undefined")) {
        if (nsrdData.hasOwnProperty('resultMap')) {
            if (nsrdData.resultMap.hasOwnProperty('fieldObjectList')) {
                
                      nsrdData.resultMap.fieldObjectList.forEach((element: any) => {
            this.nsrdData[element.fieldName] = {};
            let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), "fieldName", element.fieldName);
            if(element.active){
                this.nsrdData[element.fieldName].active = element.active;
                this.contactAddForm.addControl(element.fieldName, this._fb.control({value: currentControl.field.value, disabled: currentControl.field.disabled}, currentControl.validators));
                if(element.mandatory){
                    this.nsrdData[element.fieldName].mandatory = element.mandatory;
                    currentControl.validators.push(Validators.required);
                    this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                }else{
                    this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                }
            }else{
                this.contactAddForm.removeControl(element.fieldName);
            }
            
            
            if(element.active){
                this.contactAddForm.controls[element.fieldName].updateValueAndValidity();
            }
        });
                    // nsrdData.resultMap.fieldObjectList.forEach((element: any) => {
                    //     this.nsrdData[element.fieldName] = {};
                    //     this.nsrdData[element.fieldName].active = element.active;
                    //     this.nsrdData[element.fieldName].mandatory = element.mandatory;
                    //     this.contactAddForm.controls[element.fieldName].updateValueAndValidity();
                    // });
                
            }
        } else {
            nsrdData.forEach((element: any) => {
            this.nsrdData[element.fieldName] = {};
            let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), "fieldName", element.fieldName);
            if(element.active){
                this.nsrdData[element.fieldName].active = element.active;
                this.contactAddForm.addControl(element.fieldName, this._fb.control({value: currentControl.field.value, disabled: currentControl.field.disabled}, currentControl.validators));
                if(element.mandatory){
                    this.nsrdData[element.fieldName].mandatory = element.mandatory;
                    currentControl.validators.push(Validators.required);
                    this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                }else{
                    this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                }
            if( element.fieldName === 'responseBy'  &&  (this.contactAddForm.controls['responseBy'].value == null || this.contactAddForm.controls['responseBy'].value == '')){
                            let OneWeekAheadOftoday = Utility.getOneWeekAheadOfToday();
                            this.contactAddForm.controls['responseBy'].setValue(OneWeekAheadOftoday.day + "/" + OneWeekAheadOftoday.month + "/" + OneWeekAheadOftoday.year);
                }
            if( element.fieldName === 'contactStartTime'  &&  (this.contactAddForm.controls['contactStartTime'].value == null || this.contactAddForm.controls['contactStartTime'].value == '')){
                            let today = Utility.getTodayTime();
                            this.contactAddForm.controls['contactStartTime'].setValue(today.hours + ":" + today.minutes);
                }
            }else{
                this.contactAddForm.removeControl(element.fieldName);
            }
            
            
            if(element.active){
                this.contactAddForm.controls[element.fieldName].updateValueAndValidity();
            }
        });
            
                // nsrdData.forEach((element: any) => {
                //     this.nsrdData[element.fieldName] = {};
                //     this.nsrdData[element.fieldName].active = element.active;
                //     this.nsrdData[element.fieldName].mandatory = element.mandatory;
                //     this.contactAddForm.controls[element.fieldName].updateValueAndValidity();
                // });
            
    }
}


    }
    updateAnswers(childAnswers) {
        this.childAnswers = childAnswers;
    }

    ngAfterViewInit() {

    }
    onSubmit() {
      

        if (this.contactAddForm.valid) {
            if (this.contactAddForm.value.location == [""])
                this.contactAddForm.value.location = null;
                let relatesTo = this.contactAddForm.getRawValue().relatesTo;
                this.relateto.forEach((element, index)=> {
                if (element.key.description == relatesTo) {
                   this.contactAddForm.controls['relatesTo'].setValue(JSON.stringify(element.key));
                }
            });
            
                this.contactAddForm.value.providerId = this.contactAddForm.controls['providerId'].value;
                this.contactAddForm.value.team = this.team;
                this.contactAddForm.value.contactOfficer = this.officer;

            this.contactService.updateContact(this.contactId, this.contactAddForm.getRawValue()).subscribe((response: any) => {
                this.router.navigate(['../../..'], {relativeTo: this.route});
            },
            err=>{
                    if (!(typeof this.relateto == "undefined")) {
                   this.relateto.forEach((element, index)=> {
                if (element.key.description == relatesTo) {
                   this.contactAddForm.controls['relatesTo'].setValue(element.key.description);
                }
                    });
                }
                if(JSON.parse(err._body).errorMessage=="Edit operation is not allowed."){
                this.headerService.setErrorPopup(JSON.parse(err._body))
            }
              
            });
        }

    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ContactConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ContactConstants.featureId, field, this.action);
    }
    initForm() {
        this.contactAddForm = this._fb.group({
            profileId: [this.contact.profileId, Validators.compose([Validators.required, , ,])],
            spgVersion: [this.contact.spgVersion],
            contactId: [this.contact.contactId],
            spgUpdateUser: [this.contact.spgUpdateUser],
            contactStartTime: [this.contact.contactStartTime, Validators.compose([ValidationService.timeValidator])],
            contactEndTime: [this.contact.contactEndTime, Validators.compose([ValidationService.timeValidator])],
            note: [this.contact.note],
            location: [this.contact.location],
            spgContactId: ['0', Validators.compose([Validators.required, , ,])],
            relatesTo: [this.contact.relatesTo, Validators.compose([Validators.required, , ,])],
            contactTypeId: [this.contact.contactTypeId, Validators.compose([Validators.required, , ,])],
            contactDate: [this.contact.contactDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            providerId: [this.contact.providerId, Validators.compose([Validators.required, , ,])],
            team: [this.contact.team],
            contactOfficer: [this.contact.contactOfficer],
            contactOutcomeId: [this.contact.contactOutcomeId],
            enforcementActionId: [this.contact.enforcementActionId],
            sensitiveContactYesNoId: [this.contact.sensitiveContactYesNoId],
            rarDay: [],
            alertYesNoId: [this.contact.alertYesNoId, Validators.compose([Validators.required, , ,])],
            contactCategoryId: [this.contact.contactCategoryId],
            responseBy: [this.contact.responseBy]
        });
    }

        getNSRDFormObj(){
        let formObjArray: any[] = [];
        let contactType: any = {};
        contactType.fieldName = "contactTypeId";
        contactType.field = {value: ''};
        contactType.validators = [],
        formObjArray.push(contactType);

        let contactStartTime: any = {};
        contactStartTime.fieldName = "contactStartTime";
        contactStartTime.field = {value: ''};
        contactStartTime.validators = [ValidationService.timeValidator],
        formObjArray.push(contactStartTime);

          let contactEndTime: any = {};
        contactEndTime.fieldName = "contactEndTime";
        contactEndTime.field = {value: ''};
        contactEndTime.validators = [ValidationService.timeValidator],
        formObjArray.push(contactEndTime);

            let location: any = {};
        location.fieldName = "location";
        location.field = {value: ''};
        location.validators = [],
        formObjArray.push(location);


        let contactOutcome: any = {};
        contactOutcome.fieldName = "contactOutcomeId";
        contactOutcome.field = {value: ''};
        contactOutcome.validators = [],
        formObjArray.push(contactOutcome);

        let enforcementAction: any = {};
        enforcementAction.fieldName = "enforcementActionId";
        enforcementAction.field = {value: ''};
        enforcementAction.validators = [],
        formObjArray.push(enforcementAction);

          let responseBy: any = {};
        responseBy.fieldName = "responseBy";
        responseBy.field = {value: ''};
        responseBy.validators = [ValidationService.dateValidator],
        formObjArray.push(responseBy);

        

       
        
        return formObjArray;        
    }
}

