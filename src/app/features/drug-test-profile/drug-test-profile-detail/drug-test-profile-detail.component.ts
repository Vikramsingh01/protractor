import {Component, OnInit, EventEmitter, Output } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {Title} from "@angular/platform-browser";
import {DrugTestProfile} from '../drug-test-profile';
import {DrugTestProfileService} from '../drug-test-profile.service';
import {TokenService} from '../../../services/token.service';
import {AuthorizationService} from '../../../services/authorization.service';
import {DataService} from '../../../services/data.service';
import {HeaderService} from '../../../views/header/header.service';
import {DrugTestProfileConstants} from '../drug-test-profile.constants';
import {ListService} from "../../../services/list.service";


@Component({
  selector: 'tr-drug-test-profile-detail',
  templateUrl: 'drug-test-profile-detail.component.html'
})
export class DrugTestProfileDetailComponent implements OnInit {

  private subscription: Subscription;
  drugTestProfile: DrugTestProfile;
  private drugTestProfileId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private eventId: number;
  private crcList = [];
  private teamlist = [];
  private officerlist = [];
  @Output("drugTestProfileAvailableFlag") drugTestProfileAvailableFlag: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private route: ActivatedRoute,
              private authorizationService: AuthorizationService,
              private dataService: DataService,
              private drugTestProfileService: DrugTestProfileService,
              private headerService: HeaderService,
              private titleService: Title,
              private listService: ListService) {
  }

  ngOnInit() {
    this.listService.getListDataWithLookup(433, 503).subscribe(crcList => {
      this.crcList = crcList;
    });

    this.listService.getListDataWithLookup(445, 507).subscribe(crcList => {
      this.teamlist = crcList;
    });
    this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
      this.officerlist = crcList;
    });

    //this.titleService.setTitle("View Drug Test Profile");
    this.eventId = this.route.snapshot.params['eventId'];
    this.subscription = this.route.params.subscribe((params: any) => {

      //this.authorizationService.getAuthorizationDataByTableId(DrugTestProfileConstants.tableId).subscribe(authorizationData => {
      this.authorizationService.getAuthorizationData(DrugTestProfileConstants.featureId, DrugTestProfileConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(DrugTestProfileConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(DrugTestProfileConstants.featureId, authorizationData[1]);
        }

        //this.authorizedFlag = this.authorizationService.isTableAuthorized(DrugTestProfileConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(DrugTestProfileConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.drugTestProfileService.getDrugTestProfile(this.eventId).subscribe(data => {
            this.drugTestProfile = data;
            this.drugTestProfileAvailableFlag.emit(true);
          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }
  
  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(DrugTestProfileConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(DrugTestProfileConstants.featureId, action);
  }

  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(DrugTestProfileConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(DrugTestProfileConstants.featureId, field, "Read");
  }

}
