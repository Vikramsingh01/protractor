import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { PssRequirementManagerService } from "./pss-requirement-manager.service";
import { PssRequirementManager } from "./pss-requirement-manager";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { PssRequirementManagerConstants } from './pss-requirement-manager.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { FilterPipe } from '../../generic-components/filter/filter.pipe';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-pss-requirement-manager',
  templateUrl: 'pss-requirement-manager.component.html',
  
  providers: [PssRequirementManagerService],
   

})
export class PssRequirementManagerComponent implements OnInit {

  @Input() pssRequirementManagerId: number;
 allocationreasonList: any[];

  pssRequirementManagers: PssRequirementManager[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
		private route: ActivatedRoute,
    private pssRequirementManagerService: PssRequirementManagerService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
     private listService: ListService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {

this.listService.getListData(195).subscribe(allocationreasonList=>{
      this.allocationreasonList = allocationreasonList 
    });

	let pssRequirementManager: PssRequirementManager = new PssRequirementManager();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('pssRequirementId')) {
				pssRequirementManager.pssRequirementId = params['pssRequirementId'];
			}
		});
	this.authorizationService.getAuthorizationData(PssRequirementManagerConstants.featureId,PssRequirementManagerConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(PssRequirementManagerConstants.featureId, res[0]);
		this.dataService.addFeatureFields(PssRequirementManagerConstants.featureId, res[1]);
	}
	}).flatMap(data=>
	this.pssRequirementManagerService.sortFilterAndPaginate(pssRequirementManager, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj)).subscribe((data: any) => {
      this.pssRequirementManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = pssRequirementManager;
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
    this.pssRequirementManagerService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.pssRequirementManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  delete(pssRequirementManagerId: number) {
	let pssRequirementManager: PssRequirementManager = new PssRequirementManager();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('pssRequirementId')) {
				pssRequirementManager.pssRequirementId = params['pssRequirementId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.pssRequirementManagerService.delete(pssRequirementManagerId).subscribe((data: any) => {
        this.pssRequirementManagerService.searchPssRequirementManager(pssRequirementManager).subscribe((data: any) => {
          this.pssRequirementManagers = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(PssRequirementManagerConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(PssRequirementManagerConstants.featureId, field, "Read");
  }
}
