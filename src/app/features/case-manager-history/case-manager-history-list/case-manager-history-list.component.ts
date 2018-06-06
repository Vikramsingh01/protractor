import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CaseManagerHistoryService } from "../case-manager-history.service";
import { CaseManagerHistory } from "../case-manager-history";
import { CaseManagerHistoryConstants } from '../case-manager-history.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { Subscription } from "rxjs/Rx";
import { SortFilterPagination } from '../../../generic-components/pagination/pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';

@Component({
  selector: 'tr-case-manager-history',
  templateUrl: 'case-manager-history-list.component.html'
})
export class CaseManagerHistoryListComponent implements OnInit {

    @Input() caseManagerHistoryId: number;
    private searchObjs: any[] = [];
    allocationReasonList: any[];
    providerList: any[];
    caseManagerHistoryList: any[];
    caseManagerHistory: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    caseManagerHistoryFilterForm: FormGroup;
                                                                                                                                                                                                      private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private caseManagerHistoryService: CaseManagerHistoryService,
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
        this.listService.getListData(144).subscribe(allocationReasonList => {
      this.allocationReasonList = allocationReasonList
    });
    this.listService.getListData(193).subscribe(providerList => {
      this.providerList = providerList;
    });
    
    let caseManagerHistory: CaseManagerHistory = new CaseManagerHistory();
    this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('profileId')) {
        caseManagerHistory.profileId = params['profileId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(CaseManagerHistoryConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(CaseManagerHistoryConstants.featureId, CaseManagerHistoryConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CaseManagerHistoryConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CaseManagerHistoryConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CaseManagerHistoryConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CaseManagerHistoryConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.caseManagerHistoryService.sortFilterAndPaginate(caseManagerHistory, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj).subscribe(data => {
                this.caseManagerHistoryList = data.content;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                                { 'field': 'transferFromProviderId', 'type': 'text', 'label': 'Transfer From Provider Id' },
                                                        { 'field': 'transferToResponsibleOfficer', 'type': 'text', 'label': 'Transfer To Responsible Officer' },
                                                        { 'field': 'allocationDate', 'type': 'date', 'label': 'Allocation Date' },
                                                        { 'field': 'transferReasonId', 'type': 'text', 'label': 'Transfer Reason Id' },
                                                        { 'field': 'transferToProviderId', 'type': 'text', 'label': 'Transfer To Provider Id' },
                                    ];
    
  }

  delete(caseManagerHistoryId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.caseManagerHistoryService.deleteCaseManagerHistory(caseManagerHistoryId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.caseManagerHistoryFilterForm.value, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj);
                    });
                }
            });
    }


  reset(){
    this.caseManagerHistoryFilterForm.reset();
    let caseManagerHistory: CaseManagerHistory = new CaseManagerHistory();
    this.sortFilterAndPaginate(caseManagerHistory, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj);
  }
  searchCaseManagerHistory(filterObj) {
    this.sortFilterPaginationObj.filterObj = filterObj;
    this.sortFilterPaginationObj.paginationObj.number = 0;
    this.sortFilterAndPaginate(filterObj, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj);
  }

  sort(sortObj){
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortFilterPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, this.sortFilterPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    this.caseManagerHistoryService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.caseManagerHistoryList = data.content;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CaseManagerHistoryConstants.tableId, action, this.authorizationData);
    //return this.authorizationService.isFeatureActionAuthorized(CaseManagerHistoryConstants.featureId, action);
    return true;
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CaseManagerHistoryConstants.tableId, field, "Read", this.authorizationData);
    //return this.authorizationService.isFeildAuthorized(CaseManagerHistoryConstants.featureId, field, "Read");
    return true;
  }
}
