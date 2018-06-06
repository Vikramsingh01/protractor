import {Component, Input, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ReferralService} from "../referral.service";
import {Referral} from "../referral";
import {ReferralConstants} from '../referral.constants';
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
import {Location} from "@angular/common";
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-referral',
  templateUrl: 'referral-list.component.html'
})
export class ReferralListComponent implements OnInit {

  @Input() referralId: number;
  private searchObjs: any[] = [];
  referralList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private profileId;
  private eventId;
  private action;
  referralFilterForm: FormGroup;
  private referralTypeIdList: any[] = [];
  private referralOutcomeIdList: any[] = [];
  private referralSourceIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private referralService: ReferralService,
              private dataService: DataService,
              private tokenService: TokenService,
              private authorizationService: AuthorizationService,
              private authenticationGuard: AuthenticationGuard,
              private listService: ListService,
              private headerService: HeaderService,
              private confirmService: ConfirmService,
              private _fb: FormBuilder,
              private location: Location,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Referral');
    this.listService.getListData(203).subscribe(referralTypeIdList => {
      this.referralTypeIdList = referralTypeIdList;
    });
    this.listService.getListData(131).subscribe(referralOutcomeIdList => {
      this.referralOutcomeIdList = referralOutcomeIdList;
    });
    this.listService.getListData(202).subscribe(referralSourceIdList => {
      this.referralSourceIdList = referralSourceIdList;
    });
    let referral: Referral = new Referral();
    this.route.params.subscribe((params: any) => {
       if (params.hasOwnProperty('eventId')) {
        referral.eventId = params['eventId'];
        this.eventId = params['eventId'];
      }
       if (params.hasOwnProperty('profileId')) {
            this.profileId = params['profileId'];
        }
    });
    //this.authorizationService.getAuthorizationDataByTableId(ReferralConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(ReferralConstants.featureId, ReferralConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(ReferralConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(ReferralConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(ReferralConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ReferralConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.referralService.sortFilterAndPaginate(referral, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.referralList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = referral;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
    //  {'field': 'referralTypeId', 'type': 'dropdown', 'tableId': '203', 'label': 'Referral Type Id'},
     // {'field': 'referralDate', 'type': 'date', 'label': 'Referral Date'},
     // {'field': 'referralOutcomeId', 'type': 'dropdown', 'tableId': '201', 'label': 'Referral Outcome Id'},
    ];

  }

  delete(referralId: number) {
    let referral: Referral = new Referral();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        referral.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.referralService.isAuthorize(referral.profileId,this.action).subscribe((response: any) => {
          
                if (response) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.referralService.deleteReferral(referralId).subscribe((data: any) => {
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
    this.referralFilterForm.reset();
    let referral: Referral = new Referral();
    this.sortFilterAndPaginate(referral, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  searchReferral(filterObj) {
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
    this.referralService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.referralList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  goBack(){
    this.location.back();
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(ReferralConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ReferralConstants.featureId, action);
  }

  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(ReferralConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ReferralConstants.featureId, field, "Read");
  }
}
