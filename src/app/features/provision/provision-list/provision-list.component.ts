import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ProvisionService } from "../provision.service";
import { Provision } from "../provision";
import { ProvisionConstants } from '../provision.constants';
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
  selector: 'tr-provision',
  templateUrl: 'provision-list.component.html'
})
export class ProvisionListComponent implements OnInit {

  @Input() provisionId: number;
  private searchObjs: any[] = [];
  provisionList: any[];
  private action;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  provisionFilterForm: FormGroup;
  private adjustmentIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private provisionService: ProvisionService,
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
    this.titleService.setTitle('View Accessibility');
    this.listService.getListData(114).subscribe(adjustmentIdList => {
      this.adjustmentIdList = adjustmentIdList;
    });
    let provision: Provision = new Provision();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('offenderDisabilityId')) {
        provision.offenderDisabilityId = params['offenderDisabilityId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(ProvisionConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(ProvisionConstants.featureId, ProvisionConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(ProvisionConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(ProvisionConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProvisionConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ProvisionConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.provisionService.sortFilterAndPaginate(provision, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.provisionList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = provision;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'adjustmentId', 'type': 'dropdown', 'tableId': '114', 'label': 'Adjustment' },
      { 'field': 'startDate', 'type': 'date', 'label': 'Start Date' },
      { 'field': 'note', 'type': 'text', 'label': 'Note' },
      { 'field': 'endDate', 'type': 'date', 'label': 'End Date' },
    ];

  }

  delete(provisionId: number) {
      let provision: Provision = new Provision();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        provision.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.provisionService.isAuthorize(provision.profileId,this.action).subscribe((response: any) => {
                if (response) {
      this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.provisionService.deleteProvision(provisionId).subscribe((data: any) => {
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
    this.provisionFilterForm.reset();
    let provision: Provision = new Provision();
    this.sortFilterAndPaginate(provision, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchProvision(filterObj) {
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
    this.provisionService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.provisionList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(ProvisionConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ProvisionConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(ProvisionConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ProvisionConstants.featureId, field, "Read");
  }
}
