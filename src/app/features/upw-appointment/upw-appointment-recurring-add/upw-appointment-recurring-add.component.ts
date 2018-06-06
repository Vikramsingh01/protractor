import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { ListService } from '../../../services/list.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwAppointmentService } from '../upw-appointment.service';
import { UpwAppointmentConstants } from '../upw-appointment.constants';
import { UpwAppointment } from '../upw-appointment';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { UpwProjectService } from "../../upw-project/upw-project.service";
import { Utility } from "../../../shared/utility";
import { ServiceUserService } from "../../service-user/service-user.service";
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';

@Component({
    selector: 'tr-upw-appointment-recurring-edit',
    templateUrl: 'upw-appointment-recurring-add.component.html'
})
export class UpwAppointmentRecurringAddComponent implements OnInit {

    private subscription: Subscription;
    private upwAppointmentId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    upwAppointmentAddForm: FormGroup;
    upwProjectSearchForm: FormGroup;
    private upwAppointment: UpwAppointment = new UpwAppointment();
    private action;
    private upwProjects: any[] = [];
    private officeTeams: any[] = [];
    private dayOfWeekList: any[] = [];
    private upwProjectForAvailability: any = {};
    private allocatedServiceUsers: any[] = [];
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
        private titleService: Title,
        private listService: ListService,
        private serviceUserService: ServiceUserService) { }

    ngOnInit() {
      this.listService.getListData(357).subscribe((dayOfWeekList: any[]) => {
        dayOfWeekList.sort((n1, n2) => {
          if (n1.key > n2.key) {
            return 1;
          }
          if (n1.key < n2.key) {
            return -1;
          }
          return 0;
        });
        this.dayOfWeekList = dayOfWeekList;
        });

         this.listService.getListDataByLookupAndPkValue(0, 533, this.dataService.getLoggedInUserId()).subscribe(officeTeams => {
          this.officeTeams = officeTeams;
        });
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('upwEventId')) {
                this.upwAppointment.eventId = params['upwEventId'];
                this.initValidateForm();
            }
            if (!params.hasOwnProperty('upwAppointmentId')) {
                this.action = "Create";
                this.titleService.setTitle("Schedule Recurring Community Payback Appointment");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Add Community Payback Appointment");
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
                                this.upwAppointmentAddForm.patchValue(data);
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
    }

    upwProjectUpdate(upwProjectId){
        if(upwProjectId != null && upwProjectId != ""){
            this.upwProjectForAvailability = Utility.getObjectFromArrayByKeyAndValue(this.upwProjects, "upwProjectId", parseInt(upwProjectId));
            this.upwProjectSearchForm.controls['projectName'].setValue(this.upwProjectForAvailability.projectName);
            this.upwProjectSearchForm.controls['projectAvailability'].setValue("");
        }
    }

    projectAvailabilityUpdate(projectAvailabilityId){
        if(projectAvailabilityId != null && projectAvailabilityId != ''){
            let projectAvailability = Utility.getObjectFromArrayByKeyAndValue(this.upwProjectForAvailability.projectAvailability, "projectAvailabilityId", parseInt(projectAvailabilityId));
            this.upwProjectSearchForm.controls['startTime'].setValue(projectAvailability.start);
            this.upwProjectSearchForm.controls['endTime'].setValue(projectAvailability.end);
            this.upwProjectSearchForm.controls['selectedDay'].setValue(projectAvailability.dayOfWeekId);
        }else{
            this.upwProjectSearchForm.controls['startTime'].setValue('');
            this.upwProjectSearchForm.controls['endTime'].setValue('');
        }
    }

    getUPWData(){
        this.upwProjectSearchForm.controls['startDate'].markAsTouched();
        this.upwProjectSearchForm.controls['dayOfWeekId'].markAsTouched();
        this.upwProjectSearchForm.controls['projectName'].setValue('');
        this.upwProjectSearchForm.controls['projectId'].setValue('');
        if(this.upwProjectSearchForm.controls['startDate'].valid){
            this.upwProjectSearchForm.value.projectAvailability = null;
            let  sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
            sortSearchPaginationObj.paginationObj.size = 10000000;
            this.upwProjectService.sortFilterAndPaginate(this.upwProjectSearchForm.value, sortSearchPaginationObj.paginationObj, null).subscribe((upwProjectList: any) => {
                this.upwProjects = upwProjectList.content;
            });
        }
    }


    addUpwAppointment(){
        if(this.upwProjectSearchForm.valid){
            this.upwProjectSearchForm.value.projectAvailability = null;
            this.upwAppointmentService.validate(this.upwProjectSearchForm.value).subscribe(breResponse=>{
                const control = <FormArray>this.upwAppointmentAddForm.controls['upwAppointment'];
                let timeDifferenceInMinutes = Utility.convertTimeToMinutes(this.upwProjectSearchForm.controls['endTime'].value)-Utility.convertTimeToMinutes(this.upwProjectSearchForm.controls['startTime'].value);
                control.push(this._fb.group({
                    dayOfWeekId: [this.upwProjectSearchForm.controls['selectedDay'].value, Validators.compose([Validators.required])],
                    upwProjectId: [this.upwProjectSearchForm.controls['projectId'].value, Validators.compose([Validators.required])],
                    projectTypeId: [this.upwProjectSearchForm.controls['projectTypeId'].value],
                    projectName: [this.upwProjectSearchForm.controls['projectName'].value, Validators.compose([Validators.required])],
                    startDate: [this.upwProjectSearchForm.controls['startDate'].value, Validators.compose([Validators.required])],
                    endDate: [this.upwProjectSearchForm.controls['endDate'].value, Validators.compose([])],
                    startTime: [this.upwProjectSearchForm.controls['startTime'].value, Validators.compose([Validators.required])],
                    endTime: [this.upwProjectSearchForm.controls['endTime'].value, Validators.compose([Validators.required])],
                    eventId: [this.upwAppointment.eventId, Validators.compose([Validators.required])],
                    hours: [Utility.convertMinutesToHours(timeDifferenceInMinutes)]
                }));
                //this.resetUpwAppointmentSearchForm();
            },
            error=>{
                if(error.status === 409){
                    this.headerService.setErrorPopup({errorMessage: "Unable to create this sequence of appointments as one or more of the dates coincides with an existing appointment"})
                }
            })

        }

    }
    removeUpwAppointment(i){
        const control = <FormArray>this.upwAppointmentAddForm.controls['upwAppointment'];
        control.removeAt(i);
    }

    getAllocatedServiceUsers(){
        this.showHideAllocatedServiceUsers = !this.showHideAllocatedServiceUsers;
        if(this.showHideAllocatedServiceUsers){
            let searchObj: any= {};
            searchObj.appointmentDate = this.upwProjectSearchForm.controls['startDate'].value;
            searchObj.projectName = this.upwProjectSearchForm.controls['projectName'].value;
            this.upwAppointmentService.getAllocatedServiceUserIdsByAppointmentDateAndProjectName(searchObj).subscribe(allocateServiceUserResponse=>{
                let profileIds: any[] = allocateServiceUserResponse.allocatedServiceUserIds;
                if(profileIds.length > 0){
                    this.serviceUserService.searchByProfileIds(profileIds).subscribe(allocatedServiceUsers=>{
                        this.allocatedServiceUsers = allocatedServiceUsers;
                    })
                }else{
                    this.allocatedServiceUsers = [];
                }
            })
        }
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
    onSubmit() {
        if (this.upwAppointmentAddForm.valid) {
          const control = <FormArray>this.upwAppointmentAddForm.controls['upwAppointment'];
          if(control.length <=0){
            this.headerService.setErrorPopup({errorMessage: 'You must add at least one appointment.'})
            return false;
          }
            if (this.upwAppointmentId != null) {
                this.upwAppointmentService.updateUpwAppointment(this.upwAppointmentId, this.upwAppointmentAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                });
            } else {
                this.upwAppointmentService.addRecurringUpwAppointment(this.upwAppointmentAddForm.value.upwAppointment).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            }
        }
    }

    isFeildAuthorized(field) {
        return this.authorizationService.isFeildAuthorized(UpwAppointmentConstants.featureId, field, this.action);
    }
    initForm() {
        this.upwAppointmentAddForm = this._fb.group({
            upwAppointment: this._fb.array([]),
        });
    }

    initValidateForm(){
      this.upwProjectSearchForm = this._fb.group({
            startDate: ['', Validators.compose([ValidationService.dateValidator, Validators.required])],
            dayOfWeekId: ['', Validators.compose([Validators.required])],
            officeTeamId: [''],
            projectTypeId: [''],
            projectId: ['', Validators.compose([Validators.required])],
            projectName: ['', Validators.compose([Validators.required])],
            projectAvailability: ['', Validators.compose([Validators.required])],
            startTime: ['', Validators.compose([ValidationService.timeValidator, Validators.required])],
            endTime: ['', Validators.compose([ValidationService.timeValidator, Validators.required])],
            endDate: ['', Validators.compose([])],
            selectedDay: ['', Validators.compose([Validators.required])],
            eventId: [this.upwAppointment.eventId]
        })
    }

    resetUpwAppointmentSearchForm(){
        this.upwProjects = [];
        this.upwProjectForAvailability = [];
        this.upwProjectSearchForm.reset();
        this.upwProjectSearchForm.controls['dayOfWeekId'].setValue("");
        this.upwProjectSearchForm.controls['officeTeamId'].setValue("");
        this.upwProjectSearchForm.controls['projectTypeId'].setValue("");
        this.upwProjectSearchForm.controls['projectId'].setValue("");
        this.upwProjectSearchForm.controls['projectAvailability'].setValue("");
    }
}

