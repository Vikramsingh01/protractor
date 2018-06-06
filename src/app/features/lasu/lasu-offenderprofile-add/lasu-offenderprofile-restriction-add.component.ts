import {Component, OnInit} from '@angular/core';
import {LasuRestrictionService} from "../lasu-restriction.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {ListService} from "../../../services/list.service";
import {Utility} from "../../../shared/utility";
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderService} from "../../../views/header/header.service";
import {ConfirmService} from "../../../generic-components/confirm-box/confirm.service";
import {ValidationService} from "../../../generic-components/control-messages/validation.service";
import {LasuRestriction} from "../models/lasu-restriction";
import {LasuExclusionService} from "../lasu-exclusion.service";
import {SortFilterPagination} from "../../../generic-components/pagination/pagination";

@Component({
  selector: 'tr-lasu-offenderprofile-restriction',
  templateUrl: 'lasu-offenderprofile-restriction-add.component.html'
})

export class LasuOffenderprofileRestrictionAddComponent implements OnInit {

  restrictionAddForm: FormGroup;
  action: string;
  lasuRestrictionList: LasuRestriction[] = [];
  personData: any;
  userId;
  profileId;
  sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor(private _fb: FormBuilder, private dataService: DataService, private listService: ListService,
              private lasuRestrictionService: LasuRestrictionService, private router: Router, private route: ActivatedRoute,
              private headerService: HeaderService, private confirmService: ConfirmService,
              private lasuExclusionService: LasuExclusionService) {
  }

  ngOnInit() {
    if (this.route.snapshot.params['profileId']) {
      this.profileId = this.route.snapshot.params['profileId'];
    }
    let path = this.route.snapshot.url.join('/').indexOf('restriction/new');
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

    this.lasuRestrictionService.getLasuRestrictions(this.profileId).subscribe(data => {
      this.lasuRestrictionList = data;
    });

    this.restrictionAddForm = this._fb.group({
      restrictedStaffId: ['', Validators.required],
      restrictionReasonId: ['', Validators.compose([Validators.required])],
      restrictionStartDate: ['', Validators.compose([Validators.required, ValidationService.dateValidator])],
      restrictionEndDate: ['', ValidationService.dateValidator]
    });
  }

