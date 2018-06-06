import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { CustodyLocationService } from "../custody-location.service";
import { CustodyLocation } from "../custody-location";
import { CustodyLocationConstants } from '../custody-location.constants';
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
  selector: 'tr-custody-location',
  templateUrl: 'custody-location-list.component.html'
})
export class CustodyLocationListComponent implements OnInit {

    @Input() custodyLocationId: number;
    private searchObjs: any[] = [];
    custodyLocationList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    custodyLocationFilterForm: FormGroup;
                                            private currentLocationIdList: any[] = [];
                                                                                                                                                                  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private custodyLocationService: CustodyLocationService,
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
    this.titleService.setTitle("Custody Location");
                                            this.listService.getListData(135).subscribe(currentLocationIdList => {
        this.currentLocationIdList = currentLocationIdList;
    });
                                                                                                                                                                    let custodyLocation: CustodyLocation = new CustodyLocation();
    this.route.params.subscribe((params: any)=>{

    });
    //this.authorizationService.getAuthorizationDataByTableId(CustodyLocationConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(CustodyLocationConstants.featureId, CustodyLocationConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CustodyLocationConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CustodyLocationConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyLocationConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyLocationConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.custodyLocationService.sortFilterAndPaginate(custodyLocation, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.custodyLocationList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = custodyLocation;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                                                                                            ];
    
  }

  delete(custodyLocationId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.custodyLocationService.deleteCustodyLocation(custodyLocationId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


  reset(){
    this.custodyLocationFilterForm.reset();
    let custodyLocation: CustodyLocation = new CustodyLocation();
    this.sortFilterAndPaginate(custodyLocation, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchCustodyLocation(filterObj) {
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
    this.custodyLocationService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.custodyLocationList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CustodyLocationConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CustodyLocationConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CustodyLocationConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CustodyLocationConstants.featureId, field, "Read");
  }
}
