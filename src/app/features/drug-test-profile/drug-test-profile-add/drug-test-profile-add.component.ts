import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {FormGroup, FormBuilder, Validators, FormArray} from "@angular/forms";
import {Subscription} from "rxjs/Rx";
import {Title} from "@angular/platform-browser";
import {TokenService} from '../../../services/token.service';
import {AuthorizationService} from '../../../services/authorization.service';
import {DataService} from '../../../services/data.service';
import {HeaderService} from '../../../views/header/header.service';
import {DrugTestProfileService} from '../drug-test-profile.service';
import {DrugTestProfileConstants} from '../drug-test-profile.constants';
import {DrugTestProfile} from '../drug-test-profile';
import {ValidationService} from '../../../generic-components/control-messages/validation.service';
import {ConfirmService} from '../../../generic-components/confirm-box/confirm.service';
import {Drugs} from "../drug-test-type";
import { ListService } from '../../../services/list.service';
import { Utility } from "../../../shared/utility";

@Component({
  selector: 'tr-drug-test-profile-edit',
  templateUrl: 'drug-test-profile-add.component.html'
})
export class DrugTestProfileAddComponent implements OnInit {

  private subscription: Subscription;
  private drugTestProfileId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  drugTestProfileAddForm: FormGroup;
  private drugTestProfile: DrugTestProfile = new DrugTestProfile();
  private mainDrug: number;
  private drugList: Set<number> = new Set<number>();
  private action;
  private eventId;
  private mainDrugMessage: string = null;
  private secondaryDrugDrugMessage: string = null;

