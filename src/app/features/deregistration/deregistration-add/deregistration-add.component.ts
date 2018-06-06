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
import { DeregistrationService } from '../deregistration.service';
import { deregistrationConstants } from '../deregistration.constants';
import { Deregistration } from '../deregistration';
import { RegistrationService } from '../../registration/registration.service';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { AssociatedPTO } from '../associated-pto';
import { Utility } from "../../../shared/utility";

@Component({
    selector: 'tr-deregistration-edit',
    templateUrl: 'deregistration-add.component.html'
})
export class DeregistrationAddComponent implements OnInit {

    private subscription: Subscription;
    private deregistrationId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    deregistrationAddForm: FormGroup;
    private deregistration: Deregistration = new Deregistration();
    private action;
    private associatedPTO: AssociatedPTO;
    private team: string = "";
    private officer: string = "";
    private offenderId="";
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private deregistrationService: DeregistrationService,
        private registrationService:RegistrationService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title
        ) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('deregistrationId')) {
                this.action = "Create";
                this.titleService.setTitle("Add deregistration");
            }else{
                this.action = "Update";
                this.titleService.setTitle("Edit deregistration");
            }
        });
     
        this.route.params.subscribe((params:any)=>{
            if(params.hasOwnProperty('registrationId')){
                    this.deregistration.registrationId=params['registrationId'];
                       this.registrationService.getRegistration(this.deregistration.registrationId).subscribe(data=>{
                           this.deregistration.registrationType=data.registerTypeId;
                            this.deregistrationAddForm.patchValue(this.deregistration);
                            this.deregistrationAddForm.controls['registrationType'].disable();
                       })

            };
              if(params.hasOwnProperty('profileId')){
                    this.offenderId=params['profileId'];
                      

            };
        })
       
        //this.authorizationService.getAuthorizationDataByTableId(deregistrationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(deregistrationConstants.featureId, deregistrationConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(deregistrationConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(deregistrationConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(deregistrationConstants.tableId, this.action, this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(deregistrationConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.subscription = this.route.params.subscribe((params: any) => {

                    this.deregistrationAddForm.controls['deregisteringTeam'].disable();
                    this.deregistrationAddForm.controls['deregisteringOfficer'].disable();
                    this.deregistrationAddForm.controls['deregisteringProviderId'].disable();

                    if (!params.hasOwnProperty('deregistrationId')) {
                        this.deregistrationService.getPTOfficer().subscribe(data => {
                          this.associatedPTO = data
                          this.deregistrationAddForm.controls['deregisteringOfficer'].setValue(this.associatedPTO.officer.split("/")[1]);
                          this.deregistrationAddForm.controls['deregisteringTeam'].setValue(this.associatedPTO.team.split("/")[1]);
                          this.deregistrationAddForm.controls['deregisteringProviderId'].setValue(this.associatedPTO.provider);
                        });
                    }

                    if (params.hasOwnProperty('deregistrationId')) {
                        this.deregistrationId = params['deregistrationId'];
                        this.deregistrationService.getderegistration(this.deregistrationId).subscribe((data: any) => {
                            if(data.locked == "false"){
                                this.officer = data.deregisteringOfficer;
                                this.team = data.deregisteringTeam;
                                data.deregisteringOfficer = data.deregisteringOfficer.split("/")[1];
                                data.deregisteringTeam = data.deregisteringTeam.split("/")[1];
                                this.deregistrationAddForm.patchValue(data);
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
        if (this.deregistrationAddForm.touched) {
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
        if (this.deregistrationAddForm.valid) {
			this.deregistrationAddForm.patchValue(Utility.escapeHtmlTags(this.deregistrationAddForm.value));
            if (this.deregistrationId != null) {
                this.deregistrationAddForm.value.deregisteringProviderId = this.deregistrationAddForm.controls['deregisteringProviderId'].value;
                this.deregistrationAddForm.value.deregisteringTeam = this.team;
                this.deregistrationAddForm.value.deregisteringOfficer = this.officer;

                this.deregistrationService.updatederegistration(this.deregistrationId, this.deregistrationAddForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['../../..'], {relativeTo: this.route});
                });
            } else {
                this.deregistrationAddForm.value.deregisteringTeam = this.associatedPTO.team;
                this.deregistrationAddForm.value.deregisteringOfficer = this.associatedPTO.officer;
                this.deregistrationAddForm.value.deregisteringProviderId = this.deregistrationAddForm.controls['deregisteringProviderId'].value;
                
                this.deregistrationService.addderegistration(this.deregistrationAddForm.value).subscribe((response: any) => {
                  this.router.navigate(['../../..', this.deregistrationAddForm.value.registrationId],{relativeTo: this.route});
                });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(deregistrationConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(deregistrationConstants.featureId, field, this.action);
    }
    initForm() {
        this.deregistrationAddForm = this._fb.group({
                        deregistrationId:[ this.deregistration.deregistrationId ],
                        registrationType:[this.deregistration.registrationType ,  Validators.compose([ Validators.required , , , ]) ],
                        registrationId:[ this.deregistration.registrationId ,  Validators.compose([ Validators.required , , , ]) ],
                        deregisteringProviderId:[ this.deregistration.deregisteringProviderId ,  Validators.compose([ Validators.required , , , ]) ],
                        deregisteringTeam:[ this.deregistration.deregisteringTeam ,  Validators.compose([ Validators.required , , , ])  ],
                        deregistrationDate:[ this.deregistration.deregistrationDate ,  Validators.compose([Validators.required,  ValidationService.dateValidator , , ]) ],
                        deregistrationNotes:[ this.deregistration.deregistrationNotes ,  Validators.compose([, , , ]) ],
                        deregisteringOfficer:[ this.deregistration.deregisteringOfficer ,  Validators.compose([Validators.required, ,  Validators.maxLength(72) , ]) ],
                      
                    });
    }
}

