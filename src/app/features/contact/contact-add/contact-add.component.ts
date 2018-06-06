import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ContactService } from '../contact.service';
import { ContactConstants } from '../contact.constants';
import { Contact } from '../contact';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from '../../../shared/utility';
import { ListService } from '../../../services/list.service';
import { AssociatedPTO } from '../associated-pto';
import { Title } from "@angular/platform-browser";
@Component({
    selector: 'tr-contact-add',
    templateUrl: 'contact-add.component.html'
})
export class ContactAddComponent implements OnInit {

    private subscription: Subscription;
    private contactId: number;
    private authorizationData: any;
    private nsrdData: any = [];
    private sensitiveYesNoList = [];
    private entryType: any = [];
    private outcomeList: any = [];
    private enforcementList: any= [];
    private authorizedFlag: boolean = false;
    contactAddForm: FormGroup;
    contactForm: FormGroup;
    childAnswers: any = [];
    alertList: any = [];
    private contact: Contact = new Contact();
    private action;
    orgs: any = [];
    teams: any = [];
    officerIds: any = [];
    private relateto = [];
    private associatedPTO: AssociatedPTO;
    private team: string = "";
    private officer: string = "";
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
                this.action = "Create";
                this.titleService.setTitle('Add Plan Entry');
            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit Plan Entry');
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

                if (params.hasOwnProperty('profileId')) {
                    this.contact.profileId = params['profileId'];
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
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ContactConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ContactConstants.featureId, this.action);

            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    let currentDate = new Date();
                    let ddS = "", mmS = "";
                    let dd = currentDate.getDate();
                    if (dd < 10)
                        ddS = "0" + dd;
                    else
                        ddS = ("" + dd).replace(/^\s+|\s+$/g, '');;
                    let mm = currentDate.getMonth() + 1;
                    if (mm < 10)
                        mmS = "0" + mm;
                    else
                        mmS = ("" + mm).replace(/^\s+|\s+$/g, '');;
                    let yyyy = currentDate.getFullYear();

                    let defaultDate = ddS + "/" + mmS + "/" + yyyy;
                    this.contactAddForm.controls['alertYesNoId'].setValue(2);
                    this.contactAddForm.controls['sensitiveContactYesNoId'].setValue(2);
                    this.contactAddForm.controls['contactDate'].setValue(defaultDate);
                    this.contactAddForm.controls['rarDay'].setValue("No");
                    this.contactAddForm.controls['providerId'].disable();

                    if (!params.hasOwnProperty('contactId')) {
                        this.contactService.getPTOfficer().subscribe(data => {
                            this.associatedPTO = data
                            this.contactAddForm.controls['providerId'].setValue(this.associatedPTO.provider);
                        });
                    }


