import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AliasService } from "../alias.service";
import { Alias } from "../alias";
import { AliasConstants } from '../alias.constants';
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
  selector: 'tr-alias',
  templateUrl: 'alias-list.component.html'
})
export class AliasListComponent implements OnInit {

  @Input() aliasId: number;
  private searchObjs: any[] = [];
  aliasList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  aliasFilterForm: FormGroup;
   private action;
  private genderIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private aliasService: AliasService,
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
    let alias: Alias = new Alias();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        alias.profileId = params['profileId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(AliasConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(AliasConstants.featureId, AliasConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(AliasConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(AliasConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AliasConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.aliasService.sortFilterAndPaginate(alias, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.aliasList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = alias;
        })
      } else {
        this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
      }
    });


    this.searchObjs = [
      { 'field': 'profileId', 'type': 'hidden', 'value': alias.profileId },
      { 'field': 'firstName', 'type': 'text', 'label': 'First Name' },
      { 'field': 'secondName', 'type': 'text', 'label': 'Second Name' },
      { 'field': 'thirdName', 'type': 'text', 'label': 'Third Name' },
      { 'field': 'familyName', 'type': 'text', 'label': 'Family Name' },
      { 'field': 'dateOfBirth', 'type': 'date', 'label': 'Date Of Birth' },
      { 'field': 'genderId', 'type': 'dropdown', 'tableId': '2', 'label': 'Gender' },
    ];

  }

  delete(aliasId: number) {
    let alias: Alias = new Alias();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        alias.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.aliasService.isAuthorize(alias.profileId,this.action).subscribe((response: any) => {
          
                if (response) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.aliasService.deleteAlias(aliasId).subscribe((data: any) => {
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


  reset() {
    this.aliasFilterForm.reset();
    let alias: Alias = new Alias();
    
    this.sortFilterAndPaginate(alias, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchAlias(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    //this.sortSearchPaginationObj.paginationObj = new SortSearchPagination().paginationObj;
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
    this.aliasService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.aliasList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(AliasConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AliasConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(AliasConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AliasConstants.featureId, field, "Read");
  }
}
