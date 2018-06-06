import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { addressService } from '../address.service';
import { addressConstants } from '../address.constants';
import { ListService } from '../../../services/list.service';

import { Address } from '../address';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import {Title} from "@angular/platform-browser";

import { Utility } from '../../../shared/utility';
@Component({
    selector: 'tr-address-edit',
    templateUrl: 'address-add.component.html'
})
export class addressAddComponent implements OnInit {

    private subscription: Subscription;
    private addressId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    addressAddForm: FormGroup;
    private address: Address = new Address();
    private mainAddress;
    private ifFixedAdobe = false;
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
        private addressService: addressService,
        private validationService: ValidationService,
        private listService:  ListService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private _titleService: Title) { }

    ngOnInit() {
            
		 this.loggedUserDetails=this.dataService.getLoggedInUserName();
            this.currentDate=new Date();
         this.currentTime=this.currentDate.toString().substring(0,25);
         console.log("user Details "+this.loggedUserDetails);
        
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                this.address.profileId = params['profileId'];
            }
            if (!params.hasOwnProperty('offenderAddressId')) {
                this.action = "Create";
                this._titleService.setTitle('Add Address');
            } else {
                this.action = "Update";
                this._titleService.setTitle('Edit Address');
            }
        });

        //this.authorizationService.getAuthorizationDataByTableId(addressConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(addressConstants.featureId, addressConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(addressConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(addressConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(addressConstants.tableId, this.action, this.authorizationData);
            this.initForm();
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, this.action, this.authorizationData);
            this.addressService.isAuthorize(this.address.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
                 if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('offenderAddressId')) {
                        this.addressId = params['offenderAddressId'];
                        this.addressService.getaddress(this.addressId).subscribe((data: any) => {
                            if (data.locked == "false") {
								this.previousNotes = data.note;
                                data.note = "";
                                this.addressAddForm.patchValue(data);
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
            // this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(addressConstants.featureId, this.action);
            // if (this.authorizedFlag) {
            //     this.initForm();
            //     this.subscription = this.route.params.subscribe((params: any) => {
            //         if (params.hasOwnProperty('offenderAddressId')) {
            //             this.addressId = params['offenderAddressId'];
            //             this.addressService.getaddress(this.addressId).subscribe((data: any) => {
            //                 if (data.locked == "false") {
			// 					this.previousNotes = data.note;
            //                     data.note = "";
            //                     this.addressAddForm.patchValue(data);
            //                 }
            //                 else {
            //                     this.headerService.setAlertPopup("The record is locked");

            //                 }
            //             });
            //         }
            //     })
            // } else {
            //     this.headerService.setAlertPopup("Not authorized");
            // }
        });

        this.addressService.getOffenderMainAddress(this.address.profileId).subscribe((addressData: any) => {
            if(!this.isEmpty(addressData)) {
                this.mainAddress = addressData;
            }
        });

    }
    navigateTo(url) {
        if (this.addressAddForm.touched) {
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
        if (this.addressAddForm.valid) {
             this.addressAddForm.patchValue(Utility.escapeHtmlTags(this.addressAddForm.value));
            if (this.addressId != null) {
               let noFixedAbodeYesNoIdCode : String;
                let addressStatusIdCode : String;
                if(this.addressAddForm.value.noFixedAbodeYesNoId!=null){
                   noFixedAbodeYesNoIdCode = this.listService.getCodeByTableIdAndPkId(244, this.addressAddForm.value.noFixedAbodeYesNoId); 
                }
                if(this.addressAddForm.value.addressStatusId!=null){
                   addressStatusIdCode = this.listService.getCodeByTableIdAndPkId(83, this.addressAddForm.value.addressStatusId); 
                }
               let addressStatusIdValue =   this.listService.getPkValueByTableIdAndCode(83,'M');
               let noFixedAbodeYesNoIdValue =   this.listService.getPkValueByTableIdAndCode(244,'Y');
              if (noFixedAbodeYesNoIdCode == "Y" && !this.ifFixedAdobe) {
                    this.confirmService.confirm({
                        message: 'No Fixed Abode : Selecting Yes will clear the data on the form and change the address status to \'Main\'. Please select ok to continue or cancel to return to the form.',
                        header: 'Confirm',
                        accept: () => {
                            this.addressAddForm.reset();
                            this.addressAddForm.controls['addressStatusId'].setValue(addressStatusIdValue);
                            this.addressAddForm.controls['noFixedAbodeYesNoId'].setValue(noFixedAbodeYesNoIdValue);
                            this.addressAddForm.controls['profileId'].setValue(this.address.profileId);
                            this.addressAddForm.controls['offenderAddressId'].setValue(this.addressId);
                            this.addressAddForm.controls['spgOffenderAddressId'].setValue(0);
                        }
                    });
                    this.ifFixedAdobe=true;
                } else if (addressStatusIdCode == "M" && this.mainAddress!=undefined) {
                    this.confirmService.confirm({
                        message: 'This will automatically change the status of the existing main address to previous.',
                        header: 'Confirm',
                        accept: () => {
                            this.addressService.updateaddress(this.addressId, this.addressAddForm.value).subscribe((response: any) => {
                                this.router.navigate(['../../..'], { relativeTo: this.route });
                            });
                        }
                    });
                } else {
                    this.addressService.updateaddress(this.addressId, this.addressAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../../..'], { relativeTo: this.route });
                    });
                }

            } else {
                let noFixedAbodeYesNoIdCode : String;
                let addressStatusIdCode : String;
                if(this.addressAddForm.value.noFixedAbodeYesNoId!=null){
                   noFixedAbodeYesNoIdCode = this.listService.getCodeByTableIdAndPkId(244, this.addressAddForm.value.noFixedAbodeYesNoId); 
                }
                if(this.addressAddForm.value.addressStatusId!=null){
                   addressStatusIdCode = this.listService.getCodeByTableIdAndPkId(83, this.addressAddForm.value.addressStatusId); 
                }
                let addressStatusIdValue =   this.listService.getPkValueByTableIdAndCode(83,'M');
                let noFixedAbodeYesNoIdValue =   this.listService.getPkValueByTableIdAndCode(244,'Y');

                if (noFixedAbodeYesNoIdCode == "Y" && !this.ifFixedAdobe) {
                    this.confirmService.confirm({
                        message: 'No Fixed Abode : Selecting Yes will clear the data on the form and change the address status to \'Main\'. Please select ok to continue or cancel to return to the form.',
                        header: 'Confirm',
                        accept: () => {
                            this.addressAddForm.reset();
                            this.addressAddForm.controls['addressStatusId'].setValue(addressStatusIdValue);
                            this.addressAddForm.controls['noFixedAbodeYesNoId'].setValue(noFixedAbodeYesNoIdValue);
                            this.addressAddForm.controls['profileId'].setValue(this.address.profileId);
                            this.addressAddForm.controls['spgOffenderAddressId'].setValue(0);
                        }
                    });
                    this.ifFixedAdobe=true;
                } else if (addressStatusIdCode == "M" && this.mainAddress!=undefined) {
                    this.confirmService.confirm({
                        message: 'This will automatically change the status of the existing main address to previous.',
                        header: 'Confirm',
                        accept: () => {
                            this.addressService.addaddress(this.addressAddForm.value).subscribe((response: any) => {
                                this.router.navigate(['../..'], { relativeTo: this.route });
                            });
                        }
                    });
                } else {
                    this.addressService.addaddress(this.addressAddForm.value).subscribe((response: any) => {
                        this.router.navigate(['../..'], { relativeTo: this.route });
                    });
                }
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(addressConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(addressConstants.featureId, field, this.action);
    }
    initForm() {
        this.addressAddForm = this._fb.group({
            offenderAddressId: [this.address.offenderAddressId],
            profileId: [this.address.profileId, Validators.compose([Validators.required, , ,])],
            spgVersion: [this.address.spgVersion],
            spgUpdateUser: [this.address.spgUpdateUser],
            addressStatusId: [this.address.addressStatusId, Validators.compose([Validators.required, , ,])],
            buildingName: [this.address.buildingName, Validators.compose([, , Validators.maxLength(35),])],
            houseNumber: [this.address.houseNumber, Validators.compose([, , Validators.maxLength(35),])],
            streetName: [this.address.streetName, Validators.compose([, , Validators.maxLength(35),])],
            district: [this.address.district, Validators.compose([, , Validators.maxLength(35),])],
            townCity: [this.address.townCity, Validators.compose([, , Validators.maxLength(35),])],
            county: [this.address.county, Validators.compose([, , Validators.maxLength(35),])],
            postcode: [this.address.postcode, Validators.compose([, , Validators.maxLength(8),])],
            telephoneNumber: [this.address.telephoneNumber, Validators.compose([, , Validators.maxLength(35),])],
            startDate: [this.address.startDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            endDate: [this.address.endDate, Validators.compose([, ValidationService.dateValidator, ,])],
            note: [this.address.note, Validators.compose([, , ,])],
           // newNote: ['',Validators.compose([, , Validators.maxLength(3900)])], 
            noFixedAbodeYesNoId: [this.address.noFixedAbodeYesNoId],
            spgOffenderAddressId: ['0'],
            // createdBy:[ this.address.createdBy , ],
            // createdByUserId:[ this.address.createdByUserId , ],
            // createdDate:[ this.address.createdDate , ],
            // modifiedBy:[ this.address.modifiedBy , ],
            // modifiedByUserId:[ this.address.modifiedByUserId , ],
            // modifiedDate:[ this.address.modifiedDate , ],
            // deleted:[ this.address.deleted , ],
            // deletedBy:[ this.address.deletedBy , ],
            // deletedByUserId:[ this.address.deletedByUserId , ],
            // deletedDate:[ this.address.deletedDate , ],
            // locked:[ this.address.locked , ],
            // version:[ this.address.version , ],
        });
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}

