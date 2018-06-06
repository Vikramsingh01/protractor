import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { OffenderProfile } from '../offenderprofile';
import { OffenderProfileService } from '../offenderprofile.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { OffenderProfileConstants } from '../offenderprofile.constants';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-offenderprofile-detail',
  templateUrl: 'offenderprofile-detail.component.html',
  providers: [OffenderProfileService]
})
export class OffenderProfileDetailComponent implements OnInit {

  private subscription: Subscription;
  offenderProfile: OffenderProfile;
  private profileId: number;
  private show=true;

  constructor(private route: ActivatedRoute, private dataService: DataService,
    private headerService: HeaderService, private offenderProfileService: OffenderProfileService, private authorizationService: AuthorizationService, private _titleService: Title) { }

  ngOnInit() {
    this._titleService.setTitle('Identifiers');
    this.subscription = this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
      this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: OffenderProfile) => {
       
       this.offenderProfile = data;
       this.headerService.publishOffenderDetailsData(this.offenderProfile);
        

      },
       (errors)=>{
        // console.log(errors);
       this.show=false
        //this.headerService.setAlertPopup(errors.json().message)
     });
    })
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(OffenderProfileConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(OffenderProfileConstants.featureId, field, "Read");
  }

}
