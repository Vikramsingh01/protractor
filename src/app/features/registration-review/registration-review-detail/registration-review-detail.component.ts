import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { RegistrationReview } from '../registration-review';
import { RegistrationReviewService } from '../registration-review.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { RegistrationReviewConstants } from '../registration-review.constants';
import { ListService } from '../../../services/list.service';


@Component({
  selector: 'tr-registration-review-detail',
  templateUrl: 'registration-review-detail.component.html'
})
export class RegistrationReviewDetailComponent implements OnInit {

  private subscription: Subscription;
  registrationReview: RegistrationReview;
  private registrationReviewId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private teamlist:any=[];
  private officerlist:any=[];
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private registrationReviewService: RegistrationReviewService,
      private headerService: HeaderService,
      private titleService: Title,
      private listService:ListService) { }

  ngOnInit() {
     this.listService.getListDataWithLookup(445, 501).subscribe(crcList => {
         this.teamlist = crcList;
     });
            this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
         this.officerlist = crcList;
     });
    this.titleService.setTitle("View Registration Review");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.registrationReviewId = params['registrationReviewId'];
       //this.authorizationService.getAuthorizationDataByTableId(RegistrationReviewConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(RegistrationReviewConstants.featureId, RegistrationReviewConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(RegistrationReviewConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(RegistrationReviewConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(RegistrationReviewConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RegistrationReviewConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.registrationReviewService.getRegistrationReview(this.registrationReviewId).subscribe(data => {
                this.registrationReview = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(RegistrationReviewConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(RegistrationReviewConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(RegistrationReviewConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(RegistrationReviewConstants.featureId, field, "Read");
  }
  parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
   }

}
