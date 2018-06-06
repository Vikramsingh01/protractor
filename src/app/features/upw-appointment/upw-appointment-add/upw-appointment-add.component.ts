import { Component, OnInit, OnDestroy, Directive, HostListener, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwAppointmentService } from '../upw-appointment.service';
import { UpwAppointmentConstants } from '../upw-appointment.constants';
import { UpwAppointment } from '../upw-appointment';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { UpwProjectService } from "../../upw-project/upw-project.service";
import { ListService } from "../../../services/list.service";
import { Utility } from "../../../shared/utility";
import { ServiceUserService } from "../../service-user/service-user.service";
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-upw-appointment-add',
  templateUrl: 'upw-appointment-add.component.html'
})
export class UpwAppointmentAddComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private upwAppointmentId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  upwAppointmentAddForm: FormGroup;
  private upwProjects: any[] = [];
  private teams: any[] = [];
  private officeTeams: any[] = [];
  private upwTeams: any[] = [];
  private upwOfficers: any[] = [];
  private projectTypes: any[] = [];
  private nsrdData: any[] = [];
  private childAnswers: any[] = [];
  private allocatedServiceUsers: any[] = [];
  private projectSlots: any[] = [];
  private outcomeTypeList: any[] = [];
  private teamSubscription: Subscription;
  private upwAppointment: UpwAppointment = new UpwAppointment();
  private action;
  private previousNotes: string = "";
  private showHideAllocatedServiceUsers: boolean = false;
  constructor(private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private upwAppointmentService: UpwAppointmentService,
    private validationService: ValidationService,
    private confirmService: ConfirmService,
    private headerService: HeaderService,
    private upwProjectService: UpwProjectService,
    private listService: ListService,
    private serviceUserService: ServiceUserService,
    private titleService: Title) { }

  ngOnInit() {
    
    this.teamSubscription = this.listService.getListDataWithLookup(0, 503).subscribe(teams => {
      this.teams = teams;
    });
    this.listService.getListDataByLookupAndPkValue(0, 533, this.dataService.getLoggedInUserId()).subscribe(officeTeams => {
      this.officeTeams = officeTeams;
    });

    this.listService.getListDataByLookupAndPkValue(0, 519, this.dataService.getLoggedInUserId()).subscribe(officeTeams => {
      this.upwTeams = officeTeams;
    });
    this.listService.getListData(239).subscribe(projectTypes => {
      this.projectTypes = projectTypes;
    });
    this.listService.getPkValueByTableIdAndCodeFromDB(104, "CUPA").subscribe((pkValue: any) => {
      this.listService.getDependentAnswers(104, pkValue.pkValue).subscribe((outcomeTypeList: any) => {
        this.outcomeTypeList = outcomeTypeList[103];
      });
    })

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('upwEventId')) {
        this.upwAppointment.eventId = params['upwEventId'];
      }
      if (!params.hasOwnProperty('upwAppointmentId')) {
        this.action = "Create";
        this.titleService.setTitle('Schedule Community Payback Appointment');
      } else {
        this.action = "Update";
        this.titleService.setTitle('Edit Community Payback Appointment');
      }
    });

    this.authorizationService.getAuthorizationData(UpwAppointmentConstants.featureId, UpwAppointmentConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(UpwAppointmentConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(UpwAppointmentConstants.featureId, authorizationData[1]);
      }
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAppointmentConstants.featureId, this.action);
      if (this.authorizedFlag) {
        this.initForm();
        this.subscription = this.route.params.subscribe((params: any) => {
          if (params.hasOwnProperty('upwAppointmentId')) {
            this.upwAppointmentId = params['upwAppointmentId'];
            this.upwAppointmentService.getUpwAppointment(this.upwAppointmentId).subscribe((data: any) => {
              if (data.locked == "false") {
                data = this.upwAppointmentService.removeConstantsFields(data);
                this.upwAppointmentService.getUpwAppointmentCrd(data).subscribe((breResponse: any) => {
                  this.updateNsrd(breResponse.resultMap.fieldObjectList);
                  let team = Utility.getObjectFromArrayByKeyAndValue(this.upwTeams, 'value', data.upwTeam);
                  if (team != null) {
                    data.upwTeamId = Utility.getObjectFromArrayByKeyAndValue(this.upwTeams, 'value', data.upwTeam).key;
                  }
                  this.supervisiorTeamChange(data.upwTeamId);
                  this.upwProjectService.specificSearch({ projectName: data.projectName, projectTypeId: data.projectTypeId }, null, null).subscribe((projects: any) => {
                    if (projects.content.length == 1) {
                      data.officeTeamId = projects.content[0].officeTeamId;
                      data.projectId = projects.content[0].upwProjectId;
                    }
                    if (data.upwOutcomeTypeId == null) {
                      data.upwOutcomeTypeId = "";
                    }
                    if (data.upwOutcomeTypeId != "") {
                      this.upwAppointmentAddForm.controls['appointmentDate'].disable();
                    }
                    if(Utility.getObjectFromArrayByKeyAndValue(this.upwOfficers, 'value', data.upwContactOfficer) != null){
                      data.upwContactOfficerId = Utility.getObjectFromArrayByKeyAndValue(this.upwOfficers, 'value', data.upwContactOfficer).key;
                    }
                    this.previousNotes = data.note;
                    data.note = "";
                    this.upwAppointmentAddForm.patchValue(data);
                    this.getUPWData();
                  })
                });
                //this.upwAppointmentAddForm.patchValue(data);

              }
              else {
                this.headerService.setAlertPopup("The record is locked");

              }
            });
          }
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });
    this.upwAppointmentAddForm.controls['startTime'].valueChanges.subscribe(value => {
      if (this.upwAppointmentAddForm.controls['startTime'].valid && this.upwAppointmentAddForm.controls['endTime'].valid
        && this.upwAppointmentAddForm.controls['startTime'].value != null && this.upwAppointmentAddForm.controls['endTime'].value != null
        && this.upwAppointmentAddForm.controls['startTime'].value != "" && this.upwAppointmentAddForm.controls['endTime'].value != "") {
        let penaltyTime = 0;
        if (this.upwAppointmentAddForm.controls['penaltyTime'] != null && this.upwAppointmentAddForm.controls['penaltyTime'].valid && this.upwAppointmentAddForm.controls['penaltyTime'].value != null && this.upwAppointmentAddForm.controls['penaltyTime'].value != "") {
          penaltyTime = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['penaltyTime'].value);
        }
        let diff = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['endTime'].value) - Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['startTime'].value);
        if (this.upwAppointmentAddForm.controls['minutesOffered'] != null) {
          this.upwAppointmentAddForm.controls['minutesOffered'].setValue(Utility.convertMinutesToHours(diff));
        }
        if (this.upwAppointmentAddForm.controls['minutesCredited'] != null) {
          this.upwAppointmentAddForm.controls['minutesCredited'].setValue(Utility.convertMinutesToHours(diff - penaltyTime));
        }
      }
    })
    this.upwAppointmentAddForm.controls['endTime'].valueChanges.subscribe(value => {
      if (this.upwAppointmentAddForm.controls['startTime'].valid && this.upwAppointmentAddForm.controls['endTime'].valid
        && this.upwAppointmentAddForm.controls['startTime'].value != null && this.upwAppointmentAddForm.controls['endTime'].value != null
        && this.upwAppointmentAddForm.controls['startTime'].value != "" && this.upwAppointmentAddForm.controls['endTime'].value != "") {
        let penaltyTime = 0;
        if (this.upwAppointmentAddForm.controls['penaltyTime'] != null && this.upwAppointmentAddForm.controls['penaltyTime'].valid && this.upwAppointmentAddForm.controls['penaltyTime'].value != null && this.upwAppointmentAddForm.controls['penaltyTime'].value != "") {
          penaltyTime = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['penaltyTime'].value);
        }
        let diff = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['endTime'].value) - Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['startTime'].value);
        if (this.upwAppointmentAddForm.controls['minutesOffered'] != null) {
          this.upwAppointmentAddForm.controls['minutesOffered'].setValue(Utility.convertMinutesToHours(diff));
        }
        if (this.upwAppointmentAddForm.controls['minutesCredited'] != null) {
          this.upwAppointmentAddForm.controls['minutesCredited'].setValue(Utility.convertMinutesToHours(diff - penaltyTime));
        }
      }
    })

    this.upwAppointmentAddForm.controls['penaltyTime'].valueChanges.subscribe(value => {
      if (this.upwAppointmentAddForm.controls['startTime'].valid && this.upwAppointmentAddForm.controls['endTime'].valid
        && this.upwAppointmentAddForm.controls['startTime'].value != null && this.upwAppointmentAddForm.controls['endTime'].value != null
        && this.upwAppointmentAddForm.controls['startTime'].value != "" && this.upwAppointmentAddForm.controls['endTime'].value != "") {
        let penaltyTime = 0;
        if (this.upwAppointmentAddForm.controls['penaltyTime'] != null && this.upwAppointmentAddForm.controls['penaltyTime'].valid && this.upwAppointmentAddForm.controls['penaltyTime'].value != null && this.upwAppointmentAddForm.controls['penaltyTime'].value != "") {
          penaltyTime = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['penaltyTime'].value);
        }
        let diff = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['endTime'].value) - Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['startTime'].value);
        if (this.upwAppointmentAddForm.controls['minutesOffered'] != null) {
          this.upwAppointmentAddForm.controls['minutesOffered'].setValue(Utility.convertMinutesToHours(diff));
        }
        if (this.upwAppointmentAddForm.controls['minutesCredited'] != null) {
          this.upwAppointmentAddForm.controls['minutesCredited'].setValue(Utility.convertMinutesToHours(diff - penaltyTime));
        }
      }
    })

    this.upwAppointmentAddForm.controls['upwOutcomeTypeId'].valueChanges.subscribe(value => {
      if (value == null || value == "") {
        this.nsrdData["penaltyTime"] = {};
        this.nsrdData["penaltyTime"].active = false;
        this.upwAppointmentAddForm.removeControl("penaltyTime");
        this.nsrdData["intensiveYesNoId"] = {};
        this.nsrdData["intensiveYesNoId"].active = false;
        this.upwAppointmentAddForm.removeControl("intensiveYesNoId");
        this.nsrdData["minutesOffered"] = {};
        this.nsrdData["minutesOffered"].active = false;
        this.upwAppointmentAddForm.removeControl("minutesOffered");
        this.nsrdData["minutesCredited"] = {};
        this.nsrdData["minutesCredited"].active = false;
        this.upwAppointmentAddForm.removeControl("minutesCredited");
        this.nsrdData["highVisibilityVestYesNoId"] = {};
        this.nsrdData["highVisibilityVestYesNoId"].active = false;
        this.upwAppointmentAddForm.removeControl("highVisibilityVestYesNoId");
        this.nsrdData["workQualityId"] = {};
        this.nsrdData["workQualityId"].active = false;
        this.upwAppointmentAddForm.removeControl("workQualityId");
        this.nsrdData["behaviourId"] = {};
        this.nsrdData["behaviourId"].active = false;
        this.upwAppointmentAddForm.removeControl("behaviourId");
        this.nsrdData["enforcementActionId"] = {};
        this.nsrdData["enforcementActionId"].active = false;
        this.upwAppointmentAddForm.removeControl('enforcementActionId');
      }
    });
  }

  valueChange() {
    if (this.upwAppointmentAddForm.controls['penaltyTime'] != null) {
      this.upwAppointmentAddForm.controls['penaltyTime'].valueChanges.subscribe(value => {
        if (this.upwAppointmentAddForm.controls['startTime'].valid && this.upwAppointmentAddForm.controls['endTime'].valid
          && this.upwAppointmentAddForm.controls['startTime'].value != null && this.upwAppointmentAddForm.controls['endTime'].value != null
          && this.upwAppointmentAddForm.controls['startTime'].value != '' && this.upwAppointmentAddForm.controls['endTime'].value != '') {
          let penaltyTime = 0;
          if (this.upwAppointmentAddForm.controls['penaltyTime'] != null && this.upwAppointmentAddForm.controls['penaltyTime'].valid && this.upwAppointmentAddForm.controls['penaltyTime'].value != null && this.upwAppointmentAddForm.controls['penaltyTime'].value != '') {
            penaltyTime = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['penaltyTime'].value);
          }
          let diff = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['endTime'].value) - Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['startTime'].value);
          if (this.upwAppointmentAddForm.controls['minutesOffered'] != null) {
            this.upwAppointmentAddForm.controls['minutesOffered'].setValue(Utility.convertMinutesToHours(diff));
          }
          if (this.upwAppointmentAddForm.controls['minutesCredited'] != null) {
            this.upwAppointmentAddForm.controls['minutesCredited'].setValue(Utility.convertMinutesToHours(diff - penaltyTime));
          }
        }
      })
    }
  }
  updateNsrd(nsrdData) {
    nsrdData.forEach((element: any) => {
      this.nsrdData[element.fieldName] = {};
      let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), 'fieldName', element.fieldName);
      if (element.active) {
        this.nsrdData[element.fieldName].active = element.active;
        this.upwAppointmentAddForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
        if (element.mandatory) {
          this.nsrdData[element.fieldName].mandatory = element.mandatory;
          currentControl.validators.push(Validators.required);
          this.upwAppointmentAddForm.controls[element.fieldName].setValidators(currentControl.validators);
        } else {
          this.upwAppointmentAddForm.controls[element.fieldName].setValidators(currentControl.validators);
        }
      } else {
        this.nsrdData[element.fieldName].active = element.active;
        this.upwAppointmentAddForm.removeControl(element.fieldName);
      }


      if (element.active) {
        this.upwAppointmentAddForm.controls[element.fieldName].updateValueAndValidity();
      }
    });
    this.updateFormData();
    this.valueChange();
  }

  updateAd(childAnswers) {
    this.childAnswers = childAnswers;
  }
  getUPWData() {
    let searchObj: any = {};
    searchObj.officeTeamId = this.upwAppointmentAddForm.value.officeTeamId;
    searchObj.projectTypeId = this.upwAppointmentAddForm.value.projectTypeId;
    searchObj.startDate = this.upwAppointmentAddForm.getRawValue().appointmentDate;
    let date = Utility.convertStringToDate(this.upwAppointmentAddForm.getRawValue().appointmentDate);

    if (date != null && searchObj.officeTeamId != null && searchObj.officeTeamId != ''
      && searchObj.projectTypeId != null && searchObj.projectTypeId != '' && searchObj.startDate != null && searchObj.startDate != '') {
      let dayOfWeek = date.getDay();
      if (dayOfWeek == 0) {
        dayOfWeek = 7;
      }
      searchObj.dayOfWeekId = dayOfWeek;
      this.upwProjectService.sortFilterAndPaginate(searchObj, { size: 1000000 }, null).subscribe((upwProjectList: any) => {
        this.upwProjects = upwProjectList.content;
        if (upwProjectList.content.length == 0) {
          this.upwAppointmentAddForm.controls['projectName'].setValue('');
          this.upwAppointmentAddForm.controls['projectId'].setValue('');
          this.upwAppointmentAddForm.controls['startTime'].setValue('');
          this.upwAppointmentAddForm.controls['endTime'].setValue('');
        }
      });
    }
  }

  upwProjectUpdate(upwProjectId) {
    if (upwProjectId != null && upwProjectId != '') {

      let upwProjectForAvailability = Utility.getObjectFromArrayByKeyAndValue(this.upwProjects, 'upwProjectId', parseInt(upwProjectId));
      this.upwAppointmentAddForm.controls['projectName'].setValue(upwProjectForAvailability.projectName);
      let date = Utility.convertStringToDate(this.upwAppointmentAddForm.value.appointmentDate);
      let dayOfWeek = date.getDay();
      if (dayOfWeek == 0) {
        dayOfWeek = 7;
      }
      let projectSlots: any[] = Utility.filterArrayByKeyAndValue(upwProjectForAvailability.projectAvailability, 'dayOfWeekId', dayOfWeek);
      if (projectSlots.length === 1) {
        this.upwAppointmentAddForm.controls['startTime'].setValue(projectSlots[0].start);
        this.upwAppointmentAddForm.controls['endTime'].setValue(projectSlots[0].end);
        let diff = Utility.convertTimeToMinutes(projectSlots[0].end) - Utility.convertTimeToMinutes(projectSlots[0].start);
        let penaltyTime = 0;
        if (this.upwAppointmentAddForm.controls['penaltyTime'] != null && this.upwAppointmentAddForm.controls['penaltyTime'].valid && this.upwAppointmentAddForm.controls['penaltyTime'].value != null && this.upwAppointmentAddForm.controls['penaltyTime'].value != '') {
          penaltyTime = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['penaltyTime'].value);
        }
        if (this.upwAppointmentAddForm.controls['minutesOffered'] != null) {
          this.upwAppointmentAddForm.controls['minutesOffered'].setValue(Utility.convertMinutesToHours(diff));
        }
        if (this.upwAppointmentAddForm.controls['minutesCredited'] != null) {
          this.upwAppointmentAddForm.controls['minutesCredited'].setValue(Utility.convertMinutesToHours(diff - penaltyTime));
        }
        this.projectSlots = [];


      }

      if (projectSlots.length > 1) {
        this.upwAppointmentAddForm.controls['startTime'].setValue(null);
        this.upwAppointmentAddForm.controls['endTime'].setValue(null);
        this.projectSlots = projectSlots;
      }
    }
  }

  projectAvailabilityUpdate(projectAvailabilityId) {
    let projectSlot: any = Utility.getObjectFromArrayByKeyAndValue(this.projectSlots, 'projectAvailabilityId', parseInt(projectAvailabilityId));
    if (projectSlot != null) {
      this.upwAppointmentAddForm.controls['startTime'].setValue(projectSlot.start);
      this.upwAppointmentAddForm.controls['endTime'].setValue(projectSlot.end);
      let diff = Utility.convertTimeToMinutes(projectSlot.end) - Utility.convertTimeToMinutes(projectSlot.start);
      let penaltyTime = 0;
      if (this.upwAppointmentAddForm.controls['penaltyTime'] != null && this.upwAppointmentAddForm.controls['penaltyTime'].valid && this.upwAppointmentAddForm.controls['penaltyTime'].value != null && this.upwAppointmentAddForm.controls['penaltyTime'].value != '') {
        penaltyTime = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['penaltyTime'].value);
      }
      if (this.upwAppointmentAddForm.controls['minutesOffered'] != null) {
        this.upwAppointmentAddForm.controls['minutesOffered'].setValue(Utility.convertMinutesToHours(diff));
      }
      if (this.upwAppointmentAddForm.controls['minutesCredited'] != null) {
        this.upwAppointmentAddForm.controls['minutesCredited'].setValue(Utility.convertMinutesToHours(diff - penaltyTime));
      }
    }
  }


  supervisiorTeamChange(teamId) {
    if (teamId != null) {
      this.upwAppointmentAddForm.controls['upwTeam'].setValue(Utility.getObjectFromArrayByKeyAndValue(this.upwTeams, 'key', parseInt(teamId)).value);
      this.listService.getListDataByLookupAndPkValue(0, 520, teamId).subscribe(upwOfficers => {
        this.upwOfficers = upwOfficers;
      });
    }
  }
  getAllocatedServiceUsers() {
    this.showHideAllocatedServiceUsers = !this.showHideAllocatedServiceUsers;
    if (this.showHideAllocatedServiceUsers) {
      let searchObj: any = {};
      searchObj.appointmentDate = this.upwAppointmentAddForm.controls['appointmentDate'].value;
      searchObj.projectName = this.upwAppointmentAddForm.controls['projectName'].value;
      this.upwAppointmentService.getAllocatedServiceUserIdsBySpecificAppointmentDateAndProjectName(searchObj).subscribe(allocateServiceUserResponse => {
        let profileIds: any[] = allocateServiceUserResponse.allocatedServiceUserIds;
        if (profileIds.length > 0) {
          this.serviceUserService.searchByProfileIds(profileIds).subscribe(allocatedServiceUsers => {
            this.allocatedServiceUsers = allocatedServiceUsers;
          })
        } else {
          this.allocatedServiceUsers = [];
        }
      })
    }
  }

  updateAnswers(childAnswers) {
    this.childAnswers = childAnswers;
  }
  navigateTo(url) {
    if (this.upwAppointmentAddForm.touched) {
      this.confirmService.confirm(
        {
          message: 'Do you want to leave this page without saving?',
          header: 'Confirm',
          accept: () => {
            this.router.navigate(url, { relativeTo: this.route });
          }
        });
    } else {
      this.router.navigate(url, { relativeTo: this.route });
      return false;
    }
  }

  updateFormData() {
    if (this.upwAppointmentAddForm.controls['startTime'].valid && this.upwAppointmentAddForm.controls['endTime'].valid
      && this.upwAppointmentAddForm.controls['startTime'].value != null && this.upwAppointmentAddForm.controls['endTime'].value != null
      && this.upwAppointmentAddForm.controls['startTime'].value != '' && this.upwAppointmentAddForm.controls['endTime'].value != '') {
      let penaltyTime = 0;
      if (this.upwAppointmentAddForm.controls['penaltyTime'] != null && this.upwAppointmentAddForm.controls['penaltyTime'].valid && this.upwAppointmentAddForm.controls['penaltyTime'].value != null && this.upwAppointmentAddForm.controls['penaltyTime'].value != '') {
        penaltyTime = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['penaltyTime'].value);
      }
      let diff = Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['endTime'].value) - Utility.convertTimeToMinutes(this.upwAppointmentAddForm.controls['startTime'].value);
      if (this.upwAppointmentAddForm.controls['minutesOffered'] != null) {
        this.upwAppointmentAddForm.controls['minutesOffered'].setValue(Utility.convertMinutesToHours(diff));
      }
      if (this.upwAppointmentAddForm.controls['minutesCredited'] != null) {
        this.upwAppointmentAddForm.controls['minutesCredited'].setValue(Utility.convertMinutesToHours(diff - penaltyTime));
      }
    }
  }
  onSubmit() {
    if (this.upwAppointmentAddForm.valid) {
      this.upwAppointmentAddForm.controls['upwContactOfficer'].setValue(Utility.getObjectFromArrayByKeyAndValue(this.upwOfficers, 'key', parseInt(this.upwAppointmentAddForm.controls['upwContactOfficerId'].value)).value);
			this.upwAppointmentAddForm.patchValue(Utility.escapeHtmlTags(this.upwAppointmentAddForm.value));
      this.upwAppointmentService.checkduplicateAppointment(this.upwAppointmentAddForm.getRawValue()).subscribe(response=> {
        if(response == false)
            this.headerService.setErrorPopup({'errorMessage': 'Unable to create this appointment it will coincide with an existing appointment'});
         else{
              if (this.upwAppointmentId != null) {
        this.upwAppointmentService.updateUpwAppointment(this.upwAppointmentId, this.upwAppointmentAddForm.getRawValue()).subscribe((response: any) => {
          this.router.navigate(['../../..'], { relativeTo: this.route });
        });
      } else {
        this.upwAppointmentService.addUpwAppointment(this.upwAppointmentAddForm.getRawValue()).subscribe((response: any) => {
          this.router.navigate(['../..'], { relativeTo: this.route });
        });
      }
            }

          });

    }
  }

  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(UpwAppointmentConstants.featureId, field, this.action);
  }
  initForm() {
    this.upwAppointmentAddForm = this._fb.group({
      officeTeamId: ['', Validators.compose([Validators.required])],
      upwAppointmentId: [this.upwAppointment.upwAppointmentId, Validators.compose([, , ,])],
      eventId: [this.upwAppointment.eventId, Validators.compose([, , ,])],
      spgUpwAppointmentId: ['0'],
      appointmentDate: [this.upwAppointment.appointmentDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
      providerId: [this.upwAppointment.providerId, Validators.compose([, , ,])],
      upwOutcomeTypeId: [this.upwAppointment.upwOutcomeTypeId, Validators.compose([, , ,])],
      projectTypeId: ['', Validators.compose([Validators.required, , ,])],
      projectName: [this.upwAppointment.projectName, Validators.compose([Validators.required])],
      projectId: ['', Validators.compose([Validators.required])],
      startTime: [this.upwAppointment.startTime, Validators.compose([Validators.required, ValidationService.timeValidator, , ,])],
      endTime: [this.upwAppointment.endTime, Validators.compose([Validators.required, ValidationService.timeValidator, , ,])],
      penaltyTime: [this.upwAppointment.penaltyTime, Validators.compose([ValidationService.timeValidator, , ,])],
      note: [this.upwAppointment.note, Validators.compose([, , ,])],
      upwTeamId: ['', Validators.compose([Validators.required, , Validators.maxLength(60),])],
      upwTeam: ['', Validators.compose([Validators.required, , Validators.maxLength(60),])],
      upwContactOfficerId: ['', Validators.compose([Validators.required, , Validators.maxLength(80),])],
      upwContactOfficer: ['', Validators.compose([])],
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.teamSubscription.unsubscribe();
  }
}
