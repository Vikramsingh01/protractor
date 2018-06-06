import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { UpwAppointmentService } from "../upw-appointment.service";
import { UpwAppointment } from "../upw-appointment";
import { UpwAppointmentConstants } from '../upw-appointment.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { CommunityRequirementService } from "../../community-requirement/community-requirement.service";
@Component({
    selector: 'tr-upw-appointment',
    templateUrl: 'upw-appointment-list.component.html'
})
export class UpwAppointmentListComponent implements OnInit {

    @Input() upwAppointmentId: number;
    private searchObjs: any[] = [];
    upwAppointmentList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    upwAppointmentFilterForm: FormGroup;
    private intensiveList: any[] = [];
    private providerIdList: any[] = [];
    private upwOutcomeTypeIdList: any[] = [];
    private projectTypeIdList: any[] = [];
    private highVisibilityVestList: any[] = [];
    private workQualityIdList: any[] = [];
    private behaviourIdList: any[] = [];
    private dayOfWeekList: any[] = [];
    private nonTerminatedCommunityRequirementCount;
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private upwAppointmentService: UpwAppointmentService,
        private communityRequirementService: CommunityRequirementService,
        private dataService: DataService,
        private tokenService: TokenService,
        private authorizationService: AuthorizationService,
        private authenticationGuard: AuthenticationGuard,
        private listService: ListService,
        private headerService: HeaderService,
        private confirmService: ConfirmService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {

        this.sortSearchPaginationObj.sortObj.field = "appointmentDate";
        this.sortSearchPaginationObj.sortObj.sort = "asc";
        this.listService.getListData(244).subscribe(intensiveList => {
            this.intensiveList = intensiveList;
        });
        this.listService.getListData(357).subscribe(dayOfWeekList => {
            this.dayOfWeekList = dayOfWeekList;
        });
        this.listService.getListData(193).subscribe(providerIdList => {
            this.providerIdList = providerIdList;
        });
        this.listService.getListData(103).subscribe(upwOutcomeTypeIdList => {
            this.upwOutcomeTypeIdList = upwOutcomeTypeIdList;
        });
        this.listService.getListData(239).subscribe(projectTypeIdList => {
            this.projectTypeIdList = projectTypeIdList;
        });
        this.listService.getListData(244).subscribe(highVisibilityVestList => {
            this.highVisibilityVestList = highVisibilityVestList;
        });
        this.listService.getListData(243).subscribe(workQualityIdList => {
            this.workQualityIdList = workQualityIdList;
        });
        this.listService.getListData(234).subscribe(behaviourIdList => {
            this.behaviourIdList = behaviourIdList;
        });
        let upwAppointment: UpwAppointment = new UpwAppointment();
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('upwEventId')) {
                upwAppointment.eventId = params['upwEventId'];
            }
            if (params.hasOwnProperty('profileId')) {
                let profile = params['profileId'];
            }

        });
        this.authorizationService.getAuthorizationData(UpwAppointmentConstants.featureId, UpwAppointmentConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(UpwAppointmentConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(UpwAppointmentConstants.featureId, authorizationData[1]);
            }
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, "Read");
            if (this.authorizedFlag) {
                this.upwAppointmentService.sortFilterAndPaginate(upwAppointment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                    this.upwAppointmentList = data.content;
                    this.upwAppointmentList.forEach(appointment=>{
                        let dayOfWeekId = Utility.convertStringToDate(appointment.appointmentDate).getDay();
                        if(dayOfWeekId == 0){
                            dayOfWeekId = 7;
                        }
                        appointment.dayOfWeekId = dayOfWeekId;
                    });
                    this.sortSearchPaginationObj.paginationObj = data;
                    this.sortSearchPaginationObj.filterObj = upwAppointment;
                })
            } 
        });

        this.searchObjs = [
            { 'field': 'startDate', 'type': 'date', 'label': 'From' },
            { 'field': 'endDate', 'type': 'date', 'label': 'To' },
            { 'field': 'eventId', 'type': 'hidden', 'value': upwAppointment.eventId },
        ];
    }

    delete(upwAppointmentId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.upwAppointmentService.deleteUpwAppointment(upwAppointmentId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }

    reset() {
        this.upwAppointmentFilterForm.reset();
        let upwAppointment: UpwAppointment = new UpwAppointment();
        this.sortFilterAndPaginate(upwAppointment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }
    searchUpwAppointment(filterObj) {
        this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
        this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }

    sort(sortObj) {
        this.sortSearchPaginationObj.sortObj = sortObj;
        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
    }
    paginate(paginationObj) {
        this.sortSearchPaginationObj.paginationObj = paginationObj;
        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
    }

    sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
        this.upwAppointmentService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
            this.upwAppointmentList = data.content;
            this.upwAppointmentList.forEach(appointment=>{
                let dayOfWeekId = Utility.convertStringToDate(appointment.appointmentDate).getDay();
                if(dayOfWeekId == 0){
                    dayOfWeekId = 7;
                }
                appointment.dayOfWeekId = dayOfWeekId;
            });
            this.sortSearchPaginationObj.paginationObj = data;
        });
    }

    isAuthorized(action) {
        return this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, action);
    }
    isFeildAuthorized(field) {
        return this.authorizationService.isFeildAuthorized(UpwAppointmentConstants.featureId, field, "Read");
    }
}
