import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RateCardInterventionService } from "./rate-card-intervention.service";
import { RateCardIntervention } from "./rate-card-intervention";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { RateCardInterventionConstants } from './rate-card-intervention.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { ListService } from '../../services/list.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-rate-card-intervention',
  templateUrl: 'rate-card-intervention.component.html',
  
  providers: [RateCardInterventionService]

})
export class RateCardInterventionComponent implements OnInit {

  @Input() rateCardInterventionId: number;

  rateCardInterventions: RateCardIntervention[];
  private rateCardInterventionMainCategoryList: any[];
  private rateCardInterventionSubCategoryList: any[];  
  private rateCardInterventionstatusList: any[];
  private rateCardInterventionOutcomeList: any[];
  private intendedProviderList: any[];
  private interventionProviderList: any[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();
	
  constructor(private router: Router,
		private route: ActivatedRoute,
    private rateCardInterventionService: RateCardInterventionService,
    private dataService: DataService,
    private tokenService: TokenService,
    private listService: ListService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {
     this.listService.getListData(192).subscribe(rateCardInterventionMainCategoryList=>{
       this.rateCardInterventionMainCategoryList = rateCardInterventionMainCategoryList ;
     });
     this.listService.getListData(170).subscribe(rateCardInterventionSubCategoryList=>{
       this.rateCardInterventionSubCategoryList = rateCardInterventionSubCategoryList; 
     });
     this.listService.getListData(191).subscribe(rateCardInterventionstatusList=>{
       this.rateCardInterventionstatusList = rateCardInterventionstatusList; 
     });
     this.listService.getListData(169).subscribe(rateCardInterventionOutcomeList=>{
       this.rateCardInterventionOutcomeList = rateCardInterventionOutcomeList; 
     });
     this.listService.getListData(193).subscribe(intendedProviderList=>{
       this.intendedProviderList = intendedProviderList;
     });
     this.listService.getListData(193).subscribe(interventionProviderList=>{
       this.interventionProviderList = interventionProviderList; 
     });
	let rateCardIntervention: RateCardIntervention = new RateCardIntervention();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('profileId')) {
				rateCardIntervention.profileId = params['profileId'];
			}
		});
	this.authorizationService.getAuthorizationData(RateCardInterventionConstants.featureId,RateCardInterventionConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(RateCardInterventionConstants.featureId, res[0]);
		this.dataService.addFeatureFields(RateCardInterventionConstants.featureId, res[1]);
	}
	}).flatMap(data=>
	this.rateCardInterventionService.sortFilterAndPaginate(rateCardIntervention, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj)).subscribe((data) => {
      this.rateCardInterventions = data.content;
       this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = rateCardIntervention;
    });
  }

  delete(rateCardInterventionId: number) {
	let rateCardIntervention: RateCardIntervention = new RateCardIntervention();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('profileId')) {
				rateCardIntervention.profileId = params['profileId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.rateCardInterventionService.delete(rateCardInterventionId).subscribe((data: any) => {
        this.rateCardInterventionService.getRateCardInterventions().subscribe((data: RateCardIntervention[]) => {
          this.rateCardInterventions = data;
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
    this.rateCardInterventionService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.rateCardInterventions = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(RateCardInterventionConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(RateCardInterventionConstants.featureId, field, "Read");
  }
}
