import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { EngagementHistory } from '../engagement-history';
import { EngagementHistoryService } from '../engagement-history.service';
import { EngagementHistoryConstants } from '../engagement-history.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';

@Component({
  selector: 'tr-engagement-history-detail',
  templateUrl: 'engagement-history-detail.component.html',
  providers: [EngagementHistoryService, TokenService]
})
export class EngagementHistoryDetailComponent implements OnInit {

  private subscription: Subscription;
  engagementHistory: EngagementHistory;
  private engagementHistoryId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private engagementHistoryService: EngagementHistoryService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.engagementHistoryId = params['id'];
      this.authorizationService.getAuthorizationData(EngagementHistoryConstants.featureId, EngagementHistoryConstants.tableId).map(res => {
        if (res.length > 0) {
          this.dataService.addFeatureActions(EngagementHistoryConstants.featureId, res[0]);
          this.dataService.addFeatureFields(EngagementHistoryConstants.featureId, res[1]);
        }
      }).flatMap((data) => this.engagementHistoryService.getEngagementHistory(this.engagementHistoryId)).subscribe((data: any) => {
        this.engagementHistory = data;
      })
    })
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(EngagementHistoryConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(EngagementHistoryConstants.featureId, field, "Read");
  }

}
