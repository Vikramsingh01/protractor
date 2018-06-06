import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { OffenderProfile } from "../offenderprofile";
import { OffenderProfileSummary } from './offenderprofile-summary';
import { OffenderProfileService } from '../offenderprofile.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { OffenderProfileConstants } from '../offenderprofile.constants';
import { EventComponent } from '../../event';
import{ addressService } from '../../address/address.service';
import{ Address } from '../../address/address';
import{ AliasService } from '../../alias/alias.service';
import { ListService } from '../../../services/list.service';
import { OffenderDisabilityService } from '../../offender-disability/offender-disability.service';
import { OffenderDisability } from '../../offender-disability/offender-disability';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-offenderprofile-summary',
  templateUrl: 'offenderprofile-summary.component.html',
  providers: [OffenderProfileService, addressService, OffenderDisabilityService]
})
export class OffenderProfileSummaryComponent implements OnInit {

  private subscription: Subscription;
  offenderProfileSummary : OffenderProfileSummary = new OffenderProfileSummary();;
  offenderProfile : OffenderProfile;
  private profileId: number;
  private show=true;
  teamList:any[];
  prisonLocationList: any[];
  officerList:any[];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  offenderDisabilitys: OffenderDisability[];

  address: Address = new Address();

  constructor(
    private _titleService: Title,
    private route: ActivatedRoute, private dataService: DataService,
    private headerService: HeaderService, private offenderProfileService: OffenderProfileService, private authorizationService: AuthorizationService,
    private addressService : addressService, private aliasService: AliasService,private offenderDisabilityService: OffenderDisabilityService,
    private listService: ListService) { }

  ngOnInit() {
    this._titleService.setTitle('SU Details');
    this.sortSearchPaginationObj.paginationObj.size=1;

    this.subscription = this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
      this.offenderProfileService.getOffenderProfileSummaryByProfileId(this.profileId).subscribe((data: OffenderProfile) => {

          this.offenderProfile = data;
          this.headerService.publishOffenderDetailsData(this.offenderProfile);
          this.offenderProfileSummary.name = this.offenderProfile.firstName + " " +this.offenderProfile.familyName;
          this.offenderProfileSummary.dateOfBirth = this.offenderProfile.dateOfBirth;
          this.offenderProfileSummary.mobileNumber = this.offenderProfile.mobileNumber;
          this.offenderProfileSummary.pncNumber = this.offenderProfile.pncNumber;
          this.offenderProfileSummary.ethnicityId = this.offenderProfile.ethnicityId;
          this.offenderProfileSummary.nationalityId = this.offenderProfile.nationalityId;
          this.offenderProfileSummary.teamId = this.offenderProfile.teamId;
          this.offenderProfileSummary.caseManagerId = this.offenderProfile.caseManagerId;
          this.offenderProfileSummary.note = this.offenderProfile.note;
          this.offenderProfileSummary.offenderManagerResponsibleOfficer = this.offenderProfile.offenderManagerResponsibleOfficer;

         this.listService.getListDataByLookupAndPkValue(445, 501, 0).subscribe(listObj => {
                this.teamList = listObj;
          })

          this.listService.getListDataByLookupAndPkValue(270, 502, 0).subscribe(listObj => {
            this.officerList = listObj;
          })

          // this.offenderProfileSummary.alias="Not Recorded";
           this.aliasService.getAliasForOffender(this.profileId ).subscribe(aliasData => {
               if(aliasData != null && aliasData != undefined && aliasData.aliasId != null){
                  this.offenderProfileSummary.alias="Alias Recorded";
              }
          })

          let offenderDisability: OffenderDisability = new OffenderDisability();
          offenderDisability.profileId=this.profileId;
          this.offenderDisabilityService.sortFilterAndPaginate(offenderDisability, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((data: any) => {
            this.offenderDisabilitys = data.content;

            if(this.offenderDisabilitys != null && this.offenderDisabilitys.length > 0 ){
              this.offenderProfileSummary.accessibilityStatus="Disability Recorded";
            }
          });


          this.offenderProfileService.getOffenderPrisonLocationId(this.profileId).subscribe((prisonLocationData: any) => {
              this.offenderProfileSummary.prisonLocationId = prisonLocationData.prisonlLocationId;
          })

      },
       (errors)=>{
        // console.log(errors);
       this.show=false
        //this.headerService.setAlertPopup(errors.json().message)
     });
    })
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(OffenderProfileConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(OffenderProfileConstants.featureId, field, "Read");
  }

}
