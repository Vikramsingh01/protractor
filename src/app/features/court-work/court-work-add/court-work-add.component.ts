import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CourtWorkService } from '../court-work.service';
import { CourtWorkConstants } from '../court-work.constants';
import { CourtWork } from '../court-work';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Event } from '../../event/event';
import { EventService } from '../../event/event.service';
import { RequestSubType } from '../requestSubType';
import { IDate, IMonth, IWeek, IDayLabels, IMonthLabels, IOptions } from "../../../generic-components/date-picker/index";
import { ListService } from '../../../services/list.service';
import { Utility } from "../../../shared/utility";

@Component({
    selector: 'tr-court-work-edit',
    templateUrl: 'court-work-add.component.html'
})
export class CourtWorkAddComponent implements OnInit {

    event: Event = new Event();
    private requestSubTypes: RequestSubType[] = [];
    private eventId: number;
    private subscription: Subscription;
    private courtWorkId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    courtWorkAddForm: FormGroup;
    private courtWork: CourtWork = new CourtWork();
    private action;
    childAnswers: any = [];
    private reqTypeIds=[];
    private previousNotes: string = "";
    private team: string = "";
    private officer: string = "";
    @Output("updateCourtWorkList") updateCourtWorkList: EventEmitter<any> = new EventEmitter<any>();
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private courtWorkService: CourtWorkService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title,
        private listService: ListService ) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
             if (params.hasOwnProperty('eventId')) {
                this.eventId = params['eventId'];
                this.courtWork.eventId=this.eventId;
             }

              if (params.hasOwnProperty('profileId')) {
                this.courtWork.profileId = params['profileId'];
             }
            if (!params.hasOwnProperty('courtWorkId')) {
                this.action = "Create";
                this.titleService.setTitle("Court Work");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Court Work");
            }
        });
        //this.courtWorkAddForm.controls['processRefDate'].enable();
        //this.authorizationService.getAuthorizationDataByTableId(CourtWorkConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CourtWorkConstants.featureId, CourtWorkConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CourtWorkConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CourtWorkConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtWorkConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CourtWorkConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('courtWorkId')) {
                        this.courtWorkId = params['courtWorkId'];
                        this.courtWorkService.getCourtWork(this.courtWorkId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.previousNotes = data.processNote;
                                data.processNote = "";
                                this.officer = data.nsiOfficer;
                                this.team = data.nsiTeam;
                                data.nsiOfficer = data.nsiOfficer.split("/")[1];
                                data.nsiTeam = data.nsiTeam.split("/")[1];
                                this.courtWorkAddForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");

                            }
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });

         this.courtWorkService.getRequestFilteredTypeList().subscribe(data=>{
            this.reqTypeIds=data.reqTypeIds;
         })

    }

 getToday(): IDate {
        let date: Date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    onChange(reqTypeId:number){

   let reqTypeIdCode = this.listService.getCodeByTableIdAndPkId(192, reqTypeId);

        let today: IDate = this.getToday();
        if(reqTypeIdCode=='CRTS'){
            this.courtWorkAddForm.controls['processRefDate'].disable();
            this.courtWorkAddForm.controls['processRefDate'].setValue(today.day+"/"+today.month+"/"+today.year);
        }else{
            this.courtWorkAddForm.controls['processRefDate'].setValue("");
            this.courtWorkAddForm.controls['processSubTypeId'].setValue("");
            this.courtWorkAddForm.controls['processRefDate'].enable();
        }
    }


updateAnswers(childAnswers) {
    this.childAnswers = childAnswers;
  }

    navigateTo(url) {
        if (this.courtWorkAddForm.touched) {
            this.confirmService.confirm(
                {
                    message: 'Do you want to leave this page without saving?',
                    header: 'Confirm',
                    accept: () => {
                        this.router.navigate(url, {relativeTo: this.route});
                    }
                });
        }else{
            this.router.navigate(url, {relativeTo: this.route});
            return false;
        }
    }
    onSubmit() {
        if (this.courtWorkAddForm.valid) {
			this.courtWorkAddForm.patchValue(Utility.escapeHtmlTags(this.courtWorkAddForm.value));

            if (this.courtWorkId != null) {
                this.courtWorkService.updateCourtWork(this.courtWorkId, this.courtWorkAddForm.value).subscribe((response: any) => {
                  this.headerService.refreshActiveBreach();
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.courtWorkService.addCourtWork(this.eventId, this.courtWorkAddForm.getRawValue()).subscribe((response: any) => {
                  this.headerService.refreshActiveBreach();
                    this.resetCourtWorkForm();
                    this.updateCourtWorkList.emit(true);

                });
            }

        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CourtWorkConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CourtWorkConstants.featureId, field, this.action);
    }
    initForm() {
        this.courtWorkAddForm = this._fb.group({
                        processId:[ this.courtWork.processId],
                        profileId:[ this.courtWork.profileId ,  Validators.compose([ Validators.required , , , ]) ],
                         eventId:[ this.courtWork.eventId ,  Validators.compose([ Validators.required , , , ]) ],
                        //spgVersion:[ this.courtWork.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
                        //spgUpdateUser:[ this.courtWork.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
                        processTypeId:[ this.courtWork.processTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        processSubTypeId:['' ,  Validators.compose([ Validators.required , , , ]) ],
                        processRefDate:[ this.courtWork.processRefDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        //processExpectedStartDate:[ this.courtWork.processExpectedStartDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        //processStartDate:[ this.courtWork.processStartDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                       // processExpectedEndDate:[ this.courtWork.processExpectedEndDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                       // processEndDate:[ this.courtWork.processEndDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                       // processStageId:[ this.courtWork.processStageId ,  Validators.compose([ Validators.required , , , ]) ],
                       // processStageDate:[ this.courtWork.processStageDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        processNote:[ this.courtWork.processNote],
                       // processOutcomeId:[ this.courtWork.processOutcomeId ,  Validators.compose([, , , ]) ],
                        //processEndAttCount:[ this.courtWork.processEndAttCount ,  Validators.compose([, , , ]) ],
                        //intendedProviderId:[ this.courtWork.intendedProviderId ,  Validators.compose([, , , ]) ],
                        spgProcessContactId: ['0'],
                        // createdBy:[ this.courtWork.createdBy , ],
                        // createdByUserId:[ this.courtWork.createdByUserId , ],
                        // createdDate:[ this.courtWork.createdDate , ],
                        // modifiedBy:[ this.courtWork.modifiedBy , ],
                        // modifiedByUserId:[ this.courtWork.modifiedByUserId , ],
                        // modifiedDate:[ this.courtWork.modifiedDate , ],
                        // deleted:[ this.courtWork.deleted , ],
                        // deletedBy:[ this.courtWork.deletedBy , ],
                        // deletedByUserId:[ this.courtWork.deletedByUserId , ],
                        // deletedDate:[ this.courtWork.deletedDate , ],
                        // locked:[ this.courtWork.locked , ],
                        // version:[ this.courtWork.version , ],
                    });

    }
    resetCourtWorkForm(){
        this.courtWorkAddForm.controls['processTypeId'].setValue("");
        this.courtWorkAddForm.controls['processSubTypeId'].setValue("");
        this.courtWorkAddForm.controls['processRefDate'].setValue("");
        this.courtWorkAddForm.controls['processNote'].setValue("");
        this.courtWorkAddForm.controls['processRefDate'].enable();
        this.courtWorkAddForm.controls['processTypeId'].markAsUntouched();
        this.courtWorkAddForm.controls['processSubTypeId'].markAsUntouched();
        this.courtWorkAddForm.controls['processRefDate'].markAsUntouched();
          this.courtWorkAddForm.controls['processRefDate'].markAsUntouched();
    }
}

