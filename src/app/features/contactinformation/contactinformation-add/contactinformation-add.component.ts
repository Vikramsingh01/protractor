import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlTree, UrlSegment } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';

import { HeaderService } from '../../../views/header/header.service';
import { contactinformationService } from '../contactinformation.service';
import { contactinformationConstants } from '../contactinformation.constants';
import { contactinformation } from '../contactinformation';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service'
import { Utility } from '../../../shared/utility';
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-contactinformation-edit',
    templateUrl: 'contactinformation-add.component.html',

})
export class contactinformationAddComponent implements OnInit {

    private subscription: Subscription;
    private contactinformationId: number;
    private authorizationData: any;


    private authorizedFlag: boolean = false;
    contactinformationAddForm: FormGroup;
    //   private ProfileId: number;
    allowSmsYesNoId: String[];
    private contactinformation: contactinformation = new contactinformation();
    private action;
    //   neoProfile: NeoProfile = new NeoProfile();
    private childAnswers = [];
    private allowSmsYesNoIdList = [];
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private contactinformationService: contactinformationService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private titleService: Title) { }


    ngOnInit() {
        
        this.listService.getListData(244).subscribe(data => {
            data.forEach(function (value, index) {
                if (value.value == "Undefined") {
                    data.splice(index, 1);
                }
            });
            this.allowSmsYesNoIdList = data
        })


        this.route.params.subscribe((params: any) => {
            let urlTree: UrlTree = this.router.parseUrl(this.router.url);
            let childObj: any = urlTree.root.children;
               if (params.hasOwnProperty('profileId')) {
                     
                        this.contactinformation.profileId =params['profileId'];;
               }
            let urlSegment: UrlSegment = childObj.primary.segments[3];
            if (urlSegment.path == 'new') {
                this.action = "Create";
                this.titleService.setTitle('Add Key Contacts');
            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit Key Contacts');
            }
        });



        //this.authorizationService.getAuthorizationDataByTableId(contactinformationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(contactinformationConstants.featureId, contactinformationConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(contactinformationConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(contactinformationConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(contactinformationConstants.tableId, this.action, this.authorizationData);
              this.initForm();
            this.contactinformationService.isAuthorize(this.contactinformation.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
                if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('profileId')) {
                        this.contactinformationId = params['profileId'];
                        this.contactinformation.profileId = this.contactinformationId;
                        this.contactinformationService.getcontactinformation(this.contactinformationId).subscribe((data1: any) => {
                            if (!data1.locked) {
                                /* if( this.action=="Update"){
                                      this.listService.getListData(165).subscribe(data=>{
                                      this.childAnswers = data;
                                      let list= this.childAnswers;
                                           list.forEach(function(value,index){
                                           if(value.key==data1.nationalityId){
                                             list.splice(index,1);
                                             }
                                         });
                                         this.childAnswers=list;
                                  });
                                 }*/
                                this.contactinformation = data1;
                                this.contactinformationAddForm.patchValue(data1);
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

           // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(contactinformationConstants.featureId, "Update");
            
        });
    }
    updateAd(childAnswers) {
        this.childAnswers = childAnswers;
    }

    navigateTo(url) {
        if (this.contactinformationAddForm.touched) {
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

        let data = this.contactinformationAddForm.value;
        //data.allowSmsYesNoId = Utility.filterArrayByKeyAndValue(this.contactinformationAddForm.value.hobbies, 'allowSmsYesNoId', true);
        //    console.log("===ON SUBMIT==ALLOW==="+data);
        //    console.log("yyyyy====vallis==="+this.contactinformationAddForm.valid);
        if (this.contactinformationAddForm.valid) {
			this.contactinformationAddForm.patchValue(Utility.escapeHtmlTags(this.contactinformationAddForm.value));
            if (this.contactinformation.profileId != null) {
                if (this.contactinformationAddForm.value.nationalityId == "") {
                    this.contactinformationAddForm.value.secondNationalityId = ""
                }

                this.contactinformationService.updatecontactinformation(this.contactinformation.profileId, this.contactinformationAddForm.value).subscribe((response: any) => {

                    this.router.navigate(['..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(contactinformationConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(contactinformationConstants.featureId, field, this.action);
    }

    initForm() {
        this.contactinformationAddForm = this._fb.group({
            profileId: [this.contactinformationId],
            immigrationNumber: [this.contactinformation.immigrationNumber, Validators.compose([Validators.maxLength(20)])],
            ethnicityId: [this.contactinformation.ethnicityId, Validators.compose([, , ,])],
            nationalityId: [this.contactinformation.nationalityId, Validators.compose([, , ,])],
            secondNationalityId: [this.contactinformation.secondNationalityId, Validators.compose([, , ,])],
            languageId: [this.contactinformation.languageId, Validators.compose([, , ,])],
            interpreterRequiredYesNoId: [this.contactinformation.interpreterRequiredYesNoId],
            immigrationStatusId: [this.contactinformation.immigrationStatusId, Validators.compose([, , ,])],
            religionId: [this.contactinformation.religionId, Validators.compose([, , ,])],
            equalityMonitoringNote: [this.contactinformation.equalityMonitoringNote, Validators.compose([, , ,])],

            allowSmsYesNoId: [this.contactinformation.allowSmsYesNoId],
            dateDied: [this.contactinformation.dateDied],
            dateOfBirth: [this.contactinformation.dateOfBirth],
            emailAddress: [this.contactinformation.emailAddress],
            eventCount: [this.contactinformation.eventCount],
            exclusionMessage: [this.contactinformation.exclusionMessage],
            exclusionsExistYesNoId: [this.contactinformation.exclusionsExistYesNoId],
            familyName: [this.contactinformation.familyName],
            fileName: [this.contactinformation.fileName],
            firstName: [this.contactinformation.firstName],
            genderId: [this.contactinformation.genderId],
            // mobileNumber: [this.contactinformation.mobileNumber],
            mobileNumber: [this.contactinformation.mobileNumber, Validators.compose([, ValidationService.MobileNumberTextValidator, ValidationService.MobileNumberDigitValidator, Validators.maxLength(35),])],

            note: [this.contactinformation.note],
            offenderManagerProviderId: [this.contactinformation.offenderManagerProviderId],
            offenderManagerResponsibleOfficer: [this.contactinformation.offenderManagerResponsibleOfficer],
            offenderManagerResponsibleTeam: [this.contactinformation.offenderManagerResponsibleTeam],
            previousName: [this.contactinformation.previousName],

            remandStatus: [this.contactinformation.remandStatus],
            restrictionMessage: [this.contactinformation.restrictionMessage],
            restrictionsExistYesNoId: [this.contactinformation.restrictionsExistYesNoId],
            secondName: [this.contactinformation.secondName],

            sexualOrientationId: [this.contactinformation.sexualOrientationId],
            offenderDetailId: [this.contactinformation.offenderDetailId],
            //   telephoneNumber: [this.contactinformation.telephoneNumber],
            telephoneNumber: [this.contactinformation.telephoneNumber, Validators.compose([, ValidationService.TelephoneNumberTextValidator, Validators.maxLength(35),])],

            terminatedEventCount: [this.contactinformation.terminatedEventCount],
            thirdName: [this.contactinformation.thirdName],
            tierId: [this.contactinformation.tierId],
            titleId: [this.contactinformation.titleId],
            transGenderDiscloseConsentYesNoId: [this.contactinformation.transGenderDiscloseConsentYesNoId],
            transGenderProcessId: [this.contactinformation.transGenderProcessId],
            transferPendingYesNoId: [1],

            croNumber: [this.contactinformation.croNumber],

            niNumber: [this.contactinformation.niNumber],
            nomsNumber: [this.contactinformation.nomsNumber],
            pncNumber: [this.contactinformation.pncNumber],
            caseReferenceNumber: [this.contactinformation.caseReferenceNumber],

            caseReviewDate: [this.contactinformation.caseReviewDate],
            suitableGroupWorkYesNoId: [this.contactinformation.suitableGroupWorkYesNoId],
            privateYesNoId: [this.contactinformation.privateYesNoId],
            reallocationDate: [this.contactinformation.reallocationDate],
            dateReleaseFromCustody: [this.contactinformation.dateReleaseFromCustody],
            dateReturnedToCustody: [this.contactinformation.dateReturnedToCustody],
            referralDate: [this.contactinformation.referralDate],
            dependantsId: [this.contactinformation.dependantsId],
            domicileId: [this.contactinformation.domicileId],
            officerId: [this.contactinformation.caseManagerId],
            preferredCommunicationMethodId: [this.contactinformation.preferredCommunicationMethodId],
            providerId: [this.contactinformation.providerId],
            reviewingOfficerProviderId: [this.contactinformation.reviewingOfficerProviderId],
            reviewingOfficerTeamId: [this.contactinformation.reviewingOfficerTeamId],
            serviceUserStateId: [this.contactinformation.serviceUserStateId],
            serviceUserTypeId: [this.contactinformation.serviceUserTypeId],
            statusId: [this.contactinformation.statusId],
            teamId: [this.contactinformation.teamId],
            spgVersion: [this.contactinformation.spgVersion],
            spgUpdateUser: [this.contactinformation.spgUpdateUser],
        });
    }
}

