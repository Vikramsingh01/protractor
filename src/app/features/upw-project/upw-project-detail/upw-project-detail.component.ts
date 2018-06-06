import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { UpwProject } from '../upw-project';
import { UpwProjectService } from '../upw-project.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { UpwProjectConstants } from '../upw-project.constants';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-upw-project-detail',
  templateUrl: 'upw-project-detail.component.html'
})
export class UpwProjectDetailComponent implements OnInit {

  private subscription: Subscription;
  upwProject: UpwProject;
  private upwProjectId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private teamList: any[] = [];
  private crcList: any[] = [];
  constructor(private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private dataService: DataService,
    private upwProjectService: UpwProjectService,
    private headerService: HeaderService,
    private listService: ListService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Project Details');
     this.listService.getListDataWithLookup(445, 501).subscribe(teamList => {
         this.teamList = teamList;
     });
      this.listService.getListDataWithLookup(433, 503).subscribe(crcList => {
         this.crcList = crcList;
     });
    this.subscription = this.route.params.subscribe((params: any) => {
      this.upwProjectId = params['upwProjectId'];
      //this.authorizationService.getAuthorizationDataByTableId(UpwProjectConstants.tableId).subscribe(authorizationData => {
      this.authorizationService.getAuthorizationData(UpwProjectConstants.featureId, UpwProjectConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
          this.dataService.addFeatureActions(UpwProjectConstants.featureId, authorizationData[0]);
          this.dataService.addFeatureFields(UpwProjectConstants.featureId, authorizationData[1]);
        }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwProjectConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwProjectConstants.featureId, "Read");
        if (this.authorizedFlag) {
          this.upwProjectService.getUpwProject(this.upwProjectId).subscribe(data => {
            this.upwProject = data;
          })
        } else {
          this.headerService.setAlertPopup("Not authorized");
        }
      });
    })
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(UpwProjectConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(UpwProjectConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(UpwProjectConstants.tableId, field, "Read", this.authorizationData);
    //return this.authorizationService.isFeildAuthorized(UpwProjectConstants.featureId, field, "Read");
    return true;
  }

}
