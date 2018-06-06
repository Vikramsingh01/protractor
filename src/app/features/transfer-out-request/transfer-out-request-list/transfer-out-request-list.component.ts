import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { TransferOutRequestService } from "../transfer-out-request.service";
import { TransferOutRequest } from "../transfer-out-request";
import { TransferOutRequestConstants } from '../transfer-out-request.constants';
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
  selector: 'tr-transfer-out-request',
  templateUrl: 'transfer-out-request-list.component.html'
})
export class TransferOutRequestListComponent implements OnInit {

  @Input() transferOutRequestId: number;
  private searchObjs: any[] = [];
  filterForm: FormGroup;
  transferOutRequestList: any[];
  transferOutRequest:TransferOutRequest
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  transferOutRequestFilterForm: FormGroup;
  
  private transferFromProviderIdList: any[] = [];
  private transferToProviderIdList: any[] = [];
   private descriptionIdList: any[] = [];
  private transferReasonIdList: any[] = [];
  private providerList;
  private excludeCodes;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private transferOutRequestService: TransferOutRequestService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder,
    private _titleService: Title) {
  }

  ngOnInit() {
    this._titleService.setTitle('Transfer Out Request');
    this.listService.getListData(193).subscribe(transferFromProviderIdList => {
      this.transferFromProviderIdList = transferFromProviderIdList;
    });
    this.listService.getListData(193).subscribe(transferToProviderIdList => {
      this.transferToProviderIdList = transferToProviderIdList;
    });
    this.listService.getListData(337).subscribe(descriptionIdList => {
      this.descriptionIdList = descriptionIdList;
    });
      this.listService.getListData(17).subscribe(descriptionIdList => {
      this.descriptionIdList = descriptionIdList;
    });
    this.listService.getListData(228).subscribe(transferReasonIdList => {
      this.transferReasonIdList = transferReasonIdList;
    });
    let transferOutRequest: TransferOutRequest = new TransferOutRequest();
    this.route.params.subscribe((params: any) => {

    });
    this.transferOutRequestService.getProviderFilteredList().subscribe(data => {
      this.providerList = data.providerList;

    this.searchObjs = [
     { 'field': 'familyName', 'type': 'text', 'label': 'Surname' },
      { 'field': 'transferFromProviderId', 'type': 'dropdown', 'tableId': '193', 'label': 'From Provider' , 'excludeCodes':this.providerList },
      { 'field': 'transferToProviderId', 'type': 'dropdown', 'tableId': '193', 'label': 'To Provider', 'excludeCodes':this.providerList },
      { 'field': 'requestDate', 'type': 'date', 'label': 'Request Date (start)' },
      { 'field': 'requestEndDate', 'type': 'date', 'label': 'Request Date (end)' },
      { 'field': 'type', 'type': 'text', 'tableId': '228', 'label': 'Type' },
    ];

  });
    //this.authorizationService.getAuthorizationDataByTableId(TransferOutRequestConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(TransferOutRequestConstants.featureId, TransferOutRequestConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(TransferOutRequestConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(TransferOutRequestConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(TransferOutRequestConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TransferOutRequestConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.sortSearchPaginationObj.sortObj.field="requestDate";
        transferOutRequest.statusId = this.listService.getPkValueByTableIdAndCode(229, 'PN');
        this.transferOutRequestService.sortFilterAndPaginate(transferOutRequest, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.transferOutRequestList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = transferOutRequest;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

  }

  delete(transferOutRequestId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.transferOutRequestService.deleteTransferOutRequest(transferOutRequestId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.transferOutRequestFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.transferOutRequestFilterForm.reset();
    this.sortSearchPaginationObj.paginationObj.number=0;
    let transferOutRequest: TransferOutRequest = new TransferOutRequest();
    this.sortFilterAndPaginate(transferOutRequest, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchTransferOutRequest(filterObj) {
  
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
     
    if(filterObj['familyName']=="")
        filterObj['familyName']=null;
    if(filterObj['transferFromProviderId']=="")
        filterObj['transferFromProviderId']=null;
    if(filterObj['transferToProviderId']=="")
        filterObj['transferToProviderId']=null;    
    if(filterObj['requestDate']=="")
        filterObj['requestDate']=null;
	  if(filterObj['requestEndDate']=="")
        filterObj['requestEndDate']=null;
    if(filterObj['type']=="")
        filterObj['type']=null;
      
    
    this.sortFilterAndPaginate(filterObj,this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
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
    this.sortSearchPaginationObj.sortObj.field="requestDate";
    sortObj.field="requestDate";
    this.transferOutRequestService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      if(data.hasOwnProperty('content')){
      this.transferOutRequestList = data.content;
      }else{
    this.transferOutRequestList = data;
      }
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(TransferOutRequestConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(TransferOutRequestConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(TransferOutRequestConstants.tableId, field, "Read", this.authorizationData);
    //return this.authorizationService.isFeildAuthorized(TransferOutRequestConstants.featureId, field, "Read");
    return true;
  }

  // initForm() {
  //       this.transferOutRequestAddForm = this._fb.group({
  //           transferToProviderId: ['', Validators.compose([Validators.required, , ,])],
  //           transferToTeam: [{value:'Unallocated',disabled: true}, Validators.compose([Validators.required, , ,])],
  //           transferToOfficer: [{value:'Unallocated',disabled: true}, Validators.compose([Validators.required, , ,])],
  //           transferOutRequests : this._fb.array([]),
  //       });
  //   }
 


}
