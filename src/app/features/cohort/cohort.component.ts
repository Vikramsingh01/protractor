import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CohortService } from "./cohort.service";
import { Cohort } from "./cohort";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { CohortConstants } from './cohort.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-cohort',
  templateUrl: 'cohort.component.html',
  
  providers: [CohortService]

})
export class CohortComponent implements OnInit {

  @Input() cohortId: number;

  cohorts: Cohort[];
  listProvider:any[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
		private route: ActivatedRoute,
    private cohortService: CohortService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService) {
  }

  ngOnInit() {
	let cohort: Cohort = new Cohort();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				cohort.eventId = params['eventId'];
			}
		});

     this.listService.getListData(193).subscribe(listProvider=>{
      this.listProvider = listProvider;
  });


	this.authorizationService.getAuthorizationData(CohortConstants.featureId,CohortConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(CohortConstants.featureId, res[0]);
		this.dataService.addFeatureFields(CohortConstants.featureId, res[1]);
	}
	}).flatMap(data=>
	this.cohortService.sortFilterAndPaginate(cohort, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj)).subscribe((data: any) => {
      this.cohorts = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = cohort;
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
    this.cohortService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.cohorts = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  delete(cohortId: number) {
	let cohort: Cohort = new Cohort();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				cohort.eventId = params['eventId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.cohortService.delete(cohortId).subscribe((data: any) => {
        this.cohortService.searchCohort(cohort).subscribe((data: any) => {
          this.cohorts = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(CohortConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(CohortConstants.featureId, field, "Read");
  }
}
