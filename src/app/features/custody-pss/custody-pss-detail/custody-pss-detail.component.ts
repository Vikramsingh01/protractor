import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { CustodyPss } from '../custody-pss';
import { CustodyPssService } from '../custody-pss.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CustodyPssConstants } from '../custody-pss.constants';


@Component({
  selector: 'tr-custody-pss-detail',
  templateUrl: 'custody-pss-detail.component.html'
})
export class CustodyPssDetailComponent implements OnInit {

  private subscription: Subscription;
  custodyPss: CustodyPss;
  private eventId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private custodyPssService: CustodyPssService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View PSS");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.eventId = params['eventId'];
       //this.authorizationService.getAuthorizationDataByTableId(CustodyPssConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CustodyPssConstants.featureId, CustodyPssConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CustodyPssConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CustodyPssConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyPssConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyPssConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.custodyPssService.getCustodyPss(this.eventId).subscribe(data => {
                this.custodyPss = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(CustodyPssConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CustodyPssConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(CustodyPssConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CustodyPssConstants.featureId, field, "Read");
  }

}
