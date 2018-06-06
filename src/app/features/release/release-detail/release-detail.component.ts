import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { Release } from '../release';
import { ReleaseService } from '../release.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ReleaseConstants } from '../release.constants';


@Component({
  selector: 'tr-release-detail',
  templateUrl: 'release-detail.component.html'
})
export class ReleaseDetailComponent implements OnInit {

  private subscription: Subscription;
  release: Release;
  private releaseId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private releaseService: ReleaseService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Release");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.releaseId = params['releaseId'];
       //this.authorizationService.getAuthorizationDataByTableId(ReleaseConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ReleaseConstants.featureId, ReleaseConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ReleaseConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ReleaseConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ReleaseConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ReleaseConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.releaseService.getRelease(this.releaseId).subscribe(data => {
                this.release = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ReleaseConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ReleaseConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ReleaseConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ReleaseConstants.featureId, field, "Read");
  }

}
