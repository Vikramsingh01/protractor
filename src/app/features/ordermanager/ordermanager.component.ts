import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { OrderManagerService } from "./ordermanager.service";
import { OrderManager } from "./ordermanager";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { OrderManagerConstants } from './ordermanager.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-ordermanager',
  templateUrl: 'ordermanager.component.html',
  
  providers: [OrderManagerService]

})
export class OrderManagerComponent implements OnInit {

  @Input() orderManagerId: number;

  orderManagers: OrderManager[];
  providerList:any[]
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
		private route: ActivatedRoute,
    private orderManagerService: OrderManagerService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService:ListService) {
  }

  ngOnInit() {

 this.listService.getListData(193).subscribe(data=>{
       this.providerList = data 
     });


	let orderManager: OrderManager = new OrderManager();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				orderManager.eventId = params['eventId'];
			}
		});
	this.authorizationService.getAuthorizationData(OrderManagerConstants.featureId,OrderManagerConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(OrderManagerConstants.featureId, res[0]);
		this.dataService.addFeatureFields(OrderManagerConstants.featureId, res[1]);
	}
	}).flatMap(data=>
	this.orderManagerService.sortFilterAndPaginate(orderManager, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj)).subscribe((data: any) => {
      this.orderManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = orderManager;
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
    this.orderManagerService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.orderManagers = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  delete(orderManagerId: number) {
	let orderManager: OrderManager = new OrderManager();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				orderManager.eventId = params['eventId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.orderManagerService.delete(orderManagerId).subscribe((data: any) => {
        this.orderManagerService.sortFilterAndPaginate(orderManager, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj).subscribe((data: any) => {
          this.orderManagers = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(OrderManagerConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(OrderManagerConstants.featureId, field, "Read");
  }
}