  constructor(private _fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private authorizationService: AuthorizationService,
              private dataService: DataService,
              private drugTestProfileService: DrugTestProfileService,
              private validationService: ValidationService,
              private confirmService: ConfirmService,
              private headerService: HeaderService,
              private titleService: Title,
              private listService: ListService) {
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.params['eventId'];
    this.route.params.subscribe((params: any) => {
      if (!params.hasOwnProperty('drugTestProfileId')) {
        this.action = "Create";
        this.titleService.setTitle("Add Drug Test Profile");
      } else {
        this.action = "Update";
        this.titleService.setTitle("Edit Drug Test Profile");
      }
    });

    //this.authorizationService.getAuthorizationDataByTableId(DrugTestProfileConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(DrugTestProfileConstants.featureId, DrugTestProfileConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(DrugTestProfileConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(DrugTestProfileConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(DrugTestProfileConstants.tableId, this.action, this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(DrugTestProfileConstants.featureId, this.action);
      if (this.authorizedFlag) {
        this.initForm();
        this.subscription = this.route.params.subscribe((params: any) => {
          if (params.hasOwnProperty('drugTestProfileId')) {
            this.drugTestProfileId = params['drugTestProfileId'];
            this.drugTestProfileService.getDrugTestProfile(this.eventId).subscribe((data: any) => {
              data.drugList.forEach(element =>{
                this.drugList.add(element);
              });
              this.mainDrug = data.mainDrugId;
              data.drugToBeTestedForId = "",
              this.drugTestProfileAddForm.patchValue(data);
            });
          }
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });
  }

  navigateTo(url) {
    if (this.drugTestProfileAddForm.touched) {
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
    if (this.drugTestProfileAddForm.valid) {
		this.drugTestProfileAddForm.patchValue(Utility.escapeHtmlTags(this.drugTestProfileAddForm.value));
      if (this.drugList.size < 1) {
        this.headerService.setErrorPopup({'errorMessage': 'No drug tests have been added to the drug profile.'});
      }
      else {
        if (this.drugTestProfileId != null) {
          this.drugTestProfileService.updateDrugTestProfile(this.drugTestProfileId, this.drugTestProfileAddForm.value).subscribe((response: any) => {
            this.router.navigate(['../..'], {relativeTo: this.route});
          });
        } else {
          this.drugTestProfileService.addDrugTestProfile(this.drugTestProfileAddForm.value).subscribe((response: any) => {
            this.router.navigate(['../..'], {relativeTo: this.route});
          });
        }
      }
    }

    else {
    }
  }

  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(DrugTestProfileConstants.tableId, field, this.action, this.authorizationData);
    return this.authorizationService.isFeildAuthorized(DrugTestProfileConstants.featureId, field, this.action);
  }

  addDrug(isMainDrug: boolean) {
    this.mainDrugMessage = null;
    this.secondaryDrugDrugMessage = null;

    if((this.drugList.has(this.drugTestProfileAddForm.controls['drugToBeTestedForId'].value)) && !isMainDrug){
      this.secondaryDrugDrugMessage = "This drug has already been added.";
    }
    if (isMainDrug && this.drugTestProfileAddForm.controls['addMainDrugYesNoId'].value) {
      this.mainDrug = parseInt(this.drugTestProfileAddForm.controls['mainDrugId'].value);
      if (this.mainDrug && this.drugTestProfileAddForm.controls['addMainDrugYesNoId'].value ==  this.listService.getPkValueByTableIdAndCode(244,'Y')) {

        if (this.drugList.has(this.mainDrug)){
          this.mainDrugMessage = "This drug has already been added.";
        }
        else {
          this.drugList.add(this.mainDrug);
        }
      }
      if (this.mainDrug && this.drugTestProfileAddForm.controls['addMainDrugYesNoId'].value == this.listService.getPkValueByTableIdAndCode(244,'N')) {
        this.drugList.delete(this.mainDrug);
      }
    }
    else if (isMainDrug == false && this.drugTestProfileAddForm.controls['drugToBeTestedForId'].value) {
      if (this.drugList.has(parseInt(this.drugTestProfileAddForm.controls['drugToBeTestedForId'].value))){
        this.secondaryDrugDrugMessage = "This drug has already been added.";
      }

      else {
        if(this.mainDrug == parseInt(this.drugTestProfileAddForm.controls['drugToBeTestedForId'].value)){
          this.headerService.setErrorPopup({'errorMessage': 'Cannot add main drug to list when add to drugs list is set to no.'});
        }else{
          this.drugList.add(parseInt(this.drugTestProfileAddForm.controls['drugToBeTestedForId'].value));
        }
      }
    }
    this.drugTestProfileAddForm.controls['drugList'].patchValue(Array.from(this.drugList));
  }

  removeDrug(drugId: number) {
    this.drugList.delete(drugId);
    this.drugTestProfileAddForm.controls['drugList'].patchValue(Array.from(this.drugList));
  }

  initForm() {
    this.drugTestProfileAddForm = this._fb.group({
      eventId: [this.eventId],
      drugTestProfileId: [this.drugTestProfile.drugTestProfileId],
      dateAssessed: [this.drugTestProfile.dateAssessed, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
      teamId: [this.drugTestProfile.teamId, Validators.compose([Validators.required, , ,])],
      officeTeamId: [this.drugTestProfile.officeTeamId, Validators.compose([Validators.required, , ,])],
      officerId: [this.drugTestProfile.officerId, Validators.compose([Validators.required, , ,])],
      mainDrugId: [this.drugTestProfile.mainDrugId, Validators.compose([Validators.required, , ,])],
      addMainDrugYesNoId: [this.drugTestProfile.addMainDrugYesNoId, Validators.compose([Validators.required, , ,])],
      notes: [this.drugTestProfile.notes, Validators.compose([, , ,])],
      estimatedWeekelyCost: [this.drugTestProfile.estimatedWeekelyCost, Validators.compose([Validators.required, Validators.maxLength(10) , ,])],
      drugToBeTestedForId: [this.drugTestProfile.drugToBeTestedForId, Validators.compose([, , ,])],
      drugList: [],
      // createdBy:[ this.drugTestProfile.createdBy , ],
      // createdByUserId:[ this.drugTestProfile.createdByUserId , ],
      // createdDate:[ this.drugTestProfile.createdDate , ],
      // modifiedBy:[ this.drugTestProfile.modifiedBy , ],
      // modifiedByUserId:[ this.drugTestProfile.modifiedByUserId , ],
      // modifiedDate:[ this.drugTestProfile.modifiedDate , ],
      // deleted:[ this.drugTestProfile.deleted , ],
      // deletedBy:[ this.drugTestProfile.deletedBy , ],
      // deletedByUserId:[ this.drugTestProfile.deletedByUserId , ],
      // deletedDate:[ this.drugTestProfile.deletedDate , ],
      // locked:[ this.drugTestProfile.locked , ],
      // version:[ this.drugTestProfile.version , ],
    });

  }
}

