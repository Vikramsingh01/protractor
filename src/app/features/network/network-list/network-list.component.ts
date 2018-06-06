import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NetworkService } from "../network.service";
import { Network } from "../network";
import { NetworkConstants } from '../network.constants';
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
  selector: 'tr-network',
  templateUrl: 'network-list.component.html'
})
export class NetworkListComponent implements OnInit {

    @Input() personalcontactId: number;

    private searchObjs: any[] = [];
    networkList: any[];
    networks: Network[];
    private authorizationData: any;
    private action;
    private authorizedFlag: boolean = false;
    networkFilterForm: FormGroup;
    private genderIdList: any[] = [];
    private titleIdList: any[] = [];
    private relationshipIdList: any[] = [];
                                                                                                                                                                                                                  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private networkService: NetworkService,
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
        this.listService.getListData(2).subscribe(genderIdList => {
        this.genderIdList = genderIdList;
    });
        this.listService.getListData(227).subscribe(titleIdList => {
        this.titleIdList = titleIdList;
    });
     this.listService.getListData(187).subscribe(relationshipIdList => {
        this.relationshipIdList = relationshipIdList;
    });
         
     let network: Network = new Network();
    this.route.params.subscribe((params: any)=>{
     if(params.hasOwnProperty('profileId')) {
			network.profileId = params['profileId'];
			}
    });

    //this.authorizationService.getAuthorizationDataByTableId(NetworkConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(NetworkConstants.featureId, NetworkConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(NetworkConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(NetworkConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(NetworkConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(NetworkConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.networkService.sortFilterAndPaginate(network, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.networkList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = network;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                            { 'field': 'genderId', 'type': 'dropdown',  'tableId':'2', 'label': 'Gender Id' },
                            { 'field': 'titleId', 'type': 'dropdown',  'tableId':'227', 'label': 'Title Id' },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ];
    
  }

  delete(personalcontactId: number) {
       let network: Network = new Network();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        network.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.networkService.isAuthorize(network.profileId,this.action).subscribe((response: any) => {
               
       if (response) {
    this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.networkService.deleteNetwork(personalcontactId).subscribe((data: any) => {
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
    this.networkFilterForm.reset();
    let network: Network = new Network();
    this.sortFilterAndPaginate(network, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchNetwork(filterObj) {
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
    this.networkService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.networkList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(NetworkConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(NetworkConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(NetworkConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(NetworkConstants.featureId, field, "Read");
  }
}