                    if (params.hasOwnProperty('contactId')) {
                        this.contactId = params['contactId'];
                        this.contactService.getContact(this.contactId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.previousNotes = data.note;
                                data.note = "";
                                this.officer = data.contactOfficer;
                                this.team = data.team;

                                data.contactOfficer = this.parseOfficer(data.contactOfficer);
                                data.team = data.team.split("/")[1].split("[")[0].split("(")[0];

                                this.contactAddForm.patchValue(data);
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

        this.contactService.getRelatedToList(this.contact.profileId).subscribe(data => {
            this.relateto = data;
        });

        let today = Utility.getTodayTime();
        this.contactAddForm.controls['contactStartTime'].setValue(today.hours + ":" + today.minutes);
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


        // nsrdData.forEach((element: any) => {
        //     this.nsrdData[element.fieldName] = {};
        //     this.nsrdData[element.fieldName].active = element.active;
        //     this.nsrdData[element.fieldName].mandatory = element.mandatory;
        //     this.contactAddForm.controls[element.fieldName].updateValueAndValidity();
        // });
        if (!(typeof nsrdData == "undefined")) {
            if (nsrdData.hasOwnProperty('resultMap')) {
                if (nsrdData.resultMap.hasOwnProperty('fieldObjectList')) {

                    nsrdData.resultMap.fieldObjectList.forEach((element: any) => {
                        this.nsrdData[element.fieldName] = {};
                        let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), "fieldName", element.fieldName);
                        if (element.active) {
                            this.nsrdData[element.fieldName].active = element.active;
                            this.contactAddForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
                            if (element.mandatory) {
                                this.nsrdData[element.fieldName].mandatory = element.mandatory;
                                currentControl.validators.push(Validators.required);
                                this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                            } else {
                                this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                            }
                        } else {
                            this.contactAddForm.removeControl(element.fieldName);
                        }


                        if (element.active) {
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
                    if (element.active) {
                        this.nsrdData[element.fieldName].active = element.active;
                        this.contactAddForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
                        if (element.mandatory) {
                            this.nsrdData[element.fieldName].mandatory = element.mandatory;
                            currentControl.validators.push(Validators.required);
                            this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                        } else {
                            this.contactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                        }
                        if (element.fieldName === 'responseBy') {
                            let OneWeekAheadOftoday = Utility.getOneWeekAheadOfToday();
                            this.contactAddForm.controls['responseBy'].setValue(OneWeekAheadOftoday.day + "/" + OneWeekAheadOftoday.month + "/" + OneWeekAheadOftoday.year);
                        }
                    } else {
                        this.contactAddForm.removeControl(element.fieldName);
                    }


                    if (element.active) {
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
    // nsrdData.forEach((element: any) => {
    //   this.nsrdData[element.fieldName] = {};
    //   this.nsrdData[element.fieldName].active = element.active;
    //   this.nsrdData[element.fieldName].mandatory = element.mandatory;
    //   this.contactAddForm.controls[element.fieldName].updateValueAndValidity();
    // });


    updateAnswers(childAnswers) {
      if(childAnswers[103]){
        this.outcomeList = childAnswers[103];
      }
      if(childAnswers[121]){
        this.enforcementList = childAnswers[121];
      }
    }

    ngAfterViewInit() {

    }

    change(option) {
        if (option.selectedIndex > 0) {
            let selectedTeamId = this.orgs[option.selectedIndex - 1].key;
            this.listService.getListDataByLookupAndPkValue(270, 538, selectedTeamId).subscribe(listObj => {
                this.officerIds = listObj;
                if (this.officerIds.length == 0) {
                    this.contactAddForm.value.officerIds = null;
                }
            })
        }

    }

    onSubmit() {
        //  if(!this.nsrdData['contactOutcomeId'].mandatory){
        //     this.contactAddForm.controls['contactOutcomeId'].reset();
        //  }

        if (this.contactAddForm.valid) {
            this.contactAddForm.patchValue(Utility.escapeHtmlTags(this.contactAddForm.value));

            if (this.contactAddForm.value.location == [""])
                this.contactAddForm.value.location = null;

            this.contactAddForm.value.providerId = this.contactAddForm.controls['providerId'].value;

            this.contactService.addContact(this.contactAddForm.value).subscribe((response: any) => {
                this.router.navigate(['../..'], { relativeTo: this.route });
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
            relatesTo: ['', Validators.compose([Validators.required, , ,])],
            contactTypeId: [this.contact.contactTypeId, Validators.compose([Validators.required, , ,])],
            contactDate: [this.contact.contactDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            providerId: [this.contact.providerId, Validators.compose([Validators.required, , ,])],
            team: [this.contact.team, Validators.compose([Validators.required, , ,])],
            contactOfficer: [this.contact.contactOfficer, Validators.compose([Validators.required, , ,])],
            contactOutcomeId: [this.contact.contactOutcomeId],
            enforcementActionId: [this.contact.enforcementActionId],
            sensitiveContactYesNoId: [this.contact.sensitiveContactYesNoId],
            rarDay: [],
            alertYesNoId: [this.contact.alertYesNoId, Validators.compose([Validators.required, , ,])],
            contactCategoryId: [this.contact.contactCategoryId],
            responseBy: [this.contact.responseBy],
            dataId: [this.contact.dataId],
            tableId: [this.contact.tableId]
        });
    }

    getNSRDFormObj() {
        let formObjArray: any[] = [];
        let contactType: any = {};
        contactType.fieldName = "contactTypeId";
        contactType.field = { value: '' };
        contactType.validators = [],
            formObjArray.push(contactType);

        let contactStartTime: any = {};
        contactStartTime.fieldName = "contactStartTime";
        contactStartTime.field = { value: '' };
        contactStartTime.validators = [ValidationService.timeValidator],
            formObjArray.push(contactStartTime);

        let contactEndTime: any = {};
        contactEndTime.fieldName = "contactEndTime";
        contactEndTime.field = { value: '' };
        contactEndTime.validators = [ValidationService.timeValidator],
            formObjArray.push(contactEndTime);

        let location: any = {};
        location.fieldName = "location";
        location.field = { value: '' };
        location.validators = [],
            formObjArray.push(location);


        let contactOutcome: any = {};
        contactOutcome.fieldName = "contactOutcomeId";
        contactOutcome.field = { value: '' };
        contactOutcome.validators = [],
            formObjArray.push(contactOutcome);

        let enforcementAction: any = {};
        enforcementAction.fieldName = "enforcementActionId";
        enforcementAction.field = { value: '' };
        enforcementAction.validators = [],
            formObjArray.push(enforcementAction);

        let responseBy: any = {};
        responseBy.fieldName = "responseBy";
        responseBy.field = { value: '' };
        responseBy.validators = [ValidationService.dateValidator],
            formObjArray.push(responseBy);

        let rarDay: any = {};
        rarDay.fieldName = "rarDay";
        rarDay.field = { value: '' };
        rarDay.validators = [],
        formObjArray.push(rarDay);
        return formObjArray;
    }
    getEntryTypeByRelatesTo(data) {
        let request = JSON.parse(data)
        this.contactService.getEntryTypeByRelatesTo(request).subscribe(data => {
            this.entryType = data;
        })
    }

    parseOfficer(officerName) {
        if (officerName != null && typeof officerName != undefined) {
            return officerName.substring(officerName.indexOf("/") + 1).replace(/\[[0-9]*\]/g, "");
        } else
            return officerName;
    }
}
