import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { ProcessContact } from '../process-contact';
import { ProcessContactService } from '../process-contact.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ProcessContactConstants } from '../process-contact.constants';


@Component({
  selector: 'tr-process-contact-detail',
  templateUrl: 'process-contact-detail.component.html'
})
export class ProcessContactDetailComponent implements OnInit {

  private subscription: Subscription;
  processContact: ProcessContact;
  private processContactId: number;
   private processTypeId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private processContactService: ProcessContactService,
      private headerService: HeaderService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Interventions");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.processContactId = params['processContactId'];
       this.processTypeId = params['processTypeId'];
       //this.authorizationService.getAuthorizationDataByTableId(ProcessContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ProcessContactConstants.featureId, ProcessContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ProcessContactConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ProcessContactConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProcessContactConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ProcessContactConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.processContactService.getProcessContact(this.processContactId, this.processTypeId).subscribe(data => {
                this.processContact = data;

                if(data.hasOwnProperty('unitsCode')){
                  this.processContact.processEndDate=this.processContact.processEndDate+" "+data.unitsCode;
                }
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ProcessContactConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ProcessContactConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ProcessContactConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ProcessContactConstants.featureId, field, "Read");
  }

  parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }
}
