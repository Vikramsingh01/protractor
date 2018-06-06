import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { TerminateRequirementService } from '../terminate-requirement.service';
import { TerminateRequirementConstants } from '../terminate-requirement.constants';
import { TerminateRequirement } from '../terminate-requirement';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { CommunityRequirementService } from '../../community-requirement/community-requirement.service';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-terminate-requirement-add',
    templateUrl: 'terminate-requirement-add.component.html'
})
export class TerminateRequirementAddComponent implements OnInit {

    private subscription: Subscription;
    private terminateRequirementId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    terminateRequirementAddForm: FormGroup;
    private terminateRequirement: TerminateRequirement = new TerminateRequirement();
    private action;
    private locked;
    private isCommReqTerminatedFlag: boolean = false;
    private terminated = false;
    private terminationReasonList = [];
    private nsrdData: any = [];
    private childAnswers: any = [];
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private terminateRequirementService: TerminateRequirementService,
        private communityRequirementService: CommunityRequirementService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService) { }

    ngOnInit() {

        this.route.params.subscribe((params: any) => {
            // if (!params.hasOwnProperty('terminateRequirementId')) {
            //     this.action = "Create";
            // }else{
            this.action = "Update";
            // }
        });

        //this.authorizationService.getAuthorizationDataByTableId(TerminateRequirementConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(TerminateRequirementConstants.featureId, TerminateRequirementConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(TerminateRequirementConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(TerminateRequirementConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(TerminateRequirementConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TerminateRequirementConstants.featureId, this.action);
            if (this.authorizedFlag) {

                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('communityRequirementId')) {
                        this.terminateRequirementId = params['communityRequirementId'];

                        this.initForm();
                        this.communityRequirementService.getCommunityRequirement(this.terminateRequirementId).subscribe(communityRequirement => {
                            this.listService.getDependentAnswers(215, communityRequirement.requirementTypeMainCategoryId).subscribe((childAnswers: any) => {
                                this.terminationReasonList = childAnswers[217];
                            })
                            this.terminateRequirementService.terminateRequirementCRD(communityRequirement).subscribe(nsrdData => {
                                //console.log(nsrdData);
                                this.updateNsrd(nsrdData.resultMap.fieldObjectList);



                            })
                        })
                        this.terminateRequirementService.getTerminateRequirement(this.terminateRequirementId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.locked = false;
                            }
                            else {
                                this.locked = true;
                            }
                            if (data.terminationReasonId != null) {
                                this.terminated = true;
                                this.isCommReqTerminatedFlag = true;
                                this.terminateRequirementAddForm.patchValue(data);
                                this.terminateRequirementAddForm.controls['actualEndDate'].disable();
                                this.terminateRequirementAddForm.controls['attendanceCount'].disable();
                                this.terminateRequirementAddForm.controls['terminationReasonId'].disable();

                            }
                        });
                    }
                })
            }
        });
    }
    updateNsrd(nsrdData) {
        nsrdData.forEach((element: any) => {
            this.nsrdData[element.fieldName] = {};
            this.nsrdData[element.fieldName].active = element.active;
            this.nsrdData[element.fieldName].mandatory = element.mandatory;
            if (element.mandatory) {
                this.terminateRequirementAddForm.controls[element.fieldName].setValidators([Validators.required, ValidationService.NumberValidator]);
            } else {
                this.terminateRequirementAddForm.controls[element.fieldName].setValidators(null);
            }
            this.terminateRequirementAddForm.controls[element.fieldName].updateValueAndValidity();
        });

    }
    navigateTo(url) {
        if (this.terminateRequirementAddForm.touched) {
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


    updateAnswers(childAnswers) {
        this.childAnswers = childAnswers;
    }

    onSubmit() {
        if (this.terminateRequirementAddForm.valid) {
            let communityRequirementId = this.route.snapshot.params['communityRequirementId'];
            this.terminateRequirementService.isAuthorize(communityRequirementId, this.action).subscribe((response: any) => {
                if (response) {
                    if (this.terminated) {

                        this.confirmService.confirm(
                            {
                                message: 'Do you wish to unterminate this Requirement?',
                                header: 'Confirm',
                                accept: () => {
                                    this.terminateRequirementService.unTerminateRequirement(this.terminateRequirementId,this.terminateRequirementAddForm.value).subscribe((response: any) => {
                                    this.router.navigate(['../../'], {relativeTo: this.route});
                                    });
                                    // alert("Unterminated..");
                                }
                            });

                    } else {
                        this.terminateRequirementAddForm.patchValue(Utility.escapeHtmlTags(this.terminateRequirementAddForm.value));
                        this.confirmService.confirm(
                            {
                                message: 'You are about to terminate this Requirement. Do you wish to continue?',
                                header: 'Confirm',
                                accept: () => {
                                    this.terminateRequirementService.terminateRequirement(this.terminateRequirementId, this.terminateRequirementAddForm.value).subscribe((response: any) => {
                                        this.router.navigate(['../../'], { relativeTo: this.route });
                                    });
                                    // alert("Terminated..");
                                }
                            });
                    }
                }
                else{
                      this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
                }
            });



        }
        //
        //     if (this.terminateRequirementId != null) {
        //         this.terminateRequirementService.updateTerminateRequirement(this.terminateRequirementId, this.terminateRequirementAddForm.value).subscribe((response: any) => {
        //             this.router.navigate(['../../..'], {relativeTo: this.route});
        //         });
        //     } else {
        //         this.terminateRequirementService.addTerminateRequirement(this.terminateRequirementAddForm.value).subscribe((response: any) => {
        //             this.router.navigate(['../..'], {relativeTo: this.route});
        //         });
        //     }
        // }
        // else {
        //     //alert("Invalid Form");
        // }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(TerminateRequirementConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(TerminateRequirementConstants.featureId, field, this.action);
    }
    initForm() {
        this.terminateRequirementAddForm = this._fb.group({
            actualEndDate: [this.terminateRequirement.actualEndDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            terminationReasonId: [this.terminateRequirement.terminationReasonId, Validators.compose([Validators.required, , ,])],
            attendanceCount: [this.terminateRequirement.attendanceCount, Validators.compose([Validators.required, ,])],
            note: [this.terminateRequirement.note, Validators.compose([, , ,])],
        });
    }
}

