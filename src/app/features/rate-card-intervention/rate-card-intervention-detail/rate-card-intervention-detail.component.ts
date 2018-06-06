import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { RateCardIntervention } from '../rate-card-intervention';
import { RateCardInterventionService } from '../rate-card-intervention.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { RateCardInterventionConstants } from '../rate-card-intervention.constants';

@Component({
  selector: 'tr-rate-card-intervention-detail',
  templateUrl: 'rate-card-intervention-detail.component.html',
  providers: [RateCardInterventionService, TokenService]
})
export class RateCardInterventionDetailComponent implements OnInit {

  private subscription: Subscription;
  rateCardIntervention: RateCardIntervention;
  private rateCardInterventionId: number;
  private previousNotes: string = "";
  
  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private listService: ListService, private dataService: DataService, private rateCardInterventionService: RateCardInterventionService) { }

  ngOnInit() {
     
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.rateCardInterventionId = params['id'];
      
      this.rateCardInterventionService.getRateCardIntervention(this.rateCardInterventionId).subscribe((data: RateCardIntervention) => {

      this.rateCardIntervention = data;
      this.previousNotes = data.note;
      data.note = "";
      //console.log(this.rateCardIntervention);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(RateCardInterventionConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(RateCardInterventionConstants.featureId, field, "Read");
  }

}
