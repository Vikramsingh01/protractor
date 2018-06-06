import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { PssRequirementService } from "../pss-requirement.service";
import { PssRequirement } from "../pss-requirement";
import { PssRequirementConstants } from '../pss-requirement.constants';
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
import { EventService } from '../../event/event.service';

@Component({
  selector: 'tr-pss-requirement',
  templateUrl: 'pss-requirement-list.component.html'
})
export class PssRequirementListComponent implements OnInit {

  @Input() pssRequirementId: number;
  private searchObjs: any[] = [];
  pssRequirementList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private pssAddNotAllowed: boolean = false;
  private isLicenceCondActive: boolean = false;
  pssRequirementFilterForm: FormGroup;
  private terminationReasonIdList: any[] = [];
  private psProviderIdList: any[] = [];
  private pssRequirementTypeMainCategoryIdList: any[] = [];
  private pssRequirementTypeSubCategoryIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private eventJson: any[] = [];
  private isPSSAllowed: boolean = false;
  private action: any;
  private profileId: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private pssRequirementService: PssRequirementService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder,
    private eventService: EventService) {
  }

  ngOnInit() {
    this.listService.getListData(199).subscribe(terminationReasonIdList => {
      this.terminationReasonIdList = terminationReasonIdList;
    });
    this.listService.getListData(193).subscribe(psProviderIdList => {
      this.psProviderIdList = psProviderIdList;
    });
    this.listService.getListData(197).subscribe(pssRequirementTypeMainCategoryIdList => {
      this.pssRequirementTypeMainCategoryIdList = pssRequirementTypeMainCategoryIdList;
    });
    this.listService.getListData(198).subscribe(pssRequirementTypeSubCategoryIdList => {
      this.pssRequirementTypeSubCategoryIdList = pssRequirementTypeSubCategoryIdList;
    });
    let pssRequirement: PssRequirement = new PssRequirement();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        pssRequirement.eventId = params['eventId'];
      }
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(PssRequirementConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(PssRequirementConstants.featureId, PssRequirementConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(PssRequirementConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(PssRequirementConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(PssRequirementConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PssRequirementConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.eventService.getEvent(pssRequirement.eventId).subscribe((response: any) => {
          this.eventJson = this.pssRequirementService.removeConstantsFields(response);
          this.pssRequirementService.complexRefDataRequestForDisposal(this.eventJson).subscribe((breResponse: any) => {
            if (breResponse != null && breResponse.resultMap != null && breResponse.resultMap.fieldObjectList != null && breResponse.resultMap.fieldObjectList.length > 0) {
              breResponse.resultMap.fieldObjectList.forEach(element => {
                if (element.fieldName === "isPSSAllowed" && element.active === true) {
                  this.isPSSAllowed = true;
                }
              });
            }

          });
        });

        this.pssRequirementService.getCustodyLocationCurrentByEventId(pssRequirement.eventId).subscribe((data: any) => {
          if (data.currentStatus == "In Custody" || data.currentStatus == "Recalled") {
            this.pssAddNotAllowed = true;
          }
        })

        // this.pssRequirementService.isLicenceConditionActive(pssRequirement.eventId).subscribe((data: any) => {
        //   if (data !=null && data > 0) {
        //     this.isLicenceCondActive = true;
        //   }
        // })

        this.pssRequirementService.sortFilterAndPaginate(pssRequirement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.pssRequirementList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = pssRequirement;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'pssRequirementTypeMainCategoryId', 'type': 'dropdown', 'tableId': '197', 'label': 'Pss Requirement Type Main Category Id' },
      { 'field': 'pssRequirementTypeSubCategoryId', 'type': 'dropdown', 'tableId': '198', 'label': 'Pss Requirement Type Sub Category Id' },
      { 'field': 'expectedStartDate', 'type': 'date', 'label': 'Expected Start Date' },
      { 'field': 'actualStartDate', 'type': 'date', 'label': 'Actual Start Date' },
    ];

  }

  delete(pssRequirementId: number) {
    let pssRequirement: PssRequirement = new PssRequirement();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        pssRequirement.eventId = params['eventId'];
      }
    });
    this.action = "ARCHIVE";

    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.pssRequirementService.deletePssRequirement(pssRequirementId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });

  }


  reset() {
    this.pssRequirementFilterForm.reset();
    let pssRequirement: PssRequirement = new PssRequirement();
    this.sortFilterAndPaginate(pssRequirement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchPssRequirement(filterObj) {
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
    this.pssRequirementService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.pssRequirementList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(PssRequirementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(PssRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(PssRequirementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(PssRequirementConstants.featureId, field, "Read");
  }
}
