import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ProviderLaoDetailService } from "./providerlaodetail.service";
import { ProviderLaoDetail } from "./providerlaodetail";
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { ProviderLaoDetailConstants } from './providerlaodetail.constants';
import { AuthorizationService } from '../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../shared/utility';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@Component({
  selector: 'tr-providerlaodetail',
  templateUrl: 'providerlaodetail.component.html',
  
  providers: [ProviderLaoDetailService]

})
export class ProviderLaoDetailComponent implements OnInit {

  @Input() providerLaoDetailId: number;

  providerLaoDetails: ProviderLaoDetail[];

  constructor(private router: Router,
		private route: ActivatedRoute,
    private providerLaoDetailService: ProviderLaoDetailService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard) {
  }

  ngOnInit() {
	let providerLaoDetail: ProviderLaoDetail = new ProviderLaoDetail();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('profileId')) {
				providerLaoDetail.laoProviderId = params['profileId'];
			}
		});
	this.authorizationService.getAuthorizationData(ProviderLaoDetailConstants.featureId,ProviderLaoDetailConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(ProviderLaoDetailConstants.featureId, res[0]);
		this.dataService.addFeatureFields(ProviderLaoDetailConstants.featureId, res[1]);
	}
	}).flatMap(data=>
	this.providerLaoDetailService.getProviderLaoDetails()).subscribe((data: ProviderLaoDetail[]) => {
      this.providerLaoDetails = data;
    });
  }

  delete(providerLaoDetailId: number) {
	let providerLaoDetail: ProviderLaoDetail = new ProviderLaoDetail();
		this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('profileId')) {
				providerLaoDetail.laoProviderId = params['profileId'];
			}
		});

    if (confirm("Are you sure you want to delete?")) {
      this.providerLaoDetailService.delete(providerLaoDetailId).subscribe((data: any) => {
        this.providerLaoDetailService.getProviderLaoDetails().subscribe((data: ProviderLaoDetail[]) => {
          this.providerLaoDetails = data;
        });
      });
    }
  }
  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(ProviderLaoDetailConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(ProviderLaoDetailConstants.featureId, field, "Read");
  }
}
