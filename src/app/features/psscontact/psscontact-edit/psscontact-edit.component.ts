import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { PssContact } from '../psscontact';
import { PssContactService } from '../psscontact.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { PssContactConstants } from '../psscontact.constants';
import { Utility } from '../../../shared/utility';
@Component({
  selector: 'tr-psscontact-edit',
  templateUrl: 'psscontact-edit.component.html',
  providers: [PssContactService]
})
export class PssContactEditComponent implements OnInit {

  private subscription: Subscription;
  pssContact: PssContact = new PssContact();
  private pssContactId: number;

  pssContactForm: FormGroup;
  private action;
  private profileId;

  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private pssContactService: PssContactService) { }

  ngOnInit() {
    let routeData: any = this.route.routeConfig.data;
    if (routeData.action === "Create") {
      this.action = "Add";
    } else {
      this.action = "Edit";
    }
    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        this.pssContact.eventId = params['eventId'];
      }

      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
    })

    this.authorizationService.getAuthorizationData(PssContactConstants.featureId, PssContactConstants.tableId).subscribe(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(PssContactConstants.featureId, res[0]);
        this.dataService.addFeatureFields(PssContactConstants.featureId, res[1]);
      }
    });
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.pssContactId = params['id'];
        this.pssContactService.getPssContact(this.pssContactId).subscribe((data: PssContact) => {
          this.pssContact = data;
          this.pssContactForm.patchValue(this.pssContact);
        });
      }
    })
  }

  onSubmit() {
    if (this.pssContactForm.valid) {
		 this.pssContactForm.patchValue(Utility.escapeHtmlTags(this.pssContactForm.value));
      this.subscription = this.route.params.subscribe((params: any) => {		  
        if (params.hasOwnProperty('id')) {
          this.pssContactId = params['id'];
          this.pssContactService.updatePssContact(this.pssContactId, this.pssContactForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.profileId, 'event', this.pssContact.eventId, this.pssContact.pssContactId]);
          });
        } else {
          this.pssContactService.addPssContact(this.pssContactForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.profileId, 'event', this.pssContact.eventId, this.pssContact.pssContactId]);
          });
        }
      });
    }
    else {
      alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(PssContactConstants.featureId, field, "Create");
  }

  initForm() {
    this.pssContactForm = this._fb.group({
      pssContactId: [this.pssContact.pssContactId],
      eventId: [this.pssContact.eventId],
      pssDate: [this.pssContact.pssDate],
      spgPssContactId: [0],
      spgVersion: [this.pssContact.spgVersion],
      spgUpdateUser: [this.pssContact.spgUpdateUser],
      // createdDate: [this.pssContact.createdDate],
      // createdBy: [this.pssContact.createdBy],
      // createdByUserId: [this.pssContact.createdByUserId],
      // modifiedDate: [this.pssContact.modifiedDate],
      // modifiedBy: [this.pssContact.modifiedBy],
      // modifiedByUserId: [this.pssContact.modifiedByUserId],
      // deleted: [this.pssContact.deleted],
      // deletedDate: [this.pssContact.deletedDate],
      // deletedBy: [this.pssContact.deletedBy],
      // deletedByUserId: [this.pssContact.deletedByUserId],
      // locked: [this.pssContact.locked],
      // version: [this.pssContact.version],
    });
  }
}
