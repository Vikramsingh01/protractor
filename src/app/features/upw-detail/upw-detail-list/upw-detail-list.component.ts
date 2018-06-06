import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { UpwDetailService } from "../upw-detail.service";
import { UpwDetail } from "../upw-detail";
import { UpwDetailConstants } from '../upw-detail.constants';
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
import { EventService } from '../../event/event.service';
import { UpwAdjustmentService } from '../../upw-adjustment/upw-adjustment.service';

@Component({
  selector: 'tr-upw-detail',
  templateUrl: 'upw-detail-list.component.html',
  providers: [EventService, UpwAdjustmentService]
})
export class UpwDetailListComponent implements OnInit {

  @Input() upwDetailId: number;
  private searchObjs: any[] = [];
  upwDetailList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  upwDetailFilterForm: FormGroup;
  private workedIntensivelyYesNoIdList: any[] = [];
  private requirementTypeMainCategoryIdList: any[] = [];
  private requirementTypeSubCategoryIdList : any[] = [];
  private upwStatusIdList: any[] = [];
  private orderTypeList: any[] = [];
  private adjustmentDate: any;
  private adjustmentAmountUpw: 0;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();

  private adjustmentSortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private upwDetailService: UpwDetailService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private eventService: EventService,
    private upwAdjustmentService: UpwAdjustmentService,
    private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.listService.getListData(244).subscribe(workedIntensivelyYesNoIdList => {
      this.workedIntensivelyYesNoIdList = workedIntensivelyYesNoIdList;
    });
    this.listService.getListData(242).subscribe(upwStatusIdList => {
      this.upwStatusIdList = upwStatusIdList;
    });
    this.listService.getListData(421).subscribe(orderTypeList => {
      this.orderTypeList = orderTypeList;
    });
    this.listService.getListData(215).subscribe(requirementTypeMainCategoryIdList => {
      this.requirementTypeMainCategoryIdList = requirementTypeMainCategoryIdList;
    });
    this.listService.getListData(216).subscribe(requirementTypeSubCategoryIdList => {
      this.requirementTypeSubCategoryIdList = requirementTypeSubCategoryIdList;
    });
    
    let upwDetail: UpwDetail = new UpwDetail();
    this.route.params.subscribe((params: any) => {

    });
      this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        upwDetail.profileId = params['profileId'];
      }
    });

    //this.authorizationService.getAuthorizationDataByTableId(UpwDetailConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(UpwDetailConstants.featureId, UpwDetailConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(UpwDetailConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(UpwDetailConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwDetailConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwDetailConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.upwDetailService.sortFilterAndPaginate(upwDetail, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.upwDetailList = data.content;
          this.setUpwDetailsOtherValues(this.upwDetailList)
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = upwDetail;
        })
      }
    });


    this.searchObjs = [
      { 'field': 'eventId', 'type': 'hidden', 'label': 'Event Id' },
      { 'field': 'upwStatusId', 'type': 'dropdown', 'tableId': '242', 'label': 'Status' },
    ];

  }

  delete(upwDetailId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.upwDetailService.deleteUpwDetail(upwDetailId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.upwDetailFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.upwDetailFilterForm.reset();
    let upwDetail: UpwDetail = new UpwDetail();
    this.sortFilterAndPaginate(upwDetail, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchUpwDetail(filterObj) {
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
    this.upwDetailService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.upwDetailList = data.content;
      this.setUpwDetailsOtherValues(this.upwDetailList)
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(UpwDetailConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(UpwDetailConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(UpwDetailConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(UpwDetailConstants.featureId, field, "Read");
  }

  setUpwDetailsOtherValues(upwDetailList){
            upwDetailList.forEach(element => {
              element.totalHoursWorkedForAll = element.totalHoursOrdered;
            this.eventService.getEvent(element.eventId).subscribe(data => {
              element.orderTypeDisposalTypeId = data.orderTypeDisposalTypeId;
              element.eventNumber = data.eventNumber;

            });           
            this.adjustmentSortSearchPaginationObj.sortObj.field = "adjustmentDate";
            this.adjustmentSortSearchPaginationObj.sortObj.sort = "asc";
            this.upwAdjustmentService.sortFilterAndPaginate({ eventId: element.eventId }, null, this.adjustmentSortSearchPaginationObj.sortObj).subscribe(dataUpwAdjustment => {
             element.adjustmentAmount = 0;
              dataUpwAdjustment.content.forEach((upwAdjustmentData, index) => {
               element.adjustmentDate = upwAdjustmentData.adjustmentDate;
                if (upwAdjustmentData.adjustmentType == 'POSITIVE') {
                   element.adjustmentAmount = element.adjustmentAmount + upwAdjustmentData.adjustmentAmount;
                } else if (upwAdjustmentData.adjustmentType == 'NEGATIVE') {
                   element.adjustmentAmount = element.adjustmentAmount - upwAdjustmentData.adjustmentAmount;
                }                
              });
              element.adjustmentAmount = Utility.convertMinutesToHours(element.adjustmentAmount);
            });
           
          });
  }
}
