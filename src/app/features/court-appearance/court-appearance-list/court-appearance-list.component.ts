import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CourtAppearanceService } from "../court-appearance.service";
import { CourtAppearance } from "../court-appearance";
import { CourtAppearanceConstants } from '../court-appearance.constants';
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
    selector: 'tr-court-appearance',
    templateUrl: 'court-appearance-list.component.html'
})
export class CourtAppearanceListComponent implements OnInit {

    @Input() courtAppearanceId: number;
    private searchObjs: any[] = [];
    courtAppearanceList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    courtAppearanceFilterForm: FormGroup;
    private remandStatusIdList: any[] = [];
    private pleaIdList: any[] = [];
    private eventId;
    private profileId;
    private courtIdList: any[] = [];
    private courtAppearanceTypeIdList: any[] = [];
    private outcomeIdList: any[] = [];
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private courtAppearanceService: CourtAppearanceService,
        private dataService: DataService,
        private tokenService: TokenService,
        private authorizationService: AuthorizationService,
        private authenticationGuard: AuthenticationGuard,
        private listService: ListService,
        private headerService: HeaderService,
        private confirmService: ConfirmService,
        private _fb: FormBuilder,
        private titleService: Title) {
    }

    ngOnInit() {
        this.titleService.setTitle('Court Appearance');
        this.listService.getListData(213).subscribe(remandStatusIdList => {
            this.remandStatusIdList = remandStatusIdList;
        });
        this.listService.getListData(188).subscribe(pleaIdList => {
            this.pleaIdList = pleaIdList;
        });
        this.listService.getListData(105).subscribe(courtIdList => {
            this.courtIdList = courtIdList;
        });
        this.listService.getListData(107).subscribe(courtAppearanceTypeIdList => {
            this.courtAppearanceTypeIdList = courtAppearanceTypeIdList;
        });
        this.listService.getListData(106).subscribe(outcomeIdList => {
            this.outcomeIdList = outcomeIdList;
        });
        let courtAppearance: CourtAppearance = new CourtAppearance();
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('eventId')) {
                courtAppearance.eventId = params['eventId'];
                this.eventId = params['eventId'];
            }
            if (params.hasOwnProperty('profileId')) {
                this.profileId = params['profileId'];
            }
        });
        //this.authorizationService.getAuthorizationDataByTableId(CourtAppearanceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CourtAppearanceConstants.featureId, CourtAppearanceConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(CourtAppearanceConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(CourtAppearanceConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtAppearanceConstants.tableId, "Read", this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CourtAppearanceConstants.featureId, "Read");
            if (this.authorizedFlag) {
                this.courtAppearanceService.sortFilterAndPaginate(courtAppearance, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                    this.courtAppearanceList = data.content;
                    this.sortSearchPaginationObj.paginationObj = data;
                    this.sortSearchPaginationObj.filterObj = courtAppearance;
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });


        this.searchObjs = [
            { 'field': 'courtId', 'type': 'dropdown', 'tableId': '105', 'label': 'Court Id' },
            { 'field': 'courtAppearanceTypeId', 'type': 'dropdown', 'tableId': '107', 'label': 'Court Appearance Type Id' },
            { 'field': 'courtDate', 'type': 'date', 'label': 'Court Date' },
            { 'field': 'outcomeId', 'type': 'dropdown', 'tableId': '106', 'label': 'Outcome Id' },
        ];

    }

    delete(courtAppearanceId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.courtAppearanceService.deleteCourtAppearance(courtAppearanceId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


    reset() {
        this.courtAppearanceFilterForm.reset();
        let courtAppearance: CourtAppearance = new CourtAppearance();
        this.sortFilterAndPaginate(courtAppearance, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }
    searchCourtAppearance(filterObj) {
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
        this.courtAppearanceService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
            this.courtAppearanceList = data.content;
            this.sortSearchPaginationObj.paginationObj = data;
        });
    }

    isAuthorized(action) {
        //return this.authorizationService.isTableAuthorized(CourtAppearanceConstants.tableId, action, this.authorizationData);
        return this.authorizationService.isFeatureActionAuthorized(CourtAppearanceConstants.featureId, action);
    }
    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CourtAppearanceConstants.tableId, field, "Read", this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CourtAppearanceConstants.featureId, field, "Read");
    }
}
