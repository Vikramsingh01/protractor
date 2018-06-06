import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { RequirementManager } from '../requirementmanager';
import { RequirementManagerService } from '../requirementmanager.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'tr-requirementmanager-detail',
  templateUrl: 'requirementmanager-detail.component.html',
  providers: [RequirementManagerService, TokenService]
})
export class RequirementManagerDetailComponent implements OnInit {

  private subscription: Subscription;
  requirementManager: RequirementManager;
  private requirementManagerId: number;

  constructor(private route: ActivatedRoute, private requirementManagerService: RequirementManagerService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.requirementManagerId = params['id'];
      this.requirementManagerService.getRequirementManager(this.requirementManagerId).subscribe((data: RequirementManager) => {
      this.requirementManager = data;
      //console.log(this.requirementManager);
    });
    })
  }

  isAuthorized(action){
    return this.requirementManagerService.isAuthorized(action);
  }
  isFeildAuthorized(field){
    return this.requirementManagerService.isFeildAuthorized(field, 'Read');
  }

}
