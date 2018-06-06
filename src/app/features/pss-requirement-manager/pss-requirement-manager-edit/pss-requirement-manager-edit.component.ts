import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { PssRequirementManager } from '../pss-requirement-manager';
import { PssRequirementManagerService } from '../pss-requirement-manager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { PssRequirementManagerConstants } from '../pss-requirement-manager.constants';
import { Utility } from '../../../shared/utility';
@Component({
  selector: 'tr-pss-requirement-manager-edit',
  templateUrl: 'pss-requirement-manager-edit.component.html',
  providers: [PssRequirementManagerService]
})
export class PssRequirementManagerEditComponent implements OnInit {

  private subscription: Subscription;
  pssRequirementManager: PssRequirementManager = new PssRequirementManager();
  private pssRequirementManagerId: number;
  private profileId;
  private eventId;
  pssRequirementManagerForm: FormGroup;  
	private action;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private pssRequirementManagerService: PssRequirementManagerService) { }

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
        this.eventId = params['eventId'];
      }
      if (params.hasOwnProperty('pssRequirementId')) {
        this.pssRequirementManager.pssRequirementId = params['pssRequirementId'];
      }
    });
  
	this.authorizationService.getAuthorizationData(PssRequirementManagerConstants.featureId,PssRequirementManagerConstants.tableId).subscribe(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(PssRequirementManagerConstants.featureId, res[0]);
		this.dataService.addFeatureFields(PssRequirementManagerConstants.featureId, res[1]);
	}
	});
this.initForm();
	
    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('id')) {
        this.pssRequirementManagerId = params['id'];
        this.pssRequirementManagerService.getPssRequirementManager(this.pssRequirementManagerId).subscribe((data: PssRequirementManager) => {
          this.pssRequirementManager = data;
		  this.pssRequirementManagerForm.patchValue(this.pssRequirementManager);
        });
      }
    })
  }

  onSubmit(){
 if(this.pssRequirementManagerForm.valid){
	 this.pssRequirementManagerForm.patchValue(Utility.escapeHtmlTags(this.pssRequirementManagerForm.value));
    if(this.pssRequirementManagerId != null){
      this.pssRequirementManagerService.updatePssRequirementManager(this.pssRequirementManagerId, this.pssRequirementManagerForm.value).subscribe((response: any)=>{
        this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'pss-requirement', this.pssRequirementManager.pssRequirementId]);
      });
    }else{
      this.pssRequirementManagerService.addPssRequirementManager(this.pssRequirementManagerForm.value).subscribe((response: any)=>{
        this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'pss-requirement', this.pssRequirementManager.pssRequirementId]);
      });
    }
 }
 else{
  alert("Invalid Form");
 }
  }
  
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(PssRequirementManagerConstants.featureId, field, "Create");
  }
  
  initForm(){
	this.pssRequirementManagerForm = this._fb.group({pssRequirementManagerId: [this.pssRequirementManager.pssRequirementManagerId],
pssRequirementId: [this.pssRequirementManager.pssRequirementId],
allocationDate: [this.pssRequirementManager.allocationDate],
allocationReasonId: [this.pssRequirementManager.allocationReasonId],
endDate: [this.pssRequirementManager.endDate],
providerId: [this.pssRequirementManager.providerId],
responsibleOfficer: [this.pssRequirementManager.responsibleOfficer],
responsibleTeam: [this.pssRequirementManager.responsibleTeam],
spgPssRequirementManagerId: [0],
spgVersion: [this.pssRequirementManager.spgVersion],
spgUpdateUser: [this.pssRequirementManager.spgUpdateUser],
// createdDate: [this.pssRequirementManager.createdDate],
// createdBy: [this.pssRequirementManager.createdBy],
// createdByUserId: [this.pssRequirementManager.createdByUserId],
// modifiedDate: [this.pssRequirementManager.modifiedDate],
// modifiedBy: [this.pssRequirementManager.modifiedBy],
// modifiedByUserId: [this.pssRequirementManager.modifiedByUserId],
// deleted: [this.pssRequirementManager.deleted],
// deletedDate: [this.pssRequirementManager.deletedDate],
// deletedBy: [this.pssRequirementManager.deletedBy],
// deletedByUserId: [this.pssRequirementManager.deletedByUserId],
// locked: [this.pssRequirementManager.locked],
// version: [this.pssRequirementManager.version],
});
  }
}
