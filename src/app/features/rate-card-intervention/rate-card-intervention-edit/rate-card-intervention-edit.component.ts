import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { RateCardIntervention } from '../rate-card-intervention';
import { RateCardInterventionService } from '../rate-card-intervention.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { ListService } from '../../../services/list.service';
import { DataService } from '../../../services/data.service';
import { Utility } from '../../../shared/utility';
import { RateCardInterventionConstants } from '../rate-card-intervention.constants';

@Component({
  selector: 'tr-rate-card-intervention-edit',
  templateUrl: 'rate-card-intervention-edit.component.html',
  providers: [RateCardInterventionService]
})
export class RateCardInterventionEditComponent implements OnInit {

  private subscription: Subscription;
  rateCardIntervention: RateCardIntervention = new RateCardIntervention();
  private rateCardInterventionId: number;
  
  rateCardInterventionForm: FormGroup;
  private action;
  constructor(private _fb: FormBuilder, private router: Router, private listService: ListService,
  private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private rateCardInterventionService: RateCardInterventionService) { }

  ngOnInit() {
   
     let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
	this.authorizationService.getAuthorizationData(RateCardInterventionConstants.featureId,RateCardInterventionConstants.tableId).subscribe(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(RateCardInterventionConstants.featureId, res[0]);
		this.dataService.addFeatureFields(RateCardInterventionConstants.featureId, res[1]);
	}
	});

    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('profileId')) {
        this.rateCardIntervention.profileId = params['profileId'];
      }
    });
this.initForm();
	
    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('id')) {
        this.rateCardInterventionId = params['id'];
        this.rateCardInterventionService.getRateCardIntervention(this.rateCardInterventionId).subscribe((data: RateCardIntervention) => {
          this.rateCardIntervention = data;
		  this.rateCardInterventionForm.patchValue(this.rateCardIntervention);
        });
      }
    })
  }

  onSubmit(){
	if(this.rateCardInterventionForm.valid){
		this.rateCardInterventionForm.patchValue(Utility.escapeHtmlTags(this.rateCardInterventionForm.value));
		this.subscription = this.route.params.subscribe((params: any)=>{
		  if (params.hasOwnProperty('id')) {
			this.rateCardInterventionId = params['id'];  
			this.rateCardInterventionService.updateRateCardIntervention(this.rateCardInterventionId, this.rateCardInterventionForm.value).subscribe((response: any)=>{
			  this.router.navigate(['my-service-user',this.rateCardIntervention.profileId]);
			});
		  }else{
			this.rateCardInterventionService.addRateCardIntervention(this.rateCardInterventionForm.value).subscribe((response: any)=>{
			  this.router.navigate(['my-service-user',this.rateCardIntervention.profileId]);
			});
		  }
	  });
	}
	else{
		alert("Invalid Form");
	}
  }
  
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(RateCardInterventionConstants.featureId, field, "Create");
  }
  
  initForm(){
	this.rateCardInterventionForm = this._fb.group({rateCardInterventionId: [this.rateCardIntervention.rateCardInterventionId],
actualStartDate: [this.rateCardIntervention.actualStartDate],
attendanceCount: [this.rateCardIntervention.attendanceCount],
expectedEndDate: [this.rateCardIntervention.expectedEndDate],
expectedStartDate: [this.rateCardIntervention.expectedStartDate],
intendedProviderId: [this.rateCardIntervention.intendedProviderId],
interventionOutcomeId: [this.rateCardIntervention.interventionOutcomeId],
interventionStatusDate: [this.rateCardIntervention.interventionStatusDate],
interventionStatusId: [this.rateCardIntervention.interventionStatusId],
interventionTypeMainCategoryId: [this.rateCardIntervention.interventionTypeMainCategoryId],
interventionTypeSubCategoryId: [this.rateCardIntervention.interventionTypeSubCategoryId],
length: [this.rateCardIntervention.length],
note: [this.rateCardIntervention.note],
profileId: [this.rateCardIntervention.profileId],
referralDate: [this.rateCardIntervention.referralDate],
spgRateCardInterventionId: [0],
actualEndDate: [this.rateCardIntervention.actualEndDate],
interventionProviderId: [this.rateCardIntervention.interventionProviderId],
spgVersion: [this.rateCardIntervention.spgVersion],
spgUpdateUser: [this.rateCardIntervention.spgUpdateUser],
// createdDate: [this.rateCardIntervention.createdDate],
// createdBy: [this.rateCardIntervention.createdBy],
// createdByUserId: [this.rateCardIntervention.createdByUserId],
// modifiedDate: [this.rateCardIntervention.modifiedDate],
// modifiedBy: [this.rateCardIntervention.modifiedBy],
// modifiedByUserId: [this.rateCardIntervention.modifiedByUserId],
// deleted: [this.rateCardIntervention.deleted],
// deletedDate: [this.rateCardIntervention.deletedDate],
// deletedBy: [this.rateCardIntervention.deletedBy],
// deletedByUserId: [this.rateCardIntervention.deletedByUserId],
// locked: [this.rateCardIntervention.locked],
// version: [this.rateCardIntervention.version],
});
  }
}
