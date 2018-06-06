import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { EngagementHistoryService } from "./engagement-history.service";
import { EngagementHistory } from "./engagement-history";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { EngagementHistoryConstants } from './engagement-history.constants';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-engagement-history',
  templateUrl: 'engagement-history.component.html',
  
  providers: [EngagementHistoryService]

})
export class EngagementHistoryComponent implements OnInit {

  @Input() engagementHistoryId: number;
  private offenderId;

  engagementHistorys: EngagementHistory[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private engagementHistoryService: EngagementHistoryService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {
     this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('offenderId')) {
       this.offenderId = params['offenderId'];
      }
    });


    this.authorizationService.getAuthorizationData(EngagementHistoryConstants.featureId, EngagementHistoryConstants.tableId).map(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(EngagementHistoryConstants.featureId, res[0]);
        this.dataService.addFeatureFields(EngagementHistoryConstants.featureId, res[1]);
      }
    }).flatMap(data => this.engagementHistoryService.getEngagementHistorysByOffenderId(this.offenderId)).subscribe(data => {
      this.engagementHistorys = data.content;
    })
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
    this.engagementHistoryService.sortFilterAndPaginate(filterObj, paginationObj, sortObj, this.offenderId).subscribe((data: any)=>{
      this.engagementHistorys = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  delete(engagementHistoryId: number) {
    if (confirm("Are you sure you want to delete?")) {
      this.engagementHistoryService.delete(engagementHistoryId).subscribe((data: any) => {
        this.engagementHistoryService.getEngagementHistorys().subscribe((data: EngagementHistory[]) => {
          this.engagementHistorys = data;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(EngagementHistoryConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(EngagementHistoryConstants.featureId, field, "Read");
  }
}
