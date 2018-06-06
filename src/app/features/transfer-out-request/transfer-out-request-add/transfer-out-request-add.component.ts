import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { TransferOutRequestService } from '../transfer-out-request.service';
import { TransferOutRequestConstants } from '../transfer-out-request.constants';
import { TransferOutRequest } from '../transfer-out-request';
import { TransferTo } from '../transfer-to';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import {Title} from "@angular/platform-browser";
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-transfer-out-request-add',
    templateUrl: 'transfer-out-request-add.component.html'
})
export class TransferOutRequestAddComponent implements OnInit {

    private subscription: Subscription;
    private transferOutRequestId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    transferOutRequestAddForm: FormGroup;
    private transferOutRequest: TransferOutRequest = new TransferOutRequest();
    private transferTo: TransferTo = new TransferTo();
    private action;
    private arequestFlag: boolean = false;
    transferOutRequestList: any[] = [];
    providerCodesList: any[];
    private profileId: number;
    private allowTransferOut: boolean = false;

    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private transferOutRequestService: TransferOutRequestService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private _titleService: Title) { }

    ngOnInit() {
      this.providerCodesList = ['C10','C12','C11','C14','C13','C16','C15','C18','C17','C19','C21','C20','C01','C00','C03','C02','C05','C04','C07','C06','C09','C08','N00','N02','N01','N04','N03','N06','N05','N07'];
        this.action = "Create";
        this._titleService.setTitle('Transfer Out Request');
        //this.authorizationService.getAuthorizationDataByTableId(TransferOutRequestConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(TransferOutRequestConstants.featureId, TransferOutRequestConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(TransferOutRequestConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(TransferOutRequestConstants.featureId, authorizationData[1]);
        }});
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(TransferOutRequestConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TransferOutRequestConstants.featureId, this.action);
            if (this.authorizedFlag) {

                this.initForm();

                this.subscription = this.route.params.subscribe((params: any) => {
                    let transferOutRequest: TransferOutRequest = new TransferOutRequest();
                    // if(params.hasOwnProperty('profileId')){
                    //     this.profileId =  params['profileId'];
                    //     this.transferOutRequestService.getTransferOutRequests(this.profileId, transferOutRequest ).subscribe(transferOutRequestData => {
                    //         transferOutRequestData.forEach(element => {
                    //             const control = <FormArray>this.transferOutRequestAddForm.controls['transferOutRequests'];
                    //             control.push(this._fb.group({status: element.status, transferReasonId: element.transferReasonId, profileId: element.profileId,type: element.type,
                    //             dataId : element.dataId, tableId: element.tableId, transferToProviderId: element.transferToProviderId, transferToTeam: element.transferToTeam,
                    //             transferToOfficer : element.transferToOfficer, transferWithdrawnReasonId : element.transferWithdrawnReasonId,createdBy: element.createdBy,createdByUserId: element.createdByUserId,createdDate: element.createdDate,
                    //             modifiedBy: element.modifiedBy, modifiedByUserId: element.modifiedByUserId, modifiedDate: element.modifiedDate, deleted: element.deleted, deletedBy: element.deletedBy, deletedByUserId: element.deletedByUserId, deletedDate: element.deletedDate,
                    //             locked: element.locked, version: element.version, description: element.description, transferFromProviderId: element.transferFromProviderId, requestDate: element.requestDate
                    //         }));
                    //         });;
                    //     });
                    // }
                    if (params.hasOwnProperty('transferOutRequestId')) {
                        this.transferOutRequestId = params['transferOutRequestId'];
                        this.transferOutRequestService.getTransferOutRequest(this.transferOutRequestId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.transferOutRequestAddForm.patchValue(data);
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
            if(!this.arequestFlag && this.authorizedFlag){
                this.arequestFlag=true;
               this.initTransferRequest();
            }
    }

    initTransferRequest() {
        this.subscription = this.route.params.subscribe((params: any) => {
            let transferOutRequest: TransferOutRequest = new TransferOutRequest();
            if (params.hasOwnProperty('profileId')) {
                this.profileId = params['profileId'];
            }
                this.transferOutRequestService.getTransferOutRequests(this.profileId, transferOutRequest).subscribe(transferOutRequestData => {
                  this.transferOutRequestList = transferOutRequestData;
                    transferOutRequestData.forEach(element => {
                        const control = <FormArray>this.transferOutRequestAddForm.controls['transferOutRequests'];
                        control.push(this._fb.group({
                            transferOutRequestId: element.transferOutRequestId,
                            statusId: element.statusId,
                            transferReasonId: element.transferReasonId,
                            profileId: element.profileId, type: element.type,
                            dataId: element.dataId,
                            tableId: element.tableId,
                            transferToProviderId: element.transferToProviderId,
                            transferToTeam: element.transferToTeam,
                            transferToOfficer: element.transferToOfficer,
                            transferWithdrawnReasonId: element.transferWithdrawnReasonId,
                            teamId: element.teamId,
                            createdBy: element.createdBy,
                            createdByUserId: element.createdByUserId,
                            createdDate: element.createdDate,
                            modifiedBy: element.modifiedBy,
                            modifiedByUserId: element.modifiedByUserId,
                            modifiedDate: element.modifiedDate,
                            deleted: element.deleted,
                            deletedBy: element.deletedBy,
                            deletedByUserId: element.deletedByUserId,
                            deletedDate: element.deletedDate,
                            locked: element.locked,
                            version: element.version,
                            descriptionId: element.descriptionId,
                            transferFromProviderId: element.transferFromProviderId,
                            requestDate: element.requestDate,
                            transferFromOfficer: element.transferFromOfficer,
                            transferFromTeam: element.transferFromTeam
                        }));
                    });
                });
                   });
    }

    navigateTo(url) {
        if (this.transferOutRequestAddForm.touched) {
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
        if (this.transferOutRequestAddForm.valid) {

            this.transferOutRequestAddForm.patchValue(Utility.escapeHtmlTags(this.transferOutRequestAddForm.value));

            this.transferOutRequestService.addTransferOutRequest(this.transferOutRequestAddForm.value).subscribe((response: any) => {
                this.initForm();
                this.initTransferRequest();
            });

        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(TransferOutRequestConstants.tableId, field, this.action, this.authorizationData);
        //return this.authorizationService.isFeildAuthorized(TransferOutRequestConstants.featureId, field, this.action);
        return true;
    }
    isAuthorized(action) {
        //return this.authorizationService.isTableAuthorized(TransferOutRequestConstants.tableId, action, this.authorizationData);
        //return this.authorizationService.isFeatureActionAuthorized(TransferOutRequestConstants.featureId, action);
        return true;
    }

    initForm() {
        this.transferOutRequestAddForm = this._fb.group({
            transferToProviderId: ['', Validators.compose([Validators.required, , ,])],
            transferToTeam: [{ value: 'Unallocated', disabled: true }, Validators.compose([Validators.required, , ,])],
            transferToOfficer: [{ value: 'Unallocated', disabled: true }, Validators.compose([Validators.required, , ,])],
            transferOutRequests: this._fb.array([]),
        });
    }
    onChange(selectedValue) {
        this.allowTransferOut = true;
    }
}

