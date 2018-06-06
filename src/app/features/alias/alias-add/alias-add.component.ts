import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AliasService } from '../alias.service';
import { AliasConstants } from '../alias.constants';
import { Alias } from '../alias';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { OffenderProfileService } from "../../offenderprofile/offenderprofile.service";
import { Utility } from "../../../shared/utility";
import { Title } from "@angular/platform-browser";
@Component({
    selector: 'tr-alias-edit',
    templateUrl: 'alias-add.component.html'
})
export class AliasAddComponent implements OnInit {

    private subscription: Subscription;
    private aliasId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    aliasAddForm: FormGroup;
    private alias: Alias = new Alias();
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private aliasService: AliasService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private offenderProfileService: OffenderProfileService,
        private _titleService: Title) { }

    ngOnInit() {

        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.alias.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('aliasId')) {
                this.action = "Create";
                this._titleService.setTitle('Add Alias');
            } else {
                this.action = "Update";
                this._titleService.setTitle('Edit Alias');
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(AliasConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AliasConstants.featureId, AliasConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(AliasConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(AliasConstants.featureId, authorizationData[1]);
            }
            this.initForm();
            this.aliasService.isAuthorize(this.alias.profileId, this.action).subscribe((response: any) => {
                this.authorizedFlag = response;
                if (response) {
                    this.initForm();
                    this.subscription = this.route.params.subscribe((params: any) => {
                        if (params.hasOwnProperty('aliasId')) {
                            this.aliasId = params['aliasId'];
                            this.aliasService.getAlias(this.aliasId).subscribe((data: any) => {
                                if (data.locked == "false") {
                                    this.aliasAddForm.patchValue(data);
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

            // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AliasConstants.featureId, this.action);
            // if (this.authorizedFlag) {
            //     this.initForm();
            //     this.subscription = this.route.params.subscribe((params: any) => {
            //         if (params.hasOwnProperty('aliasId')) {
            //             this.aliasId = params['aliasId'];
            //             this.aliasService.getAlias(this.aliasId).subscribe((data: any) => {
            //                 if (data.locked == "false") {
            //                     this.aliasAddForm.patchValue(data);
            //                 }
            //                 else {
            //                     this.headerService.setAlertPopup("The record is locked");

            //                 }
            //             });
            //         }
            //     })
            // } else {
            //     this.headerService.setAlertPopup("Not authorized");
            // }
        });
    }
    navigateTo(url) {
        if (this.aliasAddForm.touched) {
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
        if (this.aliasAddForm.valid) {
            this.aliasAddForm.patchValue(Utility.escapeHtmlTags(this.aliasAddForm.value));
            if (this.aliasAddForm.value.dateOfBirth == null || Utility.removeSpaces(this.aliasAddForm.value.dateOfBirth) == '') {
                this.offenderProfileService.getOffenderProfileByProfileId(this.alias.profileId).subscribe(offenderDetails => {
                    this.aliasAddForm.value.dateOfBirth = offenderDetails.dateOfBirth;
                    if (this.aliasId != null) {
                        this.aliasService.updateAlias(this.aliasId, this.aliasAddForm.value).subscribe((response: any) => {
                            this.router.navigate(['../../..'], { relativeTo: this.route });
                        });
                    } else {
                        this.aliasService.addAlias(this.aliasAddForm.value).subscribe((response: any) => {
                            this.router.navigate(['../..'], { relativeTo: this.route });
                        });
                    }
                });
            } else {
                if (this.aliasId != null) {
                    this.aliasService.updateAlias(this.aliasId, this.aliasAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../../..'], { relativeTo: this.route });
                    });
                } else {
                    this.aliasService.addAlias(this.aliasAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../..'], { relativeTo: this.route });
                    });
                }
            }

        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(AliasConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(AliasConstants.featureId, field, this.action);
    }
    initForm() {
        this.aliasAddForm = this._fb.group({
            aliasId: [this.alias.aliasId],
            profileId: [this.alias.profileId, Validators.compose([Validators.required, , ,])],
            spgVersion: [this.alias.spgVersion],
            spgUpdateUser: [this.alias.spgUpdateUser],
            firstName: [this.alias.firstName, Validators.compose([Validators.required, Validators.maxLength(35),])],
            secondName: [this.alias.secondName, Validators.compose([, , Validators.maxLength(35),])],
            thirdName: [this.alias.thirdName, Validators.compose([, , Validators.maxLength(35),])],
            familyName: [this.alias.familyName, Validators.compose([Validators.required, , Validators.maxLength(35),])],
            dateOfBirth: [this.alias.dateOfBirth, Validators.compose([ValidationService.dateValidator, ,])],
            genderId: [this.alias.genderId, Validators.compose([Validators.required, , ,])],
            spgAliasId: ['0']
        });
    }
}
