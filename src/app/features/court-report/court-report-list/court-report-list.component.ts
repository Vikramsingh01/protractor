import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { CourtReportService } from "../court-report.service";
import { CourtReport } from "../court-report";
import { CourtReportConstants } from '../court-report.constants';
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
  selector: 'tr-court-report',
  templateUrl: 'court-report-list.component.html'
})
export class CourtReportListComponent implements OnInit {

    @Input() courtReportId: number;
     eventId: number;
     profileId: number;
    private searchObjs: any[] = [];
    courtReportList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    courtReportFilterForm: FormGroup;
    courtRequestedReportList: any[];
    courtReportProposelTypeList: any[];
    courtReportIDList: any[];
    private action: any;

                                                                                                                                                                                                                                                                                      private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private courtReportService: CourtReportService,
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
    this.titleService.setTitle("Court Reports");
                                                                                                                                                                                                                                                                                        let courtReport: CourtReport = new CourtReport();
    this.route.params.subscribe((params: any)=>{
       if (params.hasOwnProperty('eventId')) {
        this.eventId = params['eventId'];
      }
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
this.listService.getListData(108).subscribe(courtRequestedReportList => {
      this.courtRequestedReportList = courtRequestedReportList;
    });                                                                                                           
                            this.listService.getListData(421).subscribe(courtReportProposelTypeList => {
      this.courtReportProposelTypeList = courtReportProposelTypeList;
    });

    });
    //this.authorizationService.getAuthorizationDataByTableId(CourtReportConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(CourtReportConstants.featureId, CourtReportConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CourtReportConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CourtReportConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtReportConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CourtReportConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.courtReportService.sortFilterAndPaginateByEventId(courtReport, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj,this.eventId,this.profileId).subscribe(data => {
                 this.courtReportList = data.content;
                 this.sortSearchPaginationObj.paginationObj = data;
               })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                { 'field': 'requestedDate', 'type': 'date', 'label': 'Requested Date' },
                                                        { 'field': 'requiredByDate', 'type': 'date', 'label': 'Required By Date' },
                                                        { 'field': 'requestedReportTypeId', 'type': 'text', 'label': 'Requested Report Type Id' },
                                                        { 'field': 'courtReportOfficer', 'type': 'text', 'label': 'Court Report Officer' },
                                                        { 'field': 'completedDate', 'type': 'date', 'label': 'Completed Date' },
                                                        { 'field': 'proposalTypeId', 'type': 'text', 'label': 'Proposal Type Id' },
                                                        { 'field': 'deliveredReportTypeId', 'type': 'text', 'label': 'Delivered Report Type Id' },
                                    ];
    
  }

  delete(courtReportId: number) {
     let courtReport: CourtReport = new CourtReport();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        courtReport.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.courtReportService.isAuthorize(courtReport.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
                if (response) {
    this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.courtReportService.deleteCourtReport(courtReportId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj,this.eventId,this.profileId);
                    });
                }
            });
             }
       else {
                this.headerService.setAlertPopup("Not authorized");
            }    
            });
    }


  reset(){
    this.courtReportFilterForm.reset();
    let courtReport: CourtReport = new CourtReport();
    this.sortFilterAndPaginate(courtReport, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj,this.eventId,this.profileId);
  }
  searchCourtReport(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj,this.eventId,this.profileId);
  }

  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj,this.eventId,this.profileId);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj,this.eventId,this.profileId);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj,eventId,profileId){
    
     this.courtReportService.sortFilterAndPaginateByEventId(filterObj, paginationObj, sortObj,this.eventId,this.profileId).subscribe((data: any)=>{
     this.courtReportList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CourtReportConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CourtReportConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CourtReportConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CourtReportConstants.featureId, field, "Read");
  }
}
