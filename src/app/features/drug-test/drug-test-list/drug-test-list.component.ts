import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { DrugTestService } from "../drug-test.service";
import { DrugTest } from "../drug-test";
import { DrugTestConstants } from '../drug-test.constants';
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
  selector: 'tr-drug-test',
  templateUrl: 'drug-test-list.component.html'
})
export class DrugTestListComponent implements OnInit {

  @Input() drugTestId: number;
  @Input("drugTestProfileAvailableFlag") drugTestProfileAvailableFlag: boolean;
  private searchObjs: any[] = [];
  drugTestList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  drugTestFilterForm: FormGroup;
  private offenderComplianceYesNoIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private action;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private drugTestService: DrugTestService,
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
    //this.titleService.setTitle("Drug Test");
    this.listService.getListData(244).subscribe(offenderComplianceYesNoIdList => {
      this.offenderComplianceYesNoIdList = offenderComplianceYesNoIdList;
    });
    let drugTest: DrugTest = new DrugTest();
    this.route.params.subscribe((params: any) => {

    });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        drugTest.eventId = params['eventId'];
      }

    });
    //this.authorizationService.getAuthorizationDataByTableId(DrugTestConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(DrugTestConstants.featureId, DrugTestConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(DrugTestConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(DrugTestConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(DrugTestConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(DrugTestConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.drugTestService.sortFilterAndPaginate(drugTest, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.drugTestList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = drugTest;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
    ];

  }

  delete(drugTestId: number) {
    let drugTest: DrugTest = new DrugTest();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        drugTest.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.drugTestService.isAuthorize(drugTest.profileId,this.action).subscribe((response: any) => {
          
                if (response) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.drugTestService.deleteDrugTest(drugTestId).subscribe((data: any) => {
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
    this.drugTestFilterForm.reset();
    let drugTest: DrugTest = new DrugTest();
    this.sortFilterAndPaginate(drugTest, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchDrugTest(filterObj) {
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
    this.drugTestService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.drugTestList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(DrugTestConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(DrugTestConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(DrugTestConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(DrugTestConstants.featureId, field, "Read");
  }
}
