import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import {NgForm} from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { ServiceUser } from '../service-user';
import { ServiceUserService } from '../service-user.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'tr-service-user-edit',
  templateUrl: 'service-user-edit.component.html',
  providers: [ServiceUserService, TokenService]
})
export class ServiceUserEditComponent {

  private subscription: Subscription;
  serviceUser: ServiceUser = new ServiceUser();
  private serviceUserId: number;
  constructor(private router: Router,
		private route: ActivatedRoute,  private authorizationService: AuthorizationService, private dataService: DataService, private serviceUserService: ServiceUserService) { }

}
