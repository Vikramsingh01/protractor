import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { LicenceConditionService } from "../licence-condition.service";
import { LicenceCondition } from "../licence-condition";
import { LicenceConditionConstants } from '../licence-condition.constants';
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
  selector: 'tr-licence-condition',
  templateUrl: 'licence-condition-list.component.html'
})
export class LicenceConditionListComponent implements OnInit {

  @Input() licenceConditionId: number;
  private searchObjs: any[] = [];
  licenceConditionList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  licenceConditionFilterForm: FormGroup;
  private licCondTypeMainCategoryIdList: any[] = [];
  private licCondTypeSubCategoryIdList: any[] = [];
  private terminationReasonIdList: any[] = [];
  private isActiveRelease: boolean = false;
  private action;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private licenceConditionService: LicenceConditionService,
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
    this.listService.getListData(422).subscribe(licCondTypeMainCategoryIdList => {
      this.licCondTypeMainCategoryIdList = licCondTypeMainCategoryIdList;
    });
    this.listService.getListData(155).subscribe(licCondTypeSubCategoryIdList => {
      this.licCondTypeSubCategoryIdList = licCondTypeSubCategoryIdList;
    });
    this.listService.getListData(156).subscribe(terminationReasonIdList => {
      this.terminationReasonIdList = terminationReasonIdList;
    });
    let licenceCondition: LicenceCondition = new LicenceCondition();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        licenceCondition.eventId = params['eventId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(LicenceConditionConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(LicenceConditionConstants.featureId, LicenceConditionConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(LicenceConditionConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(LicenceConditionConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(LicenceConditionConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(LicenceConditionConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.licenceConditionService.getActiveRelease(licenceCondition.eventId).subscribe((response: any) => {
          if(response != null && response > 0){
            this.isActiveRelease = true;
          }
        });
        this.licenceConditionService.sortFilterAndPaginate(licenceCondition, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.licenceConditionList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = licenceCondition;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'expectedEndDate', 'type': 'date', 'label': 'Expected End Date' },
      { 'field': 'actualEndDate', 'type': 'date', 'label': 'Actual End Date' },
      { 'field': 'sentenceDate', 'type': 'date', 'label': 'Sentence Date' },
      { 'field': 'licCondTypeMainCategoryId', 'type': 'dropdown', 'tableId': '422', 'label': 'Lic Cond Type Main Category Id' },
      { 'field': 'licCondTypeSubCategoryId', 'type': 'dropdown', 'tableId': '155', 'label': 'Lic Cond Type Sub Category Id' },
    ];

  }

  delete(licenceConditionId: number) {
     let licenceCondition: LicenceCondition = new LicenceCondition();
  
    this.action="Archive";
     this.licenceConditionService.isAuthorize(licenceConditionId,this.action).subscribe((response: any) => {
          
                if (response) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.licenceConditionService.deleteLicenceCondition(licenceConditionId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
                }
       else {
               this.headerService.setErrorPopup({errorMessage: "You are not authorised to perform this action on this SU record. Please contact the Case Manager."});
            }    
            });
    
  }


  reset() {
    this.licenceConditionFilterForm.reset();
    let licenceCondition: LicenceCondition = new LicenceCondition();
    this.sortFilterAndPaginate(licenceCondition, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchLicenceCondition(filterObj) {
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
    this.licenceConditionService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.licenceConditionList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(LicenceConditionConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(LicenceConditionConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(LicenceConditionConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(LicenceConditionConstants.featureId, field, "Read");
  }
}
