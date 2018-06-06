import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { CustodyLocation } from '../custody-location';
import { CustodyLocationService } from '../custody-location.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CustodyLocationConstants } from '../custody-location.constants';

import { ReleaseService } from '../../../features/release/release.service';

import { EventService } from '../../../features/event/event.service';
import { Event } from '../../../features/event/event';


@Component({
  selector: 'tr-custody-location-detail',
  templateUrl: 'custody-location-detail.component.html'
})
export class CustodyLocationDetailComponent implements OnInit {

  private subscription: Subscription;
  custodyLocation: CustodyLocation;
  private custodyLocationId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private eventId: number;
  private profileId: number;
  event: Event = new Event();
  private currentStatus: any;
  private statusDate: any;
  private eventJson: any[] = [];
  private isReleaseAllowed: boolean = false;
  private clickeditLock: boolean = false;
  private clickeditView: any = true;
  private isRecall: boolean = false;
  private isRecallLock: any = false;
  private isStatusInCustody: boolean = false;


  constructor(private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private custodyLocationService: CustodyLocationService,
    private headerService: HeaderService,
    private titleService: Title,
    private eventService: EventService,
    private releaseService: ReleaseService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Through The Gate Details");
    this.subscription = this.route.params.subscribe((params: any) => {
      this.custodyLocationId = params['custodyLocationId'];
      this.eventId = params['eventId'];
      this.profileId = params['profileId'];





      this.authorizationService.getAuthorizationData(CustodyLocationConstants.featureId, CustodyLocationConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(CustodyLocationConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(CustodyLocationConstants.featureId, authorizationData[1]);
        }

        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyLocationConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.custodyLocationService.getCustodyLocationByEventId(this.eventId).subscribe(data => {

            if (data.locked === "false") {
              data.locked = "false";
            } else {
              data.locked = "true";
            }
            this.custodyLocation = data;
          },
            error => {
              console.log(this.custodyLocation);
            });


          this.custodyLocationService.getCurrentStatusByEventId(this.eventId).subscribe(data => {
            this.currentStatus = data.currentStatus;
            if (this.currentStatus == "In Custody") {
              this.isStatusInCustody = true;
            }
          })
          this.custodyLocationService.getStatusDateByEventId(this.eventId).subscribe(data => {
            this.statusDate = data.statusDate;
          })
          this.custodyLocationService.getRecallStatusByEventId(this.eventId).subscribe(data => {
            if (data.currentEditStatus == true) {
              this.isRecall = true;

            }
            console.log(data);
          });

          this.custodyLocationService.getCustodyLocationLockStatusByEventId(this.eventId).subscribe(data => {
            this.isRecallLock = data.currentEditStatus;
            console.log(data.currentEditLockStatus);
          });



        } else {



          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(CustodyLocationConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(CustodyLocationConstants.featureId, field, "Read");
  }

}
