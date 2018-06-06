import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Subscription} from "rxjs/Rx";
import {TokenService} from '../../../services/token.service';
import {AuthorizationService} from '../../../services/authorization.service';
import {DataService} from '../../../services/data.service';
import {HeaderService} from '../../../views/header/header.service';
import {ReferralService} from '../referral.service';
import {ReferralConstants} from '../referral.constants';
import {Referral} from '../referral';
import {ValidationService} from '../../../generic-components/control-messages/validation.service';
import {ConfirmService} from '../../../generic-components/confirm-box/confirm.service';
import { Utility } from '../../../shared/utility';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-referral-edit',
  templateUrl: 'referral-add.component.html'
})
export class ReferralAddComponent implements OnInit {

  private subscription: Subscription;
  private referralId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  referralAddForm: FormGroup;
  private referral: Referral = new Referral();
  private action;
  private previousNotes: string = "";
  constructor(private _fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private authorizationService: AuthorizationService,
              private dataService: DataService,
              private referralService: ReferralService,
              private validationService: ValidationService,
              private confirmService: ConfirmService,
              private headerService: HeaderService,
              private titleService: Title) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
       if (params.hasOwnProperty('eventId')) {
                this.referral.eventId = params['eventId'];
            }
        if (params.hasOwnProperty('profileId')) {
                this.referral.profileId = params['profileId'];
        }
      if (!params.hasOwnProperty('referralId')) {
        this.action = "Create";
        this.titleService.setTitle('Add Referral');
      } else {
        this.action = "Update";
        this.titleService.setTitle('Edit Referral');
      }
    });

    //this.authorizationService.getAuthorizationDataByTableId(ReferralConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(ReferralConstants.featureId, ReferralConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(ReferralConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(ReferralConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(ReferralConstants.tableId, this.action, this.authorizationData);
       this.initForm();
            this.referralService.isAuthorize(this.referral.profileId,this.action).subscribe((response: any) => {
                this.authorizedFlag=response;
               if (this.authorizedFlag) {
        this.initForm();
        this.subscription = this.route.params.subscribe((params: any) => {
          if (params.hasOwnProperty('referralId')) {
            this.referralId = params['referralId'];
            this.referralService.getReferral(this.referralId).subscribe((data: any) => {
              if (data.locked == "false") {
                this.previousNotes = data.note;
                data.note = "";
                this.referralAddForm.patchValue(data);
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
   
      
    });
  }

  navigateTo(url) {
    if (this.referralAddForm.touched) {
      this.confirmService.confirm(
        {
          message: 'Do you want to leave this page without saving?',
          header: 'Confirm',
          accept: () => {
            this.router.navigate(url, {relativeTo: this.route});
          }
        });
    } else {
      this.router.navigate(url, {relativeTo: this.route});
      return false;
    }
  }

  onSubmit() {
    if (this.referralAddForm.valid) {
		this.referralAddForm.patchValue(Utility.escapeHtmlTags(this.referralAddForm.value));
           
      if (this.referralId != null) {
        this.referralService.updateReferral(this.referralId, this.referralAddForm.value).subscribe((response: any) => {
          this.router.navigate(['../..'], {relativeTo: this.route});
        });
      } else {
        this.referralService.addReferral(this.referralAddForm.value).subscribe((response: any) => {
          this.router.navigate(['..'], {relativeTo: this.route});
        });
      }
    }
    else {
      //alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(ReferralConstants.tableId, field, this.action, this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ReferralConstants.featureId, field, this.action);
  }

  initForm() {
    this.referralAddForm = this._fb.group({
     // referralId :[this.referral.referralId],
      eventId :[this.referral.eventId, Validators.compose([Validators.required, , ,])],
      referralTypeId: [this.referral.referralTypeId, Validators.compose([Validators.required, , ,])],
      referralDate: [this.referral.referralDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
      referralOutcomeId: [this.referral.referralOutcomeId, Validators.compose([Validators.required,, , ,])],
      referralSourceId: [this.referral.referralSourceId, Validators.compose([Validators.required, , ,])],
      note: [this.referral.note, Validators.compose([, , ,])],
      spgReferralId : ['0'],
    // referredToProviderId : [this.referral.referredToProviderId],
     // referredToTeam : [this.referral.referredToTeam],
      //referredToOfficer : [this.referral.referredToOfficer]
    });
  }
}

