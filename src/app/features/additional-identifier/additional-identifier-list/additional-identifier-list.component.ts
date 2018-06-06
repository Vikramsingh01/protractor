import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AdditionalIdentifierService } from "../additional-identifier.service";
import { AdditionalIdentifier } from "../additional-identifier";
import { AdditionalIdentifierConstants } from '../additional-identifier.constants';
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
  selector: 'tr-additional-identifier',
  templateUrl: 'additional-identifier-list.component.html'
})
export class AdditionalIdentifierListComponent implements OnInit {

  @Input() additionalIdentifierId: number;
  private searchObjs: any[] = [];
  additionalIdentifierList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  additionalIdentifierFilterForm: FormGroup;
  private identifierTypeIdList: any[] = [];
  private action;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private additionalIdentifierService: AdditionalIdentifierService,
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
    this.listService.getListData(79).subscribe(identifierTypeIdList => {
      this.identifierTypeIdList = identifierTypeIdList;
    });
    let additionalIdentifier: AdditionalIdentifier = new AdditionalIdentifier();
    this.route.params.subscribe((params: any) => {
       if (params.hasOwnProperty('profileId')) {
        additionalIdentifier.profileId = params['profileId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(AdditionalIdentifierConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(AdditionalIdentifierConstants.featureId, AdditionalIdentifierConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(AdditionalIdentifierConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(AdditionalIdentifierConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(AdditionalIdentifierConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdditionalIdentifierConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.additionalIdentifierService.sortFilterAndPaginate(additionalIdentifier, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.additionalIdentifierList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = additionalIdentifier;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'profileId', 'type': 'hidden', value: additionalIdentifier.profileId },
      { 'field': 'identifierTypeId', 'type': 'dropdown', 'tableId': '79', 'label': 'Identifier Type' },
    ];

  }

  delete(additionalIdentifierId: number) {

       let additionalIdentifier: AdditionalIdentifier = new AdditionalIdentifier();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        additionalIdentifier.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.additionalIdentifierService.isAuthorize(additionalIdentifier.profileId,this.action).subscribe((response: any) => {
      
                if (response) {
      this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.additionalIdentifierService.deleteAdditionalIdentifier(additionalIdentifierId).subscribe((data: any) => {
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
    this.additionalIdentifierFilterForm.reset();
    let additionalIdentifier: AdditionalIdentifier = new AdditionalIdentifier();
    this.sortFilterAndPaginate(additionalIdentifier, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchAdditionalIdentifier(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
    this.sortSearchPaginationObj.paginationObj.number = 0;
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
    this.additionalIdentifierService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.additionalIdentifierList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(AdditionalIdentifierConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AdditionalIdentifierConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(AdditionalIdentifierConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AdditionalIdentifierConstants.featureId, field, "Read");
  }
}
