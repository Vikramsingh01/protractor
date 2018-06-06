import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import { Title } from "@angular/platform-browser";
import { Offloc } from '../offloc';
import { Utility } from '../../../shared/utility';
import { OfflocRequestService } from '../offloc-request.service';
import { OfflocResponseService } from '../offloc-response.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { OfflocConstants } from '../offloc.constants';
import { OffenderProfileService } from '../../offenderprofile/offenderprofile.service';
import { CustodyLocationService } from '../../custody-location/custody-location.service';
import { CustodyKeyDateService } from '../../custody-key-date/custody-key-date.service';
import { ReleaseService } from '../../release/release.service';
import { PssRequirementService } from '../../pss-requirement/pss-requirement.service';
import { Location } from '@angular/common';

@Component({
  selector: 'tr-offloc-detail',
  templateUrl: 'offloc-detail.component.html'
})
export class OfflocDetailComponent implements OnInit {

  private subscription: Subscription;
  offlocResponse: Offloc;
  cmsOffenderProfile: any;
  private offlocResponseId: number;
  private profileId: number;
  private eventId: number;
  private custodyKeyDateList: any[] = [];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private paroleCustodyKeyDate;
  private licenceCustodyKeyDate;
  private sentenceCustodyKeyDate;
  private hdcCustodyKeyDate;
  private expectedReleaseDateCustodyKeyDate;
  private conditionalCustodyKeyDate;
  private pssCustodyKeyDate;
  private pssRequirement;
  private custodyLocation;

   constructor(private route: ActivatedRoute,
      private router: Router,
      private authorizationService: AuthorizationService,
      private dataService: DataService,
      private offlocRequestService: OfflocRequestService,
      private offlocResponseService: OfflocResponseService,
      private offenderProfileService: OffenderProfileService,
      private custodyLocationService: CustodyLocationService,
      private custodyKeyDateService: CustodyKeyDateService,
      private releaseService: ReleaseService,
      private pssRequirementService: PssRequirementService,
      private headerService: HeaderService,
      private listService: ListService,
      private titleService: Title,
  private location: Location) { }

