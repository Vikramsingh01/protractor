import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { ProposedRequirement } from '../proposedrequirement';
import { ProposedRequirementService } from '../proposedrequirement.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ProposedRequirementConstants } from '../proposedrequirement.constants';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-proposedrequirement-edit',
  templateUrl: 'proposedrequirement-edit.component.html',
  providers: [ProposedRequirementService]
})
export class ProposedRequirementEditComponent implements OnInit {

  private subscription: Subscription;
  proposedRequirement: ProposedRequirement = new ProposedRequirement();
  private proposedRequirementId: number;

  proposedRequirementForm: FormGroup;
  private action;
  private profileId;
  private eventId;
  private courtAppearanceId;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private proposedRequirementService: ProposedRequirementService) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }
      if (params.hasOwnProperty('eventId')) {
        this.eventId = params['eventId'];
      }
      if (params.hasOwnProperty('courtAppearanceId')) {
        this.courtAppearanceId = params['courtAppearanceId'];
      }
      if (params.hasOwnProperty('courtReportId')) {
        this.proposedRequirement.courtReportId = params['courtReportId'];
      }
      
    });

    let routeData: any = this.route.routeConfig.data;
    if (routeData.action === "Create") {
      this.action = "Add";
    } else {
      this.action = "Edit";
    }
    this.authorizationService.getAuthorizationData(ProposedRequirementConstants.featureId, ProposedRequirementConstants.tableId).subscribe(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(ProposedRequirementConstants.featureId, res[0]);
        this.dataService.addFeatureFields(ProposedRequirementConstants.featureId, res[1]);
      }
    });
    this.initForm();

    this.subscription = this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.proposedRequirementId = params['id'];
        this.proposedRequirementService.getProposedRequirement(this.proposedRequirementId).subscribe((data: ProposedRequirement) => {
          this.proposedRequirement = data;
          this.proposedRequirementForm.patchValue(this.proposedRequirement);
        });
      }
    })
  }

  onSubmit() {

    if (this.proposedRequirementForm.valid) {
		this.proposedRequirementForm.patchValue(Utility.escapeHtmlTags(this.proposedRequirementForm.value));
       this.subscription = this.route.params.subscribe((params: any) => {
        if (params.hasOwnProperty('id')) {
          this.proposedRequirementId = params['id'];
          this.proposedRequirementService.updateUpwAppointment(this.proposedRequirementId, this.proposedRequirementForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'court-and-custody', 'courtappearance', this.courtAppearanceId, 'court-report',this.proposedRequirement.courtReportId]);

          });
        } else {
          this.proposedRequirementService.addProposedRequirement(this.proposedRequirementForm.value).subscribe((response: any) => {
            this.router.navigate(['/my-service-user', this.profileId, 'event', this.eventId, 'court-and-custody', 'courtappearance', this.courtAppearanceId, 'court-report',this.proposedRequirement.courtReportId]);

          });
        }
      });
 
    }
    else {
        alert("Invalid Form");
      }
  }

    isFeildAuthorized(field) {
      return this.authorizationService.isFeildAuthorized(ProposedRequirementConstants.featureId, field, "Create");
    }

    initForm() {
      this.proposedRequirementForm = this._fb.group({
        proposedRequirementId: [this.proposedRequirement.proposedRequirementId],
        additionalRequirementTypeMainCategoryId: [this.proposedRequirement.additionalRequirementTypeMainCategoryId],
        additionalRequirementTypeSubCategoryId: [this.proposedRequirement.additionalRequirementTypeSubCategoryId],
        courtReportId: [this.proposedRequirement.courtReportId],
        length: [this.proposedRequirement.length],
        requirementTypeMainCategoryId: [this.proposedRequirement.requirementTypeMainCategoryId],
        requirementTypeSubCategoryId: [this.proposedRequirement.requirementTypeSubCategoryId],
        spgProposedRequirementId: [0],
        spgVersion: [this.proposedRequirement.spgVersion],
        spgUpdateUser: [this.proposedRequirement.spgUpdateUser],
        // createdDate: [this.proposedRequirement.createdDate],
        // createdBy: [this.proposedRequirement.createdBy],
        // createdByUserId: [this.proposedRequirement.createdByUserId],
        // modifiedDate: [this.proposedRequirement.modifiedDate],
        // modifiedBy: [this.proposedRequirement.modifiedBy],
        // modifiedByUserId: [this.proposedRequirement.modifiedByUserId],
        // deleted: [this.proposedRequirement.deleted],
        // deletedDate: [this.proposedRequirement.deletedDate],
        // deletedBy: [this.proposedRequirement.deletedBy],
        // deletedByUserId: [this.proposedRequirement.deletedByUserId],
        // locked: [this.proposedRequirement.locked],
        // version: [this.proposedRequirement.version],
      });
    }
  }
