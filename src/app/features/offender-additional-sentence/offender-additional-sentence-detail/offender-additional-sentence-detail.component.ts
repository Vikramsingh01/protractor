import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { OffenderAdditionalSentence } from '../offender-additional-sentence';
import { OffenderAdditionalSentenceService } from '../offender-additional-sentence.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { OffenderAdditionalSentenceConstants } from '../offender-additional-sentence.constants';


@Component({
  selector: 'tr-offender-additional-sentence-detail',
  templateUrl: 'offender-additional-sentence-detail.component.html'
})
export class OffenderAdditionalSentenceDetailComponent implements OnInit {

  private subscription: Subscription;
  offenderAdditionalSentence: OffenderAdditionalSentence;
  private offenderAdditionalSentenceId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private offenderAdditionalSentenceService: OffenderAdditionalSentenceService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Additional Sentence");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.offenderAdditionalSentenceId = params['offenderAdditionalSentenceId'];
       //this.authorizationService.getAuthorizationDataByTableId(OffenderAdditionalSentenceConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(OffenderAdditionalSentenceConstants.featureId, OffenderAdditionalSentenceConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(OffenderAdditionalSentenceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(OffenderAdditionalSentenceConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(OffenderAdditionalSentenceConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OffenderAdditionalSentenceConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.offenderAdditionalSentenceService.getOffenderAdditionalSentence(this.offenderAdditionalSentenceId).subscribe(data => {
                this.offenderAdditionalSentence = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(OffenderAdditionalSentenceConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(OffenderAdditionalSentenceConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(OffenderAdditionalSentenceConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(OffenderAdditionalSentenceConstants.featureId, field, "Read");
  }

}
