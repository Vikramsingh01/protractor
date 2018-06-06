import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { RecallService } from '../recall.service';
import { RecallConstants } from '../recall.constants';
import { Recall } from '../recall';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from '../../../shared/utility';
import { ListService } from '../../../services/list.service';
@Component({
    selector: 'tr-recall-edit',
    templateUrl: 'recall-add.component.html'
})
export class RecallAddComponent implements OnInit {

    private subscription: Subscription;
    private recallId: number;
    private authorizationData: any;
    private type;
    private authorizedFlag: boolean = false;
    recallAddForm: FormGroup;
    private recall: Recall = new Recall();
    private previousNotes: string = "";
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private recallService: RecallService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private titleService: Title) { }

    ngOnInit() {
        this.listService.getlistBreDataByTableId(135).subscribe(listResponse=>{
          this.type = listResponse.filter(item =>
              item['selectable'] == true);
        });

        this.route.params.subscribe((params: any) => {
            this.route.params.subscribe((params: any) => {
                if (params.hasOwnProperty('eventId')) {
                    this.recall.eventId = params['eventId'];
                }
            });
            if (!params.hasOwnProperty('recallId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Recall");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit Recall");
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(RecallConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(RecallConstants.featureId, RecallConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(RecallConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(RecallConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(RecallConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RecallConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('recallId')) {
                        this.recallId = params['recallId'];
                        this.recallService.getRecall(this.recallId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.previousNotes = data.recallNote;
                                data.recallNote = "";
                                this.recallAddForm.patchValue(data);
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
    navigateTo(url) {
        if (this.recallAddForm.touched) {
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
        if (this.recallAddForm.valid) {
			this.recallAddForm.patchValue(Utility.escapeHtmlTags(this.recallAddForm.value));
            if (this.recallId != null) {
                this.recallService.updateRecall(this.recallId, this.recallAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], { relativeTo: this.route });
                });
            } else {
                this.confirmService.confirm(
                    {
                        message: 'You are about to recall the Service User; all associated Licence Conditions will be auto-terminated. Ensure to terminate associated Recall NSI.',
                        header: 'Confirm',
                        accept: () => {
                            this.recallAddForm.value.spgRecallId = 0;
                            this.recallService.addRecall(this.recallAddForm.value).subscribe((response: any) => {
                                this.router.navigate(['../'], { relativeTo: this.route });
                            });
                        }
                    });

            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(RecallConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(RecallConstants.featureId, field, this.action);
    }
    initForm() {
        this.recallAddForm = this._fb.group({
            // recallId: [this.recall.recallId, Validators.compose([, , ,])],
            eventId: [this.recall.eventId, Validators.compose([Validators.required, , ,])],
            // spgVersion: [this.recall.spgVersion, Validators.compose([, , Validators.maxLength(32),])],
            // spgUpdateUser: [this.recall.spgUpdateUser, Validators.compose([, , Validators.maxLength(72),])],
            recallNote: [this.recall.recallNote, Validators.compose([, , ,])],
            spgRecallId: [this.recall.spgRecallId, Validators.compose([, , ,])],
            // createdBy: [this.recall.createdBy,],
            // createdByUserId: [this.recall.createdByUserId,],
            // createdDate: [this.recall.createdDate,],
            // modifiedBy: [this.recall.modifiedBy,],
            // modifiedByUserId: [this.recall.modifiedByUserId,],
            // modifiedDate: [this.recall.modifiedDate,],
            // deleted: [this.recall.deleted,],
            // deletedBy: [this.recall.deletedBy,],
            // deletedByUserId: [this.recall.deletedByUserId,],
            // deletedDate: [this.recall.deletedDate,],
            // locked: [this.recall.locked,],
            // version: [this.recall.version,],
            recallDate: [this.recall.recallDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            recallReasonId: [this.recall.recallReasonId, Validators.compose([Validators.required, , ,])],
            recallLocationId: [this.recall.recallLocationId, Validators.compose([Validators.required, , ,])],
        });
    }
}

