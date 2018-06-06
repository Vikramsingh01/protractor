import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { RegistrationReviewService } from "../registration-review.service";
import { RegistrationReview } from "../registration-review";
import { RegistrationReviewConstants } from '../registration-review.constants';
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
  selector: 'tr-registration-review',
  templateUrl: 'registration-review-list.component.html'
})
export class RegistrationReviewListComponent implements OnInit {

  @Input() registrationReviewId: number;
  private searchObjs: any[] = [];
  private action;
  registrationReviewList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  registrationReviewFilterForm: FormGroup;
  private registrationReview: RegistrationReview = new RegistrationReview();
  private reviewCompletedYesNoIdList: any[] = [];
  private reviewProviderIdList: any[] = [];
  private reviewingTeamList: any[] = [];
  private reviewingOfficerList: any[] = [];
  private registrationId; private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private registrationReviewService: RegistrationReviewService,
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
    this.titleService.setTitle("Registration Review");
    this.listService.getListData(244).subscribe(reviewCompletedYesNoIdList => {
      this.reviewCompletedYesNoIdList = reviewCompletedYesNoIdList;
    });

       this.listService.getListDataWithLookup(445, 501).subscribe(crcList => {
         this.reviewingTeamList = crcList;
     });
    this.listService.getListData(193).subscribe(reviewProviderIdList => {
      this.reviewProviderIdList = reviewProviderIdList;
    });
     this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
         this.reviewingOfficerList = crcList;
     });
    // this.listService.getListData(445).subscribe(reviewingTeamList => {
    //   this.reviewingTeamList = reviewingTeamList;
    // });
    //this.listService.getListData(279).subscribe(reviewingOfficerList => {
      //this.reviewingOfficerList = reviewingOfficerList;
    //});
    let registrationReview: RegistrationReview = new RegistrationReview();
    this.route.params.subscribe((params: any) => {

    });

      this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
         this.reviewingOfficerList = crcList;
     });

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('registrationId')) {
        registrationReview.registrationId = params['registrationId'];

      }

    });

    //this.authorizationService.getAuthorizationDataByTableId(RegistrationReviewConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(RegistrationReviewConstants.featureId, RegistrationReviewConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(RegistrationReviewConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(RegistrationReviewConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(RegistrationReviewConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RegistrationReviewConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.registrationReviewService.sortFilterAndPaginate(registrationReview, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.registrationReviewList = data.content;
          this.registrationReviewList.forEach(element=>{
             this.registrationReviewService.getderegistrationByRegistrationId(element.registrationId).subscribe(data=>{
            element.deregistrationDate=data.deregistrationDate;
            
         })
          })
         
          this.registrationReviewList.forEach(element=>{
            element.isReviewCompleted = this.isReviewCompleted(element.reviewCompletedYesNoId);      
          })
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = registrationReview;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    this.searchObjs = [
      { 'field': 'reviewCompletedYesNoId', 'type': 'dropdown', 'tableId': '244', 'label': 'Review Completed Yes No Id' },
      { 'field': 'reviewProviderId', 'type': 'dropdown', 'tableId': '193', 'label': 'Review Provider Id' },
      { 'field': 'reviewingTeam', 'type': 'dropdown', 'tableId': '445', 'label': 'Reviewing Team' },
      { 'field': 'reviewingOfficer', 'type': 'dropdown', 'tableId': '279', 'label': 'Reviewing Officer' },
    ];

    
  }

  delete(registrationReviewId: number) {
    
     let registrationReview: RegistrationReview = new RegistrationReview();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        registrationReview.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.registrationReviewService.isAuthorize(registrationReview.profileId,this.action).subscribe((response: any) => {
              
                if (response) {
     this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.registrationReviewService.deleteRegistrationReview(registrationReviewId).subscribe((data: any) => {
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
    this.registrationReviewFilterForm.reset();
    let registrationReview: RegistrationReview = new RegistrationReview();
    this.sortFilterAndPaginate(registrationReview, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchRegistrationReview(filterObj) {
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
    this.registrationReviewService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.registrationReviewList = data.content;
      this.registrationReviewList.forEach(element=>{
        element.isReviewCompleted = this.isReviewCompleted(element.reviewCompletedYesNoId);
      })
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(RegistrationReviewConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(RegistrationReviewConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(RegistrationReviewConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(RegistrationReviewConstants.featureId, field, "Read");
  }

  isReviewCompleted(completedYesNoId){
    let value: boolean = false;
    let code = this.listService.getCodeByTableIdAndPkId(244,completedYesNoId);
    if(code == 'Y'){
      value = true;
    }

    return value;
  }
  parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
    }
}
