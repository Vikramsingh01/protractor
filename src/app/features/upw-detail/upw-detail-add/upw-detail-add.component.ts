import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwDetailService } from '../upw-detail.service';
import { UpwDetailConstants } from '../upw-detail.constants';
import { UpwDetail } from '../upw-detail';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { UpwAdjustmentService } from '../../upw-adjustment/upw-adjustment.service';
import { Utility } from '../../../shared/utility';
import { Observable } from 'rxjs/Observable';
import { UpwAppointmentService } from "../../upw-appointment/upw-appointment.service";
import { CommunityRequirementService } from "../../community-requirement/community-requirement.service";
import { EventService } from '../../event/event.service';

@Component({
    selector: 'tr-upw-detail-edit',
    templateUrl: 'upw-detail-add.component.html'
})
export class UpwDetailAddComponent implements OnInit {

    private subscription: Subscription;
    private upwDetailId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    upwDetailAddForm: FormGroup;
    private upwDetail: UpwDetail = new UpwDetail();
    private action;
    private previousNotes = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private upwDetailService: UpwDetailService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private upwAdjustmentService: UpwAdjustmentService,
        private upwAppointmentService: UpwAppointmentService,
        private communityRequirementService: CommunityRequirementService,
        private eventService: EventService,
        private headerService: HeaderService,
        private listService: ListService) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('upwDetailId')) {
                this.action = "Create";
            } else {
                this.action = "Update";
            }
        });

        this.authorizationService.getAuthorizationData(UpwDetailConstants.featureId, UpwDetailConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(UpwDetailConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(UpwDetailConstants.featureId, authorizationData[1]);
            }
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwDetailConstants.featureId, this.action);
            this.authorizedFlag = true;
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('upwDetailId')) {
                        this.upwDetailId = params['upwDetailId'];
                        this.upwDetailService.getUpwDetail(this.upwDetailId).subscribe((data: any) => {
                            if (data.locked == "false") {                                
                                let obj: any = {};
                                this.route.params.subscribe((params: any) => {
                                    if (params.hasOwnProperty('profileId')) {
                                        obj.profileId = params['profileId'];
                                    }
                                });
                                obj.eventId = data.eventId;
                                let observables: Observable<any>[] = [];
                                observables.push(this.communityRequirementService.getTotalHoursOrderedByEventId(obj));
                                observables.push(this.upwAppointmentService.getTotalHoursWorkedByEventId(obj));
                                observables.push(this.upwAdjustmentService.sortFilterAndPaginate({ eventId: data.eventId }, null, null));
                                observables.push(this.eventService.getEvent(data.eventId));
                                Observable.forkJoin(observables).subscribe(dataForUpw => {
                                    data.totalHoursOrdered = dataForUpw[0].totalHoursOrdered;
                                    data.totalHoursWorked = Utility.convertMinutesToHours(dataForUpw[1].totalHoursWorked);
                                    let dataUpwAdjustment: any[] = dataForUpw[2].content;

                                    let totalAdjustment = 0;
                                    dataUpwAdjustment.forEach((upwAdjustmentData, index) => {
                                        if (upwAdjustmentData.adjustmentType == 'POSITIVE') {
                                            totalAdjustment = totalAdjustment + upwAdjustmentData.adjustmentAmount;
                                        } else if (upwAdjustmentData.adjustmentType == 'NEGATIVE') {
                                            totalAdjustment = totalAdjustment - upwAdjustmentData.adjustmentAmount;
                                        }
                                    });
                                    data.totalAdjustment = Utility.convertMinutesToHours(totalAdjustment);
                                    data.totalHoursLeft = Utility.convertMinutesToHours(dataForUpw[0].totalHoursOrdered * 60 + totalAdjustment - dataForUpw[1].totalHoursWorked);
                                    //data.eventNumber = dataForUpw[3].eventNumber;
                                    data.eventNumber = dataForUpw[3].eventNumber + " - " + this.listService.getLabelByTableIdAndPkId(421, dataForUpw[3].orderTypeDisposalTypeId);
                                    this.previousNotes = data.note;
                                    data.note = "";
                                    this.upwDetailAddForm.patchValue(data);
                                
                                });

                                
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
        if (this.upwDetailAddForm.touched) {
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
        if (this.upwDetailAddForm.valid) {
			this.upwDetailAddForm.patchValue(Utility.escapeHtmlTags(this.upwDetailAddForm.value));
            if (this.upwDetailId != null) {
                this.upwDetailService.updateUpwDetail(this.upwDetailId, this.upwDetailAddForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                });
            } else {
                this.upwDetailService.addUpwDetail(this.upwDetailAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
    }

    isFeildAuthorized(field) {
        return this.authorizationService.isFeildAuthorized(UpwDetailConstants.featureId, field, this.action);
    }
    initForm() {
        this.upwDetailAddForm = this._fb.group({
            note: [this.upwDetail.note, Validators.compose([, , ,])],
            upwDetailId: [this.upwDetail.upwDetailId, Validators.compose([])],
            eventId: [{ disabled: true }, Validators.compose([, , ,])],
            upwLengthInMinutes: [this.upwDetail.upwLengthInMinutes, Validators.compose([, , ,])],
            agreedTravelFare: [this.upwDetail.agreedTravelFare, Validators.compose([ValidationService.DecimalNumberValidator, , ,])],
            spgUpwDetailId: ['0'],
            workedIntensivelyYesNoId: [{value:this.upwDetail.workedIntensivelyYesNoId, disabled: true }, Validators.compose([, , Validators.maxLength(1),])],
            upwStatusId: [{value:this.upwDetail.upwStatusId, disabled: true }, Validators.compose([Validators.required, , ,])],
            totalHoursOrdered: [{ value: '', disabled: true }],
            totalAdjustment: [{ value: '', disabled: true }],
            totalHoursWorked: [{ value: '', disabled: true }],
            totalHoursLeft: [{ value: '', disabled: true }],
            eventNumber: [{ value: '', disabled: true }],
        });
    }
}

