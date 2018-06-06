import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { DrugTest } from '../drug-test';
import { DrugTestService } from '../drug-test.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { DrugTestConstants } from '../drug-test.constants';


@Component({
  selector: 'tr-drug-test-detail',
  templateUrl: 'drug-test-detail.component.html'
})
export class DrugTestDetailComponent implements OnInit {

  private subscription: Subscription;
  drugTest: DrugTest;
  private drugTestId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private drugTestService: DrugTestService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Drug Test");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.drugTestId = params['drugTestId'];
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
            this.drugTestService.getDrugTest(this.drugTestId).subscribe(data => {
                this.drugTest = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(DrugTestConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(DrugTestConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(DrugTestConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(DrugTestConstants.featureId, field, "Read");
  }

}
