import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { CustodyPssService } from "../custody-pss.service";
import { CustodyPss } from "../custody-pss";
import { CustodyPssConstants } from '../custody-pss.constants';
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
  selector: 'tr-custody-pss',
  templateUrl: 'custody-pss-list.component.html'
})
export class CustodyPssListComponent implements OnInit {

  @Input() eventId: number;
  private searchObjs: any[] = [];
  private isReleaseActive: boolean = false;
  private isFirstCustodyPSS: boolean = false;
  custodyPssList: any[];
  private disposalJson: any[] = [];
  private isPssApplies: boolean = false;
  private isEventTerminated: boolean = false;
  private isSEDLessThanCurrrentDate: boolean = false;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  custodyPssFilterForm: FormGroup;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private custodyPssService: CustodyPssService,
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
    this.sortSearchPaginationObj.sortObj.field = null;
    this.sortSearchPaginationObj.filterObj = null;

    this.titleService.setTitle("PSS");
    let custodyPss: CustodyPss = new CustodyPss();
    this.route.params.subscribe((params: any) => {

    });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        custodyPss.eventId = params['eventId'];
        this.eventId = params['eventId'];
      }

    });
    //this.authorizationService.getAuthorizationDataByTableId(CustodyPssConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(CustodyPssConstants.featureId, CustodyPssConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(CustodyPssConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(CustodyPssConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyPssConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyPssConstants.featureId, "Read");
      if (this.authorizedFlag) {

        this.custodyPssService.getDisposalByEventId(custodyPss.eventId).subscribe((response: any) => {
          this.disposalJson = this.custodyPssService.removeConstantsFields(response);
          this.custodyPssService.complexRefDataRequestForDisposal(this.disposalJson).subscribe((breResponse: any) => {
            if(breResponse != null && breResponse.resultMap != null && breResponse.resultMap.fieldObjectList != null && breResponse.resultMap.fieldObjectList.length > 0)
            breResponse.resultMap.fieldObjectList.forEach(element => {
              if (element.fieldName === "isPSSAllowed" && element.active === true) {
                this.isPssApplies = true;
              }
            });
          });
        });

        this.custodyPssService.sortFilterAndPaginate(custodyPss, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.custodyPssList = data.content;
          if (this.custodyPssList.length == 0) {
            this.isFirstCustodyPSS = true;
          }
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = custodyPss;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

    this.custodyPssService.isAnyReleaseActive(custodyPss.eventId).subscribe((response: any) => {
      if (response > 0) {
        this.isReleaseActive = true;
      }
    });

    this.custodyPssService.isEventTerminated(custodyPss.eventId).subscribe((response: any) => {
      if (response != null && response > 0) {
        this.isEventTerminated = true;
      }
    });

    this.custodyPssService.isSentenceExpiryDateGreaterThanSysDate(custodyPss.eventId).subscribe((response: any) => {
      if (response._body == 'true') {
        this.isSEDLessThanCurrrentDate = true;
      }
    });

    this.searchObjs = [
    ];

  }

  delete(eventId: number) {
    this.confirmService.confirm(
      {
        message: 'You are about to undo this Post Sentence Supervision. Check for any inaccuracies in PSS Requirements and adjust accordingly.',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.custodyPssService.deleteCustodyPss(eventId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.custodyPssFilterForm.reset();
    let custodyPss: CustodyPss = new CustodyPss();
    this.sortFilterAndPaginate(custodyPss, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchCustodyPss(filterObj) {
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
    this.custodyPssService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.custodyPssList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CustodyPssConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CustodyPssConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CustodyPssConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CustodyPssConstants.featureId, field, "Read");
  }
}
