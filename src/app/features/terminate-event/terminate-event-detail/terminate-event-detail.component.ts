import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { TerminateEvent } from '../terminate-event';
import { TerminateEventService } from '../terminate-event.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { TerminateEventConstants } from '../terminate-event.constants';


@Component({
  selector: 'tr-terminate-event-detail',
  templateUrl: 'terminate-event-detail.component.html'
})
export class TerminateEventDetailComponent implements OnInit {

  private subscription: Subscription;
  terminateEvent: TerminateEvent;
  private terminateEventId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private terminateEventService: TerminateEventService,
      private headerService: HeaderService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.terminateEventId = params['terminateEventId'];
       //this.authorizationService.getAuthorizationDataByTableId(TerminateEventConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(TerminateEventConstants.featureId, TerminateEventConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(TerminateEventConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(TerminateEventConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(TerminateEventConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TerminateEventConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.terminateEventService.getTerminateEvent(this.terminateEventId).subscribe(data => {
                this.terminateEvent = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(TerminateEventConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(TerminateEventConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(TerminateEventConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(TerminateEventConstants.featureId, field, "Read");
  }

}
