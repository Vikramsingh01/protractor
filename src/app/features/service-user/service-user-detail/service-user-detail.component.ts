import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ServiceUser } from '../service-user';
import { ServiceUserService } from '../service-user.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'tr-service-user-detail',
  templateUrl: 'service-user-detail.component.html',
  providers: [ServiceUserService, TokenService]
})
export class ServiceUserDetailComponent  {

  private subscription: Subscription;
  serviceUser: ServiceUser;
  private serviceUserId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private serviceUserService: ServiceUserService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.serviceUserId = params['id'];
      this.serviceUserService.searchById(this.serviceUserId).subscribe((data: ServiceUser) => {
      this.serviceUser = data;
      //console.log(this.serviceUser);
    });
    })
  }

}
