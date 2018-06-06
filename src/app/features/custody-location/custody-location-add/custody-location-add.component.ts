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
import { CustodyLocationService } from '../custody-location.service';
import { CustodyLocationConstants } from '../custody-location.constants';
import { CustodyLocation } from '../custody-location';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { EventService } from '../../../features/event/event.service';
import { Event } from '../../../features/event/event';
import { Utility } from "../../../shared/utility";

@Component({
    selector: 'tr-custody-location-edit',
    templateUrl: 'custody-location-add.component.html'
})
export class CustodyLocationAddComponent implements OnInit {

    private subscription: Subscription;
    private custodyLocationId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    custodyLocationAddForm: FormGroup;
    private custodyLocation: CustodyLocation = new CustodyLocation();
    private action;
    event: Event = new Event();
    private eventId: number;
    // private currentStatus : any;
    private currentStatus: any;
    private statusDate: any;

    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private custodyLocationService: CustodyLocationService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title,
        private eventService: EventService
    ) { }
    // ) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('custodyLocationId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Location");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit Location");
                this.eventId = params['eventId'];

            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(CustodyLocationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CustodyLocationConstants.featureId, CustodyLocationConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(CustodyLocationConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(CustodyLocationConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyLocationConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyLocationConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('custodyLocationId')) {
                        this.custodyLocationId = params['custodyLocationId'];
                        this.custodyLocationService.getCustodyLocation(this.custodyLocationId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                data.locationStartDate = Utility.convertDateToString(new Date());
                                this.custodyLocationAddForm.patchValue(data);
                                this.custodyLocationService.getCurrentStatusByEventId(this.eventId).subscribe(data => {
                                    this.currentStatus = data.currentStatus;
                                })
                                this.custodyLocationService.getCurrentStatusByEventId(this.eventId).subscribe(data => {
                                    this.currentStatus = data.currentStatus;
                                })
                                this.custodyLocationService.getStatusDateByEventId(this.eventId).subscribe(data => {
                                    this.statusDate = data.statusDate;
                                })
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
        if (this.custodyLocationAddForm.touched) {
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
        if (this.custodyLocationAddForm.valid) {
            this.custodyLocationAddForm.patchValue(Utility.escapeHtmlTags(this.custodyLocationAddForm.value));
            if (this.custodyLocationId != null) {
                //             this.custodyLocationAddForm.value.currentLocationId =  this.custodyLocationAddForm.controls['currentLocationId'].value;
                //   this.custodyLocationAddForm.value.locationStartDate =  this.custodyLocationAddForm.controls['locationStartDate'].value;
                // console.log(this.custodyLocationAddForm.controls['locationStartDate'].value);
                this.custodyLocationService.updateCustodyLocation(this.custodyLocationId, this.custodyLocationAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                });
            } else {
                this.custodyLocationService.addCustodyLocation(this.custodyLocationAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CustodyLocationConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CustodyLocationConstants.featureId, field, this.action);
    }
    initForm() {
        this.custodyLocationAddForm = this._fb.group({
            custodyLocationId: [this.custodyLocation.custodyLocationId],
            eventId: [this.custodyLocation.eventId],
            // spgVersion:[ this.custodyLocation.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
            // spgUpdateUser:[ this.custodyLocation.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
            currentLocationId: [this.custodyLocation.currentLocationId, Validators.compose([, , ,])],
            locationStartDate: [this.custodyLocation.locationStartDate, Validators.compose([Validators.required, ValidationService.dateValidator,])],
            prisonerNumber: [this.custodyLocation.prisonerNumber, Validators.compose([, , Validators.maxLength(10),])],
            paroleNumber: [this.custodyLocation.paroleNumber],
            probationContact: [this.custodyLocation.probationContact, Validators.compose([, , Validators.maxLength(200),])],
            pcTelephoneNumber: [this.custodyLocation.pcTelephoneNumber, Validators.compose([, , Validators.maxLength(35),])],
            prisonOfficer: [this.custodyLocation.prisonOfficer, Validators.compose([, , Validators.maxLength(200),])],
            poTelephoneNumber: [this.custodyLocation.poTelephoneNumber, Validators.compose([, , Validators.maxLength(35),])],
           
        });
    }
}

