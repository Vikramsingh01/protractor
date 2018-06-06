import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { CourtReport } from '../court-report';
import { CourtReportService } from '../court-report.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CourtReportConstants } from '../court-report.constants';


@Component({
  selector: 'tr-court-report-detail',
  templateUrl: 'court-report-detail.component.html'
})
export class CourtReportDetailComponent implements OnInit {

  private subscription: Subscription;
  courtReport: CourtReport;
  private courtReportId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private courtReportService: CourtReportService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Court Reports");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.courtReportId = params['courtReportId'];
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
            this.courtReportService.getCourtReport(this.courtReportId).subscribe(data => {
              data.courtReportTeam = data.courtReportTeam.split("/")[1].split("(")[0].split("[")[0];
                this.courtReport = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(CourtReportConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CourtReportConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(CourtReportConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CourtReportConstants.featureId, field, "Read");
  }

  parseOfficer(officerName) {
    if (officerName != null && typeof officerName != undefined) {
      return officerName.substring(officerName.indexOf("/") + 1).replace(/\[[0-9]*\]/g, "");
    } else
      return officerName;
  }
}
