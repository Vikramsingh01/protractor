import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { RecentAllocationsService } from "../recent-allocations.service";
import { RecentAllocations } from "../recent-allocations";
import { RecentAllocationsConstants } from '../recent-allocations.constants';
import { TokenService } from '../../../../services/token.service';
import { DataService } from '../../../../services/data.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../../shared/utility';
import { AuthenticationGuard } from '../../../../guards/authentication.guard';
import { ListService } from '../../../../services/list.service';
import { HeaderService } from '../../../../views/header/header.service';
import { FilterPipe } from '../../../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../../../generic-components/search/sort-search-pagination';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmService } from '../../../../generic-components/confirm-box/confirm.service';
import { ContactService } from '../../../contact/contact.service';
import { IDate } from '../../../../generic-components/date-picker';
import { ValidationService } from '../../../../generic-components/control-messages/validation.service';

@Component({
  selector: 'tr-recent-allocations',
  templateUrl: 'recent-allocations-list.component.html'
})
export class RecentAllocationsListComponent implements OnInit {

    private systemDate: Date;
    @Input() recentAllocationsId: number;
    private searchObjs: any[] = [];
    recentAllocationsList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    recentAllocationsFilterForm: FormGroup;
    private officerIds: any = [];
    private todayDate:IDate={year:new Date().getFullYear(),month:new Date().getMonth()+1,day:new Date().getDate()-1}
    private dateOption:any={disableUntil:this.todayDate}
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private recentAllocationsService: RecentAllocationsService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private contactService: ContactService,
    private _fb: FormBuilder,
    private titleService: Title) {
  }

  ngOnInit() {
    this.setDefaultDate();
    this.initForm();
    this.titleService.setTitle("Recent Allocations");
                                                                                                                                                                       let recentAllocations: RecentAllocations = new RecentAllocations();
    this.route.params.subscribe((params: any)=>{

    });

    /* this.contactService.getLoggedInUserTeamId().subscribe(data=>{
      if(data!=null && data.hasOwnProperty("teamId")&& data.teamId!=null){
          var  selectedTeamId=data.teamId;
          
      }
  }); */

  this.listService.getListDataByLookupAndPkValue(270, 535, this.dataService.getLoggedInUserId()).subscribe(listObj => {
    this.officerIds = listObj;
});

    //this.authorizationService.getAuthorizationDataByTableId(RecentAllocationsConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(RecentAllocationsConstants.featureId, RecentAllocationsConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(RecentAllocationsConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(RecentAllocationsConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(RecentAllocationsConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RecentAllocationsConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.sortSearchPaginationObj.sortObj.field = 'allocationDate';
          this.sortSearchPaginationObj.sortObj.sort = 'desc';
         
            this.recentAllocationsService.sortFilterAndPaginate(recentAllocations, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.recentAllocationsList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = recentAllocations;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                            ];
    
  }

  delete(recentAllocationsId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.recentAllocationsService.deleteRecentAllocations(recentAllocationsId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


  reset(){
    this.recentAllocationsFilterForm.reset();
    let recentAllocations: RecentAllocations = new RecentAllocations();
    this.sortSearchPaginationObj= new SortSearchPagination();
    this.sortSearchPaginationObj.sortObj.field = 'allocationDate';
    this.sortSearchPaginationObj.sortObj.sort = 'desc';
    this.sortFilterAndPaginate(recentAllocations, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchRecentAllocations() {
    if(this.recentAllocationsFilterForm.valid){
      this.sortSearchPaginationObj= new SortSearchPagination();
      this.sortSearchPaginationObj.filterObj =  this.recentAllocationsFilterForm.value;
      this.sortSearchPaginationObj.sortObj.field = 'allocationDate';
      this.sortSearchPaginationObj.sortObj.sort = 'desc';
      this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);  
    }
    
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
    this.recentAllocationsService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.recentAllocationsList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(RecentAllocationsConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(RecentAllocationsConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(RecentAllocationsConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(RecentAllocationsConstants.featureId, field, "Read");
  }

  initForm(){
    this.recentAllocationsFilterForm= this._fb.group({
      serviceUser:1,
      personIdentifier:[],
      caseReferenceNumber: [],
      familyName:[],
      firstName:[],
      type:[],
      startDate:['',Validators.compose([ValidationService.DateBeforeGeneric(Utility.convertDateToString(this.systemDate))])]

    });
  }
  setDefaultDate(){
    this.systemDate = new Date();
    this.systemDate.setDate(this.systemDate.getDate()-28);
    this.todayDate={year:this.systemDate.getFullYear(),month:this.systemDate.getMonth()+1,day:this.systemDate.getDate()-1}
    this.dateOption={disableUntil:this.todayDate};
  }
}
