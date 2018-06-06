import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceProviderService } from "../service-provider.service";
import { ServiceProvider } from "../service-provider";
import { ServiceProviderConstants } from '../service-provider.constants';
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
  selector: 'tr-service-provider',
  templateUrl: 'service-provider-list.component.html'
})
export class ServiceProviderListComponent implements OnInit {

  @Input() serviceProviderId: number;
  private searchObjs: any[] = [];
  serviceProviderList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  serviceProviderFilterForm: FormGroup;
  private provisionList: any[] = [];
  private statusList: any[] = [];
  private crcList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private selectedCrc : any[] =[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private serviceProviderService: ServiceProviderService,
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
    this.listService.getListData(520).subscribe(provisionList => {
      this.provisionList = provisionList;
    });
    this.listService.getListData(519).subscribe(statusList => {
      this.statusList = statusList;
    });
    this.serviceProviderService.getCrcList().subscribe(crcList => {
      this.crcList = crcList;
    });
    let serviceProvider: ServiceProvider = new ServiceProvider();
    this.route.params.subscribe((params: any) => {

    });
    //this.authorizationService.getAuthorizationDataByTableId(ServiceProviderConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(ServiceProviderConstants.featureId, ServiceProviderConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(ServiceProviderConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(ServiceProviderConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(ServiceProviderConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ServiceProviderConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.serviceProviderService.sortFilterAndPaginate(serviceProvider, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.serviceProviderList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = serviceProvider;
        })
        // this.serviceProviderService.getCrcByServiceIdList(this.serviceProviderId).subscribe(data => {
        //         this.selectedCrc = data;
        // })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'serviceProviderName', 'type': 'text', 'label': 'Service Provider Name' },
      { 'field': 'status', 'type': 'dropdown', 'tableId': '519', 'label': 'Status' },
    ];

  }

  delete(serviceProviderId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.serviceProviderService.deleteServiceProvider(serviceProviderId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.serviceProviderFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.serviceProviderFilterForm.reset();
    let serviceProvider: ServiceProvider = new ServiceProvider();
    this.sortFilterAndPaginate(serviceProvider, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchServiceProvider(filterObj) {
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
    this.serviceProviderService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.serviceProviderList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(ServiceProviderConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ServiceProviderConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(ServiceProviderConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ServiceProviderConstants.featureId, field, "Read");
  }
}
