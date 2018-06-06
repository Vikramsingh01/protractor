import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwProjectConstants } from "../../upw-project/upw-project.constants";
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { CommunityRequirementService } from "../../community-requirement/community-requirement.service";
import { UpwAppointmentService } from "../../upw-appointment/upw-appointment.service";
import { UpwAdjustmentService } from "../../upw-adjustment/upw-adjustment.service";
import { Utility } from "../../../shared/utility";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UpwAppointmentConstants } from '../../upw-appointment/upw-appointment.constants';
import { ServiceUserService } from "../../service-user/service-user.service";
import { UpwProjectService } from "../../upw-project/upw-project.service";
import { ConfirmService } from "../../../generic-components/confirm-box/confirm.service";
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-project-session-update',
  templateUrl: 'project-session-update.component.html',
  providers: []
})
export class ProjectSessionUpdateComponent implements OnInit {

  private subscription: Subscription;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private upwAppointment: any;
  private upwAppointmentId: number;
  private authorizedFlag: boolean = false;
  private allocatedServiceUsers: any[] = [];
  private crcList: any[] = [];
  private upwTeams: any[] = [];
  private upwOfficers: any[] = [];
  private sessionOutcomeForm: FormGroup;
  private nsrdData: any[] = [];
  private outcomeTypeList: any[] = [];
  private selectedAppointments: any[] = [];
  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private dataService: DataService,
    private headerService: HeaderService, private authorizationService: AuthorizationService,
    private listService: ListService, private communityRequirementService: CommunityRequirementService,
    private upwAppointmentService: UpwAppointmentService,
    private serviceUserService: ServiceUserService,
    private upwProjectService: UpwProjectService,
    private upwAdjustmentService: UpwAdjustmentService, private confirmService: ConfirmService,
    private _titleService: Title) { }

  ngOnInit() {
    this._titleService.setTitle('UPW Session Project Outcome');
    this.listService.getPkValueByTableIdAndCodeFromDB(104, "CUPA").subscribe((pkValue: any) => {
      this.listService.getDependentAnswers(104, pkValue.pkValue).subscribe((outcomeTypeList: any) => {
        this.outcomeTypeList = outcomeTypeList[103];
      });
    });
    this.initForm();
    this.listService.getListDataByLookupAndPkValue(0, 519, this.dataService.getLoggedInUserId()).subscribe(officeTeams => {
      this.upwTeams = officeTeams;
    });

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
      this.upwProjectService.sortFilterAndPaginate({ projectName: this.upwAppointment.projectName, projectTypeId: this.upwAppointment.projectTypeId, appointmentDate: this.upwAppointment.appointmentDate}, null, null).subscribe((projects: any) => {
        if (projects.content.length == 1) {
          this.upwAppointment.teamId = projects.content[0].teamId;
        }
      })
      this.getAllocatedServiceUsers(this.upwAppointment.appointmentDate, this.upwAppointment.projectName, this.upwAppointment.startTime, this.upwAppointment.endTime);


    });

    this.sessionOutcomeForm.controls['upwOutcomeTypeId'].valueChanges.subscribe(value => {
      if (value == null || value == "") {
        this.nsrdData["penaltyTime"] = {};
        this.nsrdData["penaltyTime"].active = false;
        this.sessionOutcomeForm.removeControl("penaltyTime");
        this.nsrdData["intensiveYesNoId"] = {};
        this.nsrdData["intensiveYesNoId"].active = false;
        this.sessionOutcomeForm.removeControl("intensiveYesNoId");
        this.nsrdData["minutesOffered"] = {};
        this.nsrdData["minutesOffered"].active = false;
        this.sessionOutcomeForm.removeControl("minutesOffered");
        this.nsrdData["minutesCredited"] = {};
        this.nsrdData["minutesCredited"].active = false;
        this.sessionOutcomeForm.removeControl("minutesCredited");
        this.nsrdData["highVisibilityVestYesNoId"] = {};
        this.nsrdData["highVisibilityVestYesNoId"].active = false;
        this.sessionOutcomeForm.removeControl("highVisibilityVestYesNoId");
        this.nsrdData["workQualityId"] = {};
        this.nsrdData["workQualityId"].active = false;
        this.sessionOutcomeForm.removeControl("workQualityId");
        this.nsrdData["behaviourId"] = {};
        this.nsrdData["behaviourId"].active = false;
        this.sessionOutcomeForm.removeControl("behaviourId");
        this.nsrdData["enforcementActionId"] = {};
        this.nsrdData["enforcementActionId"].active = false;
        this.sessionOutcomeForm.removeControl('enforcementActionId');
      }
    });
  }
  supervisiorTeamChange(teamId) {
    if (teamId != null) {
      this.sessionOutcomeForm.controls['upwTeam'].setValue(Utility.getObjectFromArrayByKeyAndValue(this.upwTeams, 'key', parseInt(teamId)).value);
      this.listService.getListDataByLookupAndPkValue(0, 520, teamId).subscribe(upwOfficers => {
        this.upwOfficers = upwOfficers;
      });
    }
  }

  updateNsrd(nsrdData) {
    nsrdData.forEach((element: any) => {
      this.nsrdData[element.fieldName] = {};
      let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), 'fieldName', element.fieldName);
      if (element.active) {
        this.nsrdData[element.fieldName].active = element.active;
        this.sessionOutcomeForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
        if (element.mandatory) {
          this.nsrdData[element.fieldName].mandatory = element.mandatory;
          currentControl.validators.push(Validators.required);
          this.sessionOutcomeForm.controls[element.fieldName].setValidators(currentControl.validators);
        } else {
          this.sessionOutcomeForm.controls[element.fieldName].setValidators(currentControl.validators);
        }
      } else {
        this.nsrdData[element.fieldName].active = element.active;
        this.sessionOutcomeForm.removeControl(element.fieldName);
      }


      if (element.active) {
        this.sessionOutcomeForm.controls[element.fieldName].updateValueAndValidity();
      }
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
      this.upwAppointmentService.getUpwAppointmentCrd(searchObj).subscribe((breResponse: any)=>{
        this.updateNsrd(breResponse.resultMap.fieldObjectList);
      })
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
      this.allocatedServiceUsers.forEach(serviceUser=>{
        this.selectedAppointments[serviceUser.upwAppointmentId] = false;
      })
     })
  }

  delete(upwAppointmentId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        rejectVisible: false,
        accept: () => {
          let upwAppointment = Utility.getObjectFromArrayByKeyAndValue(this.allocatedServiceUsers, 'upwAppointmentId', upwAppointmentId);
          if(upwAppointment['upwOutcomeTypeId'] && upwAppointment['upwOutcomeTypeId'] != null){
            this.headerService.setErrorPopup({errorMessage: 'There is an outcome associated with this appointment. If you wish to delete this appointment please do this from the Plan.'});
          }else{
             this.upwAppointmentService.deleteUpwAppointment(upwAppointmentId).subscribe((data: any) => {
              this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
            });

          }
        }
      });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(UpwAppointmentConstants.featureId, field, "Read");
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
  updateCheckedOptions(option, event) {
    this.selectedAppointments[option] = event.target.checked;
  }
  onSubmit(){
    if(this.sessionOutcomeForm.valid){
      let appointments = Object.keys(this.selectedAppointments);
      let outcomeAppointments: any[] = [];

      appointments.forEach(appointmentId=>{
        if (this.selectedAppointments[appointmentId]) {
          let outcomeAppointment: any = {};

          let controls: any[] = Object.keys(this.sessionOutcomeForm.controls);
          controls.forEach(control=>{
            outcomeAppointment[control] = this.sessionOutcomeForm.controls[control].value;
          });
          outcomeAppointment.upwAppointmentId = appointmentId;
          outcomeAppointments.push(outcomeAppointment);
        }
      });
        if(outcomeAppointments.length > 0) {
          let suCompletionList: String[] = [];
          let message: String = '';
          outcomeAppointments.forEach(appointmentId=>{

            let appointment = Utility.getObjectFromArrayByKeyAndValue(this.allocatedServiceUsers, 'upwAppointmentId', parseInt(appointmentId.upwAppointmentId));
            let totalHoursLeftForSU = Utility.convertTimeToMinutes(appointment.totalHoursLeft);
            let appointmentHours = Utility.convertTimeToMinutes(this.upwAppointment.endTime) - Utility.convertTimeToMinutes(this.upwAppointment.startTime);
            if(appointmentHours <= 0 || (totalHoursLeftForSU - appointmentHours) <= 0 ) {
              suCompletionList.push('CRN '+appointment.caseReferenceNumber+' '+appointment.firstName+' '+appointment.familyName);
            }
          })

          if ( suCompletionList.length > 0 ){
            if(suCompletionList.length > 0){
              message += suCompletionList.join("<br> ") + '<br>There are no hours remaining on the above orders.<br>Click <b>OK</b> to return to the UPW Outcomes Screen.';
            }
            this.headerService.setErrorPopup({ 'errorMessage': message, buttonText: 'OK' });
            this.upwAppointmentService.bulkUpdateUpwAppointment(outcomeAppointments).subscribe(response=>{
              this.getAllocatedServiceUsers(this.upwAppointment.appointmentDate, this.upwAppointment.projectName, this.upwAppointment.startTime, this.upwAppointment.endTime);
            });
            // this.confirmService.confirm({
            //   message: message.toString(),
            //   header: 'Outcome Update Confirmation',
            //   icon: 'fa fa-trash',
            //   rejectVisible: false,
            //   accept: () => {
            //     this.upwAppointmentService.bulkUpdateUpwAppointment(outcomeAppointments).subscribe(response=>{
            //       this.getAllocatedServiceUsers(this.upwAppointment.appointmentDate, this.upwAppointment.projectName, this.upwAppointment.startTime, this.upwAppointment.endTime);
            //     });
            //   }
            // });
          }else{
            this.upwAppointmentService.bulkUpdateUpwAppointment(outcomeAppointments).subscribe(response=>{
                  this.getAllocatedServiceUsers(this.upwAppointment.appointmentDate, this.upwAppointment.projectName, this.upwAppointment.startTime, this.upwAppointment.endTime);
                });
          }
        }else{
          this.headerService.setErrorPopup({'errorMessage': 'Please select atleast one appointment to update.'});
        }
    }
  }
  selectAllUsers(){
    let list: HTMLCollectionOf<Element> = document.getElementsByClassName('appointment-checkbox');
    for (let index = 0; index < list.length; index++) {
      let element: any = list[index];
      element.checked = true;
      this.selectedAppointments[element.getAttribute('value')] = true;
    }

  }
  deselectAllUsers(){
  let list: HTMLCollectionOf<Element> = document.getElementsByClassName('appointment-checkbox');
    for (let index = 0; index < list.length; index++) {
      let element: any = list[index];
      element.checked = false;
      this.selectedAppointments[element.getAttribute('value')] = false;
    }
  }
  initForm(){
    this.sessionOutcomeForm = this._fb.group({
      upwTeamId: ['', Validators.compose([Validators.required])],
      upwTeam: [''],
      upwContactOfficer: ['', Validators.compose([Validators.required])],
      upwOutcomeTypeId: ['', Validators.compose([])],
      upwAppointmentId: [''],
      note: ['']
    });
  }



  getNSRDFormObj() {
    let formObjArray: any[] = [];
    let intensive: any = {};
    intensive.fieldName = 'intensiveYesNoId';
    intensive.field = { value: '' };
    intensive.validators = [];
    formObjArray.push(intensive);

    let upwOutcomeTypeId: any = {};
    upwOutcomeTypeId.fieldName = 'upwOutcomeTypeId';
    upwOutcomeTypeId.field = { value: '' };
    upwOutcomeTypeId.validators = [];
    formObjArray.push(upwOutcomeTypeId);

    let enforcementActionId: any = {};
    enforcementActionId.fieldName = 'enforcementActionId';
    enforcementActionId.field = { value: '' };
    enforcementActionId.validators = [];
    formObjArray.push(enforcementActionId);

    let behaviourId: any = {};
    behaviourId.fieldName = 'behaviourId';
    behaviourId.field = { value: '' };
    behaviourId.validators = [];
    formObjArray.push(behaviourId);

    let workQualityId: any = {};
    workQualityId.fieldName = 'workQualityId';
    workQualityId.field = { value: '' };
    workQualityId.validators = [];
    formObjArray.push(workQualityId);

    let highVisibilityVestYesNoId: any = {};
    highVisibilityVestYesNoId.fieldName = 'highVisibilityVestYesNoId';
    highVisibilityVestYesNoId.field = { value: '' };
    highVisibilityVestYesNoId.validators = [];
    formObjArray.push(highVisibilityVestYesNoId);

    let minutesCredited: any = {};
    minutesCredited.fieldName = 'minutesCredited';
    minutesCredited.field = { value: '', disabled: true };
    minutesCredited.validators = [];
    formObjArray.push(minutesCredited);

    let minutesOffered: any = {};
    minutesOffered.fieldName = 'minutesOffered';
    minutesOffered.field = { value: '', disabled: true };
    minutesOffered.validators = [];
    formObjArray.push(minutesOffered);

    let penaltyTime: any = {};
    penaltyTime.fieldName = 'penaltyTime';
    penaltyTime.field = { value: '', };
    penaltyTime.validators = [ValidationService.timeValidator];
    formObjArray.push(penaltyTime);

    return formObjArray;
  }
}
