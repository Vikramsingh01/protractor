import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { TerminateRequirementService } from "../terminate-requirement.service";
import { TerminateRequirement } from "../terminate-requirement";
import { TerminateRequirementConstants } from '../terminate-requirement.constants';
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
  selector: 'tr-terminate-requirement',
  templateUrl: 'terminate-requirement-list.component.html'
})
export class TerminateRequirementListComponent implements OnInit {

    @Input() terminateRequirementId: number;
    private searchObjs: any[] = [];
    terminateRequirementList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    terminateRequirementFilterForm: FormGroup;
                                                                                                                                                                                                                                                                              private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private terminateRequirementService: TerminateRequirementService,
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
                                                                                                                                                                                                                                                                                let terminateRequirement: TerminateRequirement = new TerminateRequirement();
    this.route.params.subscribe((params: any)=>{

    });
    //this.authorizationService.getAuthorizationDataByTableId(TerminateRequirementConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(TerminateRequirementConstants.featureId, TerminateRequirementConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(TerminateRequirementConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(TerminateRequirementConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(TerminateRequirementConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TerminateRequirementConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.terminateRequirementService.sortFilterAndPaginate(terminateRequirement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.terminateRequirementList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = terminateRequirement;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ];
    
  }

  delete(terminateRequirementId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.terminateRequirementService.deleteTerminateRequirement(terminateRequirementId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.terminateRequirementFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


  reset(){
    this.terminateRequirementFilterForm.reset();
    let terminateRequirement: TerminateRequirement = new TerminateRequirement();
    this.sortFilterAndPaginate(terminateRequirement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchTerminateRequirement(filterObj) {
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
    this.terminateRequirementService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.terminateRequirementList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(TerminateRequirementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(TerminateRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(TerminateRequirementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(TerminateRequirementConstants.featureId, field, "Read");
  }
}
