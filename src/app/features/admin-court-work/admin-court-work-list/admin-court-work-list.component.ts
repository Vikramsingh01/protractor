import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { AdminCourtWorkService } from "../admin-court-work.service";
import { AdminCourtWork } from "../admin-court-work";
import { AdminCourtWorkConstants } from '../admin-court-work.constants';
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
  selector: 'tr-admin-court-work',
  templateUrl: 'admin-court-work-list.component.html',
})
export class AdminCourtWorkListComponent implements OnInit {
  event: Event = new Event();
  private eventId: number;
  @Input() adminCourtWorkId: number;
  private searchObjs: any[] = [];
  adminCourtWorkList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  adminCourtWorkFilterForm: FormGroup;
  private processTypeIdList: any[] = [];
  private processSubTypeIdList: any[] = [];
  private processStageIdList: any[] = [];
  private processOutcomeIdList: any[] = [];
  private categoryList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  reqTypeIds: number[] = [];
  officeTeams: any = [];
  private excludeCodes;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private adminCourtWorkService: AdminCourtWorkService, private eventService: EventService,
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
    this.titleService.setTitle("Court Work");
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
    let adminCourtWork: AdminCourtWork = new AdminCourtWork();
    this.route.params.subscribe((params: any) => {

    });

    this.listService.getListDataByLookupAndPkValue(263, 533, this.dataService.getLoggedInUserId()).subscribe(listObj => {
      this.officeTeams = listObj;
    });
    // this.listService.getListDataByLookupAndPkValue(0, 533, this.dataService.getLoggedInUserId()).subscribe(officeTeams => {
    //    this.officeTeams = officeTeams;
    // });

    //this.authorizationService.getAuthorizationDataByTableId(AdminCourtWorkConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(AdminCourtWorkConstants.featureId, AdminCourtWorkConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(AdminCourtWorkConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(AdminCourtWorkConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(AdminCourtWorkConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdminCourtWorkConstants.featureId, "Read");
      if (this.authorizedFlag) {

        this.adminCourtWorkService.sortFilterAndPaginate(adminCourtWork, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.adminCourtWorkList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = adminCourtWork;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

    this.adminCourtWorkService.getRequestTypeFilteredTypeList().subscribe(data => {
      this.reqTypeIds = data.reqTypeIds;
    })


    this.searchObjs = [
      { 'field': 'profileId', 'type': 'hidden', 'value': adminCourtWork.profileId },
      { 'field': 'processTypeId', 'type': 'dropdown', 'tableId': '192', 'label': 'Request Type' },
      { 'field': 'officeTeamId', 'type': 'dropdown', 'tableId': '445', 'label': 'team' },
      { 'field': 'categoryId', 'type': 'dropdown', 'tableId': '2546','label': 'Category' },
    ];

  }
  updateCourtWorkList(value: boolean) {
    if (value) {
      this.adminCourtWorkService.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
        this.adminCourtWorkList = data.content;
        this.sortSearchPaginationObj.paginationObj = data;
        //this.sortSearchPaginationObj.filterObj = filterObj;

      })
    }
  }
  delete(adminCourtWorkId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.adminCourtWorkService.deleteAdminCourtWork(adminCourtWorkId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.adminCourtWorkFilterForm.controls['processTypeId'].setValue('');
    this.adminCourtWorkFilterForm.controls['officeTeamId'].setValue('');
    this.adminCourtWorkFilterForm.controls['categoryId'].setValue('');
    this.adminCourtWorkFilterForm.controls['caseReferenceNumber'].setValue('');
    let adminCourtWork: AdminCourtWork = new AdminCourtWork();
    this.adminCourtWorkService.sortFilterAndPaginate(adminCourtWork, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((data: any) => {
      this.adminCourtWorkList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
      this.sortSearchPaginationObj.filterObj = adminCourtWork;
      this.sortSearchPaginationObj.sortObj.field = "";
    });

  }
  searchCourtWork() {
    this.sortSearchPaginationObj.filterObj = this.adminCourtWorkFilterForm.value
    this.sortFilterAndPaginate(this.adminCourtWorkFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
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
    this.adminCourtWorkService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.adminCourtWorkList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(AdminCourtWorkConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(110, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(AdminCourtWorkConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AdminCourtWorkConstants.featureId, field, "Read");
  }

  initForm() {
    this.adminCourtWorkFilterForm = this._fb.group({
      processTypeId: [''],
      officeTeamId: [''],
      caseReferenceNumber: [''],
      categoryId: [''],
    });

  }

}
