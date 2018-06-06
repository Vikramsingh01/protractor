import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { OrderManager } from '../ordermanager';
import { OrderManagerService } from '../ordermanager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { OrderManagerConstants } from '../ordermanager.constants';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-ordermanager-edit',
  templateUrl: 'ordermanager-edit.component.html',
  providers: [OrderManagerService]
})
export class OrderManagerEditComponent implements OnInit {

  private subscription: Subscription;
  orderManager: OrderManager = new OrderManager();
  private orderManagerId: number;
  
  orderManagerForm: FormGroup;  
	private action;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private orderManagerService: OrderManagerService) { }

  ngOnInit() {
    	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Add";
    }else{
        this.action="Edit";
    }
          this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('eventId')) {
        this.orderManager.eventId = params['eventId'];
      }
    })
  
	this.authorizationService.getAuthorizationData(OrderManagerConstants.featureId,OrderManagerConstants.tableId).subscribe(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(OrderManagerConstants.featureId, res[0]);
		this.dataService.addFeatureFields(OrderManagerConstants.featureId, res[1]);
	}
	});
this.initForm();
	
    this.subscription = this.route.params.subscribe((params: any)=>{
      if (params.hasOwnProperty('id')) {
        this.orderManagerId = params['id'];
        this.orderManagerService.getOrderManager(this.orderManagerId).subscribe((data: OrderManager) => {
          this.orderManager = data;
		  this.orderManagerForm.patchValue(this.orderManager);
        });
      }
    })
  }

  onSubmit(){
	if(this.orderManagerForm.valid){
this.orderManagerForm.patchValue(Utility.escapeHtmlTags(this.orderManagerForm.value));
  
      if(this.orderManagerId != null){
        this.orderManagerService.updateOrderManager(this.orderManagerId, this.orderManagerForm.value).subscribe((response: any)=>{
        this.router.navigate(['/ordermanager']);
        });
      }else{
        this.orderManagerService.addOrderManager(this.orderManagerForm.value).subscribe((response: any)=>{
     this.router.navigate(['/ordermanager']);
      });
      }
 
 
 //   this.orderManagerService.addOrderManager(this.orderManagerForm.value).subscribe((response: any)=>{
	//		this.router.navigate(['..']);
//		});

	}
	else{
		alert("Invalid Form");
	}
  }
  
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(OrderManagerConstants.featureId, field, "Create");
  }
  
  initForm(){
	this.orderManagerForm = this._fb.group({orderManagerId: [this.orderManager.orderManagerId],
allocationDate: [this.orderManager.allocationDate],
allocationReasonId: [this.orderManager.allocationReasonId],
endDate: [this.orderManager.endDate],
eventId: [this.orderManager.eventId],
providerId: [this.orderManager.providerId],
responsibleOfficer: [this.orderManager.responsibleOfficer],
responsibleTeam: [this.orderManager.responsibleTeam],
spgOrderManagerId: [0],
spgVersion: [this.orderManager.spgVersion],
spgUpdateUser: [this.orderManager.spgUpdateUser],
// createdDate: [this.orderManager.createdDate],
// createdBy: [this.orderManager.createdBy],
// createdByUserId: [this.orderManager.createdByUserId],
// modifiedDate: [this.orderManager.modifiedDate],
// modifiedBy: [this.orderManager.modifiedBy],
// modifiedByUserId: [this.orderManager.modifiedByUserId],
// deleted: [this.orderManager.deleted],
// deletedDate: [this.orderManager.deletedDate],
// deletedBy: [this.orderManager.deletedBy],
// deletedByUserId: [this.orderManager.deletedByUserId],
// locked: [this.orderManager.locked],
// version: [this.orderManager.version],
});
  }
}
