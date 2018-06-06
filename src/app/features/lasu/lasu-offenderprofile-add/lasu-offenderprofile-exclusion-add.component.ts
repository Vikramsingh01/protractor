import {Component, OnInit} from '@angular/core';
import {LasuExclusionService} from "../lasu-exclusion.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {ListService} from "../../../services/list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Utility} from "../../../shared/utility";
import {HeaderService} from "../../../views/header/header.service";
import {ConfirmService} from "../../../generic-components/confirm-box/confirm.service";
import {ValidationService} from "../../../generic-components/control-messages/validation.service";
import {LasuExclusion} from "../models/lasu-exclusion";
import {LasuRestrictionService} from "../lasu-restriction.service";
import {SortFilterPagination} from "../../../generic-components/pagination/pagination";

@Component({
  selector: 'tr-lasu-offenderprofile-exclusion',
  templateUrl: 'lasu-offenderprofile-exclusion-add.component.html'
})

export class LasuOffenderprofileExclusionAddComponent implements OnInit {
  exclusionAddForm: FormGroup;
  action: string;
  lasuExclusionList: LasuExclusion[] = [];
  personData: any;
  userId;
  profileId;
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private _fb: FormBuilder, private dataService: DataService, private listService: ListService,
              private lasuExclusionService: LasuExclusionService, private router: Router, private route: ActivatedRoute,
              private headerService: HeaderService, private confirmService: ConfirmService,
              private lasuRestrictionService: LasuRestrictionService) {

  }

  ngOnInit() {
    if (this.route.snapshot.params['profileId']) {
      this.profileId = this.route.snapshot.params['profileId'];
    }
    let path = this.route.snapshot.url.join('/').indexOf('exclusion/new');
    if (path != -1) {
      this.action = 'Create';
    }
    else {
      this.action = 'Update';
    }

    this.userId = this.dataService.getLoggedInUserId();

    this.listService.getListDataByLookupAndPkValue(0, 537, this.userId).subscribe(data => {
      this.personData = data;
    });

    this.lasuExclusionService.getLasuExclusions(this.profileId).subscribe(data => {
      this.lasuExclusionList = data;
    });

    this.exclusionAddForm = this._fb.group({
      excludedStaffId: [''],
      exclusionReasonId: ['', Validators.compose([Validators.required])],
      exclusionStartDate: ['', Validators.compose([Validators.required, ValidationService.dateValidator])],
      exclusionEndDate: ['', Validators.compose([ValidationService.dateValidator])],
      profileId: ['']
    });

    if (this.profileId) {
      this.exclusionAddForm.controls['profileId'].patchValue(this.profileId);
    }
  }

  navigateTo(url) {
    if (this.exclusionAddForm.touched) {
      this.confirmService.confirm(
        {
          message: 'Do you want to leave this page without saving?',
          header: 'Confirm',
          accept: () => {
            this.router.navigate(url, {relativeTo: this.route});
          }
        });
    } else {
      this.router.navigate(url, {relativeTo: this.route});
      return false;
    }
  }

  addExclusionToList() {
    if (this.exclusionAddForm.valid) {
      let lasuExclusion: LasuExclusion = this.exclusionAddForm.value;
      lasuExclusion = this.updateDates(lasuExclusion);
      this.lasuExclusionService.validateLasuExclusions(lasuExclusion).subscribe(response => {
          if (response) {
            if(this.checkExclusionList(lasuExclusion)){
              this.lasuExclusionList.unshift(lasuExclusion);
              this.exclusionAddForm.reset();
            }else{
              this.headerService.setErrorPopup({'errorMessage': 'The Exclusion is already active'});
            }
          }
        }
      );
    }
  }

  endExclusion(lasuExclusion: LasuExclusion) {
    this.lasuExclusionService.endLasuExclusions(lasuExclusion.lasuExclusionId).subscribe(result => {
      if (result) {
        this.headerService.setErrorPopup({'errorMessage': 'The Exclusion has been ended'});
        this.lasuExclusionService.getLasuExclusions(this.profileId).subscribe(data => {
          this.lasuExclusionList = data;
        });
      }
      else {
        this.headerService.setErrorPopup({'errorMessage': 'Error in ending Restriction'});
      }
    });
  }

  onSubmit() {
    if (this.lasuExclusionList.length < 1) {
      this.headerService.setErrorPopup({'errorMessage': 'No persons have been added to the list'});
    }
    else {
      if (this.lasuExclusionList) {
        this.lasuExclusionList.forEach(element => {
          element.profileId = this.profileId;
        });
      }
      if (this.action == 'Update') {
        let lasuExclusionUpdateList = this.lasuExclusionList.filter(element => !element.lasuExclusionId);

        if (lasuExclusionUpdateList) {
          this.lasuExclusionService.updateLasuExclusions(lasuExclusionUpdateList).subscribe((response: any) => {
            this.router.navigate(['../../..'], {relativeTo: this.route});
          });
        }
        else {
          this.router.navigate(['../../..'], {relativeTo: this.route});
        }
      } else {
        let lasuExclusionAddList = this.lasuExclusionList.filter(element => !element.lasuExclusionId);
        this.lasuExclusionService.addLasuExclusions(lasuExclusionAddList).subscribe((response: any) => {
          this.router.navigate(['../../..'], {relativeTo: this.route});
        });
      }
    }
  }

  getPersonName(personId: any) {
    if (personId && this.personData) {
      let person = this.personData.find(element => element.key == personId);
      return person.value;
    }
  }

  updateDates(lasuExclusion: LasuExclusion): LasuExclusion {
    if (lasuExclusion.exclusionStartDate) {
      lasuExclusion.exclusionStartDate = this.prepareDate(Utility.convertStringToDate(lasuExclusion.exclusionStartDate), 0, 0, 0);
    }
    if (lasuExclusion.exclusionEndDate) {
      lasuExclusion.exclusionEndDate = this.prepareDate(Utility.convertStringToDate(lasuExclusion.exclusionEndDate), 23, 59, 59);
    }
    return lasuExclusion;
  }

  prepareDate(inputDate: Date, hours, minutes, seconds) {
    return Utility.convertDateToString(inputDate) + " " + hours + ":" + minutes + ":" + seconds;
  }

  convertStringToDate(stringDate) {
    if (stringDate != null && stringDate != "") {
      let dateTime = stringDate.split(' ');
      let date = dateTime[0].split('/');
      let time = dateTime[1].split(':');
      return new Date(date[2], date[1] - 1, date[0], time[0], time[1], time[2]);
    }
    return null;
  }

  checkExclusionList(lasuExclusion: LasuExclusion): boolean {
    let lasuExclusionList: LasuExclusion[] = this.lasuExclusionList.filter(element => element.active || element.lasuExclusionId == null);

    if (lasuExclusion && lasuExclusionList.length > 0) {
      for (let index = 0; index < lasuExclusionList.length; index++) {
        if (lasuExclusionList[index].excludedStaffId == lasuExclusion.excludedStaffId) {
          if (lasuExclusionList[index].exclusionEndDate == "") {
            if (lasuExclusion.exclusionEndDate == "") {
              return false;
            }
            else {
              return (lasuExclusion.exclusionEndDate < lasuExclusionList[index].exclusionStartDate);
            }
          }
          else {
            if (lasuExclusion.exclusionEndDate == "") {
              return (lasuExclusion.exclusionEndDate > lasuExclusionList[index].exclusionEndDate);
            }
            else {
              return (lasuExclusion.exclusionStartDate > lasuExclusionList[index].exclusionEndDate || lasuExclusion.exclusionEndDate < lasuExclusionList[index].exclusionEndDate);
            }
          }
        }
        else {
          return true;
        }
      }
    }
    else {
      return true;
    }
  }

  sort(sortObj) {
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.lasuExclusionList.sort((e1, e2) => {
      if (sortObj.field == 'user') {
        if (sortObj.sort == 'asc')
          return this.compareFields(this.getPersonName(e1.excludedStaffId), this.getPersonName(e2.excludedStaffId));
        if (sortObj.sort == 'desc')
          return this.compareFields(this.getPersonName(e2.excludedStaffId), this.getPersonName(e1.excludedStaffId));
      }
      if (sortObj.field == 'startDate') {
        if (sortObj.sort == 'asc')
          return this.compareFields(e1.exclusionStartDate, e2.exclusionStartDate);
        if (sortObj.sort == 'desc')
          return this.compareFields(e2.exclusionStartDate, e1.exclusionStartDate);
      }
      if (sortObj.field == 'endDate') {
        if (sortObj.sort == 'asc')
          return this.compareFields(e1.exclusionEndDate, e2.exclusionEndDate);
        if (sortObj.sort == 'desc')
          return this.compareFields(e2.exclusionEndDate, e1.exclusionEndDate);
      }
      if (sortObj.field == 'action') {
        if (sortObj.sort == 'asc')
          return this.compareFields(e1.active, e2.active);
        if (sortObj.sort == 'desc')
          return this.compareFields(e2.active, e1.active);
      }
    });
  }

  compareFields(e1, e2): number {
    if (e1 > e2)
      return 1;
    else if (e1 < e2)
      return -1;
    return 0;
  }
}
