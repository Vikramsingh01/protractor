import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { CustodyKeyDateService } from "../custody-key-date.service";
import { CustodyKeyDate } from "../custody-key-date";
import { CustodyKeyDateConstants } from '../custody-key-date.constants';
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
  selector: 'tr-custody-key-date',
  templateUrl: 'custody-key-date-list.component.html'
})
export class CustodyKeyDateListComponent implements OnInit {

    @Input() custodyKeyDateId: number;
    private searchObjs: any[] = [];
    custodyKeyDateList: any[];
    private viewDataArray: any;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    custodyKeyDateFilterForm: FormGroup;
    private action;
                                                                                                                                                    private keyDateTypeIdList: any[] = [];
                  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private custodyKeyDateService: CustodyKeyDateService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder,
    private titleService: Title) {
  }

  ngOnInit() {
    //this.titleService.setTitle("Custody Key Date");
                                                                                                                                                    this.listService.getListData(223).subscribe(keyDateTypeIdList => {
        this.keyDateTypeIdList = keyDateTypeIdList;
    });
                    let custodyKeyDate: CustodyKeyDate = new CustodyKeyDate();
    this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('eventId')) {
        custodyKeyDate.eventId = params['eventId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(CustodyKeyDateConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(CustodyKeyDateConstants.featureId, CustodyKeyDateConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CustodyKeyDateConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CustodyKeyDateConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyKeyDateConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyKeyDateConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.custodyKeyDateService.sortFilterAndPaginate(custodyKeyDate, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.custodyKeyDateList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = custodyKeyDate;
            })
     
         this.custodyKeyDateService.getPTOfficer(custodyKeyDate.eventId).subscribe(data => {
         console.log(data);
         this.viewDataArray = data;
        })    
  
   } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                        { 'field': 'keyDateTypeId', 'type': 'dropdown',  'tableId':'223', 'label': 'Key Date Type Id' },
                                                { 'field': 'keyDate', 'type': 'date', 'label': 'Key Date' },
                                    ];
    
  }

  delete(custodyKeyDateId: number) {
     let custodyKeyDate: CustodyKeyDate = new CustodyKeyDate();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        custodyKeyDate.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.custodyKeyDateService.isAuthorize(custodyKeyDate.profileId,this.action).subscribe((response: any) => {
             
                if (response) {
     this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.custodyKeyDateService.deleteCustodyKeyDate(custodyKeyDateId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
      }
       else {
               this.headerService.setErrorPopup({errorMessage: "You are not authorised to perform this action on this SU record. Please contact the Case Manager."});
            }    
            });
      
    }


  reset(){
    this.custodyKeyDateFilterForm.reset();
    let custodyKeyDate: CustodyKeyDate = new CustodyKeyDate();
    this.sortFilterAndPaginate(custodyKeyDate, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchCustodyKeyDate(filterObj) {
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
    this.custodyKeyDateService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.custodyKeyDateList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CustodyKeyDateConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CustodyKeyDateConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CustodyKeyDateConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CustodyKeyDateConstants.featureId, field, "Read");
  }
}
