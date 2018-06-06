import { DataService } from './../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Observable } from "rxjs";
import { Event } from '../event';
import { EventService } from '../event.service';
import { TokenService } from '../../../services/token.service';
import { OffenderAdditionalSentenceService } from '../../offender-additional-sentence/offender-additional-sentence.service';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'tr-event-detail',
  templateUrl: 'event-detail.component.html',
  providers: [EventService, TokenService, OffenderAdditionalSentenceService]
})
export class EventDetailComponent implements OnInit {

  private subscription: Subscription;
  event: Event = new Event();
  private eventId: number;
  private disposalJson: any[] = [];
  private isPssApplies: boolean = false;
  private additionalSentence = "";
  constructor(
    private _titleService: Title,
    private route: ActivatedRoute, private eventService: EventService,
    private offenderAdditionalSentenceService: OffenderAdditionalSentenceService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this._titleService.setTitle('Event Details');
    this.subscription = this.route.params.subscribe((params: any) => {
      this.eventId = params['eventId'];
      this.event.profileId = params['profileId'];
      this.eventService.getEvent(this.eventId).subscribe((data: Event) => {
        if(parseFloat(data.rsrScore) != NaN){
              data.rsrScore = parseFloat(data.rsrScore).toString();
        }  
        this.event = data;
        let additionalSentence: any = {};
        additionalSentence.eventId = this.eventId;

        this.eventService.getDisposalByEventId(this.eventId).subscribe((response: any) => {
          this.disposalJson = this.eventService.removeConstantsFields(response);
          this.eventService.complexRefDataRequestForDisposal(this.disposalJson).subscribe((breResponse: any) => {
            console.log(breResponse);
            if (breResponse != null && breResponse.resultMap != null && breResponse.resultMap.fieldObjectList != null && breResponse.resultMap.fieldObjectList.length > 0)
              breResponse.resultMap.fieldObjectList.forEach(element => {
                if (element.fieldName === "isPSSAllowed" && element.active === true) {
                  this.isPssApplies = true;
                }
              });
          });
        });

        this.offenderAdditionalSentenceService.sortFilterAndPaginate(additionalSentence, null, null).subscribe((data: any) => {
          if (data.content.length > 0) {
            this.additionalSentence = "Yes";
          }
          else {
            this.additionalSentence = "No";
          }
        })

      });
    })
  }

  isAuthorized(action) {
    return true;
    //return this.eventService.isAuthorized(action);
  }
  isFeildAuthorized(field) {
    return true;
    //return this.eventService.isFeildAuthorized(field, 'Read');
  }

}
