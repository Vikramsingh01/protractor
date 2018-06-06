import {Component, OnInit} from "@angular/core";
import {LasuRestrictionService} from "../lasu-restriction.service";
import {ActivatedRoute} from "@angular/router";
import {LasuRestriction} from "../models/lasu-restriction";
import {ListService} from "../../../services/list.service";
import {DataService} from "../../../services/data.service";
import {SortFilterPagination} from "../../../generic-components/pagination/pagination";

@Component({
  selector: 'tr-lasu-offenderprofile-restriction-detail',
  templateUrl: 'lasu-offenderprofile-restriction-detail.component.html',

  providers: [LasuRestrictionService, ListService],

})
export class LasuOffenderprofileRestrictionDetailComponent implements OnInit {

  profileId: any;
  lasuRestrictionList: LasuRestriction[] = [];
  personData: any;
  sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor( private route: ActivatedRoute, private lasuRestrictionService: LasuRestrictionService, private listService: ListService,
               private dataService: DataService){}

  ngOnInit(){
    this.profileId = this.route.snapshot.params['profileId'];

    this.listService.getListDataByLookupAndPkValue(0, 537, this.dataService.getLoggedInUserId()).subscribe(data => {
      this.personData = data;
    });

    this.lasuRestrictionService.getLasuRestrictions(this.profileId).subscribe( data=> {
      this.lasuRestrictionList = data;
    });

  }

  getPersonName(personId: any) {
    if (personId && this.personData) {
      let person = this.personData.find(element => element.key == personId);
      return person.value;
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
      if (sortObj.field == 'status') {
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
