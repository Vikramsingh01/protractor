import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { NetworkService } from '../network.service';
import { NetworkConstants } from '../network.constants';
import { Network } from '../network';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from "../../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-network-edit',
    templateUrl: 'network-add.component.html'
})
export class NetworkAddComponent implements OnInit {
    
    private subscription: Subscription;
    private personalcontactId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    networkAddForm: FormGroup;
    private network: Network = new Network();
    private action;
     private previousNotes: string = "";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private networkService: NetworkService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        
        this.route.params.subscribe((params: any) => {
              if (params.hasOwnProperty('profileId')) {
                this.network.profileId = params['profileId'];
            }
            
            if (!params.hasOwnProperty('personalContactId')) {
                this.action = "Create";
                this.titleService.setTitle('Add Network');
            }else{
                this.action = "Update";
                this.titleService.setTitle('Edit Network');
            }
        });
       
        //this.authorizationService.getAuthorizationDataByTableId(NetworkConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(NetworkConstants.featureId, NetworkConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(NetworkConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(NetworkConstants.featureId, authorizationData[1]);
      }

    this.initForm();
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(AliasConstants.tableId, this.action, this.authorizationData);
            this.networkService.isAuthorize(this.network.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
                if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('personalContactId')) {
                this.network.personalContactId = params['personalContactId'];
            }
                    if (params.hasOwnProperty('personalContactId')) {
                        this.personalcontactId = params['personalContactId'];
                        this.networkService.getNetwork(this.personalcontactId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.previousNotes = data.note;
                                data.note = "";
                                this.networkAddForm.patchValue(data);
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
      
        /*this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(NetworkConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('personalContactId')) {
                this.network.personalContactId = params['personalContactId'];
            }
                    if (params.hasOwnProperty('personalContactId')) {
                        this.personalcontactId = params['personalContactId'];
                        this.networkService.getNetwork(this.personalcontactId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.previousNotes = data.note;
                                data.note = "";
                                this.networkAddForm.patchValue(data);
                            }
                            else{
                                this.headerService.setAlertPopup("The record is locked");
                                
                            }
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }*/
        });
    }
    navigateTo(url) {
        if (this.networkAddForm.touched) {
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
                // this.networkAddForm.value.personalContactId = '90';

        if (this.networkAddForm.valid) {
        //     if(this.networkId==undefined){
        //   this.networkId=0;
        // }
			this.networkAddForm.patchValue(Utility.escapeHtmlTags(this.networkAddForm.value));
            if (this.personalcontactId != null) {
                this.networkService.updateNetwork(this.personalcontactId, this.networkAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.networkService.addNetwork(this.networkAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
           }
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(NetworkConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(NetworkConstants.featureId, field, this.action);
    }
    initForm() {
        this.networkAddForm = this._fb.group({
                        emailAddress:[ this.network.emailAddress ,  Validators.compose([, ,  Validators.maxLength(255) , ]) ],
                        familyName:[ this.network.familyName ,  Validators.compose([ Validators.required , ,  Validators.maxLength(35) , ]) ],
                        previousSurname:[ this.network.previousSurname ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        genderId:[ this.network.genderId ,  Validators.compose([ Validators.required , , , ]) ],
                        mobileNumber:[ this.network.mobileNumber ,  Validators.compose([,ValidationService.MobileNumberTextValidator ,ValidationService.MobileNumberDigitValidator ,  Validators.maxLength(35) , ]) ],
                               

                        profileId:[ this.network.profileId ,  Validators.compose([ Validators.required , , , ]) ],
                        titleId:[ this.network.titleId ,  Validators.compose([, , , ]) ],
                        firstName:[ this.network.firstName ,  Validators.compose([ Validators.required , ,  Validators.maxLength(35) , ]) ],
                        otherName:[ this.network.otherName ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        personalContactId:[ this.network.personalContactId ],
                        spgVersion:[ this.network.spgVersion ],
                        spgUpdateUser:[ this.network.spgUpdateUser],
                        relationshipId:[ this.network.relationshipId ,  Validators.compose([ Validators.required , , , ]) ],
                        relationshipToOffenderId:[ this.network.relationshipToOffenderId ,  Validators.compose([ Validators.required , ,  Validators.maxLength(500) , ]) ],
                        startDate:[ this.network.startDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        endDate:[ this.network.endDate ,  Validators.compose([,  ValidationService.dateValidator , , ]) ],
                        note:[ this.network.note ,  Validators.compose([, , , ]) ],
                        buildingName:[ this.network.buildingName ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        houseNumber:[ this.network.houseNumber ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        streetName:[ this.network.streetName ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        district:[ this.network.district ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        townCity:[ this.network.townCity ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        county:[ this.network.county ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        postCode:[ this.network.postCode ,  Validators.compose([, ,  Validators.maxLength(8) , ]) ],
                        telephoneNumber:[ this.network.telephoneNumber ,  Validators.compose([, ,  Validators.maxLength(35) , ]) ],
                        spgPersonalContactId:['0'],
                        
                        // createdBy:[ this.network.createdBy , ],
                        // createdByUserId:[ this.network.createdByUserId , ],
                        // createdDate:[ this.network.createdDate , ],
                        // modifiedBy:[ this.network.modifiedBy , ],
                        // modifiedByUserId:[ this.network.modifiedByUserId , ],
                        // modifiedDate:[ this.network.modifiedDate , ],
                        // deleted:[ this.network.deleted , ],
                        // deletedBy:[ this.network.deletedBy , ],
                        // deletedByUserId:[ this.network.deletedByUserId , ],
                        // deletedDate:[ this.network.deletedDate , ],
                        // locked:[ this.network.locked , ],
                        version:[ this.network.version , ],
                    });
    }
}

