import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { LicenceConditionManager } from '../licence-condition-manager';
import { LicenceConditionManagerService } from '../licence-condition-manager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { LicenceConditionManagerConstants } from '../licence-condition-manager.constants';

@Component({
  selector: 'tr-licence-condition-manager-detail',
  templateUrl: 'licence-condition-manager-detail.component.html',
  providers: [LicenceConditionManagerService, TokenService]
})
export class LicenceConditionManagerDetailComponent implements OnInit {

  private subscription: Subscription;
  licenceConditionManager: LicenceConditionManager;
  private licenceConditionManagerId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private licenceConditionManagerService: LicenceConditionManagerService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.licenceConditionManagerId = params['id'];
      this.licenceConditionManagerService.getLicenceConditionManager(this.licenceConditionManagerId).subscribe((data: LicenceConditionManager) => {
      this.licenceConditionManager = data;
      //console.log(this.licenceConditionManager);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(LicenceConditionManagerConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(LicenceConditionManagerConstants.featureId, field, "Read");
  }

}
