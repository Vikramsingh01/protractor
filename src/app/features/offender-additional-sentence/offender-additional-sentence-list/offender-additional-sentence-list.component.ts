import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { OffenderAdditionalSentenceService } from "../offender-additional-sentence.service";
import { OffenderAdditionalSentence } from "../offender-additional-sentence";
import { OffenderAdditionalSentenceConstants } from '../offender-additional-sentence.constants';
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
  selector: 'tr-offender-additional-sentence',
  templateUrl: 'offender-additional-sentence-list.component.html'
})
export class OffenderAdditionalSentenceListComponent implements OnInit {

  @Input() offenderAdditionalSentenceId: number;
  private searchObjs: any[] = [];
  offenderAdditionalSentenceList: any[];
  private authorizationData: any;
  private eventId;
  private profileId;
  private authorizedFlag: boolean = false;
  offenderAdditionalSentenceFilterForm: FormGroup;
  private additionalSentenceIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private offenderAdditionalSentenceService: OffenderAdditionalSentenceService,
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
    this.titleService.setTitle("Additional Sentence");
    this.listService.getListData(82).subscribe(additionalSentenceIdList => {
      this.additionalSentenceIdList = additionalSentenceIdList;
    });
    let offenderAdditionalSentence: OffenderAdditionalSentence = new OffenderAdditionalSentence();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        offenderAdditionalSentence.eventId = params['eventId'];
        this.eventId = params['eventId'];
      }
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(OffenderAdditionalSentenceConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(OffenderAdditionalSentenceConstants.featureId, OffenderAdditionalSentenceConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(OffenderAdditionalSentenceConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(OffenderAdditionalSentenceConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(OffenderAdditionalSentenceConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OffenderAdditionalSentenceConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.offenderAdditionalSentenceService.sortFilterAndPaginate(offenderAdditionalSentence, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.offenderAdditionalSentenceList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = offenderAdditionalSentence;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'additionalSentenceId', 'type': 'dropdown', 'tableId': '82', 'label': 'Additional Sentence Id' },
      { 'field': 'length', 'type': 'text', 'label': 'Length' },
      { 'field': 'amount', 'type': 'text', 'label': 'Amount' },
    ];

  }

  navigateTo(url) {
       this.router.navigate(url, {relativeTo: this.route});
    }

  delete(offenderAdditionalSentenceId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.offenderAdditionalSentenceService.deleteOffenderAdditionalSentence(offenderAdditionalSentenceId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.offenderAdditionalSentenceFilterForm.reset();
    let offenderAdditionalSentence: OffenderAdditionalSentence = new OffenderAdditionalSentence();
    this.sortFilterAndPaginate(offenderAdditionalSentence, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchOffenderAdditionalSentence(filterObj) {
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
    this.offenderAdditionalSentenceService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.offenderAdditionalSentenceList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(OffenderAdditionalSentenceConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(OffenderAdditionalSentenceConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(OffenderAdditionalSentenceConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(OffenderAdditionalSentenceConstants.featureId, field, "Read");
  }
}
