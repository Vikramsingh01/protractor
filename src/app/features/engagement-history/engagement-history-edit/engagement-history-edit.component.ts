import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { EngagementHistory } from '../engagement-history';
import { EngagementHistoryService } from '../engagement-history.service';
import { EngagementHistoryConstants } from '../engagement-history.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Utility } from '../../../shared/utility';
@Component({
  selector: 'tr-engagement-history-edit',
  templateUrl: 'engagement-history-edit.component.html',
  providers: [EngagementHistoryService]
})
export class EngagementHistoryEditComponent implements OnInit {

  private subscription: Subscription;
  engagementHistory: EngagementHistory = new EngagementHistory();
  private engagementHistoryId: number;

  engagementHistoryForm: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private engagementHistoryService: EngagementHistoryService, private authorizationService: AuthorizationService, private dataService: DataService) { }

  ngOnInit() {

    this.authorizationService.getAuthorizationData(EngagementHistoryConstants.featureId, EngagementHistoryConstants.tableId).subscribe(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(EngagementHistoryConstants.featureId, res[0]);
        this.dataService.addFeatureFields(EngagementHistoryConstants.featureId, res[1]);
      }
    });
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.engagementHistoryId = params['id'];
        this.engagementHistoryService.getEngagementHistory(this.engagementHistoryId).subscribe((data: EngagementHistory) => {
          this.engagementHistory = data;
          this.engagementHistoryForm.patchValue(this.engagementHistory);
        });
      }
    })
  }

  onSubmit() {
    if (this.engagementHistoryForm.valid) {
				this.engagementHistoryForm.patchValue(Utility.escapeHtmlTags(this.engagementHistoryForm.value));
      this.subscription = this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('id')) {
          this.engagementHistoryId = params['id'];
          this.engagementHistoryService.updateEngagementHistory(this.engagementHistoryId, this.engagementHistoryForm.value).subscribe((response: any) => {
            this.router.navigate(['..']);
          });
        } else {
          this.engagementHistoryService.addEngagementHistory(this.engagementHistoryForm.value).subscribe((response: any) => {
            this.router.navigate(['..']);
          });
        }
      });
    }
    else {
      alert("Invalid Form");
    }
  }

  isFeildAuthorized(field) {
    let action;
    if (this.engagementHistoryId == undefined || this.engagementHistoryId == null) {
      action = "Create";
    } else {
      action = "Update";
    }
    return this.authorizationService.isFeildAuthorized(EngagementHistoryConstants.featureId, field, action);
  }

  initForm() {
    this.engagementHistoryForm = this._fb.group({
      engagementHistoryId: [this.engagementHistory.engagementHistoryId],
      caseReferenceNumber: [this.engagementHistory.caseReferenceNumber],
      spgOffenderId: [this.engagementHistory.spgOffenderId],
      acceptedRejectedDate: [this.engagementHistory.acceptedRejectedDate],
      rejectedReason: [this.engagementHistory.rejectedReason],
      acceptedRejectedByUserId: [this.engagementHistory.acceptedRejectedByUserId],
      status: [this.engagementHistory.status],
      createdDate: [this.engagementHistory.createdDate],
      createdBy: [this.engagementHistory.createdBy],
      createdByUserId: [this.engagementHistory.createdByUserId],
      modifiedDate: [this.engagementHistory.modifiedDate],
      modifiedBy: [this.engagementHistory.modifiedBy],
      modifiedByUserId: [this.engagementHistory.modifiedByUserId],
      deleted: [this.engagementHistory.deleted],
      deletedDate: [this.engagementHistory.deletedDate],
      deletedBy: [this.engagementHistory.deletedBy],
      deletedByUserId: [this.engagementHistory.deletedByUserId],
      locked: [this.engagementHistory.locked],
      version: [this.engagementHistory.version],
    });
  }
}
