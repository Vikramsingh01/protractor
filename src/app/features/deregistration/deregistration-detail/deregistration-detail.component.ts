import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { Deregistration } from '../deregistration';
import { DeregistrationService } from '../deregistration.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { deregistrationConstants } from '../deregistration.constants';
import { ListService } from '../../../services/list.service';
import { RegistrationService } from '../../registration/registration.service';


@Component({
  selector: 'tr-deregistration-detail',
  templateUrl: 'deregistration-detail.component.html'
})
export class DeregistrationDetailComponent implements OnInit {

  private subscription: Subscription;
  deregistration: Deregistration;
  private deregistrationId: number;
  private authorizationData: any;
    private authorizationViewData: any;
 private registrationId: number;

  private authorizedFlag: boolean = false;
  private teamlist:any=[];
  private officerlist:any=[]
  private officerRegisterlist:any=[]
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private deregistrationService: DeregistrationService,
      private registrationService: RegistrationService,

      private headerService: HeaderService,
      private titleService: Title,
       private listService: ListService ) { }

  ngOnInit() {


    //             this.listService.getListData(14).subscribe(officerRegisterlist => {
    //     this.officerRegisterlist = officerRegisterlist;
    // });

             this.listService.getListDataWithLookup(445, 501).subscribe(crcList => {
         this.teamlist = crcList;
     });
            this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
         this.officerlist = crcList;
     });
    this.titleService.setTitle("View deregistration");
    this.subscription = this.route.params.subscribe((params: any)=>{
    this.deregistrationId = params['deregistrationId'];
    this.registrationId = params['registrationId'];

     


       //this.authorizationService.getAuthorizationDataByTableId(deregistrationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(deregistrationConstants.featureId, deregistrationConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(deregistrationConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(deregistrationConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(deregistrationConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(deregistrationConstants.featureId, "Read");
        if (this.authorizedFlag) {
     
          this.registrationService.getRegistration(this.registrationId).subscribe(data => {
                this.officerRegisterlist = data;
                if(data.registerTypeId != null)
                {
          this.deregistrationService.getderegistration(this.deregistrationId).subscribe((data:any) => {
             data.registerTypeId = this.officerRegisterlist.registerTypeId;
                this.deregistration = data;
            })
                }
           })
            
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(deregistrationConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(deregistrationConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(deregistrationConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(deregistrationConstants.featureId, field, "Read");
  }

}
