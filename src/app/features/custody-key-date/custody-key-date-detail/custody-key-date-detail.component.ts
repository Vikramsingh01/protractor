import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { CustodyKeyDate } from '../custody-key-date';
import { CustodyKeyDateService } from '../custody-key-date.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CustodyKeyDateConstants } from '../custody-key-date.constants';


@Component({
  selector: 'tr-custody-key-date-detail',
  templateUrl: 'custody-key-date-detail.component.html'
})
export class CustodyKeyDateDetailComponent implements OnInit {

  private subscription: Subscription;
  custodyKeyDate: CustodyKeyDate;
  private custodyKeyDateId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private custodyKeyDateService: CustodyKeyDateService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Key Date");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.custodyKeyDateId = params['custodyKeyDateId'];
       //this.authorizationService.getAuthorizationDataByTableId(CustodyKeyDateConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CustodyKeyDateConstants.featureId, CustodyKeyDateConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CustodyKeyDateConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CustodyKeyDateConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyKeyDateConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyKeyDateConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.custodyKeyDateService.getCustodyKeyDate(this.custodyKeyDateId).subscribe(data => {
                this.custodyKeyDate = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(CustodyKeyDateConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CustodyKeyDateConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(CustodyKeyDateConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CustodyKeyDateConstants.featureId, field, "Read");
  }

}
