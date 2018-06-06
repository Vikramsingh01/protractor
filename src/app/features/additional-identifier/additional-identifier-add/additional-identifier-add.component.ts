import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AdditionalIdentifierService } from '../additional-identifier.service';
import { AdditionalIdentifierConstants } from '../additional-identifier.constants';
import { AdditionalIdentifier } from '../additional-identifier';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import {Title} from "@angular/platform-browser";
import { Utility } from '../../../shared/utility';
@Component({
    selector: 'tr-additional-identifier-edit',
    templateUrl: 'additional-identifier-add.component.html'
})
export class AdditionalIdentifierAddComponent implements OnInit {

    private subscription: Subscription;
    private additionalIdentifierId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    additionalIdentifierAddForm: FormGroup;
    private additionalIdentifier: AdditionalIdentifier = new AdditionalIdentifier();
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private additionalIdentifierService: AdditionalIdentifierService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private _titleService: Title) { }

    ngOnInit() {
            
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('additionalIdentifierId')) {
                this.action = "Create";
                this._titleService.setTitle('Add Additional Identifier');
            }else{
                this.action = "Update";
                this._titleService.setTitle('Edit Additional Identifier');
            }
        });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        this.additionalIdentifier.profileId = params['profileId'];
      }
    });
       
        //this.authorizationService.getAuthorizationDataByTableId(AdditionalIdentifierConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AdditionalIdentifierConstants.featureId, AdditionalIdentifierConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AdditionalIdentifierConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AdditionalIdentifierConstants.featureId, authorizationData[1]);
      }

      this.initForm();
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, this.action, this.authorizationData);
            this.additionalIdentifierService.isAuthorize(this.additionalIdentifier.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (response) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('additionalIdentifierId')) {
                        this.additionalIdentifierId = params['additionalIdentifierId'];
                        this.additionalIdentifierService.getAdditionalIdentifier(this.additionalIdentifierId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.additionalIdentifierAddForm.patchValue(data);
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


        // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdditionalIdentifierConstants.featureId, this.action);
        //     if (this.authorizedFlag) {
        //         this.initForm();
        //         this.subscription = this.route.params.subscribe((params: any) => {
        //             if (params.hasOwnProperty('additionalIdentifierId')) {
        //                 this.additionalIdentifierId = params['additionalIdentifierId'];
        //                 this.additionalIdentifierService.getAdditionalIdentifier(this.additionalIdentifierId).subscribe((data: any) => {
        //                     if(data.locked == "false"){
        //                         this.additionalIdentifierAddForm.patchValue(data);
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
    }
    navigateTo(url) {
        if (this.additionalIdentifierAddForm.touched) {
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
        if (this.additionalIdentifierAddForm.valid) {
                       this.additionalIdentifierAddForm.patchValue(Utility.escapeHtmlTags(this.additionalIdentifierAddForm.value));
            if (this.additionalIdentifierId != null) {
                this.additionalIdentifierService.updateAdditionalIdentifier(this.additionalIdentifierId, this.additionalIdentifierAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.additionalIdentifierService.addAdditionalIdentifier(this.additionalIdentifierAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(AdditionalIdentifierConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(AdditionalIdentifierConstants.featureId, field, this.action);
    }
    initForm() {
        this.additionalIdentifierAddForm = this._fb.group({
                        additionalIdentifierId:[ this.additionalIdentifier.additionalIdentifierId  ],
                        profileId:[ this.additionalIdentifier.profileId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgVersion:[ this.additionalIdentifier.spgVersion  ],
                        spgUpdateUser:[ this.additionalIdentifier.spgUpdateUser],
                        spgAdditionalIdentifierId:[ '0' ,  Validators.compose([ Validators.required , , , ]) ],
                       
                        identifierTypeId:[ this.additionalIdentifier.identifierTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        identifier:[ this.additionalIdentifier.identifier ,  Validators.compose([ Validators.required , ,  Validators.maxLength(30) , ]) ],
                    });
    }
}

