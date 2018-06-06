import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { PssRequirementService } from '../pss-requirement.service';
import { PssRequirementConstants } from '../pss-requirement.constants';
import { PssRequirement } from '../pss-requirement';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Title } from "@angular/platform-browser";
import { Utility } from '../../../shared/utility';
import { ListService } from '../../../services/list.service';

@Component({
  selector: 'tr-pss-requirement-terminate',
  templateUrl: './pss-requirement-terminate.component.html'
})
export class PssRequirementTerminateComponent implements OnInit {
  private subscription: Subscription;
  private pssRequirementId: number;
  private authorizationData: any;
  private nsrdData: any = [];
  private authorizedFlag: boolean = false;
  private childAnswers: any = [];
  pssRequirementAddForm: FormGroup;
  private pssRequirement: PssRequirement = new PssRequirement();
  private action;
  private locked;
  private terminated = false;
  private terminationReasonList = [];
  constructor(
    private _titleService: Title,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private pssRequirementService: PssRequirementService,
    private validationService: ValidationService,
    private confirmService: ConfirmService,
    private headerService: HeaderService,
    private listService: ListService) { }

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        this.pssRequirement.eventId = params['eventId'];;
      }

      this.action = "Update";
    });



    this.authorizationService.getAuthorizationData(PssRequirementConstants.featureId, PssRequirementConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(PssRequirementConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(PssRequirementConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(PssRequirementConstants.tableId, this.action, this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PssRequirementConstants.featureId, this.action);
      if (this.authorizedFlag) {
        this.initForm();
        this.subscription = this.route.params.subscribe((params: any) => {
          if (params.hasOwnProperty('pssRequirementId')) {
            this.pssRequirementId = params['pssRequirementId'];

            this.initForm();
            this.pssRequirementService.getPssRequirement(this.pssRequirementId).subscribe(pssRequirement => {
              this.listService.getDependentAnswers(197, pssRequirement.pssRequirementTypeMainCategoryId).subscribe((childAnswers: any) => {
                this.terminationReasonList = childAnswers[199];
            })


              this.pssRequirementService.terminatePssRequirementCRD(pssRequirement).subscribe(nsrdData => {
                this.updateNsrd(nsrdData.resultMap);
              })
            })


            this.pssRequirementService.getPssRequirement(this.pssRequirementId).subscribe((data: any) => {
              if (data.terminationReasonId == null || data.locked == "false") {
                this.locked = false;
              }
              else {
                this.locked = true;
              }
              if (data.terminationReasonId != null) {
                this.terminated = true;
                this.pssRequirementAddForm.patchValue(data);
                this.pssRequirementAddForm.controls['actualEndDate'].disable();
                this.pssRequirementAddForm.controls['attendanceCount'].disable();
                this.pssRequirementAddForm.controls['terminationReasonId'].disable();
                this.pssRequirementAddForm.controls['notes'].disable();
              }
            });
          }
        })
      } else {
        // this.headerService.setAlertPopup("Not authorized");
      }
    });
  }

  updateNsrd(nsrdData) {
    if (nsrdData.hasOwnProperty('fieldObjectList')) {
      let fieldObjectList: any[] = nsrdData.fieldObjectList;
      let attendanceCountObj = Utility.getObjectFromArrayByKeyAndValue(fieldObjectList, 'fieldName', 'attendanceCount');
      if (attendanceCountObj != undefined) {
        this.nsrdData[attendanceCountObj.fieldName] = {};
        this.nsrdData[attendanceCountObj.fieldName].active = attendanceCountObj.active;
        this.nsrdData[attendanceCountObj.fieldName].mandatory = attendanceCountObj.mandatory;
        if (attendanceCountObj.mandatory) {
          this.pssRequirementAddForm.controls[attendanceCountObj.fieldName].setValidators([Validators.required, ValidationService.NumberValidator]);
        } else {
          this.pssRequirementAddForm.controls[attendanceCountObj.fieldName].setValidators(null);
        }
        this.pssRequirementAddForm.controls[attendanceCountObj.fieldName].updateValueAndValidity();
      }
    }
  }

  navigateTo(url) {
    if (this.pssRequirementAddForm.touched) {
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
  onSubmit() {
    if (this.pssRequirementAddForm.valid || this.terminated) {
      this.pssRequirementService.isAuthorize(this.pssRequirementId, "Update").subscribe((response: any) => {
        if (response) {
          if (this.terminated) {
            this.confirmService.confirm(
              {
                message: 'Do you wish to unterminate this PSS Requirement?',
                header: 'Confirm',
                accept: () => {
                  this.pssRequirementService.unTerminatePssRequirement(this.pssRequirementId, this.pssRequirementAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../'], { relativeTo: this.route });
                  });
                }
              });

          } else {
            this.confirmService.confirm(
              {
                message: 'You are about to terminate this PSS Requirement. Do you wish to continue?',
                header: 'Confirm',
                accept: () => {
                  this.pssRequirementService.terminatePssRequirement(this.pssRequirementId, this.pssRequirementAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../'], { relativeTo: this.route });
                  });
                }
              });
          }
        }
        else {
          this.headerService.setErrorPopup({ errorMessage: "You are not authorised to perform this action on this SU record. Please contact the Case Manager." });
        }
      });
    }
  }

  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(PssRequirementConstants.tableId, field, this.action, this.authorizationData);
    return this.authorizationService.isFeildAuthorized(PssRequirementConstants.featureId, field, this.action);
  }
  initForm() {
    this.pssRequirementAddForm = this._fb.group({
      actualEndDate: [this.pssRequirement.actualEndDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
      terminationReasonId: [this.pssRequirement.terminationReasonId, Validators.compose([Validators.required, , ,])],
      attendanceCount: [this.pssRequirement.attendanceCount, Validators.compose([Validators.required, , ,])],
      notes: [this.pssRequirement.notes, Validators.compose([, , ,])],

    });
  }
}