  navigateTo(url) {
    if (this.restrictionAddForm.dirty) {
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

  addRestrictionToList() {
    if (this.restrictionAddForm.valid) {
      let lasuRestriction: LasuRestriction = this.restrictionAddForm.value;
      lasuRestriction = this.updateDates(lasuRestriction);
      this.lasuRestrictionService.validateLasuRestrictions(lasuRestriction).subscribe(response => {
          if (response) {
            if (this.checkRestrictionList(lasuRestriction)) {
              this.lasuRestrictionList.unshift(lasuRestriction);
              this.restrictionAddForm.reset();
            }
            else {
              this.headerService.setErrorPopup({'errorMessage': 'The Restriction is already active'});
            }
          }
        }
      );
    }
  }

  endRestriction(lasuRestriction: LasuRestriction) {
    this.lasuRestrictionService.endLasuRestrictions(lasuRestriction.lasuRestrictionId).subscribe(result => {
      if (result) {
        this.headerService.setErrorPopup({'errorMessage': 'The restriction has been ended'});
        this.lasuRestrictionService.getLasuRestrictions(this.profileId).subscribe(data => {
          this.lasuRestrictionList = data;
        });
      }
      else {
        this.headerService.setErrorPopup({'errorMessage': 'Error in ending Restriction'});
      }
    });
  }

  onSubmit() {
    if (this.lasuRestrictionList.length < 1) {
      this.headerService.setErrorPopup({'errorMessage': 'No persons have been added to the list'});
    }
    else {
      if (this.lasuRestrictionList) {
        this.lasuRestrictionList.forEach(element => {
          element.profileId = this.profileId;
        });
      }

      if (this.action == 'Update') {
        let lasuRestrictionUpdateList = this.lasuRestrictionList.filter(element => !element.lasuRestrictionId);

        if (lasuRestrictionUpdateList) {
          this.lasuRestrictionService.updateLasuRestrictions(lasuRestrictionUpdateList).subscribe((response: any) => {
            this.router.navigate(['../../..'], {relativeTo: this.route});
          });
        }
        else {
          this.router.navigate(['../../..'], {relativeTo: this.route});
        }
      } else {
        let lasuRestrictionAddList = this.lasuRestrictionList.filter(element => !element.lasuRestrictionId);
        this.lasuRestrictionService.addLasuRestrictions(lasuRestrictionAddList).subscribe((response: any) => {
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

  updateDates(lasuRestriction: LasuRestriction): LasuRestriction {
    if (lasuRestriction.restrictionStartDate) {
      lasuRestriction.restrictionStartDate = this.prepareDate(Utility.convertStringToDate(lasuRestriction.restrictionStartDate), 0, 0, 0);
    }
    if (lasuRestriction.restrictionEndDate) {
      lasuRestriction.restrictionEndDate = this.prepareDate(Utility.convertStringToDate(lasuRestriction.restrictionEndDate), 23, 59, 59);
    }
    return lasuRestriction;
  }

  prepareDate(inputDate: Date, hours, minutes, seconds) {
    return Utility.convertDateToString(inputDate) + " " + hours + ":" + minutes + ":" + seconds;
  }

  convertStringToDate(stringDate) {
    if (stringDate != null && stringDate != "") {
      let dateTime = stringDate.split(' ');
      let date = dateTime[0].split('/');
      let time = dateTime[1].split(':');
      return new Date(date[2], date[1] - 1, date[0], time[0], time[1], time[2]).toUTCString();
    }
    return null;
  }

  checkRestrictionList(lasuRestriction: LasuRestriction): boolean {
    let lasuRestrictionList: LasuRestriction[] = this.lasuRestrictionList.filter(element => element.active || element.lasuRestrictionId == null);

    if (lasuRestriction && lasuRestrictionList.length > 0) {
      for (let index = 0; index < lasuRestrictionList.length; index++) {
        if (lasuRestrictionList[index].restrictedStaffId == lasuRestriction.restrictedStaffId) {
          if (lasuRestrictionList[index].restrictionEndDate == "") {
            if (lasuRestriction.restrictionEndDate == "") {
              return false;
            }
            else {
              return (lasuRestriction.restrictionEndDate < lasuRestrictionList[index].restrictionStartDate)
            }
          }
          else {
            if (lasuRestriction.restrictionEndDate == "") {
              return (lasuRestriction.restrictionStartDate > lasuRestrictionList[index].restrictionEndDate);
            }
            else {
              return (lasuRestriction.restrictionStartDate > lasuRestrictionList[index].restrictionEndDate || lasuRestriction.restrictionEndDate < lasuRestrictionList[index].restrictionStartDate);
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
    this.lasuRestrictionList.sort((e1, e2) => {
      if (sortObj.field == 'user') {
        if (sortObj.sort == 'asc')
          return this.compareFields(this.getPersonName(e1.restrictedStaffId), this.getPersonName(e2.restrictedStaffId));
        if (sortObj.sort == 'desc')
          return this.compareFields(this.getPersonName(e2.restrictedStaffId), this.getPersonName(e1.restrictedStaffId));
      }
      if (sortObj.field == 'startDate') {
        if (sortObj.sort == 'asc')
          return this.compareFields(e1.restrictionStartDate, e2.restrictionStartDate);
        if (sortObj.sort == 'desc')
          return this.compareFields(e2.restrictionStartDate, e1.restrictionStartDate);
      }
      if (sortObj.field == 'endDate') {
        if (sortObj.sort == 'asc')
          return this.compareFields(e1.restrictionEndDate, e2.restrictionEndDate);
        if (sortObj.sort == 'desc')
          return this.compareFields(e2.restrictionEndDate, e1.restrictionEndDate);
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
