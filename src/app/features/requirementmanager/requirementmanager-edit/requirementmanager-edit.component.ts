import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { RequirementManager } from '../requirementmanager';
import { RequirementManagerService } from '../requirementmanager.service';
import { TokenService } from '../../../services/token.service';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-requirementmanager-edit',
  templateUrl: 'requirementmanager-edit.component.html',
  providers: [RequirementManagerService]
})
export class RequirementManagerEditComponent implements OnInit {

  private subscription: Subscription;
  requirementManager: RequirementManager = new RequirementManager();
  private requirementManagerId: number;
  private profileId:number;
  private eventId;
  private action;
  requirementManagerForm: FormGroup;  
	
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private requirementManagerService: RequirementManagerService) { }

  ngOnInit() {
    	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
      this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('communityrequirementId')) {
        this.requirementManager.communityRequirementId = params['communityrequirementId'];
      }

     
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
      if (params.hasOwnProperty('eventId')) {
        this.eventId = params['eventId'];
      }
    })


	this.initForm();
	
    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('id')) {
        this.requirementManagerId = params['id'];
        this.requirementManagerService.getRequirementManager(this.requirementManagerId).subscribe((data: RequirementManager) => {
          this.requirementManager = data;
		  this.requirementManagerForm.patchValue(this.requirementManager);
        });
      }
    })
  }

  onSubmit(){
	if(this.requirementManagerForm.valid){		
			this.requirementManagerForm.patchValue(Utility.escapeHtmlTags(this.requirementManagerForm.value));
	  if (this.route.params.hasOwnProperty('id')) {
        this.requirementManagerId = this.route.params['id'];  
	    this.requirementManagerService.updateRequirementManager(this.requirementManagerId, this.requirementManagerForm.value).subscribe((response: any)=>{
	        this.router.navigate(['my-service-user',this.profileId,'event',this.eventId,'communityrequirement',this.requirementManager.communityRequirementId]);
	    });
	  }else{
	    this.requirementManagerService.addRequirementManager(this.requirementManagerForm.value).subscribe((response: any)=>{
	      this.router.navigate(['my-service-user',this.profileId,'event',this.eventId,'communityrequirement',this.requirementManager.communityRequirementId]);
	    });
	  }
	}
	else{
		alert("Invalid Form");
	}
  }
  
  isFeildAuthorized(field){
    return this.requirementManagerService.isFeildAuthorized(field, 'Create');
  }
  
  initForm(){
	this.requirementManagerForm = this._fb.group({requirementManagerId: [this.requirementManager.requirementManagerId],
communityRequirementId: [this.requirementManager.communityRequirementId],
allocationDate: [this.requirementManager.allocationDate],
allocationReasonId: [this.requirementManager.allocationReasonId],
endDate: [this.requirementManager.endDate],
providerId: [this.requirementManager.providerId],
responsibleOfficer: [this.requirementManager.responsibleOfficer],
responsibleTeam: [this.requirementManager.responsibleTeam],
spgRequirementManagerId: [0],
spgVersion: [this.requirementManager.spgVersion],
spgUpdateUser: [this.requirementManager.spgUpdateUser],
// createdDate: [this.requirementManager.createdDate],
// createdBy: [this.requirementManager.createdBy],
// createdByUserId: [this.requirementManager.createdByUserId],
// modifiedDate: [this.requirementManager.modifiedDate],
// modifiedBy: [this.requirementManager.modifiedBy],
// modifiedByUserId: [this.requirementManager.modifiedByUserId],
// deleted: [this.requirementManager.deleted],
// deletedDate: [this.requirementManager.deletedDate],
// deletedBy: [this.requirementManager.deletedBy],
// deletedByUserId: [this.requirementManager.deletedByUserId],
// locked: [this.requirementManager.locked],
// version: [this.requirementManager.version],
});
  }
}
