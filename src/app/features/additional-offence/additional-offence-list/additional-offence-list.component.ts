import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { AdditionalOffenceService } from "../additional-offence.service";
import { AdditionalOffence } from "../additional-offence";
import { AdditionalOffenceConstants } from '../additional-offence.constants';
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
  selector: 'tr-additional-offence',
  templateUrl: 'additional-offence-list.component.html'
})
export class AdditionalOffenceListComponent implements OnInit {

  @Input() additionalOffenceId: number;
  private searchObjs: any[] = [];
  additionalOffenceList: any[];
  private authorizationData: any;
  private eventId;
  private profileId;
  private authorizedFlag: boolean = false;
  additionalOffenceFilterForm: FormGroup;
  private offenceCodeIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private additionalOffenceService: AdditionalOffenceService,
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
    this.titleService.setTitle("Additional Offence");
    this.listService.getListData(173).subscribe(offenceCodeIdList => {
      this.offenceCodeIdList = offenceCodeIdList;
    });
    let additionalOffence: AdditionalOffence = new AdditionalOffence();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        additionalOffence.eventId = params['eventId'];
        this.eventId = params['eventId'];
      }
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(AdditionalOffenceConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(AdditionalOffenceConstants.featureId, AdditionalOffenceConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(AdditionalOffenceConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(AdditionalOffenceConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(AdditionalOffenceConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdditionalOffenceConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.additionalOffenceService.sortFilterAndPaginate(additionalOffence, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.additionalOffenceList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = additionalOffence;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'offenceCodeId', 'type': 'dropdown', 'tableId': '173', 'label': 'Offence Code Id' },
      { 'field': 'offenceDate', 'type': 'date', 'label': 'Offence Date' },
      { 'field': 'offenceCount', 'type': 'text', 'label': 'Offence Count' },
    ];

  }

  delete(additionalOffenceId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.additionalOffenceService.deleteAdditionalOffence(additionalOffenceId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.additionalOffenceFilterForm.reset();
    let additionalOffence: AdditionalOffence = new AdditionalOffence();
    this.sortFilterAndPaginate(additionalOffence, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchAdditionalOffence(filterObj) {
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
    this.additionalOffenceService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.additionalOffenceList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(AdditionalOffenceConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AdditionalOffenceConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(AdditionalOffenceConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AdditionalOffenceConstants.featureId, field, "Read");
  }
}
