import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { RegisterReview } from "../registerreviews";
import { RegisterReviewService } from "../register-reviews.service";
import { TokenService } from '../../../../services/token.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { DataService } from '../../../../services/data.service';
import { HeaderService } from '../../../../views/header/header.service';
import { RegisterReviewConstants } from '../register-reviews.constants';
import { ListService } from '../../../../services/list.service';

@Component({
  selector: 'tr-register-review-detail',
  templateUrl: 'register-reviews-detail.component.html'
})
export class RegisterReviewsDetailComponent implements OnInit {

    private subscription: Subscription;
    registration: RegisterReview;
    private registrationId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    constructor(private route: ActivatedRoute, 
    private authorizationService: AuthorizationService, 
    private dataService: DataService, 
    private registrationService: RegisterReviewService,
    private headerService: HeaderService,
    private titleService: Title,
    private listService: ListService) { }

  ngOnInit() {
    this.titleService.setTitle("View Registrations");
    this.subscription = this.route.params.subscribe((params: any)=>{
    this.registrationId = params['registrationId'];
    this.authorizationService.getAuthorizationData(RegisterReviewConstants.featureId, RegisterReviewConstants.tableId).subscribe(authorizationData => {
    this.authorizationData = authorizationData;
    if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(RegisterReviewConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(RegisterReviewConstants.featureId, authorizationData[1]);
    }

    this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RegisterReviewConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.registrationService.getRegistration(this.registrationId).subscribe(data => {
                if(data.nextReviewDate!=null){
                data.nextReviewDate = data.nextReviewDate + " " +data.createdDate.split(" ")[1];
                data.reviewPeriod = data.reviewPeriod + " Months";
            }
                this.registration = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(RegisterReviewConstants.featureId, action);
  }

  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(RegisterReviewConstants.featureId, field, "Read");
  }
}
