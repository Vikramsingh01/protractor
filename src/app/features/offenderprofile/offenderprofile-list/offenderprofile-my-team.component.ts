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
import {Title} from "@angular/platform-browser";
import {HeaderService} from "../../../views/header/header.service";
@Component({
  selector: 'tr-offenderprofile-my-team',
  templateUrl: 'offenderprofile-my-team.component.html',

  providers: [OffenderProfileService],

})
export class OffenderProfileMyTeamComponent implements OnInit {

  @Input() offenderProfileId: number;

  offenderProfiles: any[];
  offenderProfileFilterForm: FormGroup;
  titleList:any[];
  genderList:any[];
  transgenderProcessList:any[];
  immigrationStatusList:any[];
  nationalityList:any[];
  ethnicityList:any[];
  languageList:any[];
  religionList:any[];
  secondNatioNalityList:any[];
  sexualOrientationList:any[];
  tireList:any[];
  providerList:any[];
  teamList:any[];
  officerList:any[];
  private subscription: Subscription;
  private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();
  constructor(private _titleService: Title,
    private router: Router,
		private route: ActivatedRoute,
    private offenderProfileService: OffenderProfileService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private _fb: FormBuilder,
    private headerService: HeaderService) {
  }

  ngOnInit() {
  this._titleService.setTitle('Team Service Users');

    this.listService.getListData(2).subscribe(genderList=>{
       this.genderList = genderList
     });

     this.listService.getListDataByLookupAndPkValue(270, 502, 0).subscribe(listObj => {
        this.officerList = listObj;
      })

   this.listService.getListData(193).subscribe(providerList=>{
       this.providerList = providerList
   });

   this.listService.getListDataByLookupAndPkValue(445, 501, 0).subscribe(listObj => {
          this.teamList = listObj;
    })


	let offenderProfile: OffenderProfile = new OffenderProfile();

  let sortFields: any[] = [];
  sortFields.push({field: "familyName", sort: "asc" }, {field: "firstName", sort: "asc" });

  this.authorizationService.getAuthorizationData(OffenderProfileConstants.featureId,OffenderProfileConstants.tableId).map(res => {
	if (res.length > 0) {
		this.dataService.addFeatureActions(OffenderProfileConstants.featureId, res[0]);
		this.dataService.addFeatureFields(OffenderProfileConstants.featureId, res[1]);
	}
	}).flatMap(data=>this.offenderProfileService.sortFilterAndPaginateForTeam(offenderProfile, this.sortFilterPaginationObj.paginationObj, sortFields)).subscribe(data=>{
      this.offenderProfiles = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = offenderProfile;
    })
    this.offenderProfileFilterForm = this._fb.group({
      firstName: [''],
      familyName: [''],
      caseReferenceNumber: [''],
      pncNumber: []
    })
  }

  reset(){
    this.offenderProfileFilterForm.reset();
    let offenderProfile: OffenderProfile = new OffenderProfile();
    let sortFields: any[] = [];
    sortFields.push({field: "familyName", sort: "asc" }, {field: "firstName", sort: "asc" });
    this.sortFilterPaginationObj.paginationObj.number=0;
    this.offenderProfileService.sortFilterAndPaginateForTeam(offenderProfile, this.sortFilterPaginationObj.paginationObj, sortFields).subscribe((data: any)=>{
      this.offenderProfiles = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
      this.sortFilterPaginationObj.filterObj = offenderProfile;
      this.sortFilterPaginationObj.sortObj.field = "";
    })
  }
    searchOffenderProfile() {
      let sortFields: any[] = [];
      this.sortFilterPaginationObj.paginationObj.number=0;
      sortFields.push({field: "familyName", sort: "asc" }, {field: "firstName", sort: "asc" });
      this.offenderProfileService.sortFilterAndPaginateForTeam(this.offenderProfileFilterForm.value,this.sortFilterPaginationObj.paginationObj, sortFields).subscribe((data: any) => {

      if(data ==0){
        alert("There is no record present for selected input...");
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

    this.offenderProfileService.sortFilterAndPaginateForTeam(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.offenderProfiles = data.content;
      this.sortFilterPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(OffenderProfileConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(OffenderProfileConstants.featureId, field, "Read");
  }

  notAuthorizedLasuHeaderservice(){
    this.headerService.setErrorPopup({'errorMessage': 'Access is restricted to this service user please contact a system administrator'});
  }
}
