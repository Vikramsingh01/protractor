import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { OffenderManager } from '../offendermanager';
import { OffenderManagerService } from '../offendermanager.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { OffenderManagerConstants } from '../offendermanager.constants';

@Component({
  selector: 'tr-offendermanager-detail',
  templateUrl: 'offendermanager-detail.component.html',
  providers: [OffenderManagerService, TokenService]
})
export class OffenderManagerDetailComponent implements OnInit {

  private subscription: Subscription;
  offenderManager: OffenderManager;
  private offenderManagerId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private offenderManagerService: OffenderManagerService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.offenderManagerId = params['id'];
      this.offenderManagerService.getOffenderManager(this.offenderManagerId).subscribe((data: OffenderManager) => {
      this.offenderManager = data;
      //console.log(this.offenderManager);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(OffenderManagerConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(OffenderManagerConstants.featureId, field, "Read");
  }

}
