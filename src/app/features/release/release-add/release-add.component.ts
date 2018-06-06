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
import { ReleaseService } from '../release.service';
import { ReleaseConstants } from '../release.constants';
import { Release } from '../release';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-release-edit',
    templateUrl: 'release-add.component.html'
})
export class ReleaseAddComponent implements OnInit {

    private subscription: Subscription;
    private releaseId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    releaseAddForm: FormGroup;
    private release: Release = new Release();
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private releaseService: ReleaseService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('eventId')) {
                this.release.eventId = params['eventId'];
            }
            if (!params.hasOwnProperty('releaseId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Release");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit Release");
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(ReleaseConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ReleaseConstants.featureId, ReleaseConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(ReleaseConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(ReleaseConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ReleaseConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ReleaseConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('releaseId')) {
                        this.releaseId = params['releaseId'];
                        this.releaseService.getRelease(this.releaseId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.releaseAddForm.patchValue(data);
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
    }
    navigateTo(url) {
        if (this.releaseAddForm.touched) {
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
        if (this.releaseAddForm.valid) {
			this.releaseAddForm.patchValue(Utility.escapeHtmlTags(this.releaseAddForm.value));
            let release: Release = new Release();
            this.route.params.subscribe((params: any) => {
                if (params.hasOwnProperty('eventId')) {
                    release.eventId = params['eventId'];
                }
            });
            if (this.releaseId != null) {
                this.releaseService.updateRelease(this.releaseId, this.releaseAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });

                });
            } else {
                this.confirmService.confirm(
                    {
                        message: 'You are about to release service user. Add Licence Condition/s',
                        header: 'Confirm',
                        accept: () => {
                            this.releaseService.addRelease(this.releaseAddForm.value).subscribe((response: any) => {
                                this.router.navigate(['../../../', 'event-details', 'licence-condition', 'new'], { relativeTo: this.route });
                            });
                        }
                    });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ReleaseConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ReleaseConstants.featureId, field, this.action);
    }
    initForm() {
        this.releaseAddForm = this._fb.group({
            eventId: [this.release.eventId, Validators.compose([Validators.required, , ,])],
            releaseDate: [this.release.releaseDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            releaseTypeId: [this.release.releaseTypeId, Validators.compose([Validators.required, , ,])],
        });
    }
}

