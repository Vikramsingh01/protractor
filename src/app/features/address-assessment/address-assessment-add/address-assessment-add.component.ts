import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AddressAssessmentService } from '../address-assessment.service';
import { AddressAssessmentConstants } from '../address-assessment.constants';
import { AddressAssessment } from '../address-assessment';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-address-assessment-edit',
    templateUrl: 'address-assessment-add.component.html'
})
export class AddressAssessmentAddComponent implements OnInit {

    private subscription: Subscription;
    private addressAssessmentId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    addressAssessmentAddForm: FormGroup;
    private addressAssessment: AddressAssessment = new AddressAssessment();
    private action;
    private loggedUserDetails:string;
    private currentTime:string;
    private currentDate:Date;
    private providerList=[];
	  private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private addressAssessmentService: AddressAssessmentService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService) { }

    ngOnInit() {
  /*       this.loggedUserDetails=this.dataService.getLoggedInUserName();
         this.currentDate=new Date();
         this.currentTime=this.currentDate.toString().substring(0,25);
         console.log("user Details "+this.loggedUserDetails);
*/       
	   this.route.params.subscribe((params: any) => {
           if (params.hasOwnProperty('profileId')) {
                this.addressAssessment.profileId = params['profileId'];
            }

         if (params.hasOwnProperty('offenderAddressId')) {
                this.addressAssessment.offenderAddressId = params['offenderAddressId'];
            }

            if (!params.hasOwnProperty('addressAssessmentId')) {
                this.action = "Create";
            }else{
                this.action = "Update";
            }
        });

        
       
        //this.authorizationService.getAuthorizationDataByTableId(AddressAssessmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AddressAssessmentConstants.featureId, AddressAssessmentConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AddressAssessmentConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AddressAssessmentConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AddressAssessmentConstants.tableId, this.action, this.authorizationData);
          this.initForm();
            this.addressAssessmentService.isAuthorize(this.addressAssessment.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (response) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('addressAssessmentId')) {
                        this.addressAssessmentId = params['addressAssessmentId'];
                        this.addressAssessmentService.getAddressAssessment(this.addressAssessmentId).subscribe((data: any) => {
                            if (data.locked == "false") {
								this.previousNotes = data.notes;
                                data.notes = "";
                                this.addressAssessmentAddForm.patchValue(data);
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
           

        // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AddressAssessmentConstants.featureId, this.action);
        //     if (this.authorizedFlag) {
        //         this.initForm();
        //         this.subscription = this.route.params.subscribe((params: any) => {
        //             if (params.hasOwnProperty('addressAssessmentId')) {
        //                 this.addressAssessmentId = params['addressAssessmentId'];
        //                 this.addressAssessmentService.getAddressAssessment(this.addressAssessmentId).subscribe((data: any) => {
        //                     if(data.locked == "false"){
		// 						this.previousNotes = data.notes;
        //                         data.notes = "";
        //                         this.addressAssessmentAddForm.patchValue(data);
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
         this.addressAssessmentService.getProviderFilteredList().subscribe(data=>{
            this.providerList=data.providerList;
         })
    }
    navigateTo(url) {
        if (this.addressAssessmentAddForm.touched) {
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
 
        if (this.addressAssessmentAddForm.valid) {
     /*            if(this.addressAssessmentAddForm.value.notes!=null ){
                this.addressAssessmentAddForm.value.notes=this.loggedUserDetails+"\n"+this.currentTime+"\n"+ this.addressAssessmentAddForm.value.newNotes+"\n\n"+this.addressAssessmentAddForm.value.notes;
                this.addressAssessmentAddForm.value.notes=String(this.addressAssessmentAddForm.value.notes).replace(/<[^>]+>/gm,"");
                }else{
					 this.addressAssessmentAddForm.value.notes=this.loggedUserDetails+"\n"+this.currentTime+"\n"+ this.addressAssessmentAddForm.value.newNotes+"\n\n";
                this.addressAssessmentAddForm.value.notes=String(this.addressAssessmentAddForm.value.notes).replace(/<[^>]+>/gm,"");
				}*/
            if (this.addressAssessmentId != null) {
           
                this.addressAssessmentService.updateAddressAssessment(this.addressAssessmentId, this.addressAssessmentAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.addressAssessmentService.addAddressAssessment(this.addressAssessmentAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(AddressAssessmentConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(AddressAssessmentConstants.featureId, field, this.action);
    }
    initForm() {
        this.addressAssessmentAddForm = this._fb.group({ 
                       // newNotes: ['',Validators.compose([, , Validators.maxLength(3900)])],
                        notes:[ this.addressAssessment.notes ,  Validators.compose([  , , ,]) ],
                        addressAssessmentId:[ this.addressAssessment.addressAssessmentId],
                        offenderAddressId:[ this.addressAssessment.offenderAddressId ,  Validators.compose([ Validators.required , , , ]) ],
                        spgVersion:[ this.addressAssessment.spgVersion ],
                        spgUpdateUser:[ this.addressAssessment.spgUpdateUser],
                        spgAddressAssessmentId:['0'],
                        // createdBy:[ this.addressAssessment.createdBy , ],
                        // createdByUserId:[ this.addressAssessment.createdByUserId , ],
                        // createdDate:[ this.addressAssessment.createdDate , ],
                        // modifiedBy:[ this.addressAssessment.modifiedBy , ],
                        // modifiedByUserId:[ this.addressAssessment.modifiedByUserId , ],
                        // modifiedDate:[ this.addressAssessment.modifiedDate , ],
                        // deleted:[ this.addressAssessment.deleted , ],
                        // deletedBy:[ this.addressAssessment.deletedBy , ],
                        // deletedByUserId:[ this.addressAssessment.deletedByUserId , ],
                        // deletedDate:[ this.addressAssessment.deletedDate , ],
                        // locked:[ this.addressAssessment.locked , ],
                        // version:[ this.addressAssessment.version , ],
                        date:[ this.addressAssessment.date ,  Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ]) ],
                        addressAssessmentProviderId:[ this.addressAssessment.addressAssessmentProviderId ,  Validators.compose([ Validators.required , , , ]) ],
                    });
    }
}

