import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { UpwProjectService } from "../upw-project.service";
import { UpwProject } from "../upw-project";
import { UpwProjectConstants } from '../upw-project.constants';
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
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-upw-project',
    templateUrl: 'upw-project-list.component.html'
})
export class UpwProjectListComponent implements OnInit {

    @Input() upwProjectId: number;
    private searchObjs: any[] = [];
    upwProjectList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    private enableAddButton: boolean = false;
    upwProjectFilterForm: FormGroup;
    private projectStatusIdList: any[] = [];
    private teamIdList: any[] = [];
    private officeTeamIdList: any[] = [];
    private highVisibilityYesNoIdList: any[] = [];
    private projectTypeIdList: any[] = [];
    private genderSuitabilityIdList: any[] = [];
    private visibileToPublicYesNoIdList: any[] = [];
    private selectNatureOfWorkIdList: any[] = [];
    private qualificationOpportunitieIdList: any[] = [];
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private upwProjectService: UpwProjectService,
        private dataService: DataService,
        private tokenService: TokenService,
        private authorizationService: AuthorizationService,
        private authenticationGuard: AuthenticationGuard,
        private listService: ListService,
        private headerService: HeaderService,
        private confirmService: ConfirmService,
        private _fb: FormBuilder,
        private _titleService: Title) {
    }

    ngOnInit() {
        this._titleService.setTitle('Community Payback Project');
        this.listService.getListData(1527).subscribe(projectStatusIdList => {
            this.projectStatusIdList = projectStatusIdList;
        });
        this.listService.getListData(2).subscribe(teamIdList => {
            this.teamIdList = teamIdList;
        });
        this.listService.getListData(2).subscribe(officeTeamIdList => {
            this.officeTeamIdList = officeTeamIdList;
        });
        this.listService.getListData(244).subscribe(highVisibilityYesNoIdList => {
            this.highVisibilityYesNoIdList = highVisibilityYesNoIdList;
        });
        this.listService.getListData(239).subscribe(projectTypeIdList => {
            this.projectTypeIdList = projectTypeIdList;
        });
        this.listService.getListData(237).subscribe(genderSuitabilityIdList => {
            this.genderSuitabilityIdList = genderSuitabilityIdList;
        });
        this.listService.getListData(244).subscribe(visibileToPublicYesNoIdList => {
            this.visibileToPublicYesNoIdList = visibileToPublicYesNoIdList;
        });
        this.listService.getListData(238).subscribe(selectNatureOfWorkIdList => {
            this.selectNatureOfWorkIdList = selectNatureOfWorkIdList;
        });
        this.listService.getListData(240).subscribe(qualificationOpportunitieIdList => {
            this.qualificationOpportunitieIdList = qualificationOpportunitieIdList;
        });
        let upwProject: UpwProject = new UpwProject();
        this.route.params.subscribe((params: any) => {

        });
        //this.authorizationService.getAuthorizationDataByTableId(UpwProjectConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(UpwProjectConstants.featureId, UpwProjectConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(UpwProjectConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(UpwProjectConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwProjectConstants.tableId, "Read", this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwProjectConstants.featureId, "Read");
            if (this.authorizedFlag) {
                /*this.upwProjectService.sortFilterAndPaginate(upwProject, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                    this.upwProjectList = data.content;
                    this.sortSearchPaginationObj.paginationObj = data;
                    this.sortSearchPaginationObj.filterObj = upwProject;
                })*/
            }
        });


        this.searchObjs = [
            { 'field': 'projectStatusId', 'type': 'dropdown', 'tableId': '1527', 'label': 'Status', mandatory: true },
            { 'field': 'officeTeamId', 'type': 'dropdown', 'tableId': '501', 'lookup': '533', 'inputParam': this.dataService.getLoggedInUserId(), 'label': 'Team', mandatory: true },
            { 'field': 'projectName', 'type': 'text', 'label': 'Project Name' },
            { 'field': 'projectTypeId', 'type': 'dropdown', 'tableId': '239', 'label': 'Project Type' },

        ];

    }

    delete(upwProjectId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.upwProjectService.deleteUpwProject(upwProjectId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


    reset() {
        this.upwProjectFilterForm.reset();
        let upwProject: UpwProject = new UpwProject();
        this.sortFilterAndPaginate(upwProject, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }
    searchUpwProject(filterObj) {
        this.enableAddButton = true;
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
        this.upwProjectService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
            this.upwProjectList = data.content;
            this.sortSearchPaginationObj.paginationObj = data;
        });
    }

    isAuthorized(action) {
        //return this.authorizationService.isTableAuthorized(UpwProjectConstants.tableId, action, this.authorizationData);
        return this.authorizationService.isFeatureActionAuthorized(UpwProjectConstants.featureId, action);
    }
    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(UpwProjectConstants.tableId, field, "Read", this.authorizationData);
        //return this.authorizationService.isFeildAuthorized(UpwProjectConstants.featureId, field, "Read");
        return true;
    }
}
