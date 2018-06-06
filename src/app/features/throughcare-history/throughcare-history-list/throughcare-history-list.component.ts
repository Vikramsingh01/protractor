import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { ThroughCareHistoryService } from "../throughcare-history.service";
import { ThroughCareHistory } from "../throughcare-history";
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';

@Component({
  selector: 'tr-throughcare-history',
  templateUrl: 'throughcare-history-list.component.html'
})
export class ThroughCareHistoryListComponent implements OnInit {

  @Input() custodyKeyDateId: number;
  private searchObjs: any[] = [];
  throughcareHistoryList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  custodyKeyDateFilterForm: FormGroup;
  private keyDateTypeIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  eventId: number;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private throughCareHistoryService: ThroughCareHistoryService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder,
    private titleService: Title) {
  }

  ngOnInit() {
    //this.titleService.setTitle("ThroughCare History");
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        this.eventId = params['eventId'];
      }
    });
    this.throughCareHistoryService.getThroughCareHistoryList(this.eventId).subscribe(data => {
      this.throughcareHistoryList = data;
    })
  };

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(9, action);
  }
  
}







