import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { OffenderDisabilityService } from "../offender-disability.service";
import { OffenderDisability } from "../offender-disability";
import { OffenderDisabilityConstants } from '../offender-disability.constants';
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
  selector: 'tr-offender-disability',
  templateUrl: 'offender-disability-list.component.html'
})
export class OffenderDisabilityListComponent implements OnInit {

  @Input() offenderDisabilityId: number;
  private searchObjs: any[] = [];
  offenderDisabilityList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  offenderDisabilityFilterForm: FormGroup;
  private disabilityTypeIdList: any[] = [];
  private action;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private offenderDisabilityService: OffenderDisabilityService,
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
    this.titleService.setTitle('Accessibility');
    this.listService.getListData(115).subscribe(disabilityTypeIdList => {
      this.disabilityTypeIdList = disabilityTypeIdList;
    });
    let offenderDisability: OffenderDisability = new OffenderDisability();
    this.route.params.subscribe((params: any) => {
      if(params.hasOwnProperty('profileId')) {
				offenderDisability.profileId = params['profileId'];
			}

    });
    //this.authorizationService.getAuthorizationDataByTableId(OffenderDisabilityConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(OffenderDisabilityConstants.featureId, OffenderDisabilityConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(OffenderDisabilityConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(OffenderDisabilityConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(OffenderDisabilityConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OffenderDisabilityConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.offenderDisabilityService.sortFilterAndPaginate(offenderDisability, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.offenderDisabilityList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = offenderDisability;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      {'field':'profileId', 'type':'hidden', 'value':offenderDisability.profileId},          
      { 'field': 'disabilityTypeId', 'type': 'dropdown', 'tableId': '115', 'label': 'Accessibility Type' },
      { 'field': 'startDate', 'type': 'date', 'label': 'Start Date' },
      { 'field': 'endDate', 'type': 'date', 'label': 'End Date' },
      // { 'field': 'createdDate', 'type': 'date', 'label': 'Created Date' },
    ];

  }

  delete(offenderDisabilityId: number) {

  let offenderDisability: OffenderDisability = new OffenderDisability();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        offenderDisability.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.offenderDisabilityService.isAuthorize(offenderDisability.profileId,this.action).subscribe((response: any) => {
              
                if (response) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
        this.offenderDisabilityService.deleteOffenderDisability(offenderDisabilityId).subscribe((data: any) => {
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
    this.offenderDisabilityFilterForm.reset();
    let offenderDisability: OffenderDisability = new OffenderDisability();
    this.sortFilterAndPaginate(offenderDisability, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchOffenderDisability(filterObj) {
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
    this.offenderDisabilityService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.offenderDisabilityList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(OffenderDisabilityConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(OffenderDisabilityConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(OffenderDisabilityConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(OffenderDisabilityConstants.featureId, field, "Read");
  }
}
