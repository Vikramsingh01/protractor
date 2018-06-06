import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { OffenderProfileService } from '../offenderprofile.service';
import { OffenderProfileConstants } from '../offenderprofile.constants';
import { OffenderProfile } from '../offenderprofile';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import {Title} from "@angular/platform-browser";
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-offenderprofile-edit',
    templateUrl: 'offenderprofile-edit.component.html',
    providers: [OffenderProfileService]
})
export class OffenderProfileEditComponent implements OnInit {

    private subscription: Subscription;
    private serviceUserId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    serviceUserAddForm: FormGroup;
    private serviceUser: any = {};
    private action;
    private nsrdData: any = [];
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private serviceUserService: OffenderProfileService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private _titleService: Title) { }

    ngOnInit() {
        
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('profileId')) {
                this.action = "Create";
                this._titleService.setTitle('Add Identifiers');
            } else {
                this.action = "Update";
                 this.serviceUserId = params['profileId'];
                 this._titleService.setTitle('Edit Identifiers');
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(ServiceUserConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(OffenderProfileConstants.featureId, OffenderProfileConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(OffenderProfileConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(OffenderProfileConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ServiceUserConstants.tableId, this.action, this.authorizationData);
            this.initForm();
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, this.action, this.authorizationData);
            this.serviceUserService.isAuthorize(this.serviceUserId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('profileId')) {
                        this.serviceUserId = params['profileId'];
                        this.serviceUserService.getOffenderProfileByProfileId(this.serviceUserId).subscribe((data: any) => {
                            if (!data.locked) {
                                this.serviceUserAddForm.patchValue(data);
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

        });
    }
    navigateTo(url) {
        if (this.serviceUserAddForm.touched) {
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
        if (this.serviceUserAddForm.valid) {

				this.serviceUserAddForm.patchValue(Utility.escapeHtmlTags(this.serviceUserAddForm.value));
            if (this.serviceUserId != null) {
                this.serviceUserService.updateOffenderProfile(this.serviceUserId, this.serviceUserAddForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                });
            } else {
              // Service user cannot be added from CMS
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    updateNsrd(nsrdData) {
    nsrdData.forEach((element: any) => {
      this.nsrdData[element.fieldName] = {};
      this.nsrdData[element.fieldName].active = element.active;
      this.nsrdData[element.fieldName].mandatory = element.mandatory;
      this.serviceUserAddForm.controls[element.fieldName].updateValueAndValidity();
    });
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ServiceUserConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(OffenderProfileConstants.featureId, field, this.action);
    }


    initForm() {
        this.serviceUserAddForm = this._fb.group({
            profileId: [this.serviceUser.profileId, Validators.compose([ Validators.required , , , ])],
            titleId: [this.serviceUser.titleId, Validators.compose([, , , ])],
            firstName: [this.serviceUser.firstName, Validators.compose([ Validators.required , ,  Validators.maxLength(35) , ])],
            secondName: [this.serviceUser.secondName, Validators.compose([, ,  Validators.maxLength(35) , ])],
            thirdName: [this.serviceUser.thirdName, Validators.compose([, ,  Validators.maxLength(35) , ])],
            familyName: [this.serviceUser.familyName, Validators.compose([ Validators.required , ,  Validators.maxLength(35) , ])],
            previousName: [this.serviceUser.previousName, Validators.compose([, ,  Validators.maxLength(35) , ])],
            dateOfBirth: [this.serviceUser.dateOfBirth, Validators.compose([ Validators.required , ValidationService.dateValidator, , , ])],
            genderId: [this.serviceUser.genderId, Validators.compose([ Validators.required , , , ])],
            dateDied: [this.serviceUser.dateDied, Validators.compose([, ValidationService.dateValidator, , ])],

            caseReferenceNumber: [this.serviceUser.caseReferenceNumber , Validators.compose([ Validators.required , , , ])],
            croNumber: [this.serviceUser.croNumber],
            immigrationNumber: [this.serviceUser.immigrationNumber],
            niNumber: [this.serviceUser.niNumber],
            nomsNumber: [this.serviceUser.nomsNumber],
            pncNumber: [this.serviceUser.pncNumber],
            tierId: [{value:this.serviceUser.tierId,disabled: true}, Validators.compose([, , , ])],
            bandId: [{value:this.serviceUser.bandId,disabled: false}, Validators.compose([, , , ])],
            
            allowSmsYesNoId: [this.serviceUser.allowSmsYesNoId, Validators.compose([, ,  Validators.maxLength(1) , ])],
            emailAddress: [this.serviceUser.emailAddress, Validators.compose([, ,  Validators.maxLength(255) , ])],
            equalityMonitoringNote: [this.serviceUser.equalityMonitoringNote],
            ethnicityId: [this.serviceUser.ethnicityId],
            eventCount: [this.serviceUser.eventCount],
            exclusionMessage: [this.serviceUser.exclusionMessage],
            exclusionsExistYesNoId: [this.serviceUser.exclusionsExistYesNoId],
            fileName: [this.serviceUser.fileName ],
            immigrationStatusId: [this.serviceUser.immigrationStatusId],
            interpreterRequiredYesNoId: [this.serviceUser.interpreterRequiredYesNoId],
            languageId: [this.serviceUser.languageId],
            mobileNumber: [this.serviceUser.mobileNumber],
            nationalityId: [this.serviceUser.nationalityId],
            note: [this.serviceUser.note],
            offenderManagerProviderId: [this.serviceUser.offenderManagerProviderId],
            offenderManagerResponsibleOfficer: [this.serviceUser.offenderManagerResponsibleOfficer],
            offenderManagerResponsibleTeam: [this.serviceUser.offenderManagerResponsibleTeam],
            religionId: [this.serviceUser.religionId],
            remandStatus: [this.serviceUser.remandStatus],
            restrictionMessage: [this.serviceUser.restrictionMessage],
            restrictionsExistYesNoId: [this.serviceUser.restrictionsExistYesNoId],
            secondNationalityId: [this.serviceUser.secondNationalityId],
            sexualOrientationId: [this.serviceUser.sexualOrientationId],
            //offenderDetailId: [this.offenderProfile.offenderDetailId],
            telephoneNumber: [this.serviceUser.telephoneNumber],
            terminatedEventCount: [this.serviceUser.terminatedEventCount],
            transGenderDiscloseConsentYesNoId: [this.serviceUser.transGenderDiscloseConsentYesNoId],
            transGenderProcessId: [this.serviceUser.transGenderProcessId],
            caseReviewDate: [this.serviceUser.caseReviewDate],
            suitableGroupWorkYesNoId: [this.serviceUser.suitableGroupWorkYesNoId],
            privateYesNoId: [this.serviceUser.privateYesNoId],
            reallocationDate: [this.serviceUser.reallocationDate],
            dateReleaseFromCustody: [this.serviceUser.dateReleaseFromCustody],
            dateReturnedToCustody: [this.serviceUser.dateReturnedToCustody],
            referralDate: [this.serviceUser.referralDate],
            dependantsId: [this.serviceUser.dependantsId],
            domicileId: [this.serviceUser.domicileId],
            officerId: [this.serviceUser.caseManagerId],
            preferredCommunicationMethodId: [this.serviceUser.preferredCommunicationMethodId],
            providerId: [this.serviceUser.providerId],
            reviewingOfficerProviderId: [this.serviceUser.reviewingOfficerProviderId],
            reviewingOfficerTeamId: [this.serviceUser.reviewingOfficerTeamId],
            serviceUserStateId: [this.serviceUser.serviceUserStateId],
            serviceUserTypeId: [this.serviceUser.serviceUserTypeId],
            statusId: [this.serviceUser.statusId],
            teamId: [this.serviceUser.teamId],
            spgVersion: [this.serviceUser.spgVersion],
            spgUpdateUser: [this.serviceUser.spgUpdateUser],
            // createdDate: [this.offenderProfile.createdDate],
            // createdBy: [this.offenderProfile.createdBy],
            // createdByUserId: [this.offenderProfile.createdByUserId],
            // modifiedDate: [this.offenderProfile.modifiedDate],
            // modifiedBy: [this.offenderProfile.modifiedBy],
            // modifiedByUserId: [this.offenderProfile.modifiedByUserId],
            // deleted: [this.offenderProfile.deleted],
            // deletedDate: [this.offenderProfile.deletedDate],
            // deletedBy: [this.offenderProfile.deletedBy],
            // deletedByUserId: [this.offenderProfile.deletedByUserId],
            locked: [this.serviceUser.locked],
            // version: [this.offenderProfile.version],
        });
    }
}

