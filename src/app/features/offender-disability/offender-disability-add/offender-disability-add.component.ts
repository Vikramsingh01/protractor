import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { OffenderDisabilityService } from '../offender-disability.service';
import { OffenderDisabilityConstants } from '../offender-disability.constants';
import { OffenderDisability } from '../offender-disability';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-offender-disability-edit',
    templateUrl: 'offender-disability-add.component.html'
})
export class OffenderDisabilityAddComponent implements OnInit {

    private subscription: Subscription;
    private offenderDisabilityId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    offenderDisabilityAddForm: FormGroup;
    private offenderDisability: OffenderDisability = new OffenderDisability();
    private offenderDisabilityObj: OffenderDisability = new OffenderDisability();
    assignedDisabilityTypes: number[] = [];
    offenderDisabilityList: any[];
    private action;
    
    private loggedUserDetails:string;
    private currentTime:string;
    private currentDate:Date;
	private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private offenderDisabilityService: OffenderDisabilityService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.loggedUserDetails=this.dataService.getLoggedInUserName();
           this.currentDate=new Date();
         this.currentTime=this.currentDate.toString().substring(0,25);
         console.log("user Details "+this.loggedUserDetails);
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.offenderDisability.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('offenderDisabilityId')) {
                this.action = "Create";
                this.offenderDisabilityId=0;
                this.titleService.setTitle('Add Accessibility');
            }else{
                this.action = "Update";
                this.offenderDisabilityId = params['offenderDisabilityId'];
                this.titleService.setTitle('Edit Accessibility');
            }
            
            this.offenderDisabilityService.getAssignedDisabilityTypes(this.offenderDisability.profileId,this.offenderDisabilityId).subscribe(data => {
                        this.offenderDisabilityList = data;
                        var disabilityTypesArr: number[] = [];
                        this.offenderDisabilityList.forEach(element => {
                            disabilityTypesArr.push(parseInt(element.value, 10));
                        });
                        this.assignedDisabilityTypes = disabilityTypesArr;
                    });
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(OffenderDisabilityConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(OffenderDisabilityConstants.featureId, OffenderDisabilityConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(OffenderDisabilityConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(OffenderDisabilityConstants.featureId, authorizationData[1]);
      }
   
      this.initForm();
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, this.action, this.authorizationData);
            this.offenderDisabilityService.isAuthorize(this.offenderDisability.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
                 if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('offenderDisabilityId')) {
                        this.offenderDisabilityId = params['offenderDisabilityId'];
                        this.offenderDisabilityAddForm.controls['disabilityTypeId'].disable();
                        this.offenderDisabilityService.getOffenderDisability(this.offenderDisabilityId).subscribe((data: any) => {
                            if(data.locked == "false"){
								this.previousNotes = data.note;
                                data.note = "";
                                this.offenderDisabilityAddForm.patchValue(data);
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

        // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OffenderDisabilityConstants.featureId, this.action);
        //     if (this.authorizedFlag) {
        //         this.initForm();
        //         this.subscription = this.route.params.subscribe((params: any) => {
        //             if (params.hasOwnProperty('offenderDisabilityId')) {
        //                 this.offenderDisabilityId = params['offenderDisabilityId'];
        //                 this.offenderDisabilityAddForm.controls['disabilityTypeId'].disable();
        //                 this.offenderDisabilityService.getOffenderDisability(this.offenderDisabilityId).subscribe((data: any) => {
        //                     if(data.locked == "false"){
		// 						this.previousNotes = data.note;
        //                         data.note = "";
        //                         this.offenderDisabilityAddForm.patchValue(data);
        //                     }
        //                     else{
        //                         this.headerService.setAlertPopup("The record is locked");
                                
        //                     }
        //                 });
        //             }
        //         })
        //     } else {
        //         this.headerService.setAlertPopup("Not authorized");
        //     }
        });
    }
    navigateTo(url) {
        if (this.offenderDisabilityAddForm.touched) {
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
        if (this.offenderDisabilityAddForm.valid) {
	this.offenderDisabilityAddForm.patchValue(Utility.escapeHtmlTags(this.offenderDisabilityAddForm.value));
    //        if (this.offenderDisabilityId != null) { 
         this.subscription = this.route.params.subscribe((params: any)=>{
       if(this.offenderDisabilityId==undefined){
          this.offenderDisabilityId=0;
        }
        this.offenderDisabilityAddForm.value.disabilityTypeId = this.offenderDisabilityAddForm.controls['disabilityTypeId'].value;
 //this.addressAssessmentAddForm.value.notes=this.loggedUserDetails+"\n"+this.currentTime+"\n"+ this.addressAssessmentAddForm.value.newNotes+"\n\n"+this.addressAssessmentAddForm.value.notes;
               
                  if (params.hasOwnProperty('offenderDisabilityId')) {
    		this.offenderDisabilityId = params['offenderDisabilityId']; 

                this.offenderDisabilityService.updateOffenderDisability(this.offenderDisabilityId, this.offenderDisabilityAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            } else {
                this.offenderDisabilityService.addOffenderDisability(this.offenderDisabilityAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], {relativeTo: this.route});
                });
 //           }
        }
     //   else {
            //alert("Invalid Form");
  //      }
        });
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(OffenderDisabilityConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(OffenderDisabilityConstants.featureId, field, this.action);
    }
    initForm() {
        this.offenderDisabilityAddForm = this._fb.group({
                        profileId:[ this.offenderDisability.profileId ],
                        spgVersion:[ this.offenderDisability.spgVersion ],
                        spgUpdateUser:[ this.offenderDisability.spgUpdateUser ],
                        disabilityTypeId:[ this.offenderDisability.disabilityTypeId ,  Validators.compose([ Validators.required , , , ]) ],
                        startDate:[ this.offenderDisability.startDate ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        note:[ this.offenderDisability.note ,  Validators.compose([, , , ]) ],
//                        newNote: ['',Validators.compose([, , Validators.maxLength(3900)])],
                        endDate:[ this.offenderDisability.endDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        offenderDisabilityId:[ this.offenderDisability.offenderDisabilityId , ],
                        spgOffenderDisabilityId:["0"],
                      
                        locked:[ this.offenderDisability.locked , ],
                      
                    });
    }
}

