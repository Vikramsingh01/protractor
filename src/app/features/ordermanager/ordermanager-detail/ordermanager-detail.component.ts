import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { OrderManager } from '../ordermanager';
import { OrderManagerService } from '../ordermanager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { OrderManagerConstants } from '../ordermanager.constants';

@Component({
  selector: 'tr-ordermanager-detail',
  templateUrl: 'ordermanager-detail.component.html',
  providers: [OrderManagerService, TokenService]
})
export class OrderManagerDetailComponent implements OnInit {

  private subscription: Subscription;
  orderManager: OrderManager;
  private orderManagerId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private orderManagerService: OrderManagerService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.orderManagerId = params['id'];
      this.orderManagerService.getOrderManager(this.orderManagerId).subscribe((data: OrderManager) => {
      this.orderManager = data;
      //console.log(this.orderManager);
    });
    })
  }


  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(OrderManagerConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(OrderManagerConstants.featureId, field, "Read");
  }

}
