import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AllocateProcessService } from "./allocateprocess.service";
import { AllocateProcess } from "./allocateprocess";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { ListService } from '../../services/list.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AllocateProcessConstants } from './allocateprocess.constants';
import { SortSearchPagination } from '../../generic-components/search/sort-search-pagination';

@Component({
  selector: 'tr-allocateprocess',
  templateUrl: 'allocateprocess.component.html',
  
  providers: [AllocateProcessService]

})
export class AllocateProcessComponent implements OnInit {

  @Input() allocateProcessId: number;
  private searchObjs : any[] = [];

  allocateProcesss: AllocateProcess[];
  processSubTypeList: any[];
  processOutcomeList: any[];
  processStageList: any[];
  processTypeList: any[];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private allocateProcessService: AllocateProcessService,
    private dataService: DataService,
    private tokenService: TokenService,
    private listService: ListService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {

     this.listService.getListData(170).subscribe(processSubTypeList => {
      this.processSubTypeList = processSubTypeList;
    });
    this.listService.getListData(191).subscribe(processStageList => {
      this.processStageList = processStageList;
    });
    this.listService.getListData(191).subscribe(processStageList => {
      this.processStageList = processStageList;
    });

    this.listService.getListData(192).subscribe(processTypeList => {
      this.processTypeList = processTypeList;
    });


    let allocateProcess: AllocateProcess = new AllocateProcess();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        allocateProcess.profileId = params['profileId'];
      }
    });
    this.searchObjs = [
    {'field':'processTypeId', 'type':'dropdown', 'tableId':'192', 'label':'Process Type'}, 
    {'field':'processSubTypeId', 'type':'dropdown', 'tableId':'170', 'label':'Process SubType'},
    {'field':'profileId', 'type':'hidden', 'value':allocateProcess.profileId}
  ];
    this.authorizationService.getAuthorizationData(AllocateProcessConstants.featureId, AllocateProcessConstants.tableId).map(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(AllocateProcessConstants.featureId, res[0]);
        this.dataService.addFeatureFields(AllocateProcessConstants.featureId, res[1]);
      }
    }).flatMap(data => this.allocateProcessService.sortSearchPagination(allocateProcess, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj)).subscribe(data => {
      this.allocateProcesss = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
      this.sortSearchPaginationObj.filterObj = allocateProcess;
    })
  }
  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortSearchPagination(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }

  search(filterObj){
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortSearchPagination(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortSearchPagination(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortSearchPagination(filterObj, paginationObj, sortObj){
    this.allocateProcessService.sortSearchPagination(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.allocateProcesss = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  delete(allocateProcessId: number) {
    if (confirm("Are you sure you want to delete?")) {
      let allocateProcess: AllocateProcess = new AllocateProcess();
      this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('profileId')) {
          allocateProcess.profileId = params['profileId'];
        }
      });
      this.allocateProcessService.delete(allocateProcessId).subscribe((data: any) => {
        this.allocateProcessService.searchAllocateProcess(allocateProcess).subscribe((data: any) => {
          this.allocateProcesss = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(AllocateProcessConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(AllocateProcessConstants.featureId, field, "Read");
  }
}
