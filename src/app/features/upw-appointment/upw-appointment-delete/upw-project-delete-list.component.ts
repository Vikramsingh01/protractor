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
    selector: 'tr-upw-project-delete',
    templateUrl: 'upw-project-delete-list.component.html'
})
export class UpwProjectDeleteListComponent implements OnInit {

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
    private profileId: any;
    private eventId: any;
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

        let upwAppointment: UpwAppointment = new UpwAppointment();
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.profileId = params['profileId'];
            }
             if (params.hasOwnProperty('upwEventId')) {
                this.eventId = params['upwEventId'];
            }
        });

        this.listService.getListData(357).subscribe(dayOfWeekList => {
            this.dayOfWeekList = dayOfWeekList;
        });




        this.authorizationService.getAuthorizationData(UpwAppointmentConstants.featureId, UpwAppointmentConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(UpwAppointmentConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(UpwAppointmentConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.upwAppointmentService.sortFilterAndPaginateForDeleteAppointment(upwAppointment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj,this.profileId,this.eventId).subscribe(data => {
          this.upwAppointmentList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = upwAppointment;
        })
      } else {
        this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
      }
    });
    }
    delete(projectName:any,eventId:any,dayofWeek:any) {
        this.confirmService.confirm(
            {
                message: 'Removing this project will remove all future associated appointments, please confirm you are happy to do this.',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.upwAppointmentService.deleteUpwAppointmentByProjectName(projectName,eventId,dayofWeek).subscribe((data: any) => {
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
        this.sortSearchPaginationObj.paginationObj.number = 0;
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
        this.upwAppointmentService.sortFilterAndPaginateForDeleteAppointment(filterObj, paginationObj, sortObj, this.profileId,this.eventId).subscribe((data: any) => {
            this.upwAppointmentList = data.content;
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