  ngOnInit() {
    this.titleService.setTitle("DSS Comparison");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.offlocResponseId = params['offlocResponseId'];
      this.profileId = params['profileId'];
      this.eventId = params['eventId'];
       //this.authorizationService.getAuthorizationDataByTableId(OfflocConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(OfflocConstants.featureId, OfflocConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(OfflocConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(OfflocConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(OfflocConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(OfflocConstants.featureId, "Read");
        if (this.authorizedFlag) {
          let observables: Observable<any>[] = [];
          
          observables.push(this.custodyLocationService.getCustodyLocationByEventId(this.eventId).catch(error => { return Observable.of({})}));
          observables.push(this.custodyKeyDateService.sortFilterAndPaginate({eventId: this.eventId }, null, null).catch(error => { return Observable.of({content:[]})}));
          observables.push(this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).catch(error => { return Observable.of({})}));
          observables.push(this.offlocResponseService.getOfflocResponse(this.offlocResponseId).catch(error => { return Observable.of({})}));
          Observable.forkJoin(observables).subscribe(data => {

            this.custodyLocation = data[0];
            this.custodyKeyDateList = data[1].content;
            this.cmsOffenderProfile = data[2];
            this.offlocResponse = data[3];

            let paroleKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'PED');
            let licenceKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'LED');
            let sentenceKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'SED');
            let hdcKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'HDE');
            let expectedReleaseDateKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'EXP');
            let conditionalKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'ACR');
            let pssKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'PSSED');
            this.paroleCustodyKeyDate = Utility.getObjectFromArrayByKeyAndValue(this.custodyKeyDateList, 'keyDateTypeId', paroleKeyDateTypeId);
            this.licenceCustodyKeyDate = Utility.getObjectFromArrayByKeyAndValue(this.custodyKeyDateList, 'keyDateTypeId', licenceKeyDateTypeId);
            this.sentenceCustodyKeyDate = Utility.getObjectFromArrayByKeyAndValue(this.custodyKeyDateList, 'keyDateTypeId', sentenceKeyDateTypeId);
            this.hdcCustodyKeyDate = Utility.getObjectFromArrayByKeyAndValue(this.custodyKeyDateList, 'keyDateTypeId', hdcKeyDateTypeId);
            this.expectedReleaseDateCustodyKeyDate = Utility.getObjectFromArrayByKeyAndValue(this.custodyKeyDateList, 'keyDateTypeId', expectedReleaseDateKeyDateTypeId);
            this.conditionalCustodyKeyDate = Utility.getObjectFromArrayByKeyAndValue(this.custodyKeyDateList, 'keyDateTypeId', conditionalKeyDateTypeId);
            this.pssCustodyKeyDate = Utility.getObjectFromArrayByKeyAndValue(this.custodyKeyDateList, 'keyDateTypeId', pssKeyDateTypeId);
          },error=>{
            console.log(error);
          });
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  updateCmsDetails(){
    let paroleKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'PED');
    let licenceKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'LED');
    let sentenceKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'SED');
    let hdcKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'HDE');
    let expectedReleaseDateKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'EXP');
    let conditionalKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'ACR');
    let pssKeyDateTypeId = this.listService.getPkValueByTableIdAndCode(223, 'PSSED');
    let observables: Observable<any>[] = [];
    if(this.paroleCustodyKeyDate != null && !this.paroleCustodyKeyDate.locked){
      this.paroleCustodyKeyDate.keyDate = this.offlocResponse.paroleEligibilityDate;
      this.offlocRequestService.removeConstantsFields(this.paroleCustodyKeyDate);
      observables.push(this.custodyKeyDateService.updateCustodyKeyDate(this.paroleCustodyKeyDate.custodyKeyDateId, this.paroleCustodyKeyDate).catch(error => { return Observable.of({})}));
    }else{
      this.paroleCustodyKeyDate = {};
      this.paroleCustodyKeyDate.keyDateTypeId = paroleKeyDateTypeId;
      this.paroleCustodyKeyDate.keyDate = this.offlocResponse.paroleEligibilityDate;
      this.paroleCustodyKeyDate.eventId = this.eventId;
      this.paroleCustodyKeyDate.spgCustodyKeyDateId = 0;
      observables.push(this.custodyKeyDateService.addCustodyKeyDate(this.paroleCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    if(this.licenceCustodyKeyDate != null && !this.licenceCustodyKeyDate.locked){
      this.licenceCustodyKeyDate.keyDate = this.offlocResponse.licenseExpiryDate;
      this.offlocRequestService.removeConstantsFields(this.licenceCustodyKeyDate);
      observables.push(this.custodyKeyDateService.updateCustodyKeyDate(this.licenceCustodyKeyDate.custodyKeyDateId, this.licenceCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    else{
      this.licenceCustodyKeyDate = {};
      this.licenceCustodyKeyDate.keyDateTypeId = licenceKeyDateTypeId;
      this.licenceCustodyKeyDate.keyDate = this.offlocResponse.licenseExpiryDate;
      this.licenceCustodyKeyDate.eventId = this.eventId;
      this.licenceCustodyKeyDate.spgCustodyKeyDateId = 0;
      observables.push(this.custodyKeyDateService.addCustodyKeyDate(this.licenceCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    if(this.sentenceCustodyKeyDate != null && !this.sentenceCustodyKeyDate.locked){
      this.sentenceCustodyKeyDate.keyDate = this.offlocResponse.sentenceExpiryDate;
      this.offlocRequestService.removeConstantsFields(this.sentenceCustodyKeyDate);
      observables.push(this.custodyKeyDateService.updateCustodyKeyDate(this.sentenceCustodyKeyDate.custodyKeyDateId, this.sentenceCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    else{
      this.sentenceCustodyKeyDate = {};
      this.sentenceCustodyKeyDate.keyDateTypeId = sentenceKeyDateTypeId;
      this.sentenceCustodyKeyDate.keyDate = this.offlocResponse.sentenceExpiryDate;
      this.sentenceCustodyKeyDate.eventId = this.eventId;
      this.sentenceCustodyKeyDate.spgCustodyKeyDateId = 0;
      observables.push(this.custodyKeyDateService.addCustodyKeyDate(this.sentenceCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    if(this.hdcCustodyKeyDate != null && !this.hdcCustodyKeyDate.locked){
      this.hdcCustodyKeyDate.keyDate = this.offlocResponse.hdcEligibilityDate;
      this.offlocRequestService.removeConstantsFields(this.hdcCustodyKeyDate);
      observables.push(this.custodyKeyDateService.updateCustodyKeyDate(this.hdcCustodyKeyDate.custodyKeyDateId, this.hdcCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    else{
      this.hdcCustodyKeyDate = {};
      this.hdcCustodyKeyDate.keyDateTypeId = hdcKeyDateTypeId;
      this.hdcCustodyKeyDate.keyDate = this.offlocResponse.hdcEligibilityDate;
      this.hdcCustodyKeyDate.eventId = this.eventId;
      this.hdcCustodyKeyDate.spgCustodyKeyDateId = 0;
      observables.push(this.custodyKeyDateService.addCustodyKeyDate(this.hdcCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    if(this.expectedReleaseDateCustodyKeyDate != null && !this.expectedReleaseDateCustodyKeyDate.locked){
      this.expectedReleaseDateCustodyKeyDate.keyDate = this.offlocResponse.expectedReleaseDate;
      this.offlocRequestService.removeConstantsFields(this.expectedReleaseDateCustodyKeyDate);
      observables.push(this.custodyKeyDateService.updateCustodyKeyDate(this.expectedReleaseDateCustodyKeyDate.custodyKeyDateId, this.expectedReleaseDateCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    else{
      this.expectedReleaseDateCustodyKeyDate = {};
      this.expectedReleaseDateCustodyKeyDate.keyDateTypeId = expectedReleaseDateKeyDateTypeId;
      this.expectedReleaseDateCustodyKeyDate.keyDate = this.offlocResponse.expectedReleaseDate;
      this.expectedReleaseDateCustodyKeyDate.eventId = this.eventId;
      this.expectedReleaseDateCustodyKeyDate.spgCustodyKeyDateId = 0;
      observables.push(this.custodyKeyDateService.addCustodyKeyDate(this.expectedReleaseDateCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    if(this.conditionalCustodyKeyDate != null && !this.conditionalCustodyKeyDate.locked){
      this.conditionalCustodyKeyDate.keyDate = this.offlocResponse.conditionalReleaseDate;
      this.offlocRequestService.removeConstantsFields(this.conditionalCustodyKeyDate);
      observables.push(this.custodyKeyDateService.updateCustodyKeyDate(this.conditionalCustodyKeyDate.custodyKeyDateId, this.conditionalCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    else{
      this.conditionalCustodyKeyDate = {};
      this.conditionalCustodyKeyDate.keyDateTypeId = conditionalKeyDateTypeId;
      this.conditionalCustodyKeyDate.keyDate = this.offlocResponse.conditionalReleaseDate;
      this.conditionalCustodyKeyDate.eventId = this.eventId;
      this.conditionalCustodyKeyDate.spgCustodyKeyDateId = 0;
      observables.push(this.custodyKeyDateService.addCustodyKeyDate(this.conditionalCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    if(this.pssCustodyKeyDate != null && !this.pssCustodyKeyDate.locked){
      this.pssCustodyKeyDate.keyDate = this.offlocResponse.pssEndDate;
      this.offlocRequestService.removeConstantsFields(this.pssCustodyKeyDate);
      observables.push(this.custodyKeyDateService.updateCustodyKeyDate(this.pssCustodyKeyDate.custodyKeyDateId, this.pssCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    else{
      this.pssCustodyKeyDate = {};
      this.pssCustodyKeyDate.keyDateTypeId = pssKeyDateTypeId;
      this.pssCustodyKeyDate.keyDate = this.offlocResponse.pssEndDate;
      this.pssCustodyKeyDate.eventId = this.eventId;
      this.pssCustodyKeyDate.spgCustodyKeyDateId = 0;
      observables.push(this.custodyKeyDateService.addCustodyKeyDate(this.pssCustodyKeyDate).catch(error => { return Observable.of({})}));
    }
    //observables.push(this.pssRequirementService.updatePssRequirement(this.pssRequirement.pssRequirementId, this.pssRequirement));
    if(this.custodyLocation != null && this.custodyLocation.custodyLocationId != null){
      this.offlocRequestService.removeConstantsFields(this.custodyLocation);
      this.custodyLocation.currentLocation = this.offlocResponse.prison;
      this.custodyLocation.locationStartDate = Utility.convertDateToString(new Date());
       observables.push(this.custodyLocationService.updateCustodyLocation(this.custodyLocation.custodyLocationId, this.custodyLocation).catch(error => { return Observable.of({})}));
    }
      this.offlocRequestService.removeConstantsFields(this.cmsOffenderProfile);
    this.cmsOffenderProfile.nomsNumber = this.offlocResponse.nomisNumber;
    observables.push(this.offenderProfileService.updateOffenderProfile(this.profileId, this.cmsOffenderProfile).catch(error => { return Observable.of({})}));
    Observable.forkJoin(observables).subscribe(data => {
      //this.router.navigate(['offloc'], { relativeTo: this.route });
      this.goBack();
    });


    //this.custodyKeyDateService.updateCustodyKeyDate()
  }

  goBack(){
    this.location.back();
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(OfflocConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(OfflocConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(OfflocConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(OfflocConstants.featureId, field, "Read");
  }

}
