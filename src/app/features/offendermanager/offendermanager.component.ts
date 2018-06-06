import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { OffenderManagerService } from "./offendermanager.service";
import { OffenderManager } from "./offendermanager";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { OffenderManagerConstants } from './offendermanager.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { FilterPipe } from '../../generic-components/filter/filter.pipe';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';
import { Location }               from '@angular/common';
@Component({
  selector: 'tr-offendermanager',
  templateUrl: 'offendermanager.component.html',
  
  providers: [OffenderManagerService],
  

})
export class OffenderManagerComponent implements OnInit {

  @Input() offenderManagerId: number;

  offenderManagers: OffenderManager[];

  allocationReasonList: any[];
  providerList: any[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private offenderManagerService: OffenderManagerService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
     private location: Location) {
  }

  ngOnInit() {
    this.listService.getListData(144).subscribe(allocationReasonList => {
      this.allocationReasonList = allocationReasonList
    });
    this.listService.getListData(193).subscribe(providerList => {
      this.providerList = providerList;
    });

    let offenderManager: OffenderManager = new OffenderManager();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        offenderManager.profileId = params['profileId'];
      }
    });
    this.authorizationService.getAuthorizationData(OffenderManagerConstants.featureId, OffenderManagerConstants.tableId).map(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(OffenderManagerConstants.featureId, res[0]);
        this.dataService.addFeatureFields(OffenderManagerConstants.featureId, res[1]);
      }
    }).flatMap(data =>
      this.offenderManagerService.sortFilterAndPaginate(offenderManager, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj)).subscribe((data: any) => {
        this.offenderManagers = data.content;
        this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = offenderManager;
      });
  }

 goBack(): void {
    this.location.back();
  }
  delete(offenderManagerId: number) {
    let offenderManager: OffenderManager = new OffenderManager();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        offenderManager.profileId = params['profileId'];
      }
    });

    if (confirm("Are you sure you want to delete?")) {
      this.offenderManagerService.delete(offenderManagerId).subscribe((data: any) => {
        this.offenderManagerService.searchOffenderManager(offenderManager).subscribe((data: any) => {
          this.offenderManagers = data.content;
        });
      });
    }
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
    this.offenderManagerService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.offenderManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(OffenderManagerConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(OffenderManagerConstants.featureId, field, "Read");
  }
}
