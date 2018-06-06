import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ProvisionService } from '../provision.service';
import { ProvisionConstants } from '../provision.constants';
import { Provision } from '../provision';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { DisabilityProvisionType } from '../disabilityProvisionType';
import { Utility } from "../../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-provision-edit',
    templateUrl: 'provision-add.component.html'
})
export class ProvisionAddComponent implements OnInit {

    private subscription: Subscription;
    private provisionId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    provisionAddForm: FormGroup;
    private provision: Provision = new Provision();
    private action;
    private disabilityProvisionTypes: DisabilityProvisionType[] = [];
    assignedProvisionTypes: number[] = [];
    provisionList: any[];
	private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private provisionService: ProvisionService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('disabilityId')) {
                this.provision.offenderDisabilityId = params['disabilityId'];
            }
             if (params.hasOwnProperty('profileId')) {
                this.provision.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('provisionId')) {
                this.action = "Create";
                this.provisionId = 0;
                this.titleService.setTitle('Add Accessibility Provision');
            }else{
                this.action = "Update";
                this.provisionId = params['provisionId'];
                this.titleService.setTitle('Edit Accessibility Provision');
            }

            this.provisionService.getAssignedProvisionTypes(this.provision.offenderDisabilityId,this.provisionId).subscribe(data => {
                        this.provisionList = data;
                        var provisionTypesArr: number[] = [];
                        this.provisionList.forEach(element => {
                            provisionTypesArr.push(parseInt(element.value, 10));
                        });
                        this.assignedProvisionTypes = provisionTypesArr;
                    });

        });
       
        //this.authorizationService.getAuthorizationDataByTableId(ProvisionConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ProvisionConstants.featureId, ProvisionConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ProvisionConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ProvisionConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProvisionConstants.tableId, this.action, this.authorizationData);
         this.initForm();
            this.provisionService.isAuthorize(this.provision.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('provisionId')) {
                        this.provisionId = params['provisionId'];
                        this.provisionAddForm.controls['adjustmentId'].disable();
                        this.provisionService.getProvision(this.provisionId).subscribe((data: any) => {
                            if(data.locked == "false"){
								this.previousNotes = data.note;
                                data.note = "";
                                this.provisionAddForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");
                                
                            }
                        });
                    }
                })

                this.provisionService.getDisabilityProvisionTypes(this.provision.offenderDisabilityId,this.provisionId).subscribe(data => {
                    this.disabilityProvisionTypes = data
                });
            } else {
                this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
            }    
            });

        // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ProvisionConstants.featureId, this.action);
        //     if (this.authorizedFlag) {
        //         this.initForm();
        //         this.subscription = this.route.params.subscribe((params: any) => {
        //             if (params.hasOwnProperty('provisionId')) {
        //                 this.provisionId = params['provisionId'];
        //                 this.provisionAddForm.controls['adjustmentId'].disable();
        //                 this.provisionService.getProvision(this.provisionId).subscribe((data: any) => {
        //                     if(data.locked == "false"){
		// 						this.previousNotes = data.note;
        //                         data.note = "";
        //                         this.provisionAddForm.patchValue(data);
        //                     }
        //                     else{
        //                         this.headerService.setAlertPopup("The record is locked");
                                
        //                     }
        //                 });
        //             }
        //         })

        //         this.provisionService.getDisabilityProvisionTypes(this.provision.offenderDisabilityId,this.provisionId).subscribe(data => {
        //             this.disabilityProvisionTypes = data
        //         });
        //     } else {
        //         this.headerService.setAlertPopup("Not authorized");
        //     }
        });
    }
    navigateTo(url) {
        if (this.provisionAddForm.touched) {
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
        if (this.provisionAddForm.valid) {
			this.provisionAddForm.patchValue(Utility.escapeHtmlTags(this.provisionAddForm.value));
	
	this.subscription = this.route.params.subscribe((params: any)=>{
 if(this.provisionId==undefined){
          this.provisionId=0;
        }

      this.provisionAddForm.value.adjustmentId = this.provisionAddForm.controls['adjustmentId'].value;
           
this.provisionService.checkDuplicateAccessibilityProvision(this.provisionId,this.provisionAddForm.value).subscribe((response: any)=>{
    		  if(!response.requestStatus){
            if (params.hasOwnProperty('provisionId')) {
    		this.provisionId = params['provisionId'];  
    		 this.provisionService.updateProvision(this.provisionId, this.provisionAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.provisionService.addProvision(this.provisionAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
        }
          }
          else{
            alert("Provision already exists");
          }
    		});

    });

    }
    else{
    	// alert("Invalid Form");
    }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ProvisionConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ProvisionConstants.featureId, field, this.action);
    }
    initForm() {
        this.provisionAddForm = this._fb.group({
                        provisionId:[ this.provision.provisionId ],
                        spgVersion:[ this.provision.spgVersion  ],
                        spgUpdateUser:[ this.provision.spgUpdateUser ],
                        adjustmentId:[ this.provision.adjustmentId ,  Validators.compose([ Validators.required , , , ]) ],
                        startDate:[ this.provision.startDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        note:[ this.provision.note ,  Validators.compose([, , , ]) ],
                        endDate:[ this.provision.endDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        spgProvisionId:[ '0' ],
                        offenderDisabilityId:[ this.provision.offenderDisabilityId ,  Validators.compose([ Validators.required , , , ]) ],
                    });
    }
}

