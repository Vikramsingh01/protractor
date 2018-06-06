import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CommunityRequirementService } from "../community-requirement.service";
import { CommunityRequirement } from "../community-requirement";
import { CommunityRequirementConstants } from '../community-requirement.constants';
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
  selector: 'tr-community-requirement',
  templateUrl: 'community-requirement-list.component.html'
})
export class CommunityRequirementListComponent implements OnInit {

  @Input() communityRequirementId: number;
  private searchObjs: any[] = [];
  communityRequirementList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  communityRequirementFilterForm: FormGroup;
  private additionalRequirementTypeMainCategoryIdList: any[] = [];
  private additionalRequirementTypeSubCategoryIdList: any[] = [];
  private rqProviderIdList: any[] = [];
  private requirementTypeMainCategoryIdList: any[] = [];
  private requirementTypeSubCategoryIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
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
    this.listService.getListData(80).subscribe(additionalRequirementTypeMainCategoryIdList => {
      this.additionalRequirementTypeMainCategoryIdList = additionalRequirementTypeMainCategoryIdList;
    });
    this.listService.getListData(81).subscribe(additionalRequirementTypeSubCategoryIdList => {
      this.additionalRequirementTypeSubCategoryIdList = additionalRequirementTypeSubCategoryIdList;
    });
    this.listService.getListData(193).subscribe(rqProviderIdList => {
      this.rqProviderIdList = rqProviderIdList;
    });
    this.listService.getListData(215).subscribe(requirementTypeMainCategoryIdList => {
      this.requirementTypeMainCategoryIdList = requirementTypeMainCategoryIdList;
    });
    this.listService.getListData(216).subscribe(requirementTypeSubCategoryIdList => {
      this.requirementTypeSubCategoryIdList = requirementTypeSubCategoryIdList;
    });
    let communityRequirement: CommunityRequirement = new CommunityRequirement();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        communityRequirement.eventId = params['eventId'];
      }
    });
    this.route.params.subscribe((params: any) => {

    });
    //this.authorizationService.getAuthorizationDataByTableId(CommunityRequirementConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(CommunityRequirementConstants.featureId, CommunityRequirementConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(CommunityRequirementConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(CommunityRequirementConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(CommunityRequirementConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CommunityRequirementConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.communityRequirementService.sortFilterAndPaginate(communityRequirement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.communityRequirementList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = communityRequirement;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'eventId', 'type': 'hidden', 'value': communityRequirement.eventId },
      { 'field': 'imposedDate', 'type': 'date', 'label': 'Imposed Date' },
      { 'field': 'requirementTypeMainCategoryId', 'type': 'dropdown', 'tableId': '215', 'label': 'Requirement Type Main Category Id' },
      { 'field': 'requirementTypeSubCategoryId', 'type': 'dropdown', 'tableId': '216', 'label': 'Requirement Type Sub Category Id' },
      { 'field': 'length', 'type': 'text', 'label': 'Length' },
      { 'field': 'actualStartDate', 'type': 'date', 'label': 'Actual Start Date' },
      { 'field': 'actualEndDate', 'type': 'date', 'label': 'Actual End Date' },
      { 'field': 'rqResponsibleOfficer', 'type': 'text', 'label': 'Rq Responsible Officer' },
    ];

  }

  delete(communityRequirementId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.communityRequirementService.deleteCommunityRequirement(communityRequirementId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.communityRequirementFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.communityRequirementFilterForm.reset();
    let communityRequirement: CommunityRequirement = new CommunityRequirement();
    this.sortFilterAndPaginate(communityRequirement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchCommunityRequirement(filterObj) {
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
    this.communityRequirementService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.communityRequirementList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CommunityRequirementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CommunityRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CommunityRequirementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CommunityRequirementConstants.featureId, field, "Read");
  }
  parseOfficer(officerName) {
    if (officerName != null && typeof officerName != undefined) {
      return officerName.substring(officerName.indexOf("/") + 1).replace(/\[[0-9]*\]/g, "");
    } else
      return officerName;
  }

}
