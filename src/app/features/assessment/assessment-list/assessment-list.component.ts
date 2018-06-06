import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AssessmentService } from "../assessment.service";
import { Assessment } from "../assessment";
import { AssessmentConstants } from '../assessment.constants';
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
  selector: 'tr-assessment',
  templateUrl: 'assessment-list.component.html'
})
export class AssessmentListComponent implements OnInit {

  @Input() assessmentId: number;
  private searchObjs: any[] = [];
  private action: any;
  assessmentList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  assessmentFilterForm: FormGroup;
  private durationInMinutesList: any[] = [];
  private offenderAgreementYesNoIdList: any[] = [];
  private assessmentTypeIdList: any[] = [];
  private offenderRequiredToAttendYesNoIdList: any[] = [];
  private offenderAttendedYesNoIdList: any[] = [];
  private assessmentOutcomeIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder) {
  }

  ngOnInit() {
   // this.listService.getListData().subscribe(durationInMinutesList => {
   //   this.durationInMinutesList = durationInMinutesList;
    //});
    this.listService.getListData(244).subscribe(offenderAgreementYesNoIdList => {
      this.offenderAgreementYesNoIdList = offenderAgreementYesNoIdList;
    });
    this.listService.getListData(96).subscribe(assessmentTypeIdList => {
      this.assessmentTypeIdList = assessmentTypeIdList;
    });
    this.listService.getListData(244).subscribe(offenderRequiredToAttendYesNoIdList => {
      this.offenderRequiredToAttendYesNoIdList = offenderRequiredToAttendYesNoIdList;
    });
    this.listService.getListData(244).subscribe(offenderAttendedYesNoIdList => {
      this.offenderAttendedYesNoIdList = offenderAttendedYesNoIdList;
    });
    this.listService.getListData(95).subscribe(assessmentOutcomeIdList => {
      this.assessmentOutcomeIdList = assessmentOutcomeIdList;
    });
    let assessment: Assessment = new Assessment();
     
    this.route.params.subscribe((params: any) => {
       if (params.hasOwnProperty('referralId')) {
        assessment.referralId = params['referralId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(AssessmentConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(AssessmentConstants.featureId, AssessmentConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(AssessmentConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(AssessmentConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(AssessmentConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AssessmentConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.assessmentService.sortFilterAndPaginate(assessment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.assessmentList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = assessment;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    // this.searchObjs = [
    //   { 'field': 'assessmentDate', 'type': 'date', 'label': 'Assessment Date' },
    //   { 'field': 'assessmentOutcomeId', 'type': 'dropdown', 'tableId': '95', 'label': 'Assessment Outcome ' },
    // ];

  }

  delete(assessmentId: number) {
   let assessment: Assessment = new Assessment();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        assessment.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.assessmentService.isAuthorize(assessment.profileId,this.action).subscribe((response: any) => {
             
                if (response) {
    this.confirmService.confirm(

      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.assessmentService.deleteAssessment(assessmentId).subscribe((data: any) => {
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
    this.assessmentFilterForm.reset();
    let assessment: Assessment = new Assessment();
    this.sortFilterAndPaginate(assessment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchAssessment(filterObj) {
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
    this.assessmentService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.assessmentList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(AssessmentConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AssessmentConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(AssessmentConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AssessmentConstants.featureId, field, "Read");
  }
}
