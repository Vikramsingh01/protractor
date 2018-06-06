import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs/Rx";

import {Referral} from '../referral';
import {ReferralService} from '../referral.service';
import {TokenService} from '../../../services/token.service';
import {AuthorizationService} from '../../../services/authorization.service';
import {DataService} from '../../../services/data.service';
import {HeaderService} from '../../../views/header/header.service';
import {ReferralConstants} from '../referral.constants';
import {ListService} from "../../../services/list.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-referral-detail',
  templateUrl: 'referral-detail.component.html'
})
export class ReferralDetailComponent implements OnInit {

  private subscription: Subscription;
  referral: Referral;
  private referralId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private referralTypeList: any[] = [];
  private referralOutcomeList: any[] = [];
  private show: boolean = false;
  private drugTestProfileAvailableFlag: boolean = false;
  constructor(private route: ActivatedRoute,
              private authorizationService: AuthorizationService,
              private dataService: DataService,
              private referralService: ReferralService,
              private headerService: HeaderService,
              private listService: ListService,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('View Referral');
    this.subscription = this.route.params.subscribe((params: any) => {
      this.listService.getListData(203).subscribe(referralTypeList => {
        this.referralTypeList = referralTypeList;
      });
      this.listService.getListData(131).subscribe(referralOutcomeList => {
        this.referralOutcomeList = referralOutcomeList;
      });
      this.referralId = params['referralId'];
      //this.authorizationService.getAuthorizationDataByTableId(ReferralConstants.tableId).subscribe(authorizationData => {
      this.authorizationService.getAuthorizationData(ReferralConstants.featureId, ReferralConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(ReferralConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(ReferralConstants.featureId, authorizationData[1]);
        }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ReferralConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ReferralConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.referralService.getReferral(this.referralId).subscribe(data => {
            this.referral = data;
            this.checkValidity();
          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(ReferralConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ReferralConstants.featureId, action);
  }

  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(ReferralConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ReferralConstants.featureId, field, "Read");
  }

  isDrugTestProfileAvailable(drugTestProfileAvailableFlag){
    this.drugTestProfileAvailableFlag = drugTestProfileAvailableFlag;
  }
  public checkValidity() {
    this.referralTypeList.forEach(referralType => {
        if (this.referral.referralTypeId == referralType.key && referralType.code == 'DRG') {
          this.referralOutcomeList.forEach(referralOutcome => {
            if (this.referral.referralOutcomeId == referralOutcome.key && referralOutcome.code == 'A') {
              this.show = true;
            }
          });
        }
      }
      );
    return this.show;
  }

}
