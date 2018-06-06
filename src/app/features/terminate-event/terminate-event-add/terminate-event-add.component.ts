import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { TerminateEventService } from '../terminate-event.service';
import { TerminateEventConstants } from '../terminate-event.constants';
import { TerminateEvent } from '../terminate-event';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { Utility } from "../../../shared/utility";
import { EventService } from '../../event/event.service';

@Component({
    selector: 'tr-terminate-event-add',
    templateUrl: 'terminate-event-add.component.html'
})
export class TerminateEventAddComponent implements OnInit {

    private subscription: Subscription;
    private terminateEventId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    terminateEventAddForm: FormGroup;
    private terminateEvent: TerminateEvent = new TerminateEvent();
    private action;
    private orderTypeDisposalTypeId: any;
    private childParentAnswers: any = [];
    private childAnswers: any = [];
    private isLocked;
    private terminated = false;
    private terminationReasonList = [];
    private previousNotes: string = "";
    private responsePcLength: number;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private terminateEventService: TerminateEventService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private eventService:EventService) { }

    ngOnInit() {

        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('eventId')) {
                this.terminateEvent.eventId = params['eventId'];
            }
        });

        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('terminateEventId')) {
                this.action = "Create";
            }
        });

        this.authorizationService.getAuthorizationData(TerminateEventConstants.featureId, TerminateEventConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(TerminateEventConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(TerminateEventConstants.featureId, authorizationData[1]);
            }
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TerminateEventConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('eventId')) {
                        this.terminateEventId = params['eventId'];
                            this.eventService.getDisposalByEventId(this.terminateEventId).subscribe(data=>{
                            this.terminateEvent.orderTypeDisposalTypeId=data.orderTypeDisposalTypeId;
                                if(this.terminateEvent.orderTypeDisposalTypeId!=null){
                                    this.terminateEventAddForm.patchValue(this.terminateEvent);
                                    this.listService.getDependentAnswers(421, this.terminateEvent.orderTypeDisposalTypeId).subscribe((childParentAnswers: any) => {
                                        this.childParentAnswers  = childParentAnswers;
                                    });

                               }
                     

                            })
                        this.terminateEventService.sortFilterAndPaginate({ eventId: this.terminateEventId }, null, null).subscribe((data: any) => {
                            if (data.content.length > 0) {
                                if (data.content[0].locked == false) {
                                    this.previousNotes = data.notes;
                                    data.notes = "";
                                    this.isLocked = false;
                                } else {
                                    this.isLocked = true;
                                }
                            }
                            if (data.content.length > 0 && data.content[0].terminationReasonId != null) {
                                this.terminated = true;
                                
                                this.terminateEventAddForm.patchValue(data.content[0]);
                                this.terminateEventAddForm.controls['terminationDate'].disable();
                                this.terminateEventAddForm.controls['terminationReasonId'].disable();
                                this.terminateEventAddForm.controls['notes'].disable();
                            }
                        });
                    }
                })
            } else {
                // this.headerService.setAlertPopup("Not authorized");
            }
        });
    }
    navigateTo(url) {
        if (this.terminateEventAddForm.touched) {
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
        if (this.terminateEventAddForm.valid) {

            let profileId = this.route.snapshot.params['profileId'];
            this.terminateEventService.isAuthorize(profileId, "Update").subscribe((response: any) => {
                if (response) {

                this.terminateEventAddForm.patchValue(Utility.escapeHtmlTags(this.terminateEventAddForm.value));
                this.confirmService.confirm(
                    {
                        message: 'You are about to terminate this Event. Do you wish to continue?',
                        header: 'Confirm',
                        accept: () => {
                            this.terminateEventService.getAllTerminated(this.terminateEvent.eventId).subscribe((response: any) => {
                                if (response != null && response.hasOwnProperty('LIC')) {
                                    this.confirmService.confirm(
                                        {
                                            message: 'Unable to terminate this Event. Please terminate any active Licence Condition records first',
                                            header: 'Confirm',
                                            accept: () => {
                                                this.terminateEventAddForm.reset();
                                            }
                                        });
                                } else if (response.hasOwnProperty('PSS')) {
                                     this.confirmService.confirm(
                                        {
                                            message: 'Unable to terminate this Event. Please terminate any active PSS Requirement records first',
                                            header: 'Confirm',
                                            accept: () => {
                                                this.terminateEventAddForm.reset();
                                            }
                                        });
                                } else if (response.hasOwnProperty('REQ')) {
                                     this.confirmService.confirm(
                                        {
                                            message: 'Unable to terminate this Event. Please terminate any active Community Requirement records first',
                                            header: 'Confirm',
                                            accept: () => {
                                                this.terminateEventAddForm.reset();
                                            }
                                        });
                                } else if (response.hasOwnProperty('NSI')) {
                                     this.confirmService.confirm(
                                        {
                                            message: 'Unable to terminate this Event. Please terminate any active Process Contact records first',
                                            header: 'Confirm',
                                            accept: () => {
                                                this.terminateEventAddForm.reset();
                                            }
                                        });
                                } else if (response.hasOwnProperty('RATECARD')) {
                                     this.confirmService.confirm(
                                        {
                                            message: 'Unable to terminate this Event. Please terminate any active  Components first.',
                                            header: 'Confirm',
                                            accept: () => {
                                                this.terminateEventAddForm.reset();
                                            }
                                        });
                                } else if (response.hasOwnProperty('COURTREPORT')) {
                                     this.confirmService.confirm(
                                        {
                                            message: 'Unable to terminate this Event. Please terminate any active Court Report records first.',
                                            header: 'Confirm',
                                            accept: () => {
                                                this.terminateEventAddForm.reset();
                                            }
                                        });
                                } else {
                                    this.terminateEventAddForm.value.eventId = this.terminateEventId;
                                    this.terminateEventService.getSpgVersion(this.terminateEventId).subscribe((data: any) => {
                                        this.terminateEventAddForm.value.spgVersion = data._body;

                                        this.terminateEventService.terminateEvent(this.terminateEventId, this.terminateEventAddForm.value).subscribe((response: any) => {
                                            this.router.navigate(['../../'], { relativeTo: this.route });
                                        });
                                    });
                                }
                            });
                        }
                    });

                }
                else {
                    this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
                }
            });




        }
    }

    isEventLocked() {
        if (this.isLocked)
            return true;
    }

    isFeildAuthorized(field) {
        return true;
    }
    initForm() {
        this.terminateEventAddForm = this._fb.group({
            eventId: [this.terminateEvent.eventId, Validators.compose([, , ,])],
            spgVersion: [this.terminateEvent.spgVersion, Validators.compose([, , Validators.maxLength(32),])],
            spgUpdateUser: [this.terminateEvent.spgUpdateUser, Validators.compose([, , Validators.maxLength(72),])],
            terminateUser: [this.terminateEvent.terminateUser, Validators.compose([, , Validators.maxLength(60),])],
            terminationDateTime: [this.terminateEvent.terminationDateTime, Validators.compose([, ValidationService.dateValidator, ,])],
            locked: [this.terminateEvent.locked,],
            terminationDate: [this.terminateEvent.terminationDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            terminationReasonId: [this.terminateEvent.terminationReasonId, Validators.compose([Validators.required, , ,])],
            notes: [this.terminateEvent.notes, Validators.compose([, , Validators.maxLength(45),])],
        });
    }
}

