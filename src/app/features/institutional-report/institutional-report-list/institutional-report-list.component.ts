import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { InstitutionalReportService } from "../institutional-report.service";
import { InstitutionalReport } from "../institutional-report";
import { InstitutionalReportConstants } from '../institutional-report.constants';
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
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-institutional-report',
  templateUrl: 'institutional-report-list.component.html'
})
export class InstitutionalReportListComponent implements OnInit {

    @Input() institutionalReportId: number;
    private searchObjs: any[] = [];
    institutionalReportList: any[];
    private authorizationData: any;
    private action;
    private authorizedFlag: boolean = false;
    institutionalReportFilterForm: FormGroup;
                                                                            private requestedReportTypeIdList: any[] = [];
                        private institutionIdList: any[] = [];
                                private institutionalReportProviderIdList: any[] = [];
                                  private institutionalReportOfficerList: any[] = [];
                                                                                                                                          private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private institutionalReportService: InstitutionalReportService,
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
    this.titleService.setTitle('Institutional Report');
         this.listService.getListData(149).subscribe(requestedReportTypeIdList => {
        this.requestedReportTypeIdList = requestedReportTypeIdList;
    });
             this.listService.getListData(135).subscribe(institutionIdList => {
        this.institutionIdList = institutionIdList;
    });
                                this.listService.getListData(193).subscribe(institutionalReportProviderIdList => {
        this.institutionalReportProviderIdList = institutionalReportProviderIdList;
    });
     this.listService.getListDataWithLookup(270, 502).subscribe(institutionalReportOfficerList => {
         this.institutionalReportOfficerList = institutionalReportOfficerList;
     });
                                                                                                                                            let institutionalReport: InstitutionalReport = new InstitutionalReport();
    this.route.params.subscribe((params: any)=>{
       if (params.hasOwnProperty('eventId')) {
        institutionalReport.eventId = params['eventId'];
      }

    });
    //this.authorizationService.getAuthorizationDataByTableId(InstitutionalReportConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(InstitutionalReportConstants.featureId, InstitutionalReportConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(InstitutionalReportConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(InstitutionalReportConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(InstitutionalReportConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(InstitutionalReportConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.institutionalReportService.sortFilterAndPaginate(institutionalReport, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.institutionalReportList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = institutionalReport;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                //    { 'field': 'requestedReportTypeId', 'type': 'dropdown',  'tableId':'149', 'label': 'Requested Report Type Id' },
                                // { 'field': 'institutionId', 'type': 'dropdown',  'tableId':'135', 'label': 'Institution Id' },
                                //   { 'field': 'institutionalReportProviderId', 'type': 'dropdown',  'tableId':'193', 'label': 'Institutional Report Provider Id' },
                                                                                                                                                                                                                                                                                            ];
    
  }

  delete(institutionalReportId: number) {
      let institutionalReport: InstitutionalReport = new InstitutionalReport();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        institutionalReport.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.institutionalReportService.isAuthorize(institutionalReport.profileId,this.action).subscribe((response: any) => {
          
                if (response) {
    this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.institutionalReportService.deleteInstitutionalReport(institutionalReportId).subscribe((data: any) => {
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


  reset(){
    this.institutionalReportFilterForm.reset();
    let institutionalReport: InstitutionalReport = new InstitutionalReport();
    this.sortFilterAndPaginate(institutionalReport, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchInstitutionalReport(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    this.institutionalReportService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.institutionalReportList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(InstitutionalReportConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(InstitutionalReportConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(InstitutionalReportConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(InstitutionalReportConstants.featureId, field, "Read");
  }

  parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }
}
