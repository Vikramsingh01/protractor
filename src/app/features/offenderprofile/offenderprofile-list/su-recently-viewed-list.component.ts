import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from "rxjs/Rx";
import { OffenderProfileService } from "../offenderprofile.service";
import { OffenderProfile } from "../offenderprofile";
import { OffenderProfileConstants } from '../offenderprofile.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { SortFilterPagination } from '../../../generic-components/pagination/pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-offenderprofile-my-crc',
  templateUrl: 'su-recently-viewed-list.component.html',

  providers: [OffenderProfileService],

})
export class SURecentViewedListComponent implements OnInit {

  @Input() offenderProfileId: number;

  offenderProfiles: any[];
  offenderProfileFilterForm: FormGroup;
  titleList: any[];
  genderList: any[];
  transgenderProcessList: any[];
  immigrationStatusList: any[];
  nationalityList: any[];
  ethnicityList: any[];
  languageList: any[];
  religionList: any[];
  secondNatioNalityList: any[];
  sexualOrientationList: any[];
  tireList: any[];
  providerList: any[];
  teamList: any[];
  officerList: any[];
  userId;
  private subscription: Subscription;
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private _titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private offenderProfileService: OffenderProfileService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private _fb: FormBuilder) {
  }

  ngOnInit() {
     this.initForm();
    this.userId = this.dataService.getLoggedInUserId();
    this._titleService.setTitle('CRC Service Users');

    this.listService.getListData(2).subscribe(genderList => {
      this.genderList = genderList
    });

    this.listService.getListDataByLookupAndPkValue(270, 502, 0).subscribe(listObj => {
      this.officerList = listObj;
    })

    this.listService.getListData(193).subscribe(providerList => {
      this.providerList = providerList
    });

    this.listService.getListDataByLookupAndPkValue(445, 501, 0).subscribe(listObj => {
      this.teamList = listObj;
    })


    let offenderProfile: OffenderProfile = new OffenderProfile();

  this.offenderProfileService.sortFilterAndPaginateRecentlyViewed(offenderProfile, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.offenderProfiles = data;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = offenderProfile;
          
        })
  }

  reset() {
    this.offenderProfileFilterForm.reset();
    let offenderProfile: OffenderProfile = new OffenderProfile();
    let sortFields: any[] = [];
    sortFields.push({ field: "familyName", sort: "asc" }, { field: "firstName", sort: "asc" });
    this.sortFilterPaginationObj.paginationObj.number = 0;
    this.offenderProfileService.sortFilterAndPaginateRecentlyViewed(offenderProfile, this.sortFilterPaginationObj.paginationObj, sortFields).subscribe((data: any) => {
      this.offenderProfiles = data;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = offenderProfile;
      this.sortFilterPaginationObj.sortObj.field = "";
    })
  }
  searchOffenderProfile() {
    let sortFields: any[] = [];
    sortFields.push({ field: "familyName", sort: "asc" }, { field: "firstName", sort: "asc" });
    this.offenderProfileService.sortFilterAndPaginateRecentlyViewed(this.offenderProfileFilterForm.value, this.sortFilterPaginationObj.paginationObj, sortFields).subscribe((data: any) => {

      if (data == 0) {
        alert("There is no record present for selected input...");
      }
      else {
        this.offenderProfiles = data;
        this.sortFilterPaginationObj.paginationObj = data;
        this.sortFilterPaginationObj.filterObj = this.offenderProfileFilterForm.value;
      }

    })
  }

  sort(sortObj) {
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
  }

  paginate(paginationObj) {
    let sortFields: any[] = [];
    sortFields.push({ field: "familyName", sort: "asc" }, { field: "firstName", sort: "asc" });

    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, sortFields);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    this.offenderProfileService.sortFilterAndPaginateRecentlyViewed(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.offenderProfiles = data;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(OffenderProfileConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(OffenderProfileConstants.featureId, field, "Read");
  }

  initForm() {
    this.offenderProfileFilterForm = this._fb.group({
      firstName: [''],
      familyName: [''],
      caseReferenceNumber: [''],
      pncNumber: [],
      officeTeamId: ['']
    })
  }
}
