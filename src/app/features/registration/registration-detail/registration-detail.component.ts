import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { Registration } from '../registration';
import { RegistrationService } from '../registration.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { RegistrationConstants } from '../registration.constants';
import { ListService } from '../../../services/list.service';

@Component({
  selector: 'tr-registration-detail',
  templateUrl: 'registration-detail.component.html'
})
export class RegistrationDetailComponent implements OnInit {

  private subscription: Subscription;
  registration: Registration;
  private registrationId: number;
  	private registrationProviderIdList: any[] = [];
    private registeringTeamList: any[] = [];
    private registeringOfficerList: any[] = [];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private registrationService: RegistrationService,
      private headerService: HeaderService,
      private titleService: Title,
      private listService: ListService) { }

  ngOnInit() {

    // this.listService.getListDataWithLookup(433, 503).subscribe(registrationProviderIdList => {
    //     this.registrationProviderIdList = registrationProviderIdList;
    // });

    this.listService.getListData(193).subscribe(registrationProviderIdList => {
        this.registrationProviderIdList = registrationProviderIdList;
    });
	
    this.listService.getListDataWithLookup(445, 501).subscribe(registeringTeamList => {
        this.registeringTeamList = registeringTeamList;
    });
    this.listService.getListDataWithLookup(270, 502).subscribe(registeringOfficerList => {
        this.registeringOfficerList = registeringOfficerList;
    });


    this.titleService.setTitle("View Registrations");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.registrationId = params['registrationId'];
       //this.authorizationService.getAuthorizationDataByTableId(RegistrationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(RegistrationConstants.featureId, RegistrationConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(RegistrationConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(RegistrationConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(RegistrationConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RegistrationConstants.featureId, "Read");
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
    //return this.authorizationService.isTableAuthorized(RegistrationConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(RegistrationConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(RegistrationConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(RegistrationConstants.featureId, field, "Read");
  }

}
