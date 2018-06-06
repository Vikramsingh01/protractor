import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwProjectService } from '../upw-project.service';
import { UpwProjectConstants } from '../upw-project.constants';
import { UpwProject } from '../upw-project';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { AddressGenericService } from '../../../generic-components/address-generic/address-generic.service';
import {Title} from "@angular/platform-browser";
import { Utility } from '../../../shared/utility';
@Component({
    selector: 'tr-upw-project-edit',
    templateUrl: 'upw-project-add.component.html'
})
export class UpwProjectAddComponent implements OnInit {

    private subscription: Subscription;
    private upwProjectId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    upwProjectAddForm: FormGroup;
    private upwProject: UpwProject = new UpwProject();
    private dayOfWeekList: any[] = [];
    private officeTeams: any[] = [];
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private upwProjectService: UpwProjectService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private addressGenericService: AddressGenericService,
        private listService: ListService,
        private _titleService: Title) { }

    ngOnInit() {
      this.listService.getListDataByLookupAndPkValue(0, 533, this.dataService.getLoggedInUserId()).subscribe(officeTeams => {
        officeTeams.forEach(officeTeam=>{
          officeTeam.selectable = true;
        })
            this.officeTeams = officeTeams;
        });


        this.listService.getListData(357).subscribe(dayOfWeekList => {
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
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('upwProjectId')) {
                this.action = "Create";
                this._titleService.setTitle('Add Community Payback Project');
            } else {
                this.action = "Update";
                this._titleService.setTitle('Edit Community Payback Project');
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(UpwProjectConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(UpwProjectConstants.featureId, UpwProjectConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(UpwProjectConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(UpwProjectConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwProjectConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwProjectConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('upwProjectId')) {
                        this.upwProjectId = params['upwProjectId'];
                        this.upwProjectAddForm.controls['dateRequested'].disable();
                        this.upwProjectAddForm.controls['projectCode'].disable();
                        this.upwProjectAddForm.controls['projectName'].disable();
                        this.upwProjectService.getUpwProject(this.upwProjectId).subscribe((data: any) => {
                            //if (data.locked == "false") {
                                this.upwProjectAddForm.patchValue(data);
                                this.updateProjectAvailability(data.projectAvailability);
                            // }
                            // else {
                            //     this.headerService.setAlertPopup("The record is locked");

                            // }
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });
    }
    navigateTo(url) {
        if (this.upwProjectAddForm.touched) {
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
        if (this.upwProjectAddForm.valid) {
			this.upwProjectAddForm.patchValue(Utility.escapeHtmlTags(this.upwProjectAddForm.value));

            if (this.upwProjectId != null) {
                this.upwProjectService.updateUpwProject(this.upwProjectId, this.upwProjectAddForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            } else {
                this.upwProjectService.addUpwProject(this.upwProjectAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    updateProjectAvailability(projectAvailability: any[]){
        projectAvailability.forEach(pa=>{
            const control = <FormArray>this.upwProjectAddForm.controls['projectAvailability'];
            control.push(this._fb.group({
                dayOfWeekId: [pa.dayOfWeekId, Validators.compose([Validators.required])],
                start: [pa.start, Validators.compose([Validators.required, ValidationService.timeValidator])],
                end: [pa.end, Validators.compose([Validators.required, ValidationService.timeValidator])]
            }));
        })
    }
    addProjectAvailability(){
        const control = <FormArray>this.upwProjectAddForm.controls['projectAvailability'];
        control.push(this._fb.group({
            dayOfWeekId: ['', Validators.compose([Validators.required])],
            start: ['', Validators.compose([Validators.required, ValidationService.timeValidator])],
            end: ['', Validators.compose([Validators.required, ValidationService.timeValidator])]
        }));
    }
    removeProjectAvailability(i){
        const control = <FormArray>this.upwProjectAddForm.controls['projectAvailability'];
        control.removeAt(i);
    }
    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(UpwProjectConstants.tableId, field, this.action, this.authorizationData);
        //return this.authorizationService.isFeildAuthorized(UpwProjectConstants.featureId, field, this.action);
        return true;
    }
    initForm() {
        this.upwProjectAddForm = this._fb.group({
            upwProjectId: [this.upwProject.upwProjectId],
            projectStatusId: [this.upwProject.projectStatusId, Validators.compose([Validators.required, , ,])],
            projectCode: [this.upwProject.projectCode, Validators.compose([Validators.required, , Validators.maxLength(35),])],
            projectName: [this.upwProject.projectName, Validators.compose([Validators.required, , Validators.maxLength(200),])],
            officeTeamId: [this.upwProject.officeTeamId, Validators.compose([Validators.required, , ,])],
            highVisibilityYesNoId: [this.upwProject.highVisibilityYesNoId, Validators.compose([, , ,])],
            projectTypeId: [this.upwProject.projectTypeId, Validators.compose([Validators.required, , ,])],
            startDate: [this.upwProject.startDate, Validators.compose([, ValidationService.dateValidator, ,])],
            endDate: [this.upwProject.endDate, Validators.compose([, ValidationService.dateValidator, ,])],
            provider: [this.upwProject.provider, Validators.compose([, , Validators.maxLength(200),])],
            providerAddressId: this.addressGenericService.createAddressForm(this.upwProject.providerAddressId),
            beneficiaryName: [this.upwProject.beneficiaryName, Validators.compose([, , Validators.maxLength(200),])],
            beneficiaryAddressId: this.addressGenericService.createAddressForm(this.upwProject.beneficiaryAddressId),
            placementName: [this.upwProject.placementName, Validators.compose([, , Validators.maxLength(200),])],
            placementAddressId: this.addressGenericService.createAddressForm(this.upwProject.placementAddressId),
            placementNotes: [this.upwProject.placementNotes, Validators.compose([, , ,])],
            dateRequested: [this.upwProject.dateRequested, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            dateJobEvaluted: [this.upwProject.dateJobEvaluted, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            plannedStartDate: [this.upwProject.plannedStartDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            minimumAge: [this.upwProject.minimumAge, Validators.compose([ValidationService.NumberValidator, ValidationService.MinValue(17), ,])],
            maximumAge: [this.upwProject.maximumAge, Validators.compose([ValidationService.NumberValidator, , ,])],
            minimumNoInGroup: [this.upwProject.minimumNoInGroup, Validators.compose([Validators.required, ValidationService.NumberValidator, ValidationService.MinValue(0)])],
            maximumNoInGroup: [this.upwProject.maximumNoInGroup, Validators.compose([Validators.required, ValidationService.NumberValidator, ,])],
            genderSuitabilityId: [this.upwProject.genderSuitabilityId, Validators.compose([, , ,])],
            visibileToPublicYesNoId: [this.upwProject.visibileToPublicYesNoId, Validators.compose([, , ,])],
            projectNotSuitableForNotes: [this.upwProject.projectNotSuitableForNotes, Validators.compose([, , ,])],
            selectNatureOfWorkId: [this.upwProject.selectNatureOfWorkId, Validators.compose([, , ,])],
            qualificationOpportunitieId: [this.upwProject.qualificationOpportunitieId, Validators.compose([, , ,])],
            natureOfWorkNotes: [this.upwProject.natureOfWorkNotes, Validators.compose([, , ,])],
            projectAvailability: this._fb.array([])
        });
    }
}

