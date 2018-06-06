import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Contact } from '../../contact/contact';
import { ContactService } from '../../contact/contact.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ContactConstants } from '../../contact/contact.constants';
import { ListService } from '../../../services/list.service';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-plan-appointment-detail',
  templateUrl: 'plan-appointment-detail.component.html'
})
export class PlanAppointmentDetailComponent implements OnInit {

  private subscription: Subscription;
  contact: Contact;
  private contactId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   private crcList=[];
   private teamlist=[];
    private officerlist=[];
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private contactService: ContactService,
      private headerService: HeaderService,
       private listService: ListService,
       private titleService: Title ) { }

  ngOnInit() {
      this.titleService.setTitle('View Plan Entry');

            this.listService.getListDataWithLookup(433, 503).subscribe(crcList => {
         this.crcList = crcList;
     });

             this.listService.getListDataWithLookup(445, 501).subscribe(crcList => {
         this.teamlist = crcList;
     });
            this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
         this.officerlist = crcList;
     });


    this.subscription = this.route.params.subscribe((params: any)=>{
      this.contactId = params['appointmentId'];
       //this.authorizationService.getAuthorizationDataByTableId(ContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ContactConstants.featureId, ContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ContactConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ContactConstants.featureId, authorizationData[1]);
      }
      
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ContactConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ContactConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.contactService.getContact(this.contactId).subscribe(data => {
                this.contact = data;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ContactConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ContactConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ContactConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ContactConstants.featureId, field, "Read");
  }

}
