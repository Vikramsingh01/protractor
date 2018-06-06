import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { LicenceConditionManagerService } from "./licence-condition-manager.service";
import { LicenceConditionManager } from "./licence-condition-manager";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { LicenceConditionManagerConstants } from './licence-condition-manager.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { FilterPipe } from '../../generic-components/filter/filter.pipe';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-licence-condition-manager',
  templateUrl: 'licence-condition-manager.component.html',
  
  providers: [LicenceConditionManagerService],
  

})
export class LicenceConditionManagerComponent implements OnInit {

  @Input() licenceConditionManagerId: number;

  licenceConditionManagers: LicenceConditionManager[];
  allocationReasonList: any[];
  licProviderList: any[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();


  constructor(private router: Router,
    private route: ActivatedRoute,
    private licenceConditionManagerService: LicenceConditionManagerService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private listService: ListService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {

    this.listService.getListData(139).subscribe(allocationReasonList => {
      this.allocationReasonList = allocationReasonList
    });
    this.listService.getListData(193).subscribe(licProviderList => {
      this.licProviderList = licProviderList
    });



    let licenceConditionManager: LicenceConditionManager = new LicenceConditionManager();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('licenceConditionId')) {
        licenceConditionManager.licenceConditionId = params['licenceConditionId'];
      }
    });
    this.authorizationService.getAuthorizationData(LicenceConditionManagerConstants.featureId, LicenceConditionManagerConstants.tableId).map(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(LicenceConditionManagerConstants.featureId, res[0]);
        this.dataService.addFeatureFields(LicenceConditionManagerConstants.featureId, res[1]);
      }
    }).flatMap(data =>
      this.licenceConditionManagerService.sortFilterAndPaginate(licenceConditionManager,null,null)).subscribe((data: any) => {
        this.licenceConditionManagers = data.content;
        this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = licenceConditionManager;
      });
  }

  sort(sortObj){
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, this.sortFilterPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    //sortObj.field = "firstName";
    this.licenceConditionManagerService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.licenceConditionManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  delete(licenceConditionManagerId: number) {
    let licenceConditionManager: LicenceConditionManager = new LicenceConditionManager();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('licenceConditionId')) {
        licenceConditionManager = params['licenceConditionId'];
      }
    });

    if (confirm("Are you sure you want to delete?")) {
      this.licenceConditionManagerService.delete(licenceConditionManagerId).subscribe((data: any) => {
        this.licenceConditionManagerService.sortFilterAndPaginate(licenceConditionManager,null,null).subscribe((data: LicenceConditionManager[]) => {
          this.licenceConditionManagers = data;
        });
      });
    }
  }
   
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(LicenceConditionManagerConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(LicenceConditionManagerConstants.featureId, field, "Read");
  }
}
