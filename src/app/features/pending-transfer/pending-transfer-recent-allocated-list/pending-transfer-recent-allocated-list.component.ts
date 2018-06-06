import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { PendingTransferService } from "../pending-transfer.service";
import { PendingTransfer } from "../pending-transfer";
import { PendingTransferConstants } from '../pending-transfer.constants';
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
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-pending-transfer-recent-allocated',
  templateUrl: 'pending-transfer-recent-allocated-list.component.html'
})
export class PendingTransferRecentAllocatedListComponent implements OnInit {

  @Input() pendingTransferId: number;
  private searchObjs: any[] = [];
  pendingTransferList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  pendingTransferFilterForm: FormGroup;
  private yesValue;
  private noValue;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private pendingTransferService: PendingTransferService,
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
    this.titleService.setTitle('Pending Transfers');
    this.sortSearchPaginationObj.sortObj.field="dateTimeReceived";

    
    this.yesValue = this.listService.getPkValueByTableIdAndCode(244,'Y');

    this.noValue = this.listService.getPkValueByTableIdAndCode(244,'N');

    let pendingTransfer: PendingTransfer = new PendingTransfer();
    this.route.params.subscribe((params: any) => {

    });
  
    //this.authorizationService.getAuthorizationDataByTableId(PendingTransferConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(PendingTransferConstants.featureId, PendingTransferConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(PendingTransferConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(PendingTransferConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(PendingTransferConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PendingTransferConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.pendingTransferService.sortFilterAndPaginateRecentAllocated(pendingTransfer, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.pendingTransferList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          
          this.sortSearchPaginationObj.filterObj = pendingTransfer;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

 
    

  }

  openPopup(profileId, transferRequestId){
    let laoAuthorized = this.isLaoAuthorized('Read');
    // if(!laoAuthorized){
      this.headerService.setErrorPopup({"errorMessage":"You are not permitted to view this record, please contact a system administrator."});
    // }else {
    //   this.router.navigate(['/pending-transfer',profileId, transferRequestId]);
    // }
  }

 
  searchPendingTransfer(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj) {
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj) {
    
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    
    this.pendingTransferService.sortFilterAndPaginateRecentAllocated(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.pendingTransferList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isLaoAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(PendingTransferConstants.featureLaoId, action);
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(PendingTransferConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(PendingTransferConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(PendingTransferConstants.tableId, field, "Read", this.authorizationData);
    return true;
    //return this.authorizationService.isFeildAuthorized(PendingTransferConstants.featureId, field, "Read");
  }
}
