import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { UpwDetail } from '../upw-detail';
import { UpwDetailService } from '../upw-detail.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwDetailConstants } from '../upw-detail.constants';
import { UpwAppointmentService } from "../../upw-appointment/upw-appointment.service";
import { CommunityRequirementService } from "../../community-requirement/community-requirement.service";
import { EventService } from '../../event/event.service';
import { UpwAdjustmentService } from '../../upw-adjustment/upw-adjustment.service';
import { Utility } from '../../../shared/utility';
import { Observable } from 'rxjs/Observable';
import { ListService } from '../../../services/list.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-upw-detail-detail',
  templateUrl: 'upw-detail-detail.component.html'
})
export class UpwDetailDetailComponent implements OnInit {

  private subscription: Subscription;
  upwDetail: UpwDetail;
  private upwDetailId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private upwDetailService: UpwDetailService,
      private upwAdjustmentService: UpwAdjustmentService,
      private upwAppointmentService: UpwAppointmentService,
      private communityRequirementService: CommunityRequirementService,
      private eventService: EventService,
      private listService: ListService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
      this.titleService.setTitle('View Community Payback Details');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.upwDetailId = params['upwDetailId'];
       //this.authorizationService.getAuthorizationDataByTableId(UpwDetailConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(UpwDetailConstants.featureId, UpwDetailConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(UpwDetailConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(UpwDetailConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwDetailConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwDetailConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.upwDetailService.getUpwDetail(this.upwDetailId).subscribe(data => {
              let observables: Observable<any>[] = [];
              observables.push(this.communityRequirementService.getTotalHoursOrderedByEventId(data));
              observables.push(this.upwAppointmentService.getTotalHoursWorkedByEventId(data));
              observables.push(this.upwAdjustmentService.sortFilterAndPaginate({ eventId: data.eventId }, null, null));
              observables.push(this.eventService.getEvent(data.eventId));
              Observable.forkJoin(observables).subscribe(dataForUpw => {
                let totalHrs: any;
               data.totalHoursOrdered = dataForUpw[0].totalHoursOrdered;
                totalHrs = dataForUpw[0].totalHoursOrdered;
                if(totalHrs > 0 ){
                  if(totalHrs  > 9) {
                    totalHrs = totalHrs + ":00";
                  }
                  else
                  {
                     totalHrs = "0" + totalHrs + ":00";
                  }
                  data.totalHoursOrdered = totalHrs;
                }
                data.totalHoursWorked = Utility.convertMinutesToHours(dataForUpw[1].totalHoursWorked);
                let dataUpwAdjustment: any[] = dataForUpw[2].content;

                let totalAdjustment = 0;
                dataUpwAdjustment.forEach((upwAdjustmentData, index) => {
                  if (upwAdjustmentData.adjustmentType == 'POSITIVE') {
                    totalAdjustment = totalAdjustment + upwAdjustmentData.adjustmentAmount;
                  } else if (upwAdjustmentData.adjustmentType == 'NEGATIVE') {
                    totalAdjustment = totalAdjustment - upwAdjustmentData.adjustmentAmount;
                  }
                });
                data.totalAdjustment = Utility.convertMinutesToHours(totalAdjustment);
                data.totalHoursLeft = Utility.convertMinutesToHours(dataForUpw[0].totalHoursOrdered * 60 + totalAdjustment - dataForUpw[1].totalHoursWorked);
                data.orderTypeDisposalTypeId = dataForUpw[3].orderTypeDisposalTypeId;
                data.eventNumber = dataForUpw[3].eventNumber;
               });

                this.upwDetail = data;
            })
        } 
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(UpwDetailConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(UpwDetailConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(UpwDetailConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(UpwDetailConstants.featureId, field, "Read");
  }

}
