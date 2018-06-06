import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { DeregistrationService } from "../deregistration.service";
import { Deregistration } from "../deregistration";
import { deregistrationConstants } from '../deregistration.constants';
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
  selector: 'tr-deregistration',
  templateUrl: 'deregistration-list.component.html'
})
export class DeregistrationListComponent implements OnInit {

  @Input() deregistrationId: number;
  private searchObjs: any[] = [];
  deregistrationList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  deregistrationFilterForm: FormGroup;
  private registrationIdList: any[] = [];
  private deregisteringProviderIdList: any[] = [];
  private teamlist: any = []
  private officerlist: any = []

  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private deregistrationService: DeregistrationService,
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
    this.listService.getListDataWithLookup(445, 501).subscribe(crcList => {
      this.teamlist = crcList;
    });
    this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
      this.officerlist = crcList;
    });
    this.titleService.setTitle("View Registrations");
    this.listService.getListData(207).subscribe(registrationIdList => {
      this.registrationIdList = registrationIdList;
    });
    this.listService.getListData(193).subscribe(deregisteringProviderIdList => {
      this.deregisteringProviderIdList = deregisteringProviderIdList;
    });
    let deregistration: Deregistration = new Deregistration();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('registrationId')) {
        deregistration.registrationId = params['registrationId'];
      }


    });
    //this.authorizationService.getAuthorizationDataByTableId(deregistrationConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(deregistrationConstants.featureId, deregistrationConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(deregistrationConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(deregistrationConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(deregistrationConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(deregistrationConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.deregistrationService.sortFilterAndPaginate(deregistration, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.deregistrationList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = deregistration;
        })
      }
    });


    this.searchObjs = [
      { 'field': 'deregisteringProviderId', 'type': 'dropdown', 'tableId': '193', 'label': 'Deregistering Provider Id' },
    ];

  }

  delete(deregistrationId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.deregistrationService.deletederegistration(deregistrationId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.deregistrationFilterForm.reset();
    let deregistration: Deregistration = new Deregistration();
    this.sortFilterAndPaginate(deregistration, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchderegistration(filterObj) {
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
    this.deregistrationService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.deregistrationList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(deregistrationConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(deregistrationConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(deregistrationConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(deregistrationConstants.featureId, field, "Read");
  }
}
