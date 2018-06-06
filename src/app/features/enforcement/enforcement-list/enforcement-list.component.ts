import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { EnforcementService } from "../enforcement.service";
import { Enforcement } from "../enforcement";
import { EnforcementConstants } from '../enforcement.constants';
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
import { Event } from '../../event/event';
import { EventService } from '../../event/event.service';

@Component({
  selector: 'tr-enforcement',
  templateUrl: 'enforcement-list.component.html',
})
export class EnforcementListComponent implements OnInit {
  event: Event = new Event();
  private eventId: number;
  @Input() contactId: number;
  private searchObjs: any[] = [];
  enforcementList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  enforcementFilterForm: FormGroup;
  private processTypeIdList: any[] = [];
  private processSubTypeIdList: any[] = [];
  private processStageIdList: any[] = [];
  private processOutcomeIdList: any[] = [];
  private categoryList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  officeTeams: any = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private enforcementService: EnforcementService, private eventService: EventService,
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
    this.initForm();
    this.titleService.setTitle("Enforcements");
    this.listService.getListData(192).subscribe(processTypeIdList => {
      this.processTypeIdList = processTypeIdList;
    });
    this.listService.getListData(170).subscribe(processSubTypeIdList => {
      this.processSubTypeIdList = processSubTypeIdList;
    });
    this.listService.getListData(191).subscribe(processStageIdList => {
      this.processStageIdList = processStageIdList;
    });
    this.listService.getListData(169).subscribe(processOutcomeIdList => {
      this.processOutcomeIdList = processOutcomeIdList;
    });
    this.listService.getListData(2546).subscribe(categoryList => {
      this.categoryList = categoryList;
    });
    let enforcement: Enforcement = new Enforcement();
    this.route.params.subscribe((params: any) => {

    });
    this.listService.getListDataByLookupAndPkValue(263, 533, this.dataService.getLoggedInUserId()).subscribe(listObj => {
      this.officeTeams = listObj;
    });
    //this.authorizationService.getAuthorizationDataByTableId(EnforcementConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(EnforcementConstants.featureId, EnforcementConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(EnforcementConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(EnforcementConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(EnforcementConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(EnforcementConstants.featureId, "Read");
      if (this.authorizedFlag) {

        this.enforcementService.sortFilterAndPaginate(enforcement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.enforcementList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = enforcement;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

    this.searchObjs = [
      { 'field': 'teamId', 'type': 'dropdown', 'lookup': '503', 'label': 'CRC' },
      { 'field': 'offenderIdentityId', 'type': 'dropdown', 'lookup': '521', 'label': 'CRN' },
       { 'field': 'categoryId', 'type': 'dropdown', 'tableId': '2546' ,'label': 'Category' },
    ];

  }
  updateCourtWorkList(value: boolean) {
    if (value) {
      this.enforcementService.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
        this.enforcementList = data.content;
        this.sortSearchPaginationObj.paginationObj = data;
        //this.sortSearchPaginationObj.filterObj = filterObj;

      })
    }
  }
  delete(contactId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.enforcementService.deleteEnforcement(contactId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.enforcementFilterForm.controls['teamId'].setValue('');
    this.enforcementFilterForm.controls['caseReferenceNumber'].setValue('');
    this.enforcementFilterForm.controls['categoryId'].setValue('');
    let enforcement: Enforcement = new Enforcement();
    this.sortFilterAndPaginate(enforcement, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchEnforcement() {
    this.sortFilterAndPaginate(this.enforcementFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
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
    this.enforcementService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.enforcementList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(EnforcementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(111, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(EnforcementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(EnforcementConstants.featureId, field, "Read");
  }

  initForm() {
    this.enforcementFilterForm = this._fb.group({
      teamId: [''],
      caseReferenceNumber: [''],
      categoryId: [''],
    });

  }

}
