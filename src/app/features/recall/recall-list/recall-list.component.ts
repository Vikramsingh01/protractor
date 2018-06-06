import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { RecallService } from "../recall.service";
import { Recall } from "../recall";
import { RecallConstants } from '../recall.constants';
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
  selector: 'tr-recall',
  templateUrl: 'recall-list.component.html'
})
export class RecallListComponent implements OnInit {

  @Input() recallId: number;
  private searchObjs: any[] = [];
  recallList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  recallFilterForm: FormGroup;
  private isActiveRelease: boolean = false;
  private isEventTerminated: boolean = false;
  private isSEDLessThanCurrrentDate: boolean = false;
  private isActiveRecall: boolean = false;
  private recallReasonIdList: any[] = [];
  private recallLocationIdList: any[] = [];
  private isPssActive: boolean = false;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private recallService: RecallService,
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
    this.titleService.setTitle("Recall");
    this.listService.getListData(200).subscribe(recallReasonIdList => {
      this.recallReasonIdList = recallReasonIdList;
    });
    this.listService.getListData(135).subscribe(recallLocationIdList => {
      this.recallLocationIdList = recallLocationIdList;
    });
    let recall: Recall = new Recall();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        recall.eventId = params['eventId'];
      }

    });
    //this.authorizationService.getAuthorizationDataByTableId(RecallConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(RecallConstants.featureId, RecallConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(RecallConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(RecallConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(RecallConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RecallConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.recallService.getActiveRelease(recall.eventId).subscribe((response: any) => {
          if (response != null && response > 0) {
            this.isActiveRelease = true;
          }
        });
        this.recallService.sortFilterAndPaginate(recall, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.recallList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = recall;
        })
        this.recallService.getActiveRecall(recall.eventId).subscribe((count: any) => {
          if (count != null && count > 0) {
            this.isActiveRecall = true;
          }
        });
        this.recallService.isEventTerminated(recall.eventId).subscribe((response: any) => {
          if (response != null && response > 0) {
            this.isEventTerminated = true;
          }
        });
        this.recallService.isSentenceExpiryDateGreaterThanSysDate(recall.eventId).subscribe((response: any) => {
          if (response._body == 'true') {
            this.isSEDLessThanCurrrentDate = true;
          }
        });
        this.recallService.isCustodyPssActive(recall.eventId).subscribe((response: any) => {
          if (response._body > 0) {
            this.isPssActive = true;
          }
        });
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

    this.searchObjs = [
      { 'field': 'recallDate', 'type': 'date', 'label': 'Recall Date' },
      { 'field': 'recallReasonId', 'type': 'dropdown', 'tableId': '200', 'label': 'Recall Reason Id' },
    ];

  }

  delete(recallId: number) {
    this.confirmService.confirm(
      {
        message: 'You are about to undo this Recall. Ensure associated Licence Conditions are re-entered.',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.recallService.deleteRecall(recallId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.recallFilterForm.reset();
    let recall: Recall = new Recall();
    this.sortFilterAndPaginate(recall, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchRecall(filterObj) {
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
    this.recallService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.recallList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(RecallConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(RecallConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(RecallConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(RecallConstants.featureId, field, "Read");
  }
}
