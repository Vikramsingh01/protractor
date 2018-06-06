import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RequirementManagerService } from "./requirementmanager.service";
import { RequirementManager } from "./requirementmanager";
import { RequirementManagerConstants } from "./requirementmanager.constants";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { FilterPipe } from '../../generic-components/filter/filter.pipe';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';


@Component({
  selector: 'tr-requirementmanager',
  templateUrl: 'requirementmanager.component.html',
  
  providers: [RequirementManagerService],
  


})
export class RequirementManagerComponent implements OnInit {

  @Input() requirementManagerId: number;

  requirementManagers: RequirementManager[];
  allocationReasonList:any[];
  providerList:any[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
		private route: ActivatedRoute,
    private requirementManagerService: RequirementManagerService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
     private listService: ListService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {

    
    this.listService.getListData(143).subscribe(allocationReasonList=>{
      this.allocationReasonList =allocationReasonList
      });

       this.listService.getListData(193).subscribe(data=>{
      this.providerList =data
      });
      let requirementManager: RequirementManager = new RequirementManager();
        this.route.params.subscribe((params: any)=>{
          if(params.hasOwnProperty('communityrequirementId')) {
            requirementManager.communityRequirementId= params['communityrequirementId'];
          }
        });
    this.authorizationService.getAuthorizationData(RequirementManagerConstants.featureId,RequirementManagerConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(RequirementManagerConstants.featureId, res[0]);
		this.dataService.addFeatureFields(RequirementManagerConstants.featureId, res[1]);
	}
	}).flatMap(data=>    
  this.requirementManagerService.searchRequirementManager(requirementManager)).subscribe((data) => {
      this.requirementManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = requirementManager;
    });
  }

  delete(requirementManagerId: number) {
	let requirementManager: RequirementManager = new RequirementManager();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('communityrequirementId')) {
				requirementManager.communityRequirementId = params['communityrequirementId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.requirementManagerService.delete(requirementManagerId).subscribe((data: any) => {
        this.requirementManagerService.searchRequirementManager(requirementManager).subscribe((data) => {
          this.requirementManagers = data.content;
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
    this.requirementManagerService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.requirementManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(RequirementManagerConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(RequirementManagerConstants.featureId, field, "Read");
  
}
}
