import { CourtWorkService } from './../court-work/court-work.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, UrlTree, UrlSegment } from '@angular/router';
import { HeaderService } from '../../views/header/header.service';
import { OffenderProfileService } from '../offenderprofile/offenderprofile.service';
import { RegistrationService } from "../registration/registration.service";
import { ListService } from '../../services/list.service';
import { Utility } from '../../shared/utility';
@Component({
  selector: 'tr-offender-header',
  templateUrl: './offender-header.component.html',
  providers: [OffenderProfileService]
})
export class OffenderHeaderComponent implements OnInit, OnDestroy {

  private toBeShown = true;
  private offenderDetails: any;
  private registrationDetails: any;
  private r: any = {};
  private a: any = {};
  private s: any = {};
  private i: any = {};
  private p: any = {};
  private bandList: any[] = [];
  private serviceUserUrl;
  private isActiveBreach: boolean = false;
  private activeBreachSubscriber: any;
  constructor(private route: ActivatedRoute, private router: Router, private headerService: HeaderService,
  private registrationService: RegistrationService,
  private listService: ListService,
    private offenderProfileService: OffenderProfileService,
  private courtWorkService: CourtWorkService) { }

  ngOnInit() {
    let urlTree: UrlTree = this.router.parseUrl(this.router.url);
    let childObj: any = urlTree.root.children;

    let urlSegment: UrlSegment = childObj.primary.segments[1];

    this.serviceUserUrl = childObj.primary.segments[0].path;
    let profileId: number = parseInt(urlSegment.path);
    if(isNaN(profileId)){
      if( urlTree.queryParams.hasOwnProperty("profileLoc")){
        let profileLoc=parseInt(urlTree.queryParams["profileLoc"]);
        urlSegment = childObj.primary.segments[profileLoc];
        profileId=  parseInt(urlSegment.path);
      }

    }
    this.listService.getListData(2548).subscribe(bandList => {
      this.bandList = bandList;
    });
    this.offenderProfileService.getOffenderProfileByProfileId(profileId).subscribe(offenderprofile => {
      offenderprofile=this.getBandValue(offenderprofile);
      this.offenderDetails = offenderprofile;
      this.toBeShown = true;
    })






        this.registrationService.getRegistrationColourByProfileId(profileId).subscribe(rasipJson => {
        rasipJson.forEach(element => {
          if(element.flag === 'RoSH'){
            this.r.severity = element.severity;
          }
          if(element.flag === 'Alerts'){
            this.a.severity = element.severity;
          }
          if(element.flag === 'Safeguarding'){
            this.s.severity = element.severity;
          }
          if(element.flag === 'Information'){
            this.i.severity = element.severity;
          }
          if(element.flag === 'Public Protection'){
            this.p.severity = element.severity;
          }
        });;

    })


    this.headerService.toBeShown.subscribe(value => {
      this.toBeShown = value;

    });
    this.activeBreachSubscriber = this.headerService.getActiveBreachEmitter().subscribe(data=>{
      this.refreshActiveBreach(profileId);
    })
    this.headerService.offenderDetails.subscribe((details: any) => {
      details=this.getBandValue(details);
      this.offenderDetails = details;
    })
    this.refreshActiveBreach(profileId);
       this.headerService.getRASIP().subscribe(data=>{
       data.forEach(element => {
          if(element.flag === 'RoSH'){
            this.r.severity = element.severity;
          }
          if(element.flag === 'Alerts'){
            this.a.severity = element.severity;
          }
          if(element.flag === 'Safeguarding'){
            this.s.severity = element.severity;
          }
          if(element.flag === 'Information'){
            this.i.severity = element.severity;
          }
          if(element.flag === 'Public Protection'){
            this.p.severity = element.severity;
          }
    })
  });

  }


  getBandValue(details){
    let flagFound=false;
      if(details!=null && details.hasOwnProperty("bandId")){
        this.bandList.forEach(element => {
          if(element.key==details.bandId){
            flagFound=true;
            return details.bandValue = element.value;
          }
        });

      }
      return details;

    }

    refreshActiveBreach(profileId){
      this.courtWorkService.getActiveBreachCount(profileId).subscribe(count => {
        if (count.activeBreachCount > 0) {
          this.isActiveBreach = true;
        }else {
          this.isActiveBreach = false;
        }
      });
    }
    ngOnDestroy() {
      this.activeBreachSubscriber.unsubscribe();
      //this.headerService.getActiveBreachEmitter().unsubscribe();
    }
  }
