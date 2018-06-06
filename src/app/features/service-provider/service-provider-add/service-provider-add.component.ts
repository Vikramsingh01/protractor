import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ServiceProviderService } from '../service-provider.service';
import { ServiceProviderConstants } from '../service-provider.constants';
import { ServiceProvider } from '../service-provider';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { MultiselectDropdownComponent } from '../../../generic-components/multiselect-dropdown/multiselect-dropdown.component';
import { Utility } from "../../../shared/utility";

@Component({
    selector: 'tr-service-provider-edit',
    templateUrl: 'service-provider-add.component.html'
})
export class ServiceProviderAddComponent implements OnInit {

    private subscription: Subscription;
    private serviceProviderId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    serviceProviderAddForm: FormGroup;
    private serviceProvider: any = {};
    private action;
    private crcList : any[] =[];
    private selectedCrc : any[] = [];
    private selected : string ="";

    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private serviceProviderService: ServiceProviderService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService) { }


    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('serviceProviderId')) {
                this.action = "Create";
            }else{
                this.action = "Update";
            }
        });

        this.serviceProviderService.getCrcList().subscribe( data => {
            data.forEach((element:any)=>{
                this.crcList.push({key: element.organisationId, value: element.organisation})
            })
        } );
       
        //this.authorizationService.getAuthorizationDataByTableId(ServiceProviderConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ServiceProviderConstants.featureId, ServiceProviderConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ServiceProviderConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ServiceProviderConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ServiceProviderConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ServiceProviderConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('serviceProviderId')) {
                        this.serviceProviderId = params['serviceProviderId'];
                        this.serviceProviderService.getServiceProvider(this.serviceProviderId).subscribe((data: any) => {
                            this.serviceProviderAddForm.patchValue(data);
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
        if (this.serviceProviderAddForm.touched) {
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
        if (this.serviceProviderAddForm.valid) {
			this.serviceProviderAddForm.patchValue(Utility.escapeHtmlTags(this.serviceProviderAddForm.value));
            if (this.serviceProviderId != null) {
                this.serviceProviderService.updateServiceProvider(this.serviceProviderId, this.serviceProviderAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../..'], {relativeTo: this.route});
                    this.selected = this.selectedCrc.toString();
                });
            } else {
                this.serviceProviderService.addServiceProvider(this.serviceProviderAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], {relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ServiceProviderConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ServiceProviderConstants.featureId, field, this.action);
    }
    initForm() {
        this.serviceProviderAddForm = this._fb.group({
                        serviceProviderId:[  this.serviceProvider.serviceProviderId ],
                        serviceProviderName:[  this.serviceProvider.serviceProviderName , Validators.compose([ Validators.required , ,  Validators.maxLength(100) , ])],
                        //selectedCrc:[  this.serviceProvider.selectedCrc , Validators.compose([ Validators.required , , , ])],
                        activeStart:[  this.serviceProvider.activeStart , Validators.compose([ Validators.required ,  ValidationService.dateValidator , , ])],
                        activeEnd:[  this.serviceProvider.activeEnd , Validators.compose([,  ValidationService.dateValidator , , ])],
                        addressLineOne:[  this.serviceProvider.addressLineOne , Validators.compose([, ,  Validators.maxLength(200) , ])],
                        addressLineTwo:[  this.serviceProvider.addressLineTwo , Validators.compose([, ,  Validators.maxLength(200) , ])],
                        addressLineThree:[  this.serviceProvider.addressLineThree , Validators.compose([, ,  Validators.maxLength(200) , ])],
                        town:[  this.serviceProvider.town , Validators.compose([, ,  Validators.maxLength(100) , ])],
                        postcode:[  this.serviceProvider.postcode , Validators.compose([ Validators.required , ,  Validators.maxLength(10) , ])],
                        provision:[ 2  , Validators.compose([ Validators.required ])],
                        status:[ 3  , Validators.compose([ Validators.required , , , ])],
                        selectedCrc : ['',Validators.compose([ Validators.required])]
                    });
    }
}

