import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { TerminateEventService } from "../terminate-event.service";
import { TerminateEvent } from "../terminate-event";
import { TerminateEventConstants } from '../terminate-event.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';

@Component({
  selector: 'tr-terminate-event',
  templateUrl: 'terminate-event-list.component.html'
})
export class TerminateEventListComponent implements OnInit {

    @Input() terminateEventId: number;
    private searchObjs: any[] = [];
    terminateEventList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    terminateEventFilterForm: FormGroup;
                                                                                                                                                                              private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private terminateEventService: TerminateEventService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder) {
  }

  ngOnInit() {
                                                                                                                                                                                let terminateEvent: TerminateEvent = new TerminateEvent();
    this.route.params.subscribe((params: any)=>{

    });
    //this.authorizationService.getAuthorizationDataByTableId(TerminateEventConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(TerminateEventConstants.featureId, TerminateEventConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(TerminateEventConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(TerminateEventConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(TerminateEventConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TerminateEventConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.terminateEventService.sortFilterAndPaginate(terminateEvent, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.terminateEventList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = terminateEvent;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                                            ];
    
  }

  delete(terminateEventId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.terminateEventService.deleteTerminateEvent(terminateEventId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.terminateEventFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


  reset(){
    this.terminateEventFilterForm.reset();
    let terminateEvent: TerminateEvent = new TerminateEvent();
    this.sortFilterAndPaginate(terminateEvent, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchTerminateEvent(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    this.terminateEventService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.terminateEventList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(TerminateEventConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(TerminateEventConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(TerminateEventConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(TerminateEventConstants.featureId, field, "Read");
  }
}
