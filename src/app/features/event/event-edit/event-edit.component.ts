import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Event } from '../event';
import { EventService } from '../event.service';
import { TokenService } from '../../../services/token.service';
import { Utility } from '../../../shared/utility';
import {Title} from "@angular/platform-browser";
import {ConfirmService} from "../../../generic-components/confirm-box/confirm.service";
@Component({
  selector: 'tr-event-edit',
  templateUrl: 'event-edit.component.html',
  providers: [EventService]
})
export class EventEditComponent implements OnInit {

  private subscription: Subscription;
  event: Event = new Event();
  private eventId: number;
  private previousNotes: string = "";
  eventForm: FormGroup;
private action;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private eventService: EventService, private titleService: Title, private confirmService: ConfirmService) { }

  ngOnInit() {
	let routeData: any = this.route.routeConfig.data;
    if(routeData.action==="Create"){
        this.action="Create";
        this.titleService.setTitle('Add Event');
    }else{
        this.action="Update";
        this.titleService.setTitle('Edit Event');
    }
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        this.eventId = params['eventId'];
        this.eventService.getEvent(this.eventId).subscribe((data: Event) => {
          this.event = data;
          this.previousNotes = data.notes;
          data.notes = "";
          this.eventForm.patchValue(this.event);
        });
      }
    })
  }

  onSubmit() {
    if (this.eventForm.valid) {
		this.eventForm.patchValue(Utility.escapeHtmlTags(this.eventForm.value));
      this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('eventId')) {
          this.eventId = params['eventId'];
          // this.eventForm.controls['offenceDate'].disable();
          this.eventService.updateEvent(this.eventId, this.eventForm.getRawValue()).subscribe((response: any) => {
            this.router.navigate(['../../../profile']);
          });
        } else {
          this.eventService.addEvent(this.eventForm.value).subscribe((response: any) => {
            this.router.navigate(['../../../profile']);
          });
        }
      })

    }
    else {
      alert("Invalid Form");
    }
  }

  navigateTo(url) {
    if (this.eventForm.touched) {
      this.confirmService.confirm(
        {
          message: 'Do you want to leave this page without saving?',
          header: 'Confirm',
          accept: () => {
            this.router.navigate(url, { relativeTo: this.route });
          }
        });
    } else {
      this.router.navigate(url, { relativeTo: this.route });
      return false;
    }
  }

  isFeildAuthorized(field) {
    return true;
    //return this.eventService.isFeildAuthorized(field, 'Create');
  }

  initForm() {
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        this.event.profileId = params['profileId'];
      }
    });
    this.eventForm = this._fb.group({
      eventId: [this.event.eventId],
      convictionDate: [this.event.convictionDate],
      eventNumber: [this.event.eventNumber],
      notes: [this.event.notes],
      referralDate: [this.event.referralDate],
      profileId: [this.event.profileId],

      //Main Offence fields start
      offenceCodeId: [this.event.offenceCodeId],
      offenceCount: [this.event.offenceCount],
      offenceDate: [this.event.offenceDate],
      takenIntoConsideration: [this.event.takenIntoConsideration],
      //Main Offence fields end

      //Disposal fields start
      disposalId: [this.event.disposalId],
      enteredLength: [this.event.enteredLength],
      enteredLengthUnitId: [this.event.enteredLengthUnitId],
      expectedEndDate: [this.event.expectedEndDate],
      length: [this.event.length],
      lengthUnitId: [this.event.lengthUnitId],
      lengthDays: [this.event.lengthDays],
      orderTypeDisposalTypeId: [this.event.orderTypeDisposalTypeId],
      osProviderId: [this.event.osProviderId],
      osResponsibleOfficer: [this.event.osResponsibleOfficer],
      osResponsibleTeam: [this.event.osResponsibleTeam],
      secondLength: [this.event.secondLength],
      secondLengthUnitId: [this.event.secondLengthUnitId],
      sentenceDate: [this.event.sentenceDate],
      sentenceValue: [this.event.sentenceValue],
      spgEventId: [this.event.spgEventId],
      terminationDate: [this.event.terminationDate],
      terminationReasonId: [this.event.terminationReasonId],
      spgVersion: [this.event.spgVersion],
      spgUpdateUser: [this.event.spgUpdateUser],
      //Disposal fields end

      //Allocation Information fields start
      allocationInformationId: [this.event.allocationInformationId],
      allocatedProviderId: [this.event.allocatedProviderId],
      allocationDate: [this.event.allocationDate],
      allocationDecisionId: [this.event.allocationDecisionId],
      decisionProviderId: [this.event.decisionProviderId],
      rsrDate: [this.event.rsrDate],
      rsrProviderId: [this.event.rsrProviderId],
      rsrScore: [this.event.rsrScore],
      //Allocation Information fields end

      //OGRS Assessment fields start
      ogrsAssessmentId: [this.event.ogrsAssessmentId],
      ogrs2Score: [this.event.ogrs2Score],
      ogrs3Score1: [this.event.ogrs3Score1],
      ogrs3Score2: [this.event.ogrs3Score2],
      //OGRS Assessment fields end


      // createdDate: [this.event.createdDate],
      // createdBy: [this.event.createdBy],
      // createdByUserId: [this.event.createdByUserId],
      // modifiedDate: [this.event.modifiedDate],
      // modifiedBy: [this.event.modifiedBy],
      // modifiedByUserId: [this.event.modifiedByUserId],
      // deleted: [this.event.deleted],
      // deletedDate: [this.event.deletedDate],
      // deletedBy: [this.event.deletedBy],
      // deletedByUserId: [this.event.deletedByUserId],
      // locked: [this.event.locked],
      // version: [this.event.version],
    });
  }
}
