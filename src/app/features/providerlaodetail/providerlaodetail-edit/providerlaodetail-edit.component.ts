import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { ProviderLaoDetail } from '../providerlaodetail';
import { ProviderLaoDetailService } from '../providerlaodetail.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ProviderLaoDetailConstants } from '../providerlaodetail.constants';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-providerlaodetail-edit',
  templateUrl: 'providerlaodetail-edit.component.html',
  providers: [ProviderLaoDetailService]
})
export class ProviderLaoDetailEditComponent implements OnInit {

  private subscription: Subscription;
  providerLaoDetail: ProviderLaoDetail = new ProviderLaoDetail();
  private providerLaoDetailId: number;
  private action;
  providerLaoDetailForm: FormGroup;  
	
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private providerLaoDetailService: ProviderLaoDetailService) { }

  ngOnInit() {
  	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
	this.authorizationService.getAuthorizationData(ProviderLaoDetailConstants.featureId,ProviderLaoDetailConstants.tableId).subscribe(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(ProviderLaoDetailConstants.featureId, res[0]);
		this.dataService.addFeatureFields(ProviderLaoDetailConstants.featureId, res[1]);
	}
	});
this.initForm();
	
    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('id')) {
        this.providerLaoDetailId = params['id'];
        this.providerLaoDetailService.getProviderLaoDetail(this.providerLaoDetailId).subscribe((data: ProviderLaoDetail) => {
          this.providerLaoDetail = data;
		  this.providerLaoDetailForm.patchValue(this.providerLaoDetail);
        });
      }
    })
  }

  onSubmit(){
	if(this.providerLaoDetailForm.valid){
		this.providerLaoDetailForm.patchValue(Utility.escapeHtmlTags(this.providerLaoDetailForm.value));
	  if (this.providerLaoDetailId!=null) {
	      this.providerLaoDetailService.updateProviderLaoDetail(this.providerLaoDetailId, this.providerLaoDetailForm.value).subscribe((response: any)=>{
	      this.router.navigate(['/providerlaodetail']);
	    });
	  }else{
	      this.providerLaoDetailService.addProviderLaoDetail(this.providerLaoDetailForm.value).subscribe((response: any)=>{
	      this.router.navigate(['/providerlaodetail']);
	    });
	  }
	}
	else{
		alert("Invalid Form");
	}
  }
  
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(ProviderLaoDetailConstants.featureId, field, "Create");
  }
  
  initForm(){
	this.providerLaoDetailForm = this._fb.group({providerLaoDetailId: [this.providerLaoDetail.providerLaoDetailId],
exclusionMessage: [this.providerLaoDetail.exclusionMessage],
laoProviderId: [this.providerLaoDetail.laoProviderId],
restrictionMessage: [this.providerLaoDetail.restrictionMessage],
spgProviderLaoDetailId: [0],
spgVersion: [this.providerLaoDetail.spgVersion],
spgUpdateUser: [this.providerLaoDetail.spgUpdateUser],
// createdDate: [this.providerLaoDetail.createdDate],
// createdBy: [this.providerLaoDetail.createdBy],
// createdByUserId: [this.providerLaoDetail.createdByUserId],
// modifiedDate: [this.providerLaoDetail.modifiedDate],
// modifiedBy: [this.providerLaoDetail.modifiedBy],
// modifiedByUserId: [this.providerLaoDetail.modifiedByUserId],
// deleted: [this.providerLaoDetail.deleted],
// deletedDate: [this.providerLaoDetail.deletedDate],
// deletedBy: [this.providerLaoDetail.deletedBy],
// deletedByUserId: [this.providerLaoDetail.deletedByUserId],
// locked: [this.providerLaoDetail.locked],
// version: [this.providerLaoDetail.version],
});
  }
}
