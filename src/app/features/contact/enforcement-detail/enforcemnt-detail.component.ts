import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ContactConstants } from '../contact.constants';
import { ListService } from '../../../services/list.service';
import { EventService } from "../../../features/event/event.service";
import { Event } from "../../../features/event/event";
import { SortFilterPagination } from '../../../generic-components/pagination/pagination';
import { NgForm } from '@angular/forms';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-enforcement-detail',
  templateUrl: 'enforcement-detail.component.html',
  providers:[EventService]
})
export class EnforcementDetailComponent implements OnInit {
private listEvent=[];
 seachEvent:any={};
 private enforcement={};
  private subscription: Subscription;
  contact: Contact;
  private contactId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
   private crcList=[];
   private teamlist=[];
    private officerlist=[];
        private lisOfOrderType=[];
    private event :Event=new Event();
private showlist=[];
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private contactService: ContactService,
      private headerService: HeaderService,
       private listService: ListService,
       
       private eventService:EventService,
       private titleService: Title ) { }
        private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  ngOnInit() {
      this.titleService.setTitle('NS Summary');
      this.sortFilterPaginationObj.paginationObj.size = 10000;
       let sortFields: any[] = [];
      	this.route.params.subscribe((params: any)=>{
			if(params.hasOwnProperty('profileId')) {
                this.event.profileId=params['profileId'];
                 this.eventService.sortFilterAndPaginate(this.event,SortFilterPagination,sortFields).subscribe(eventslist => {
         this.listEvent = eventslist.content;
           this.listService.getListData(421).subscribe(lisOfOrderType=>{
      this.lisOfOrderType = lisOfOrderType;
       this.showlist=this.getEventList(this.listEvent, this.lisOfOrderType);
  });
  
     });
			}
		});

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
      this.contactId = params['contactId'];
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
            // this.contactService.getEnforcementSummery(this.contactId).subscribe(data => {
            //     this.contact = data;
            // })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }
  onSubmit(form: NgForm){
      if(!(form.value.eventId==null)){
    this.contactService.getEnforcementSummery(form.value.eventId).subscribe(data => {
                this.enforcement = data;
      })
    }
  }

    reset(form: NgForm){
   form.reset();
   this.enforcement={}
  }


  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ContactConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ContactConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ContactConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ContactConstants.featureId, field, "Read");
  }

  getEventList(Events,outcomes){
      var eventToShow:any=[];
     
      outcomes.forEach(element => {
          Events.forEach(oelement => {
          if(element.key==oelement.orderTypeDisposalTypeId){
               var eventDataShow:any={}
             eventDataShow.value= oelement.eventNumber+" - "+element.value;
              eventDataShow.key=oelement.eventId;
              eventToShow.push(eventDataShow);
          }
        });
      });
      return eventToShow;
  }

}
