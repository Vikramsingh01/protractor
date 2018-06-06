import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../../services/token.service';
import { AuthorizationService } from '../../services/authorization.service';
import { DataService } from '../../services/data.service';
import { ListService } from '../../services/list.service';
import { HeaderService } from '../../views/header/header.service';
import { UpwProjectConstants } from "../upw-project/upw-project.constants";
import { SortSearchPagination } from '../../generic-components/search/sort-search-pagination';
import { CommunityRequirementService } from "../community-requirement/community-requirement.service";
import { UpwAppointmentService } from "../upw-appointment/upw-appointment.service";
import { UpwAdjustmentService } from "../upw-adjustment/upw-adjustment.service";
import { Utility } from "../../shared/utility";
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-upw-summary',
  templateUrl: 'upw-summary.component.html',
  providers: []
})
export class UPWSummaryComponent implements OnInit {

  private subscription: Subscription;
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private upwSummary: any = {};
  constructor(private route: ActivatedRoute, private dataService: DataService,
    private headerService: HeaderService, private authorizationService: AuthorizationService,
    private listService: ListService, private communityRequirementService: CommunityRequirementService,
    private upwAppointmentService: UpwAppointmentService,
    private upwAdjustmentService: UpwAdjustmentService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Community Payback');
    let obj: any = {};
    this.sortSearchPaginationObj.paginationObj.size = 10000;
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        obj.profileId = params['profileId'];
      }
    });
    let observables: Observable<any>[] = [];
    observables.push(this.communityRequirementService.getTotalHoursOrdered(obj).catch(error => { return Observable.of({totalHoursOrdered: 0})}));
    observables.push(this.upwAppointmentService.getTotalHoursWorked(obj).catch(error => { return Observable.of({totalHoursWorked: 0})}));
    observables.push(this.upwAdjustmentService.getTotalAdjustment(obj).catch(error => { return Observable.of([])}));
    
    Observable.forkJoin(observables).subscribe(data => {
      this.upwSummary.serviceUserTotalHoursOrdered = data[0].totalHoursOrdered;
      if(data[1].totalHoursWorked == null){
        data[1].totalHoursWorked = 0;
      }
      this.upwSummary.serviceUserTotalHoursWorked = Utility.convertMinutesToHours(data[1].totalHoursWorked);
      let serviceUserAdjustmentRsp: any[] = data[2];
      let totalAdjustment = 0;
      serviceUserAdjustmentRsp.forEach(adjustment => {
        if (adjustment.adjustmentType == 'POSITIVE') {
          totalAdjustment = totalAdjustment + adjustment.adjustmentAmount;
        } else if (adjustment.adjustmentType == 'NEGATIVE') {
          totalAdjustment = totalAdjustment - adjustment.adjustmentAmount;
        }
      })
      this.upwSummary.serviceUserTotalAdjustment = Utility.convertMinutesToHours(totalAdjustment);
      this.upwSummary.serviceUserTotalHoursLeft = Utility.convertMinutesToHours(data[0].totalHoursOrdered*60 + totalAdjustment - data[1].totalHoursWorked);
    });
  }

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(UpwProjectConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    return this.authorizationService.isFeildAuthorized(UpwProjectConstants.featureId, field, "Read");
  }

}
