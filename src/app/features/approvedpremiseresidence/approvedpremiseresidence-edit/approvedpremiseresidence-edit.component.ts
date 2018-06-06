import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { ApprovedPremiseResidence } from '../approvedpremiseresidence';
import { ApprovedPremiseResidenceService } from '../approvedpremiseresidence.service';
import { TokenService } from '../../../services/token.service';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-approvedpremiseresidence-edit',
  templateUrl: 'approvedpremiseresidence-edit.component.html',
  providers: [ApprovedPremiseResidenceService]
})
export class ApprovedPremiseResidenceEditComponent implements OnInit {

  private subscription: Subscription;
  approvedPremiseResidence: ApprovedPremiseResidence = new ApprovedPremiseResidence();
  private approvedPremiseResidenceId: number;
  private profileId;
  private eventId;
  approvedPremiseResidenceForm: FormGroup;  
	private action
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private approvedPremiseResidenceService: ApprovedPremiseResidenceService) { }

  ngOnInit() {
    
     this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('approvedPremisesReferralId')) {
        this.approvedPremiseResidence.approvedPremiseReferralId = params['approvedPremisesReferralId'];
      }
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
      if (params.hasOwnProperty('eventId')) {
        this.eventId = params['eventId'];
      }
    });
	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
	this.initForm();
	
    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('id')) {
        this.approvedPremiseResidenceId = params['id'];
        this.approvedPremiseResidenceService.getApprovedPremiseResidence(this.approvedPremiseResidenceId).subscribe((data: ApprovedPremiseResidence) => {
          this.approvedPremiseResidence = data;
		  this.approvedPremiseResidenceForm.patchValue(this.approvedPremiseResidence);
        });
      }
    })
  }

  onSubmit(){
	if(this.approvedPremiseResidenceForm.valid){
      this.approvedPremiseResidenceForm.patchValue(Utility.escapeHtmlTags(this.approvedPremiseResidenceForm.value));
       if(this.approvedPremiseResidenceId != null){
      this.approvedPremiseResidenceService.updateApprovedPremiseResidence(this.approvedPremiseResidenceId, this.approvedPremiseResidenceForm.value).subscribe((response: any)=>{
        this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'approvedpremisesreferral', this.approvedPremiseResidence.approvedPremiseReferralId]);
      });
    }else{
      this.approvedPremiseResidenceService.addApprovedPremiseResidence(this.approvedPremiseResidenceForm.value).subscribe((response: any)=>{
        this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'approvedpremisesreferral', this.approvedPremiseResidence.approvedPremiseReferralId]);
      });
    }

	
	}
	else{
		alert("Invalid Form");
	}
  }
  
  isFeildAuthorized(field){
    return this.approvedPremiseResidenceService.isFeildAuthorized(field, 'Create');
  }
  
  initForm(){
	this.approvedPremiseResidenceForm = this._fb.group({approvedPremiseResidenceId: [this.approvedPremiseResidence.approvedPremiseResidenceId],
    approvedPremiseReferralId: [this.approvedPremiseResidence.approvedPremiseReferralId],
    apReferralId: [this.approvedPremiseResidence.apReferralId],
    approvedPremiseId: [this.approvedPremiseResidence.approvedPremiseId],
    approvedPremiseKeyWorker: [this.approvedPremiseResidence.approvedPremiseKeyWorker],
    approvedPremiseResponsibleOfficer: [this.approvedPremiseResidence.approvedPremiseResponsibleOfficer],
    approvedPremiseResponsibleTeam: [this.approvedPremiseResidence.approvedPremiseResponsibleTeam],
    arrivalDate: [this.approvedPremiseResidence.arrivalDate],
    arrivalNote: [this.approvedPremiseResidence.arrivalNote],
    departureDate: [this.approvedPremiseResidence.departureDate],
    departureReasonId: [this.approvedPremiseResidence.departureReasonId],
    expectedDepartureDate: [this.approvedPremiseResidence.expectedDepartureDate],
    moveOnCategoryId: [this.approvedPremiseResidence.moveOnCategoryId],
    spgApprovedPremiseResidenceId: [0],
    spgVersion: [this.approvedPremiseResidence.spgVersion],
    spgUpdateUser: [this.approvedPremiseResidence.spgUpdateUser],
    // createdDate: [this.approvedPremiseResidence.createdDate],
    // createdBy: [this.approvedPremiseResidence.createdBy],
    // createdByUserId: [this.approvedPremiseResidence.createdByUserId],
    // modifiedDate: [this.approvedPremiseResidence.modifiedDate],
    // modifiedBy: [this.approvedPremiseResidence.modifiedBy],
    // modifiedByUserId: [this.approvedPremiseResidence.modifiedByUserId],
    // deleted: [this.approvedPremiseResidence.deleted],
    // deletedDate: [this.approvedPremiseResidence.deletedDate],
    // deletedBy: [this.approvedPremiseResidence.deletedBy],
    // deletedByUserId: [this.approvedPremiseResidence.deletedByUserId],
    // locked: [this.approvedPremiseResidence.locked],
    // version: [this.approvedPremiseResidence.version],
  });
  }
}
