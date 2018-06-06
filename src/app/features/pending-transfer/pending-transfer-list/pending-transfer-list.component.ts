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
  selector: 'tr-pending-transfer',
  templateUrl: 'pending-transfer-list.component.html'
})
export class PendingTransferListComponent implements OnInit {

  @Input() pendingTransferId: number;
  private searchObjs: any[] = [];
  pendingTransferList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  pendingTransferFilterForm: FormGroup;
  private senderIdList: any[] = [];
  private targetIdList: any[] = [];
  private yesValue;
  private noValue;
  private providerList;
  private excludeCodes;
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

  /*  this.pendingTransferService.getProviderFilteredList().subscribe(data => {
      this.senderIdList = data.providerList;
    });*/

    this.listService.getListData(193).subscribe(senderIdList => {
      this.senderIdList = senderIdList;
      this.targetIdList = senderIdList;
    });
    this.listService.getListData(244).subscribe(yesNoList=>{
      this.yesValue = this.listService.getPkValueByTableIdAndCode(244, 'Y');
      this.noValue = this.listService.getPkValueByTableIdAndCode(244, 'N');
    });


    let pendingTransfer: PendingTransfer = new PendingTransfer();
    this.route.params.subscribe((params: any) => {

    });
   this.pendingTransferService.getProviderFilteredList().subscribe(data => {
      this.providerList = data.providerList;
      this.searchObjs = [
      { 'field': 'dateReceived', 'type': 'date', 'label': 'Date Sent' },
      { 'field': 'crn', 'type': 'text', 'label': 'CRN' },
      { 'field': 'senderId', 'type': 'dropdown', 'tableId': '193', 'label': 'Sender','excludeCodes':this.providerList},
      { 'field': 'categoryId', 'type': 'dropdown', 'tableId': '2546', 'label': 'Category' }
    ];
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

        this.pendingTransferService.sortFilterAndPaginate(pendingTransfer, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.pendingTransferList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;

          this.sortSearchPaginationObj.filterObj = pendingTransfer;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });




  }
//, 'excludeCodes':'senderIdList'
  delete(pendingTransferId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.pendingTransferService.deletePendingTransfer(pendingTransferId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }

  openPopup(profileId, transferRequestId){
    let laoAuthorized = this.isLaoAuthorized('Read');
    if(!laoAuthorized){
      this.headerService.setErrorPopup({"errorMessage":"You are not permitted to view this record, please contact a system administrator."});
    }else {
      this.router.navigate(['/pending-transfer',profileId, transferRequestId]);
    }
  }

  reset() {
    this.pendingTransferFilterForm.reset();
    let pendingTransfer: PendingTransfer = new PendingTransfer();
    this.sortFilterAndPaginate(pendingTransfer, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
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

    this.pendingTransferService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
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
