import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Cohort } from '../cohort';
import { CohortService } from '../cohort.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { CohortConstants } from '../cohort.constants';

@Component({
  selector: 'tr-cohort-detail',
  templateUrl: 'cohort-detail.component.html',
  providers: [CohortService, TokenService]
})
export class CohortDetailComponent implements OnInit {

  private subscription: Subscription;
  cohort: Cohort;
  private cohortId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private cohortService: CohortService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.cohortId = params['id'];
      this.cohortService.getCohort(this.cohortId).subscribe((data: Cohort) => {
      this.cohort = data;
      //console.log(this.cohort);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(CohortConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(CohortConstants.featureId, field, "Read");
  }

}
