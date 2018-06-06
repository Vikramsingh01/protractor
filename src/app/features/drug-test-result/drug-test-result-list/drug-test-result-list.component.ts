import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { DrugTestResultService } from "../drug-test-result.service";
import { DrugTestResult } from "../drug-test-result";
import { DrugTestResultConstants } from '../drug-test-result.constants';
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

@Component({
  selector: 'tr-drug-test-result',
  templateUrl: 'drug-test-result-list.component.html'
})
export class DrugTestResultListComponent implements OnInit {

    @Input() drugTestResultId: number;
    private searchObjs: any[] = [];
    drugTestResultList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    drugTestResultFilterForm: FormGroup;
                                            private admittedUseYesNoIdList: any[] = [];
                                                                                                                                private testResultIdList: any[] = [];
                private agreedYesNoIdList: any[] = [];
          private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private drugTestResultService: DrugTestResultService,
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
    this.titleService.setTitle("Drug Test Result");
                                            this.listService.getListData(244).subscribe(admittedUseYesNoIdList => {
        this.admittedUseYesNoIdList = admittedUseYesNoIdList;
    });
                                                                                                                                this.listService.getListData(244).subscribe(testResultIdList => {
        this.testResultIdList = testResultIdList;
    });
                this.listService.getListData(244).subscribe(agreedYesNoIdList => {
        this.agreedYesNoIdList = agreedYesNoIdList;
    });
            let drugTestResult: DrugTestResult = new DrugTestResult();
    this.route.params.subscribe((params: any)=>{

    });
    //this.authorizationService.getAuthorizationDataByTableId(DrugTestResultConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(DrugTestResultConstants.featureId, DrugTestResultConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(DrugTestResultConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(DrugTestResultConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(DrugTestResultConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(DrugTestResultConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.drugTestResultService.sortFilterAndPaginate(drugTestResult, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.drugTestResultList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = drugTestResult;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                                            ];
    
  }

  delete(drugTestResultId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.drugTestResultService.deleteDrugTestResult(drugTestResultId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


  reset(){
    this.drugTestResultFilterForm.reset();
    let drugTestResult: DrugTestResult = new DrugTestResult();
    this.sortFilterAndPaginate(drugTestResult, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchDrugTestResult(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    this.drugTestResultService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.drugTestResultList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(DrugTestResultConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(DrugTestResultConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(DrugTestResultConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(DrugTestResultConstants.featureId, field, "Read");
  }
}
