import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { InstitutionalReport } from '../institutional-report';
import { InstitutionalReportService } from '../institutional-report.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { InstitutionalReportConstants } from '../institutional-report.constants';
import { ListService } from '../../../services/list.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-institutional-report-detail',
  templateUrl: 'institutional-report-detail.component.html'
})
export class InstitutionalReportDetailComponent implements OnInit {

  private subscription: Subscription;
  institutionalReport: InstitutionalReport;
  private institutionalReportId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
     private crcList=[];
   private teamlist=[];
    private officerlist=[];
      private institutionalReportOfficerList: any[] = [];
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private institutionalReportService: InstitutionalReportService,
      private headerService: HeaderService ,
         private listService: ListService,
         private titleService: Title ) { }

  ngOnInit() {

    this.titleService.setTitle('View Institutional Report');
          this.listService.getListDataWithLookup(433, 503).subscribe(crcList => {
         this.crcList = crcList;
     });

             this.listService.getListDataWithLookup(445, 501).subscribe(crcList => {
         this.teamlist = crcList;
     });
            this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
         this.officerlist = crcList;
     });

     

     

    this.subscription = this.route.params.subscribe((params: any)=>{
      this.institutionalReportId = params['institutionalReportId'];
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
            this.institutionalReportService.getInstitutionalReport(this.institutionalReportId).subscribe(data => {
                this.institutionalReport = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(InstitutionalReportConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(InstitutionalReportConstants.featureId, action);
  }
  isFeildAuthorized(field){
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
