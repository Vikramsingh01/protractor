import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { ApprovedPremisesReferral } from '../approvedpremisesreferral';
import { ApprovedPremisesReferralConstants } from '../approvedpremisesreferral.constants';
import { ApprovedPremisesReferralService } from '../approvedpremisesreferral.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-approvedpremisesreferral-edit',
  templateUrl: 'approvedpremisesreferral-edit.component.html',
  providers: [ApprovedPremisesReferralService]
})
export class ApprovedPremisesReferralEditComponent implements OnInit {

  private subscription: Subscription;
  approvedPremisesReferral: ApprovedPremisesReferral = new ApprovedPremisesReferral();
  private approvedPremisesReferralId: number;
  private profileId;
  approvedPremisesReferralForm: FormGroup;  
	private action;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private approvedPremisesReferralService: ApprovedPremisesReferralService) { }

  ngOnInit() {
  	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }

  this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
       if (params.hasOwnProperty('eventId')) {
        this.approvedPremisesReferral.eventId = params['eventId'];
      }
      
    });

	this.initForm();
	

    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('id')) {
        this.approvedPremisesReferralId = params['id'];
        this.approvedPremisesReferralService.getApprovedPremisesReferral(this.approvedPremisesReferralId).subscribe((data: ApprovedPremisesReferral) => {
          this.approvedPremisesReferral = data;
		  this.approvedPremisesReferralForm.patchValue(this.approvedPremisesReferral);
        });
      }
    })
  }

  onSubmit(){
	if(this.approvedPremisesReferralForm.valid){		
      this.approvedPremisesReferralForm.patchValue(Utility.escapeHtmlTags(this.approvedPremisesReferralForm.value));
		this.subscription = this.route.params.subscribe((params: any)=>{
		  if (params.hasOwnProperty('id')) {
			this.approvedPremisesReferralId = params['id'];  
			this.approvedPremisesReferralService.updateApprovedPremisesReferral(this.approvedPremisesReferralId, this.approvedPremisesReferralForm.value).subscribe((response: any)=>{
			  this.router.navigate(['/my-service-user', this.profileId, 'event', this.approvedPremisesReferral.eventId]);
			});
		  }else{
			this.approvedPremisesReferralService.addApprovedPremisesReferral(this.approvedPremisesReferralForm.value).subscribe((response: any)=>{
			  this.router.navigate(['/my-service-user', this.profileId, 'event', this.approvedPremisesReferral.eventId]);
			});
		  }
	  });
	}
	else{
		alert("Invalid Form");
	}
  }
  
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(ApprovedPremisesReferralConstants.featureId, field, "Create");
  }
  
  initForm(){
	this.approvedPremisesReferralForm = this._fb.group({approvedPremiseReferralId: [this.approvedPremisesReferral.approvedPremiseReferralId],
apReferralSourceId: [this.approvedPremisesReferral.apReferralSourceId],
approvedPremiseId: [this.approvedPremisesReferral.approvedPremiseId],
decisionDate: [this.approvedPremisesReferral.decisionDate],
decisionNote: [this.approvedPremisesReferral.decisionNote],
decisionOfficer: [this.approvedPremisesReferral.decisionOfficer],
decisionProviderId: [this.approvedPremisesReferral.decisionProviderId],
decisionTeam: [this.approvedPremisesReferral.decisionTeam],
eventId: [this.approvedPremisesReferral.eventId],
expectedArrivalDate: [this.approvedPremisesReferral.expectedArrivalDate],
expectedDepartureDate: [this.approvedPremisesReferral.expectedDepartureDate],
nonArrivalDate: [this.approvedPremisesReferral.nonArrivalDate],
nonArrivalNote: [this.approvedPremisesReferral.nonArrivalNote],
nonArrivalReasonId: [this.approvedPremisesReferral.nonArrivalReasonId],
referralCategoryId: [this.approvedPremisesReferral.referralCategoryId],
referralDate: [this.approvedPremisesReferral.referralDate],
referralDecisionId: [this.approvedPremisesReferral.referralDecisionId],
referralGroupId: [this.approvedPremisesReferral.referralGroupId],
referralNote: [this.approvedPremisesReferral.referralNote],
referringOfficer: [this.approvedPremisesReferral.referringOfficer],
referringProviderId: [this.approvedPremisesReferral.referringProviderId],
referringTeam: [this.approvedPremisesReferral.referringTeam],
rejectReasonId: [this.approvedPremisesReferral.rejectReasonId],
sourceTypeId: [this.approvedPremisesReferral.sourceTypeId],
spgApprovedPremiseReferralId: [0],
spgVersion: [this.approvedPremisesReferral.spgVersion],
spgUpdateUser: [this.approvedPremisesReferral.spgUpdateUser],
// createdDate: [this.approvedPremisesReferral.createdDate],
// createdBy: [this.approvedPremisesReferral.createdBy],
// createdByUserId: [this.approvedPremisesReferral.createdByUserId],
// modifiedDate: [this.approvedPremisesReferral.modifiedDate],
// modifiedBy: [this.approvedPremisesReferral.modifiedBy],
// modifiedByUserId: [this.approvedPremisesReferral.modifiedByUserId],
// deleted: [this.approvedPremisesReferral.deleted],
// deletedDate: [this.approvedPremisesReferral.deletedDate],
// deletedBy: [this.approvedPremisesReferral.deletedBy],
// deletedByUserId: [this.approvedPremisesReferral.deletedByUserId],
// locked: [this.approvedPremisesReferral.locked],
// version: [this.approvedPremisesReferral.version],
});
  }
}
