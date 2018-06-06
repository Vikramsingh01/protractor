import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ServiceProviderContactService } from '../service-provider-contact.service';
import { ServiceProviderContactConstants } from '../service-provider-contact.constants';
import { ServiceProviderContact } from '../service-provider-contact';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { MultiselectDropdownComponent } from '../../../generic-components/multiselect-dropdown/multiselect-dropdown.component';
import { Utility } from "../../../shared/utility";
@Component({
    selector: 'tr-service-provider-contact-edit',
    templateUrl: 'service-provider-contact-add.component.html'
})
export class ServiceProviderContactAddComponent implements OnInit {

    private subscription: Subscription;
    private serviceProviderContactId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    serviceProviderContactAddForm: FormGroup;
    private serviceProviderContact: any = {};
    private action;
    private crcList : any[] =[];
    private selectedCrc : any[] = [];
    private selected : string ="";
    private serviceProviderNameList:any[]=[];

    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private serviceProviderContactService: ServiceProviderContactService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('serviceProviderContactId')) {
                this.action = "Create";
            }else{
                this.action = "Update";
            }
        });
       this.serviceProviderContactService.getCrcList().subscribe( 
           data => {
            data.forEach((element:any)=>{
                this.crcList.push({key: element.organisationId, value: element.organisation})
            })
        });


    this.serviceProviderContactService.getServiceProviderNameList().subscribe(data => {
        console.log(data);
            data.forEach((element:any)=>{
                this.serviceProviderNameList.push({key: element.serviceProviderId, value: element.serviceProviderName})
            })
    });

    


        //this.serviceProviderName.push(1);
     //   this.serviceProviderName.push(2);

        //this.authorizationService.getAuthorizationDataByTableId(ServiceProviderContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ServiceProviderContactConstants.featureId, ServiceProviderContactConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ServiceProviderContactConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ServiceProviderContactConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ServiceProviderContactConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ServiceProviderContactConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('serviceProviderContactId')) {
                        this.serviceProviderContactId = params['serviceProviderContactId'];
                        
                        this.serviceProviderContactService.getServiceProviderContact(this.serviceProviderContactId).subscribe((data: any) => {
                            this.serviceProviderContactAddForm.patchValue(data);
                            this.selectedCrc = data.selectedCrc;
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });
    }
    navigateTo(url) {
        if (this.serviceProviderContactAddForm.touched) {
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
       if (this.serviceProviderContactAddForm.valid) {
		   this.serviceProviderContactAddForm.patchValue(Utility.escapeHtmlTags(this.serviceProviderContactAddForm.value));
            if (this.serviceProviderContactId != null) {
                this.serviceProviderContactService.updateServiceProviderContact(this.serviceProviderContactId, this.serviceProviderContactAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.serviceProviderContactService.addServiceProviderContact(this.serviceProviderContactAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                });
            }
       }
      else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ServiceProviderContactConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ServiceProviderContactConstants.featureId, field, this.action);
    }
    initForm() {
        this.serviceProviderContactAddForm = this._fb.group({
                        serviceProviderContactId:[  this.serviceProviderContact.serviceProviderContactId ],
                        //serviceProviderName:[  this.serviceProviderContact.serviceProviderName , Validators.compose([ Validators.required , , , ])],
                       // selectedCrc:[  this.serviceProviderContact.selectedCrc , Validators.compose([ Validators.required , , , ])],
                        title:[  this.serviceProviderContact.title , Validators.compose([, , , ])],
                        firstName:[  this.serviceProviderContact.firstName , Validators.compose([ Validators.required , ,  Validators.maxLength(35) , ])],
                        familyName:[  this.serviceProviderContact.familyName , Validators.compose([ Validators.required , ,  Validators.maxLength(35) , ])],
                        positionInOrganisation:[  this.serviceProviderContact.positionInOrganisation , Validators.compose([, ,  Validators.maxLength(3000) , ])],
                        status:[ 1  , Validators.compose([, , , ])],
                        telephoneNo:[  this.serviceProviderContact.telephoneNo , Validators.compose([ Validators.required , ,  Validators.maxLength(35) , ])],
                        mobileNo:[  this.serviceProviderContact.mobileNo , Validators.compose([, ,  Validators.maxLength(35) , ])],
                        contactEmail:[  this.serviceProviderContact.contactEmail , Validators.compose([, ,  Validators.maxLength(255) , ])],
                        isSecureEmail:[  this.serviceProviderContact.isSecureEmail , Validators.compose([, , , ])],
                        programmeAccreditation:[  this.serviceProviderContact.programmeAccreditation , Validators.compose([, , , ])],
                        selectedCrc : ['',Validators.compose([ Validators.required])],
                        serviceProviderName:['',Validators.compose([ Validators.required])],
                        // createdBy:[ this.serviceProviderContact.createdBy , ],
                        // createdByUserId:[ this.serviceProviderContact.createdByUserId , ],
                        // createdDate:[ this.serviceProviderContact.createdDate , ],
                        // modifiedBy:[ this.serviceProviderContact.modifiedBy , ],
                        // modifiedByUserId:[ this.serviceProviderContact.modifiedByUserId , ],
                        // modifiedDate:[ this.serviceProviderContact.modifiedDate , ],
                        // deleted:[ this.serviceProviderContact.deleted , ],
                        // deletedBy:[ this.serviceProviderContact.deletedBy , ],
                        // deletedByUserId:[ this.serviceProviderContact.deletedByUserId , ],
                        // deletedDate:[ this.serviceProviderContact.deletedDate , ],
                        // locked:[ this.serviceProviderContact.locked , ],
                        // version:[ this.serviceProviderContact.version , ],
                 });
    }
}

