import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ProposedRequirementService } from "./proposedrequirement.service";
import { ProposedRequirement } from "./proposedrequirement";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { ProposedRequirementConstants } from './proposedrequirement.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { ListService } from '../../services/list.service';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { SortFilterPagination } from '../../generic-components/pagination/pagination';

@Component({
  selector: 'tr-proposedrequirement',
  templateUrl: 'proposedrequirement.component.html',
  
  providers: [ProposedRequirementService]

})
export class ProposedRequirementComponent implements OnInit {

  @Input() proposedRequirementId: number;

  proposedRequirements: ProposedRequirement[];
  requirementTypeMainCategoryList: any[];
  requirementTypeSubCategoryList: any[];
  addRequirementTypeMainCategoryList: any[];
  addRequirementTypeSubCategoryList: any[];
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private proposedRequirementService: ProposedRequirementService,
    private dataService: DataService,
    private tokenService: TokenService,
    private listService: ListService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {

    this.listService.getListData(215).subscribe(requirementTypeMainCategoryList => {
      this.requirementTypeMainCategoryList = requirementTypeMainCategoryList
    });

    this.listService.getListData(216).subscribe(requirementTypeSubCategoryList => {
      this.requirementTypeSubCategoryList = requirementTypeSubCategoryList
    });

    this.listService.getListData(80).subscribe(addRequirementTypeMainCategoryList => {
      this.addRequirementTypeMainCategoryList = addRequirementTypeMainCategoryList
    });

    this.listService.getListData(81).subscribe(addRequirementTypeSubCategoryList => {
      this.addRequirementTypeSubCategoryList = addRequirementTypeSubCategoryList
    });

    let proposedRequirement: ProposedRequirement = new ProposedRequirement();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('courtReportId')) {
        proposedRequirement.courtReportId = params['courtReportId'];
      }
    });
    this.authorizationService.getAuthorizationData(ProposedRequirementConstants.featureId, ProposedRequirementConstants.tableId).map(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(ProposedRequirementConstants.featureId, res[0]);
        this.dataService.addFeatureFields(ProposedRequirementConstants.featureId, res[1]);
      }
    }).flatMap(data =>
      this.proposedRequirementService.sortFilterAndPaginate(proposedRequirement, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj)).subscribe((data: any) => {
        this.proposedRequirements = data.content;
        this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = proposedRequirement;
      });
  }

    sort(sortObj){
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, this.sortFilterPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    //sortObj.field = "firstName";
    this.proposedRequirementService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.proposedRequirements = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  delete(proposedRequirementId: number) {
    let proposedRequirement: ProposedRequirement = new ProposedRequirement();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('courtReportId')) {
        proposedRequirement.courtReportId = params['courtReportId'];
      }
    });

    if (confirm("Are you sure you want to delete?")) {
      this.proposedRequirementService.delete(proposedRequirementId).subscribe((data: any) => {
        this.proposedRequirementService.searchProposedRequirement(proposedRequirement).subscribe((data: any) => {
          this.proposedRequirements = data.content;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(ProposedRequirementConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(ProposedRequirementConstants.featureId, field, "Read");
  }
}
