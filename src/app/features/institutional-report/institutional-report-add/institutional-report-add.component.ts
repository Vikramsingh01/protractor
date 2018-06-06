import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { InstitutionalReportService } from '../institutional-report.service';
import { Utility } from "../../../shared/utility";
import { InstitutionalReportConstants } from '../institutional-report.constants';
import { InstitutionalReport } from '../institutional-report';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { AssociatedPTO } from '../associated-pto';
import { Title } from "@angular/platform-browser";


@Component({
    selector: 'tr-institutional-report-edit',
    templateUrl: 'institutional-report-add.component.html'
})
export class InstitutionalReportAddComponent implements OnInit {

    private subscription: Subscription;
    private institutionalReportId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    institutionalReportAddForm: FormGroup;
    private institutionalReport: InstitutionalReport = new InstitutionalReport();
    institutionalReportList: any[];
    private yesNoList = [];
    private action;
    private orgs: any = [];
    private teams: any = [];
    private officerIds: any = [];
    alertList: any = [];
    private institutionalReports: any[] = [];
    private institutionalReportForvideoLinkYesNoId: any = {};
    private previousNotes: string = "";
    private associatedPTO: AssociatedPTO;
    private team: string = "";
    private officer: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,

        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private institutionalReportService: InstitutionalReportService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private listService: ListService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.listService.getListData(244).subscribe(data => {

            data.forEach(function (value, index) {
                if (value.value == "Undefined") {
                    data.splice(index, 1);
                }
            });
            this.yesNoList = data
            this.yesNoList = data

            this.yesNoList = data;
        });


        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('eventId')) {
                this.institutionalReport.eventId = params['eventId'];
            }
            if (params.hasOwnProperty('profileId')) {
                this.institutionalReport.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('institutionalReportId')) {
                this.action = "Create";
                this.titleService.setTitle('Add Institutional Report');
            } else {
                this.action = "Update";
                this.titleService.setTitle('Edit Institutional Report');
            }
        });

        this.listService.getListDataByLookupAndPkValue(263, 533, localStorage.getItem("loggedInUserId")).subscribe(listObj => {
            this.orgs = listObj;
            if (this.orgs.length > 0) {
                this.listService.getListDataByLookupAndPkValue(445, 2, this.orgs[0].key).subscribe(listObj => {
                    this.teams = listObj;
                })
            }
        })

        this.authorizationService.getAuthorizationData(InstitutionalReportConstants.featureId, InstitutionalReportConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(InstitutionalReportConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(InstitutionalReportConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(InstitutionalReportConstants.tableId, this.action, this.authorizationData);
            this.initForm();
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, this.action, this.authorizationData);
            this.institutionalReportService.isAuthorize(this.institutionalReport.profileId, this.action).subscribe((response: any) => {
                this.authorizedFlag = response;
                if (this.authorizedFlag) {
                    this.initForm();
                    this.subscription = this.route.params.subscribe((params: any) => {

                        this.institutionalReportAddForm.controls['institutionalReportProviderId'].disable();

                        if (!params.hasOwnProperty('institutionalReportId')) {
                              this.institutionalReportService.getPTOfficer(this.institutionalReport.eventId).subscribe(data => {
                              this.associatedPTO = data
                              this.institutionalReportAddForm.controls['institutionalReportProviderId'].setValue(this.associatedPTO.provider);
                            });
                        }   

                        if (params.hasOwnProperty('institutionalReportId')) {
                            this.institutionalReportId = params['institutionalReportId'];
                            this.institutionalReportAddForm.controls['institutionalReportProviderId'].disable();
                            this.institutionalReportService.getInstitutionalReport(this.institutionalReportId).subscribe((data: any) => {
                                if (data.locked == "false") {
                                    this.previousNotes = data.note;
                                    data.note = "";

                                    this.officer = data.institutionalReportOfficer;
                                    this.team = data.institutionalReportTeam;
                                    data.institutionalReportTeam = data.institutionalReportTeam.split("/")[1].split("(")[0].split("[")[0];
                                    data.institutionalReportOfficer = this.parseOfficer(data.institutionalReportOfficer);
                                    

                                    this.institutionalReportAddForm.patchValue(data);

                                    this.institutionalReportAddForm.controls['institutionalReportTeam'].disable();
                                    this.institutionalReportAddForm.controls['institutionalReportOfficer'].disable();
                                }
                                else {
                                    this.headerService.setAlertPopup("The record is locked");

                                }
                            });
                        }
                    })
                } else {
                    this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
                }
            });

        });
    }

    change(option) {
        if (option.selectedIndex > 0) {
            let selectedTeamId = this.orgs[option.selectedIndex - 1].key;
            this.listService.getListDataByLookupAndPkValue(270, 538, selectedTeamId).subscribe(listObj => {
                this.officerIds = listObj;
                if (this.officerIds.length == 0) {
                    this.institutionalReportAddForm.value.officerIds = null;
                }
            })
        }
    }

    navigateTo(url) {
        if (this.institutionalReportAddForm.touched) {
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


    upwProjectUpdate(institutionalReportId) {
        //     if(institutionalReportId != null && institutionalReportId != ""){
        //     this.InstitutionalReportService.getListData(this.tableId).subscribe(data => 
        //        {   this.dataService.addListData(this.tableId, data);
        //           this.institutionalReportForvideoLinkYesNoId = data;
        //     }
        // }
    }

    onSubmit() {
        if (this.institutionalReportAddForm.valid) {
            this.institutionalReportAddForm.patchValue(Utility.escapeHtmlTags(this.institutionalReportAddForm.value));

            if (this.institutionalReportId != null) {
                this.institutionalReportAddForm.value.institutionalReportProviderId = this.institutionalReportAddForm.controls['institutionalReportProviderId'].value;
                this.institutionalReportService.updateInstitutionalReport(this.institutionalReportId, this.institutionalReportAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            } else {
                this.institutionalReportAddForm.value.institutionalReportProviderId = this.institutionalReportAddForm.controls['institutionalReportProviderId'].value;
                this.institutionalReportService.addInstitutionalReport(this.institutionalReportAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(InstitutionalReportConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(InstitutionalReportConstants.featureId, field, this.action);
    }
    initForm() {
        this.institutionalReportAddForm = this._fb.group({
            // institutionalReportId:[ this.institutionalReport.institutionalReportId ,  Validators.compose([ Validators.required , , , ]) ],
            eventId: [this.institutionalReport.eventId, Validators.compose([Validators.required, , ,])],
            requestedDate: [this.institutionalReport.requestedDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            requiredByDate: [this.institutionalReport.requiredByDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            allocatedDate: [this.institutionalReport.allocatedDate, Validators.compose([, ValidationService.dateValidator, ,])],
            // videoLinkYesNoId:[ this.institutionalReport.videoLinkYesNoId, Validators.compose([ Validators.required ,]) ],
            videoLinkYesNoId: ['2', Validators.compose([Validators.required, ,])],
            // spgVersion:[ this.institutionalReport.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
            // spgUpdateUser:[ this.institutionalReport.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
            requestedReportTypeId: [this.institutionalReport.requestedReportTypeId, Validators.compose([Validators.required, , ,])],
            completedDate: [this.institutionalReport.completedDate, Validators.compose([, ValidationService.dateValidator, ,])],
            institutionId: [this.institutionalReport.institutionId, Validators.compose([Validators.required, , ,])],
            deliveredToEstablishment: [this.institutionalReport.deliveredToEstablishment, Validators.compose([, ValidationService.dateValidator, ,])],
            dateAbandoned: [this.institutionalReport.dateAbandoned, Validators.compose([, ValidationService.dateValidator, ,])],
            institutionalReportProviderId: [this.institutionalReport.institutionalReportProviderId, Validators.compose([Validators.required, , ,])],
            institutionalReportTeam: [this.institutionalReport.institutionalReportTeam, Validators.compose([Validators.required, , ,])],
            institutionalReportOfficer: [this.institutionalReport.institutionalReportOfficer, Validators.compose([Validators.required, , ,])],
            note: [this.institutionalReport.note, Validators.compose([, , ,])],
            spgInstitutionalReportId: ['0'],
            // createdBy:[ this.institutionalReport.createdBy , ],
            // createdByUserId:[ this.institutionalReport.createdByUserId , ],
            // createdDate:[ this.institutionalReport.createdDate , ],
            // modifiedBy:[ this.institutionalReport.modifiedBy , ],
            // modifiedByUserId:[ this.institutionalReport.modifiedByUserId , ],
            // modifiedDate:[ this.institutionalReport.modifiedDate , ],
            // deleted:[ this.institutionalReport.deleted , ],
            // deletedBy:[ this.institutionalReport.deletedBy , ],
            // deletedByUserId:[ this.institutionalReport.deletedByUserId , ],
            // deletedDate:[ this.institutionalReport.deletedDate , ],
            // locked:[ this.institutionalReport.locked , ],
            // version:[ this.institutionalReport.version , ],
        });
    }

    parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }
}

