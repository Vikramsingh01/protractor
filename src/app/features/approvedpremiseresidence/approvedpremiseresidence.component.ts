import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ApprovedPremiseResidenceService } from "./approvedpremiseresidence.service";
import { ApprovedPremiseResidence } from "./approvedpremiseresidence";
import { ApprovedPremiseResidenceConstants } from "./approvedpremiseresidence.constants";
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
  selector: 'tr-approvedpremiseresidence',
  templateUrl: 'approvedpremiseresidence.component.html',
  
  providers: [ApprovedPremiseResidenceService]

})
export class ApprovedPremiseResidenceComponent implements OnInit {

  @Input() approvedPremiseResidenceId: number;
  private searchObjs : any[] = [];

  approvedPremiseResidences: ApprovedPremiseResidence[];

  departureReasonList: any[];
  approvedPremisesList: any[];
  approvedPremiseResidenceList: any[];
  moveOnCategoryList: any[];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private approvedPremiseResidenceService: ApprovedPremiseResidenceService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService) {
  }

  ngOnInit() {

    this.listService.getListData(88).subscribe(departureReasonList => {
      this.departureReasonList = departureReasonList;
    });

    this.listService.getListData(132).subscribe(approvedPremisesList => {
      this.approvedPremisesList = approvedPremisesList;
    });

    this.listService.getListData(164).subscribe(moveOnCategoryList => {
      this.moveOnCategoryList = moveOnCategoryList;
    });

    let approvedPremiseResidence: ApprovedPremiseResidence = new ApprovedPremiseResidence();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('approvedPremisesReferralId')) {
        approvedPremiseResidence.apReferralId = params['approvedPremisesReferralId'];
      }
    });
    this.searchObjs = [ 
      {'field':'arrivalDate', 'type':'date', 'label':'arrival Date'}, 
      {'field':'expectedDepartureDate', 'type':'date', 'label':'expected Departure Date'},
      {'field':'modifiedDate', 'type':'date', 'label':'modifiedDate'},
      {'field':'apReferralId', 'type':'hidden', 'value':approvedPremiseResidence.apReferralId}
    ];
    this.authorizationService.getAuthorizationData(ApprovedPremiseResidenceConstants.featureId, ApprovedPremiseResidenceConstants.tableId).map(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(ApprovedPremiseResidenceConstants.featureId, res[0]);
        this.dataService.addFeatureFields(ApprovedPremiseResidenceConstants.featureId, res[1]);
      }
    }).flatMap(data =>
      this.approvedPremiseResidenceService.sortSearchPagination(approvedPremiseResidence, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj)).subscribe((data: any) => {
        this.approvedPremiseResidences = data.content;
        this.sortSearchPaginationObj.paginationObj = data;
      this.sortSearchPaginationObj.filterObj = approvedPremiseResidence;
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
    this.approvedPremiseResidenceService.sortSearchPagination(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.approvedPremiseResidences= data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }


  delete(approvedPremiseResidenceId: number) {
    let approvedPremiseResidence: ApprovedPremiseResidence = new ApprovedPremiseResidence();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('approvedPremisesReferralId')) {
        approvedPremiseResidence.apReferralId = params['approvedPremisesReferralId'];
      }
    });

    if (confirm("Are you sure you want to delete?")) {
      this.approvedPremiseResidenceService.delete(approvedPremiseResidenceId).subscribe((data: any) => {
        this.approvedPremiseResidenceService.searchApprovedPremiseResidence(approvedPremiseResidence).subscribe((data: any) => {
          this.approvedPremiseResidences = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(ApprovedPremiseResidenceConstants.featureId, action)
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(ApprovedPremiseResidenceConstants.featureId, field, 'Read');
  }
}
