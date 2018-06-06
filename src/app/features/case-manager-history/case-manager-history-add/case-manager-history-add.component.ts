import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CaseManagerHistoryService } from '../case-manager-history.service';
import { CaseManagerHistoryConstants } from '../case-manager-history.constants';
import { CaseManagerHistory } from '../case-manager-history';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-case-manager-history-edit',
    templateUrl: 'case-manager-history-add.component.html'
})
export class CaseManagerHistoryAddComponent implements OnInit {

    private subscription: Subscription;
    private caseManagerHistoryId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    caseManagerHistoryAddForm: FormGroup;
    private caseManagerHistory: CaseManagerHistory = new CaseManagerHistory();
    private action;
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private caseManagerHistoryService: CaseManagerHistoryService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('caseManagerHistoryId')) {
                this.action = "Create";
            }else{
                this.action = "Update";
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(CaseManagerHistoryConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CaseManagerHistoryConstants.featureId, CaseManagerHistoryConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CaseManagerHistoryConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CaseManagerHistoryConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CaseManagerHistoryConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CaseManagerHistoryConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('caseManagerHistoryId')) {
                        this.caseManagerHistoryId = params['caseManagerHistoryId'];
                        this.caseManagerHistoryService.getCaseManagerHistory(this.caseManagerHistoryId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.caseManagerHistoryAddForm.patchValue(data);
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
    }
    navigateTo(url) {
        if (this.caseManagerHistoryAddForm.touched) {
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
        if (this.caseManagerHistoryAddForm.valid) {
			this.caseManagerHistoryAddForm.patchValue(Utility.escapeHtmlTags(this.caseManagerHistoryAddForm.value));
      
            if (this.caseManagerHistoryId != null) {
                this.caseManagerHistoryService.updateCaseManagerHistory(this.caseManagerHistoryId, this.caseManagerHistoryAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            } else {
                this.caseManagerHistoryService.addCaseManagerHistory(this.caseManagerHistoryAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CaseManagerHistoryConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CaseManagerHistoryConstants.featureId, field, this.action);
    }
    initForm() {
        this.caseManagerHistoryAddForm = this._fb.group({
                        profileId:[ this.caseManagerHistory.profileId ,  Validators.compose([ Validators.required , , , ]) ],
                        teamId:[ this.caseManagerHistory.teamId ,  Validators.compose([ Validators.required , , , ]) ],
                        userId:[ this.caseManagerHistory.userId ,  Validators.compose([ Validators.required , , , ]) ],
                        startDate:[ this.caseManagerHistory.startDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        caseManagerAllocationId:[ this.caseManagerHistory.caseManagerAllocationId ,  Validators.compose([ Validators.required , , , ]) ],
                        endDate:[ this.caseManagerHistory.endDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        transferReason:[ this.caseManagerHistory.transferReason ,  Validators.compose([, ,  Validators.maxLength(50) , ]) ],
                        createdBy:[ this.caseManagerHistory.createdBy , ],
                        createdByUserId:[ this.caseManagerHistory.createdByUserId , ],
                        createdDate:[ this.caseManagerHistory.createdDate , ],
                        modifiedBy:[ this.caseManagerHistory.modifiedBy , ],
                        modifiedByUserId:[ this.caseManagerHistory.modifiedByUserId , ],
                        modifiedDate:[ this.caseManagerHistory.modifiedDate , ],
                        deleted:[ this.caseManagerHistory.deleted , ],
                        deletedBy:[ this.caseManagerHistory.deletedBy , ],
                        deletedByUserId:[ this.caseManagerHistory.deletedByUserId , ],
                        deletedDate:[ this.caseManagerHistory.deletedDate , ],
                        locked:[ this.caseManagerHistory.locked , ],
                        version:[ this.caseManagerHistory.version , ],
                        transferFromProviderId:[ this.caseManagerHistory.transferFromProviderId ,  Validators.compose([, , , ]) ],
                        transferToResponsibleOfficer:[ this.caseManagerHistory.transferToResponsibleOfficer ,  Validators.compose([, ,  Validators.maxLength(50) , ]) ],
                        allocationDate:[ this.caseManagerHistory.allocationDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        transferReasonId:[ this.caseManagerHistory.transferReasonId ,  Validators.compose([, , , ]) ],
                        transferToProviderId:[ this.caseManagerHistory.transferToProviderId ,  Validators.compose([, , , ]) ],
                    });
    }
}

