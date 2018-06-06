import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlTree, UrlSegment } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ProtectedCharacteristicsService } from '../protected-characteristics.service';
import { ProtectedCharacteristicsConstants } from '../protected-characteristics.constants';
import { ProtectedCharacteristics } from '../protected-characteristics';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service'
import { Utility } from "../../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-protected-characteristics-edit',
    templateUrl: 'protected-characteristics-add.component.html'
})
export class ProtectedCharacteristicsAddComponent implements OnInit {

    private subscription: Subscription;
    private protectedCharacteristicsId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    protectedCharacteristicsAddForm: FormGroup;
    private protectedCharacteristics: ProtectedCharacteristics = new ProtectedCharacteristics();
    private action;
    private nsrdData: any = [];
    private childAnswers = [];
    private interpreterRequiredYesNoList=[];
    private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private protectedCharacteristicsService: ProtectedCharacteristicsService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private titleService: Title) { }

    ngOnInit() {
    

        
        this.route.params.subscribe((params: any) => {
            let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    let childObj: any = urlTree.root.children;
          if (params.hasOwnProperty('profileId')) {
            this.protectedCharacteristicsId = params['profileId'];
            this.protectedCharacteristics.profileId = this.protectedCharacteristicsId;
          }
    let urlSegment: UrlSegment = childObj.primary.segments[3];
            if (urlSegment.path=='new') {
                this.action = "Create";
                this.titleService.setTitle('Add Equality & Diversity');
            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit Equality & Diversity');
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(ProtectedCharacteristicsConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ProtectedCharacteristicsConstants.featureId, ProtectedCharacteristicsConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(ProtectedCharacteristicsConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(ProtectedCharacteristicsConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProtectedCharacteristicsConstants.tableId, this.action, this.authorizationData);
          
              this.initForm();
            
           
            
            this.protectedCharacteristicsService.isAuthorize(this.protectedCharacteristics.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (this.authorizedFlag) {
                this.initForm();
                
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('profileId')) {
                        this.protectedCharacteristicsId = params['profileId'];
                        this.protectedCharacteristics.profileId = this.protectedCharacteristicsId;
                        this.protectedCharacteristicsService.getProtectedCharacteristics(this.protectedCharacteristicsId).subscribe((data1: any) => {
                            this.previousNotes = data1.equalityMonitoringNote;
                            data1.equalityMonitoringNote="";
                            if (!data1.locked ) {
                                if( this.action=="Update"){
                                    
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
                                 if(data1!=null && data1.hasOwnProperty("transGenderProcessId") && data1.transGenderProcessId!=null ){
                                    this.protectedCharacteristicsService.getTransGenderCrd(data1).subscribe(breResponse=>{
                                        this.updateNsrd(breResponse.resultMap.fieldObjectList);
                                    })
                                 }
                                }
                                this.protectedCharacteristics = data1;
                                
                               

                                this.protectedCharacteristicsAddForm.patchValue(data1);
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


           // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ProtectedCharacteristicsConstants.featureId, "Update");
           
        });
    }
    updateAd(childAnswers){
   this.childAnswers = childAnswers;
    }
    navigateTo(url) {
        if (this.protectedCharacteristicsAddForm.touched) {
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
        if (this.protectedCharacteristicsAddForm.valid) {
			this.protectedCharacteristicsAddForm.patchValue(Utility.escapeHtmlTags(this.protectedCharacteristicsAddForm.value));
            if (this.protectedCharacteristics.profileId != null) {
                 if(this.protectedCharacteristicsAddForm.value.nationalityId==""){
                                      this.protectedCharacteristicsAddForm.value.secondNationalityId=""
                    }
                this.protectedCharacteristicsService.updateProtectedCharacteristics(this.protectedCharacteristics.profileId, this.protectedCharacteristicsAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ProtectedCharacteristicsConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ProtectedCharacteristicsConstants.featureId, field, this.action);
    }
    initForm() {
        this.protectedCharacteristicsAddForm = this._fb.group({
            profileId: [this.protectedCharacteristicsId],
            immigrationNumber: [this.protectedCharacteristics.immigrationNumber, Validators.compose([ Validators.maxLength(20)] )],
            ethnicityId: [this.protectedCharacteristics.ethnicityId, Validators.compose([, , ,])],
            nationalityId: [this.protectedCharacteristics.nationalityId, Validators.compose([, , ,])],
            secondNationalityId: [this.protectedCharacteristics.secondNationalityId, Validators.compose([, , ,])],
            languageId: [this.protectedCharacteristics.languageId, Validators.compose([, , ,])],
            interpreterRequiredYesNoId: [this.protectedCharacteristics.interpreterRequiredYesNoId],
            immigrationStatusId: [this.protectedCharacteristics.immigrationStatusId, Validators.compose([, , ,])],
            religionId: [this.protectedCharacteristics.religionId, Validators.compose([, , ,])],
            equalityMonitoringNote: [this.protectedCharacteristics.equalityMonitoringNote, Validators.compose([, , ,])],

            allowSmsYesNoId: [this.protectedCharacteristics.allowSmsYesNoId],
            dateDied: [this.protectedCharacteristics.dateDied],
            dateOfBirth: [this.protectedCharacteristics.dateOfBirth],
            emailAddress: [this.protectedCharacteristics.emailAddress],
            eventCount: [this.protectedCharacteristics.eventCount],
            exclusionMessage: [this.protectedCharacteristics.exclusionMessage],
            exclusionsExistYesNoId: [this.protectedCharacteristics.exclusionsExistYesNoId],
            familyName: [this.protectedCharacteristics.familyName],
            fileName: [this.protectedCharacteristics.fileName],
            firstName: [this.protectedCharacteristics.firstName],
            genderId: [this.protectedCharacteristics.genderId],
            mobileNumber: [this.protectedCharacteristics.mobileNumber],

            note: [this.protectedCharacteristics.note],
            offenderManagerProviderId: [this.protectedCharacteristics.offenderManagerProviderId],
            offenderManagerResponsibleOfficer: [this.protectedCharacteristics.offenderManagerResponsibleOfficer],
            offenderManagerResponsibleTeam: [this.protectedCharacteristics.offenderManagerResponsibleTeam],
            previousName: [this.protectedCharacteristics.previousName],

            remandStatus: [this.protectedCharacteristics.remandStatus],
            restrictionMessage: [this.protectedCharacteristics.restrictionMessage],
            restrictionsExistYesNoId: [this.protectedCharacteristics.restrictionsExistYesNoId],
            secondName: [this.protectedCharacteristics.secondName],

            sexualOrientationId: [this.protectedCharacteristics.sexualOrientationId],
            //offenderDetailId: [this.protectedCharacteristics.offenderDetailId],
            telephoneNumber: [this.protectedCharacteristics.telephoneNumber],
            terminatedEventCount: [this.protectedCharacteristics.terminatedEventCount],
            thirdName: [this.protectedCharacteristics.thirdName],
            tierId: [this.protectedCharacteristics.tierId],
            titleId: [this.protectedCharacteristics.titleId],
            transGenderDiscloseConsentYesNoId: [this.protectedCharacteristics.transGenderDiscloseConsentYesNoId],
            transGenderProcessId: [this.protectedCharacteristics.transGenderProcessId],
            //transferPendingYesNoId: [1],

            croNumber: [this.protectedCharacteristics.croNumber],

            niNumber: [this.protectedCharacteristics.niNumber],
            nomsNumber: [this.protectedCharacteristics.nomsNumber],
            pncNumber: [this.protectedCharacteristics.pncNumber],
            caseReferenceNumber: [this.protectedCharacteristics.caseReferenceNumber],

            caseReviewDate: [this.protectedCharacteristics.caseReviewDate],
            suitableGroupWorkYesNoId: [this.protectedCharacteristics.suitableGroupWorkYesNoId],
            privateYesNoId: [this.protectedCharacteristics.privateYesNoId],
            reallocationDate: [this.protectedCharacteristics.reallocationDate],
            dateReleaseFromCustody: [this.protectedCharacteristics.dateReleaseFromCustody],
            dateReturnedToCustody: [this.protectedCharacteristics.dateReturnedToCustody],
            referralDate: [this.protectedCharacteristics.referralDate],
            dependantsId: [this.protectedCharacteristics.dependantsId],
            domicileId: [this.protectedCharacteristics.domicileId],
            officerId: [this.protectedCharacteristics.caseManagerId],
            preferredCommunicationMethodId: [this.protectedCharacteristics.preferredCommunicationMethodId],
            providerId: [this.protectedCharacteristics.providerId],
            reviewingOfficerProviderId: [this.protectedCharacteristics.reviewingOfficerProviderId],
            reviewingOfficerTeamId: [this.protectedCharacteristics.reviewingOfficerTeamId],
            serviceUserStateId: [this.protectedCharacteristics.serviceUserStateId],
            serviceUserTypeId: [this.protectedCharacteristics.serviceUserTypeId],
            statusId: [this.protectedCharacteristics.statusId],
            teamId: [this.protectedCharacteristics.teamId],
            spgVersion: [this.protectedCharacteristics.spgVersion],
            spgUpdateUser: [this.protectedCharacteristics.spgUpdateUser],
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
            this.protectedCharacteristicsAddForm.controls[fieldName].setValidators(Validators.required);
            return true;
        }
    }
     updateNsrd(nsrdData) {
        if (!(typeof nsrdData == "undefined")) {
      
                   nsrdData.forEach((element: any) => {
                       this.nsrdData[element.fieldName] = {};
                       let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), "fieldName", element.fieldName);
                       if (element.active) {
                           this.nsrdData[element.fieldName].active = element.active;
                           this.protectedCharacteristicsAddForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
                           if (element.mandatory) {
                               this.nsrdData[element.fieldName].mandatory = element.mandatory;
                               currentControl.validators.push(Validators.required);
                               this.protectedCharacteristicsAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                           } else {
                               this.protectedCharacteristicsAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                           }
                       } else {
                           this.protectedCharacteristicsAddForm.removeControl(element.fieldName);
                       }


                       if (element.active) {
                           this.protectedCharacteristicsAddForm.controls[element.fieldName].updateValueAndValidity();
                       }
                   });
      
      }
   }

   getNSRDFormObj() {
        let formObjArray: any[] = [];
        let transGenderDiscloseConsentYesNoId: any = {};
        transGenderDiscloseConsentYesNoId.fieldName = "transGenderDiscloseConsentYesNoId";
        transGenderDiscloseConsentYesNoId.field = { value: '' };
        transGenderDiscloseConsentYesNoId.validators = [],
        formObjArray.push(transGenderDiscloseConsentYesNoId);
        return formObjArray;
    }
}

