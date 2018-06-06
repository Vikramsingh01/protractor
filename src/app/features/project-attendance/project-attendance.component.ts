import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../../services/token.service';
import { AuthorizationService } from '../../services/authorization.service';
import { DataService } from '../../services/data.service';
import { ListService } from '../../services/list.service';
import { HeaderService } from '../../views/header/header.service';
import { UpwProjectConstants } from "../upw-project/upw-project.constants";
import { SortSearchPagination } from '../../generic-components/search/sort-search-pagination';
import { CommunityRequirementService } from "../community-requirement/community-requirement.service";
import { UpwAppointmentService } from "../upw-appointment/upw-appointment.service";
import { UpwAdjustmentService } from "../upw-adjustment/upw-adjustment.service";
import { Utility } from "../../shared/utility";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UpwDetailConstants } from '../upw-detail/upw-detail.constants';
import { UpwAppointmentConstants } from '../upw-appointment/upw-appointment.constants';
import { ServiceUserService } from "../service-user/service-user.service";
import { UpwProjectService } from "../upw-project/upw-project.service";
import { ConfirmService } from "../../generic-components/confirm-box/confirm.service";
import {Title} from "@angular/platform-browser";
import { UpwAppointmentAddComponent } from '../upw-appointment/upw-appointment-add/upw-appointment-add.component';
@Component({
  selector: 'tr-project-attendance',
  templateUrl: 'project-attendance.component.html',
  providers: []
})
export class ProjectAttendaceComponent implements OnInit {

  private subscription: Subscription;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private upwAppointment: any;
  private upwAppointmentId: number;
  private authorizedFlag: boolean = false;
  private allocatedServiceUsers: any[] = [];
  private crcList: any[] = [];
  constructor(private route: ActivatedRoute, private dataService: DataService,
    private headerService: HeaderService, private authorizationService: AuthorizationService,
    private listService: ListService, private communityRequirementService: CommunityRequirementService,
    private upwAppointmentService: UpwAppointmentService,
    private serviceUserService: ServiceUserService,
    private upwProjectService: UpwProjectService,
    private upwAdjustmentService: UpwAdjustmentService, private confirmService: ConfirmService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Project Attendace List');
    let obj: any = {};
    this.sortSearchPaginationObj.sortObj.field = "firstName";
    this.sortSearchPaginationObj.sortObj.sort = "asc";
    this.listService.getListDataWithLookup(433, 503).subscribe(crcList => {
      this.crcList = crcList;
    });
    this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, "Read");
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('upwAppointmentId')) {
        obj.upwAppointmentId = params['upwAppointmentId'];
        this.upwAppointmentId = params['upwAppointmentId'];
      }
    });
    let observables: Observable<any>[] = [];
    observables.push(this.upwAppointmentService.getUpwAppointmentForAllCrc(obj.upwAppointmentId));
    Observable.forkJoin(observables).subscribe(dataForUpw => {
      this.upwAppointment = dataForUpw[0];
      this.upwProjectService.sortFilterAndPaginate({ projectName: this.upwAppointment.projectName, projectTypeId: this.upwAppointment.projectTypeId, appointmentDate: this.upwAppointment.appointmentDate }, null, null).subscribe((projects: any) => {
        if (projects.content.length == 1) {
          this.upwAppointment.teamId = projects.content[0].teamId;
        }
      })
      this.getAllocatedServiceUsers(this.upwAppointment.appointmentDate, this.upwAppointment.projectName, this.upwAppointment.startTime, this.upwAppointment.endTime);


    });

  }

  getAllocatedServiceUsers(appointmentDate, projectName, startTime, endTime) {

    let searchObj: any = {};
    searchObj.appointmentDate = appointmentDate;
    searchObj.projectName = projectName;
    searchObj.startTime = startTime;
    searchObj.endTime = endTime;
    this.sortSearchPaginationObj.filterObj = searchObj;
    this.upwAppointmentService.sortFilterAndPaginateForProjectAttendence(searchObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(allocateServiceUserResponse => {
      allocateServiceUserResponse.content.forEach((serviceUserData, index) => {
        let obj: any = {};
       let totalAdjustment = 0;
      obj.profileId = serviceUserData.profileId;
      let observables: Observable<any>[] = [];
      observables.push(this.upwAdjustmentService.getTotalAdjustment(obj));
      observables.push(this.upwAppointmentService.getTotalHoursWorked({profileId: obj.profileId}));
      Observable.forkJoin(observables).subscribe(data => {
        let serviceUserAdjustmentRsp: any[] = data[0];
        if(data[1].totalHoursWorked == null) {
          data[1].totalHoursWorked = 0;
        }
        serviceUserData.minutesCredited = data[1].totalHoursWorked;
        serviceUserAdjustmentRsp.forEach(adjustment => {
          if (adjustment.adjustmentType == 'POSITIVE') {
            totalAdjustment = totalAdjustment + adjustment.adjustmentAmount;
          } else if (adjustment.adjustmentType == 'NEGATIVE') {
            totalAdjustment = totalAdjustment - adjustment.adjustmentAmount;
          }
        })
        serviceUserData.totalHoursLeft = Utility.convertMinutesToHours(serviceUserData.length * 60 + totalAdjustment - serviceUserData.minutesCredited);
        if(serviceUserData.length > 0 ){
          if(serviceUserData.length  > 9) {
            serviceUserData.length = serviceUserData.length + ":00";
          }
          else
          {
            serviceUserData.length = "0" + serviceUserData.length + ":00";
          }
        }
      })
      })
      this.allocatedServiceUsers = allocateServiceUserResponse.content;
    })
  }

  delete(upwAppointmentId: number) {


    this.upwAppointmentService.isAuthorize(this.upwAppointmentId, "Archive").subscribe((response: any) => {
      if (response) {

        this.confirmService.confirm(
          {
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
              let upwAppointment = Utility.getObjectFromArrayByKeyAndValue(this.allocatedServiceUsers, 'upwAppointmentId', upwAppointmentId);
              if (upwAppointment['upwOutcomeTypeId'] && upwAppointment['upwOutcomeTypeId'] != null) {
                this.headerService.setErrorPopup({ errorMessage: 'There is an outcome associated with this appointment. If you wish to delete this appointment please do this from the Plan.' });
              } else {
                this.upwAppointmentService.deleteUpwAppointment(upwAppointmentId).subscribe((data: any) => {
                  this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                });

              }

            }
          });
      }
      else {
        this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
      }

    });


  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(UpwProjectConstants.featureId, field, "Read");
  }

  sort(sortObj) {
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj) {
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {

    this.getAllocatedServiceUsers(this.sortSearchPaginationObj.filterObj.appointmentDate, this.sortSearchPaginationObj.filterObj.projectName, this.sortSearchPaginationObj.filterObj.startTime, this.sortSearchPaginationObj.filterObj.endTime);
  }
}
