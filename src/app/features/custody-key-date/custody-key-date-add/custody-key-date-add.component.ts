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
import { CustodyKeyDateService } from '../custody-key-date.service';
import { CustodyKeyDateConstants } from '../custody-key-date.constants';
import { CustodyKeyDate } from '../custody-key-date';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";

@Component({
    selector: 'tr-custody-key-date-edit',
    templateUrl: 'custody-key-date-add.component.html'
})
export class CustodyKeyDateAddComponent implements OnInit {

    private subscription: Subscription;
    private custodyKeyDateId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    custodyKeyDateAddForm: FormGroup;
    private custodyKeyDate: CustodyKeyDate = new CustodyKeyDate();
    private action;
    private throughCareIds=[];
    eventId :number;
    
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private custodyKeyDateService: CustodyKeyDateService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
    if (params.hasOwnProperty('eventId')) {
                this.custodyKeyDate.eventId = params['eventId'];
                 this.eventId = params['eventId'];
            }
            if (params.hasOwnProperty('profileId')) {
                this.custodyKeyDate.profileId = params['profileId'];
               
            }
            if (!params.hasOwnProperty('custodyKeyDateId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Key Date");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit Key Date");
            }
       
             
            
        });


       
        //this.authorizationService.getAuthorizationDataByTableId(CustodyKeyDateConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CustodyKeyDateConstants.featureId, CustodyKeyDateConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(CustodyKeyDateConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(CustodyKeyDateConstants.featureId, authorizationData[1]);
      }
      this.initForm();
            this.custodyKeyDateService.isAuthorize(this.custodyKeyDate.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('custodyKeyDateId')) {
                        this.custodyKeyDateId = params['custodyKeyDateId'];
                        this.custodyKeyDateAddForm.controls['keyDateTypeId'].disable();

                        this.custodyKeyDateService.getCustodyKeyDate(this.custodyKeyDateId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.custodyKeyDateAddForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");                                
                            }
                        });
                    }
                })
            } else {
              this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
            }
            });

        //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyKeyDateConstants.tableId, this.action, this.authorizationData);
       // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyKeyDateConstants.featureId, this.action);
            
        });

       this.custodyKeyDateService.getRequestFilteredTypeList(this.eventId).subscribe(data=>{
            this.throughCareIds=data.throughCareIds;
         })

    }
    navigateTo(url) {
        if (this.custodyKeyDateAddForm.touched) {
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
        if (this.custodyKeyDateAddForm.valid) { 
			this.custodyKeyDateAddForm.patchValue(Utility.escapeHtmlTags(this.custodyKeyDateAddForm.value));
            if (this.custodyKeyDateId != null) {
                this.custodyKeyDateService.updateCustodyKeyDate(this.custodyKeyDateId, this.custodyKeyDateAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.custodyKeyDateService.addCustodyKeyDate(this.custodyKeyDateAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CustodyKeyDateConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CustodyKeyDateConstants.featureId, field, this.action);
    }
    initForm() {
        this.custodyKeyDateAddForm = this._fb.group({
                        custodyKeyDateId:[ this.custodyKeyDate.custodyKeyDateId ],
            
            
            
            
            
            
            
                  eventId:[ this.custodyKeyDate.eventId ,  Validators.compose([ Validators.required , , , ]) ],
                        // spgVersion:[ this.custodyKeyDate.spgVersion ,  Validators.compose([ Validators.required , ,  Validators.maxLength(32) , ]) ],
                        // spgUpdateUser:[ this.custodyKeyDate.spgUpdateUser ,  Validators.compose([ Validators.required , ,  Validators.maxLength(72) , ]) ],
                        spgCustodyKeyDateId:['0'],
                        // createdBy:[ this.custodyKeyDate.createdBy , ],
                        // createdByUserId:[ this.custodyKeyDate.createdByUserId , ],
                        // createdDate:[ this.custodyKeyDate.createdDate , ],
                        // modifiedBy:[ this.custodyKeyDate.modifiedBy , ],
                        // modifiedByUserId:[ this.custodyKeyDate.modifiedByUserId , ],
                        // modifiedDate:[ this.custodyKeyDate.modifiedDate , ],
                        // deleted:[ this.custodyKeyDate.deleted , ],
                        // deletedBy:[ this.custodyKeyDate.deletedBy , ],
                        // deletedByUserId:[ this.custodyKeyDate.deletedByUserId , ],
                        // deletedDate:[ this.custodyKeyDate.deletedDate , ],
                        // locked:[ this.custodyKeyDate.locked , ],
                        // version:[ this.custodyKeyDate.version , ],
                        keyDateTypeId:[ this.custodyKeyDate.keyDateTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        keyDate:[ this.custodyKeyDate.keyDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                    });
    }
}

