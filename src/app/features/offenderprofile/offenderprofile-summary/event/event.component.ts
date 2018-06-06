import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { EventService } from "../../../event/event.service";
import { Event } from "../../../event/event";
import { EventConstants } from "../../../event/event.constants";
import { TokenService } from '../../../../services/token.service';
import { DataService } from '../../../../services/data.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../../shared/utility';
import { AuthenticationGuard } from '../../../../guards/authentication.guard';
import { ListService } from '../../../../services/list.service';
import { SortFilterPagination } from '../../../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-summary-event',
  templateUrl: 'event.component.html',

  providers: [EventService]

})
export class SummaryEventComponent implements OnInit {

  @Input() eventId: number;

  events: Event[];
  listMainOffence:any[];
  lisOfOrderType: any[];
  outcomeList: any[];

  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private eventService: EventService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    ) {
  }

  ngOnInit() {
    this.sortFilterPaginationObj.paginationObj.size = 2;
    let event: Event = new Event();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('profileId')) {
				event.profileId = params['profileId'];
			}
		});
    let sortFields: any[] = [];
	this.authorizationService.getAuthorizationData(EventConstants.featureId,EventConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(EventConstants.featureId, res[0]);
		this.dataService.addFeatureFields(EventConstants.featureId, res[1]);
	}
	}).flatMap(data=>this.eventService.sortFilterAndPaginate(event, this.sortFilterPaginationObj.paginationObj, sortFields)).subscribe((data: any) => {
      this.events = data.content;
      this.events.forEach(event => {
        this.eventService.getCodeForEventType(event.eventId).subscribe((data: any) => {
          let eventId = event.eventId;
          if (data._body == '' || data._body.length <= 0) {
            this.dataService.setEventData({eventId: eventId, value: true});
          }else{
            this.dataService.setEventData({eventId: eventId, value: false});
          }
        });
      });
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = event;
    });

  this.listService.getListData(173).subscribe(listMainOffence=>{
      this.listMainOffence = listMainOffence;
  });

  this.listService.getListData(421).subscribe(lisOfOrderType=>{
      this.lisOfOrderType = lisOfOrderType;
  });

  }

    sort(sortObj){
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    let sortFields: any[] = [];

    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, sortFields);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    //sortObj.field = "firstName";
    this.eventService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.events = data.content;
      this.events.forEach(event => {
        this.eventService.getCodeForEventType(event.eventId).subscribe((data: any) => {
          let eventId = event.eventId;
          if (data._body == '' || data._body.length <= 0) {
            this.dataService.setEventData({eventId: eventId, value: true});
          }else{
            this.dataService.setEventData({eventId: eventId, value: false});
          }
        });
      });
      this.sortFilterPaginationObj.paginationObj = data;

    });
  }

  delete(eventId: number) {
	let event: Event = new Event();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('profileId')) {
				event.profileId = params['profileId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.eventService.delete(eventId).subscribe((data: any) => {
        this.eventService.searchEvent(event).subscribe((data: any) => {
          this.events = data;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(EventConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(EventConstants.featureId, field, 'Read');
  }
}
