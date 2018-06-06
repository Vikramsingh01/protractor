import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { PssContact } from '../psscontact';
import { PssContactService } from '../psscontact.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { PssContactConstants } from '../psscontact.constants';

@Component({
  selector: 'tr-psscontact-detail',
  templateUrl: 'psscontact-detail.component.html',
  providers: [PssContactService, TokenService]
})
export class PssContactDetailComponent implements OnInit {

  private subscription: Subscription;
  pssContact: PssContact;
  private pssContactId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private pssContactService: PssContactService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.pssContactId = params['id'];
      this.pssContactService.getPssContact(this.pssContactId).subscribe((data: PssContact) => {
      this.pssContact = data;
      //console.log(this.pssContact);
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(PssContactConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(PssContactConstants.featureId, field, "Read");
  }

}
