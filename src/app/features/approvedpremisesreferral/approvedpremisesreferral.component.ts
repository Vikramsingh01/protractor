import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ApprovedPremisesReferralService } from "./approvedpremisesreferral.service";
import { ApprovedPremisesReferral } from "./approvedpremisesreferral";
import { ApprovedPremisesReferralConstants } from "./approvedpremisesreferral.constants";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { ListService } from '../../services/list.service';
import { FilterPipe } from '../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../generic-components/search/sort-search-pagination';

@Component({
  selector: 'tr-approvedpremisesreferral',
  templateUrl: 'approvedpremisesreferral.component.html',
  
  providers: [ApprovedPremisesReferralService],
  

})
export class ApprovedPremisesReferralComponent implements OnInit {

  @Input() approvedPremisesReferralId: number;
   private searchObjs : any[] = [];

  approvedPremisesReferrals: ApprovedPremisesReferral[];

  apReferralCategoryList: any[];
  referralDecisionList: any[];
  rejectReasonList: any[];
  referralGroupList: any[];
  approvedPremisesList: any[];
  nonArrivalReasonList: any[];
  sourceTypeIdList: any[];
  providerList: any[];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
  private route: ActivatedRoute,
    private approvedPremisesReferralService: ApprovedPremisesReferralService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService) {
  }

  ngOnInit() {
    // this.listService.getListData(92).subscribe(referralDecisionList => {
    //   this.referralDecisionList = referralDecisionList
    // });

    this.listService.getListData(92).subscribe(apReferralCategoryList => {
      this.apReferralCategoryList = apReferralCategoryList;
    });

    // this.listService.getListData(94).subscribe(rejectReasonList => {
    //   this.rejectReasonList = rejectReasonList
    // });
    // this.listService.getListData(93).subscribe(referralGroupList => {
    //   this.referralGroupList = referralGroupList
    // });
    // this.listService.getListData(132).subscribe(approvedPremisesList => {
    //   this.approvedPremisesList = approvedPremisesList
    // });
    // this.listService.getListData(91).subscribe(nonArrivalReasonList => {
    //   this.nonArrivalReasonList = nonArrivalReasonList
    // });
    // this.listService.getListData(221).subscribe(sourceTypeIdList => {
    //   this.sourceTypeIdList = sourceTypeIdList
    // });
    // this.listService.getListData(193).subscribe(providerList => {
    //   this.providerList = providerList;
    // });

     let approvedpremisesreferral: ApprovedPremisesReferral = new ApprovedPremisesReferral();
    this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				approvedpremisesreferral.eventId = params['eventId'];
			}
		});
    this.searchObjs = [
    {'field':'referralDate', 'type':'date', 'label':'referral Date'},
    {'field':'expectedArrivalDate', 'type':'date', 'label':'expected Arrival Date'},
    {'field':'referringProviderId', 'type':'dropdown', 'tableId':'193', 'label':'referring Provider'},
    {'field':'eventId', 'type':'hidden', 'value':approvedpremisesreferral.eventId}
  ];
    this.authorizationService.getAuthorizationData(ApprovedPremisesReferralConstants.featureId,ApprovedPremisesReferralConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(ApprovedPremisesReferralConstants.featureId, res[0]);
		this.dataService.addFeatureFields(ApprovedPremisesReferralConstants.featureId, res[1]);
	}
	}).flatMap(data=>
  this.approvedPremisesReferralService.sortSearchPagination(approvedpremisesreferral, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj)).subscribe((data: any) => {
      this.approvedPremisesReferrals = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
      this.sortSearchPaginationObj.filterObj = approvedpremisesreferral;
    });
  }
  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortSearchPagination(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }

  search(filterObj){
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortSearchPagination(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortSearchPagination(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortSearchPagination(filterObj, paginationObj, sortObj){
    this.approvedPremisesReferralService.sortSearchPagination(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.approvedPremisesReferrals = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  delete(approvedPremisesReferralId: number) {
    let approvedpremisesreferral: ApprovedPremisesReferral = new ApprovedPremisesReferral();
    this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('eventId')) {
				approvedpremisesreferral.eventId = params['eventId'];
			}
		});
    if (confirm("Are you sure you want to delete?")) {
      this.approvedPremisesReferralService.delete(approvedPremisesReferralId).subscribe((data: any) => {
        this.approvedPremisesReferralService.searchApprovedPremisesReferral(approvedpremisesreferral).subscribe((data: any) => {
          this.approvedPremisesReferrals = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(ApprovedPremisesReferralConstants.featureId, action);
    //return true
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(ApprovedPremisesReferralConstants.featureId, field, "Read");
   //return true;
  }
}
