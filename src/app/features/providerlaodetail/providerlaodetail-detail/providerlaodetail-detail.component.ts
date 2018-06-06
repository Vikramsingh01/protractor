import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ProviderLaoDetail } from '../providerlaodetail';
import { ProviderLaoDetailService } from '../providerlaodetail.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ProviderLaoDetailConstants } from '../providerlaodetail.constants';

@Component({
  selector: 'tr-providerlaodetail-detail',
  templateUrl: 'providerlaodetail-detail.component.html',
  providers: [ProviderLaoDetailService, TokenService]
})
export class ProviderLaoDetailDetailComponent implements OnInit {

  private subscription: Subscription;
  providerLaoDetail: ProviderLaoDetail;
  private providerLaoDetailId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private providerLaoDetailService: ProviderLaoDetailService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.providerLaoDetailId = params['id'];
      this.providerLaoDetailService.getProviderLaoDetail(this.providerLaoDetailId).subscribe((data: ProviderLaoDetail) => {
      this.providerLaoDetail = data;
      //console.log(this.providerLaoDetail);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(ProviderLaoDetailConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(ProviderLaoDetailConstants.featureId, field, "Read");
  }

}
