import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { LicenceConditionService } from '../licence-condition.service';
import { LicenceConditionConstants } from '../licence-condition.constants';
import { LicenceCondition } from '../licence-condition';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { Utility } from '../../../shared/utility';

@Component({
  selector: 'tr-licence-condition-terminate',
  templateUrl: './licence-condition-terminate.component.html'
})
export class LicenceConditionTerminateComponent implements OnInit {
  private subscription: Subscription;
  private licenceConditionId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  licenceConditionAddForm: FormGroup;
  private licenceCondition: LicenceCondition = new LicenceCondition();
  private action;
  private locked;
  private terminated = false;
  private nsrdData: any = [];
  childAnswers: any = [];
  constructor(private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private licenceConditionService: LicenceConditionService,
    private validationService: ValidationService,
    private confirmService: ConfirmService,
    private listService: ListService,
    private headerService: HeaderService) { }


  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        this.licenceCondition.eventId = params['eventId'];
      }

      if (params.hasOwnProperty('licenceConditionId')) {
        this.licenceConditionId = params['licenceConditionId'];
        this.licenceConditionService.getLicenceCondition(this.licenceConditionId).subscribe(licenceCondition => {
          this.listService.getDependentAnswers(422, licenceCondition.licCondTypeMainCategoryId).subscribe((childAnswers: any) => {
            this.childAnswers = childAnswers;
          })

        })


      }

      // if (!params.hasOwnProperty('licenceConditionId')) {
      //   this.action = "Create";
      // } else {
      this.action = "Update";
      // }
    });

    //this.authorizationService.getAuthorizationDataByTableId(LicenceConditionConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(LicenceConditionConstants.featureId, LicenceConditionConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(LicenceConditionConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(LicenceConditionConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(LicenceConditionConstants.tableId, this.action, this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(LicenceConditionConstants.featureId, this.action);
      if (this.authorizedFlag) {
        this.initForm();
        this.subscription = this.route.params.subscribe((params: any) => {
          if (params.hasOwnProperty('licenceConditionId')) {
            this.licenceConditionId = params['licenceConditionId'];

            this.initForm();
            this.licenceConditionService.getLicenceCondition(this.licenceConditionId).subscribe(licenceCondition => {
              this.licenceConditionService.terminateLicenceConditionCRD(licenceCondition).subscribe(nsrdData => {
                //console.log(nsrdData);
                this.updateNsrd(nsrdData.resultMap.fieldObjectList);
              })
            })

            this.licenceConditionService.getLicenceCondition(this.licenceConditionId).subscribe((data: any) => {
              if (data.terminationReasonId == null || data.locked == "false") {
                this.locked = false;
              }
              else {
                this.locked = true;
              }
              if (data.terminationReasonId != null) {
                this.terminated = true;
                this.licenceConditionAddForm.patchValue(data);
                this.licenceConditionAddForm.controls['actualEndDate'].disable();
                this.licenceConditionAddForm.controls['attendanceCount'].disable();
                this.licenceConditionService.getLicenceCondition(this.licenceConditionId).subscribe(licenceCondition => {
                  this.listService.getDependentAnswers(422, licenceCondition.licCondTypeMainCategoryId).subscribe((childAnswers: any) => {
                    this.childAnswers = childAnswers;
                    let terminationList = Utility.getObjectFromArrayByKeyAndValue(this.dataService.getListData(), 'tableId', 156).list;
                    let selectedObj = Utility.getObjectFromArrayByKeyAndValue(terminationList, 'key', parseInt(data.terminationReasonId));
    
                    this.childAnswers[156].push(selectedObj);
                  })
        
                })
                
                this.licenceConditionAddForm.controls['terminationReasonId'].disable();
                this.licenceConditionAddForm.controls['note'].disable();
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
    nsrdData.forEach((element: any) => {
      this.nsrdData[element.fieldName] = {};
      this.nsrdData[element.fieldName].active = element.active;
      this.nsrdData[element.fieldName].mandatory = element.mandatory;
      if (element.mandatory) {
        this.licenceConditionAddForm.controls[element.fieldName].setValidators([Validators.required, ValidationService.NumberValidator]);
      } else {
        this.licenceConditionAddForm.controls[element.fieldName].setValidators(null);
      }
      this.licenceConditionAddForm.controls[element.fieldName].updateValueAndValidity();
    });

  }

  navigateTo(url) {
    if (this.licenceConditionAddForm.touched) {
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
    if (this.licenceConditionAddForm.valid || this.terminated) {

      this.licenceConditionService.isAuthorize(this.licenceConditionId, "Update").subscribe((response: any) => {

        if (response) {
          if (this.terminated) {
            this.confirmService.confirm(
              {
                message: 'Do you wish to unterminate this Licence Condition?',
                header: 'Confirm',
                accept: () => {
                  this.licenceConditionService.unTerminateLicenceCondition(this.licenceConditionId, this.licenceConditionAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../'], { relativeTo: this.route });
                  });
                  // alert("Unterminated..");
                }
              });

          } else {
            this.confirmService.confirm(
              {
                message: 'You are about to terminate this Licence Condition. Do you wish to continue?',
                header: 'Confirm',
                accept: () => {
                  this.licenceConditionService.terminateLicenceCondition(this.licenceConditionId, this.licenceConditionAddForm.value).subscribe((response: any) => {
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
    //return this.authorizationService.isTableFieldAuthorized(LicenceConditionConstants.tableId, field, this.action, this.authorizationData);
    return this.authorizationService.isFeildAuthorized(LicenceConditionConstants.featureId, field, this.action);
  }
  initForm() {
    this.licenceConditionAddForm = this._fb.group({

      actualEndDate: [this.licenceCondition.actualEndDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
      terminationReasonId: [this.licenceCondition.terminationReasonId, Validators.compose([Validators.required, , ,])],
      attendanceCount: [this.licenceCondition.attendanceCount, Validators.compose([Validators.required, , ,])],
      note: [this.licenceCondition.note, Validators.compose([, , ,])],

    });
  }

}
