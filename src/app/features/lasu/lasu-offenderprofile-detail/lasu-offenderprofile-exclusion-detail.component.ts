import {Component, OnInit} from "@angular/core";
import {LasuExclusionService} from "../lasu-exclusion.service";
import {LasuExclusion} from "../models/lasu-exclusion";
import {ListService} from "../../../services/list.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {SortFilterPagination} from "../../../generic-components/pagination/pagination";

@Component({
  selector: 'tr-lasu-offenderprofile-exclusion',
  templateUrl: 'lasu-offenderprofile-exclusion-detail.component.html',

  providers: [LasuExclusionService],

})
export class LasuOffenderprofileExclusionDetailComponent implements OnInit {

  profileId: any;
  lasuExclusionList: LasuExclusion[] = [];
  personData: any;
  sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();

  constructor (private route: ActivatedRoute, private lasuExclusionService: LasuExclusionService, private listService: ListService,
               private dataService: DataService){
  }

  ngOnInit(){
    this.profileId = this.route.snapshot.params['profileId'];

    this.listService.getListDataByLookupAndPkValue(0, 537, this.dataService.getLoggedInUserId()).subscribe(data => {
      this.personData = data;
    });

    this.lasuExclusionService.getLasuExclusions(this.profileId).subscribe( data=> {
      this.lasuExclusionList = data;
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
