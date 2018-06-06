import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { DrugTestResult } from '../drug-test-result';
import { DrugTestResultService } from '../drug-test-result.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { DrugTestResultConstants } from '../drug-test-result.constants';


@Component({
  selector: 'tr-drug-test-result-detail',
  templateUrl: 'drug-test-result-detail.component.html'
})
export class DrugTestResultDetailComponent implements OnInit {

  private subscription: Subscription;
  drugTestResult: DrugTestResult;
  private drugTestResultId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private drugTestResultService: DrugTestResultService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Drug Test Result");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.drugTestResultId = params['drugTestResultId'];
       //this.authorizationService.getAuthorizationDataByTableId(DrugTestResultConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(DrugTestResultConstants.featureId, DrugTestResultConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(DrugTestResultConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(DrugTestResultConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(DrugTestResultConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(DrugTestResultConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.drugTestResultService.getDrugTestResult(this.drugTestResultId).subscribe(data => {
                this.drugTestResult = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(DrugTestResultConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(DrugTestResultConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(DrugTestResultConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(DrugTestResultConstants.featureId, field, "Read");
  }

}
