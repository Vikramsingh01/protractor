import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { UpwAppointment } from '../upw-appointment';
import { UpwAppointmentService } from '../upw-appointment.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwAppointmentConstants } from '../upw-appointment.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-upw-appointment-detail',
  templateUrl: 'upw-appointment-detail.component.html'
})
export class UpwAppointmentDetailComponent implements OnInit {

  private subscription: Subscription;
  upwAppointment: UpwAppointment;
  private upwAppointmentId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private nsrdData: any[] = [];
  constructor(private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private upwAppointmentService: UpwAppointmentService,
    private headerService: HeaderService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('View Community Payback Appointment');
    this.subscription = this.route.params.subscribe((params: any) => {
      this.upwAppointmentId = params['upwAppointmentId'];
      this.authorizationService.getAuthorizationData(UpwAppointmentConstants.featureId, UpwAppointmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(UpwAppointmentConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(UpwAppointmentConstants.featureId, authorizationData[1]);
        }
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.upwAppointmentService.getUpwAppointment(this.upwAppointmentId).subscribe(data => {
            this.upwAppointment = data;
            data = this.upwAppointmentService.removeConstantsFields(data);
            this.upwAppointmentService.getUpwAppointmentCrd(data).subscribe((breResponse: any) => {
                  this.updateNsrd(breResponse.resultMap.fieldObjectList);
            });
          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  updateNsrd(nsrdData) {
    nsrdData.forEach((element: any) => {
        this.nsrdData[element.fieldName] = {};
        this.nsrdData[element.fieldName].active = element.active;
    });
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(UpwAppointmentConstants.featureId, field, "Read");
  }

}
