import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from "rxjs/Rx";
import {TokenService} from '../../../services/token.service';
import {DataService} from '../../../services/data.service';
import {AuthorizationService} from '../../../services/authorization.service';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationGuard} from '../../../guards/authentication.guard';
import {ListService} from '../../../services/list.service';
import {SortFilterPagination} from '../../../generic-components/pagination/pagination';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {LasuRestrictionService} from "../lasu-restriction.service";
import {LasuOffenderProfile} from "../lasu-offenderprofile";
import {LasuConstants} from "../lasu.constants";
import {HeaderService} from "../../../views/header/header.service";

@Component({
  selector: 'tr-lasu-offenderprofile-my-crc',
  templateUrl: 'lasu-offenderprofile-list.component.html',

  providers: [LasuRestrictionService],

})
export class LasuOffenderprofileListComponent implements OnInit {

  @Input() offenderProfileId: number;

  offenderProfiles: any[];
  offenderProfileFilterForm: FormGroup;
  genderList:any[];
  providerList:any[];
  teamList:any[];
  officerList:any[];
  userId;
  private subscription: Subscription;
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();
  constructor(private _titleService: Title,
              private router: Router,
              private route: ActivatedRoute,
              private offenderProfileService: LasuRestrictionService,
              private dataService: DataService,
              private tokenService: TokenService,
              private authorizationService: AuthorizationService,
              private authenticationGuard: AuthenticationGuard,
              private listService: ListService,
              private _fb: FormBuilder,
              private headerService: HeaderService) {
  }

  ngOnInit() {
    this.userId = this.dataService.getLoggedInUserId();
    this._titleService.setTitle('CRC Service Users');

    this.listService.getListData(2).subscribe(genderList=>{
      this.genderList = genderList
    });

    this.listService.getListDataByLookupAndPkValue(270, 502, 0).subscribe(listObj => {
      this.officerList = listObj;
    });

    this.listService.getListData(193).subscribe(providerList=>{
      this.providerList = providerList
    });

    this.listService.getListDataByLookupAndPkValue(445, 501, 0).subscribe(listObj => {
      this.teamList = listObj;
    });


    let offenderProfile: LasuOffenderProfile = new LasuOffenderProfile();

    let sortFields: any[] = [];
    sortFields.push({field: "familyName", sort: "asc" }, {field: "firstName", sort: "asc" });

    this.authorizationService.getAuthorizationData(LasuConstants.featureId,LasuConstants.tableId).map(res => {
      if (res.length > 0) {
        this.dataService.addFeatureActions(LasuConstants.featureId, res[0]);
        this.dataService.addFeatureFields(LasuConstants.featureId, res[1]);
      }
    }).flatMap(data=>this.offenderProfileService.sortFilterAndPaginateForCrc(offenderProfile, this.sortFilterPaginationObj.paginationObj, sortFields)).subscribe(data=>{
      this.offenderProfiles = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = offenderProfile;
    });
    this.offenderProfileFilterForm = this._fb.group({
      firstName: [''],
      familyName: [''],
      caseReferenceNumber: [''],
      pncNumber: [],
      officeTeamId: [''],
      isLasu: false
    })
  }

  reset(){
    this.offenderProfileFilterForm.reset();
    let offenderProfile: LasuOffenderProfile = new LasuOffenderProfile();
    let sortFields: any[] = [];
    sortFields.push({field: "familyName", sort: "asc" }, {field: "firstName", sort: "asc" });
    this.sortFilterPaginationObj.paginationObj.number=0;
    this.offenderProfileService.sortFilterAndPaginateForCrc(offenderProfile, this.sortFilterPaginationObj.paginationObj, sortFields).subscribe((data: any)=>{
      this.offenderProfiles = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = offenderProfile;
      this.sortFilterPaginationObj.sortObj.field = "";
    })
  }
  searchOffenderProfile() {
    let sortFields: any[] = [];
    sortFields.push({field: "familyName", sort: "asc" }, {field: "firstName", sort: "asc" });
    this.offenderProfileService.sortFilterAndPaginateForCrc(this.offenderProfileFilterForm.value,this.sortFilterPaginationObj.paginationObj, sortFields).subscribe((data: any) => {

      if(data ==0){
        this.headerService.setErrorPopup({'errorMessage': 'There is no record present for selected input...'});
      }
      else{
        this.offenderProfiles = data.content;
        this.sortFilterPaginationObj.paginationObj = data;
        this.sortFilterPaginationObj.filterObj = this.offenderProfileFilterForm.value;
      }

    })
  }

  sort(sortObj){
    this.sortFilterPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    let sortFields: any[] = [];
    sortFields.push({field: "familyName", sort: "asc" }, {field: "firstName", sort: "asc" });

    this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, sortFields);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){

    this.offenderProfileService.sortFilterAndPaginateForCrc(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.offenderProfiles = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(LasuConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(LasuConstants.featureId, field, "Read");
  }

  checkIsLasu(offenderProfile: LasuOffenderProfile): boolean {
    return (offenderProfile.hasActiveRestrictions == true || offenderProfile.hasActiveExclusions == true);
  }

  changeLasu(pref){
    if(pref == "limited_access"){
      this.offenderProfileFilterForm.controls['isLasu'].patchValue(true);
    }
    else{
      this.offenderProfileFilterForm.controls['isLasu'].patchValue(false);
    }
  }
}
