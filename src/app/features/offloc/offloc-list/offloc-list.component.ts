import {Component, Input, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {Title} from "@angular/platform-browser";
import {OfflocRequestService} from "../offloc-request.service";
import {OfflocResponseService} from "../offloc-response.service";
import {Offloc} from "../offloc";
import {OfflocConstants} from '../offloc.constants';
import {TokenService} from '../../../services/token.service';
import {DataService} from '../../../services/data.service';
import {AuthorizationService} from '../../../services/authorization.service';
import {Router, ActivatedRoute} from "@angular/router";
import {Utility} from '../../../shared/utility';
import {AuthenticationGuard} from '../../../guards/authentication.guard';
import {ListService} from '../../../services/list.service';
import {HeaderService} from '../../../views/header/header.service';
import {FilterPipe} from '../../../generic-components/filter/filter.pipe';
import {SortSearchPagination} from '../../../generic-components/search/sort-search-pagination';
import {NgForm, FormGroup, FormBuilder} from "@angular/forms";
import {ConfirmService} from '../../../generic-components/confirm-box/confirm.service';
import {OfflocRequest} from "../offloc-request";
import {OffenderProfileService} from "../../offenderprofile/offenderprofile.service";
import {Observable} from "rxjs/Rx";
import {CustodyLocationService} from "../../custody-location/custody-location.service";
import {SortFilterPagination} from '../../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-offloc',
  templateUrl: 'offloc-list.component.html'
})
export class OfflocListComponent implements OnInit {

  @Input() offlocId: number;
  private searchObjs: any[] = [];
  offlocList: any[] = [];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  offlocFilterForm: FormGroup;
  isRequested: boolean = false;
  private searchToken: any;
  isRefreshed: boolean = false;

  familyName: string;
  firstName: string;
  dateOfBirth: any;
  pnc: any;
  gender: any;
  prisonerNumber: any;
  croNumber: any;
  nomisNumber: any;
  profileId: any;
  eventId: any;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private offlocRequestService: OfflocRequestService,
              private offlocResponseService: OfflocResponseService,
              private dataService: DataService,
              private tokenService: TokenService,
              private authorizationService: AuthorizationService,
              private authenticationGuard: AuthenticationGuard,
              private listService: ListService,
              private headerService: HeaderService,
              private confirmService: ConfirmService,
              private _fb: FormBuilder,
              private titleService: Title,
              private offenderProfileService: OffenderProfileService,
              private custodyLocationService: CustodyLocationService) {
  }

  ngOnInit() {
    this.titleService.setTitle("Search DSS");

    let offloc: Offloc = new Offloc();
    this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
      this.eventId = params['eventId'];
    });

    //this.authorizationService.getAuthorizationDataByTableId(OfflocConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(OfflocConstants.featureId, OfflocConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(OfflocConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(OfflocConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(OfflocConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OfflocConstants.featureId, "Read");
      if (this.authorizedFlag) {

        this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe(data => {
          this.familyName = data.familyName;
          this.firstName = data.firstName;
          this.dateOfBirth = data.dateOfBirth;
          this.pnc = data.pncNumber;
          this.gender = this.listService.getLabelByTableIdAndPkId(2, data.genderId);
          this.croNumber = data.croNumber;
          this.nomisNumber = data.nomsNumber;
        });
        this.custodyLocationService.getCustodyLocationByEventId(this.eventId).subscribe(data => {
          this.prisonerNumber = data.prisonerNumber;
        })

      } else {
        this.headerService.setAlertPopup("You are not authorized to view this page.");
      }
    });
    this.searchObjs = [];
  }

  sendRequest() {
    let offlocRequest: OfflocRequest = new OfflocRequest();
    offlocRequest.eventId = this.route.snapshot.params['eventId'];
    offlocRequest.spgOfflocRequestId = 0;
    this.offlocRequestService.addOfflocRequest(offlocRequest).subscribe(data => {
      this.offlocList = [];
      this.searchToken = data.offlocRequestId;
      this.isRequested = true;
    });
  }

  initiateRefresh(): void {
    if(this.isRequested == true && this.searchToken){
      this.offlocResponseService.sortFilterAndPaginate({"crcSearchId": this.searchToken}, {"size":2}, null).subscribe(data => {
        this.sortSearchPaginationObj.paginationObj = data;
        this.isRefreshed = true;
        this.isRequested = false;
        this.offlocList = [];
        this.offlocList = data.content;
      });
    }
  }

  delete(offlocId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.offlocRequestService.deleteOfflocRequest(offlocId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.offlocFilterForm.reset();
    let offloc: Offloc = new Offloc();
    this.sortFilterAndPaginate(offloc, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  searchOffloc(filterObj) {
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
    this.offlocResponseService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.offlocList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(OfflocConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(OfflocConstants.featureId, action);
  }

  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(OfflocConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(OfflocConstants.featureId, field, "Read");
  }
}
