import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { UpwProjectDiaryService } from "../upw-project-diary.service";
import { UpwProjectDiaryConstants } from '../upw-project-diary.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { Title } from "@angular/platform-browser";
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import {UpwProjectDiary} from '../upw-project-diary';

@Component({
    selector: 'tr-upw-project-diary',
    templateUrl: 'upw-project-diary-list.component.html'
})
export class UpwProjectDiaryListComponent implements OnInit {

    private searchObjs: any[] = [];
    private upwOutcomeTypeIdList: any[] = [];
    upwProjectDiaryList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    private enableAddButton: boolean = false;
    upwProjectDiaryFilterForm: FormGroup;
    private teamIdList: any[] = [];
    private officeTeamIdList: any[] = [];
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private upwProjectDiaryService: UpwProjectDiaryService,
        private dataService: DataService,
        private tokenService: TokenService,
        private authorizationService: AuthorizationService,
        private authenticationGuard: AuthenticationGuard,
        private listService: ListService,
        private headerService: HeaderService,
        private titleService: Title,
        private confirmService: ConfirmService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.sortSearchPaginationObj.sortObj.field = "projectName";
        this.sortSearchPaginationObj.sortObj.sort = "asc";
        this.listService.getListData(2).subscribe(teamIdList => {
            this.teamIdList = teamIdList;
        });
        this.listService.getListData(2).subscribe(officeTeamIdList => {
            this.officeTeamIdList = officeTeamIdList;
        });
        //this.titleService.setTitle("Community Payback Project Diary");
        this.listService.getListData(103).subscribe(upwOutcomeTypeIdList => {
            this.upwOutcomeTypeIdList = upwOutcomeTypeIdList;
        });

        let upwProjectDiary: UpwProjectDiary = new UpwProjectDiary();
        this.route.params.subscribe((params: any) => {

        });
        this.authorizationService.getAuthorizationData(UpwProjectDiaryConstants.featureId, UpwProjectDiaryConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(UpwProjectDiaryConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(UpwProjectDiaryConstants.featureId, authorizationData[1]);
            }
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwProjectDiaryConstants.featureId, "Read");
            if (this.authorizedFlag) {

            }
            //  else {
            //     this.headerService.setAlertPopup("Not authorized");
            // }
        });


        this.searchObjs = [
            { 'field': 'appointmentDate', 'type': 'date', 'label': 'Date', mandatory: true  },
            { 'field': 'officeTeamId', 'type': 'dropdown', 'tableId': '501', 'lookup': '533', 'inputParam': this.dataService.getLoggedInUserId(), 'label': 'Team', mandatory: true },
        ];

    }

    reset() {
        this.upwProjectDiaryFilterForm.reset();
        let upwProjectDiary: UpwProjectDiary = new UpwProjectDiary();
        this.sortFilterAndPaginate(upwProjectDiary, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }
    searchUpwProjectDiary(filterObj) {
        this.enableAddButton = true;
        this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
        if(filterObj.teamId == "" && filterObj.officeTeamId == "")
        {
          	this.enableAddButton = false;
        }
        else{
        	this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
        }
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
      if(filterObj.officeTeamId == "" && filterObj.appointmentDate == ""){
          this.upwProjectDiaryList = [];
      }else{
        this.upwProjectDiaryService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
              this.upwProjectDiaryList = data.content;
              this.sortSearchPaginationObj.paginationObj = data;
        });
      }
    }

    isAuthorized(action) {
        return this.authorizationService.isFeatureActionAuthorized(UpwProjectDiaryConstants.featureId, action);
    }
    isFeildAuthorized(field) {
        return true;
    }
}
