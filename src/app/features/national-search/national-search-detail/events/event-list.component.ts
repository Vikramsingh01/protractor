import { Component, Input,  OnInit } from '@angular/core';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { NationalSearch } from '../../national-search';
import { NationalSearchService } from '../../national-search.service';
import { TokenService } from '../../../../services/token.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { DataService } from '../../../../services/data.service';
import { HeaderService } from '../../../../views/header/header.service';
import { ConfirmService } from '../../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../../services/list.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationGuard } from '../../../../guards/authentication.guard';
import { NationalSearchConstants } from '../../national-search.constants'


@Component({
  selector: 'tr-national-search-event-list',
  templateUrl: 'event-list.component.html'
})
export class EventListComponent implements OnInit {

  @Input() nationalSearchId: number;
  private searchObjs: any[] = [];
  nationalSearchList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  filterObj:any={};
  private genderIdList: any[] = [];
  private mainOffenceList: any[] = [];
  private disposalList: any[] = [];
  private orderProviderList: any[] = [];
  
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private nationalSearchService: NationalSearchService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle("Events");
   
    let nationalSearch: NationalSearch = new NationalSearch();
    this.listService.getListData(173).subscribe(mainOffenceList => {
      this.mainOffenceList = mainOffenceList;
    });
    this.listService.getListData(421).subscribe(disposalList => {
      this.disposalList = disposalList;
    });
    this.listService.getListData(193).subscribe(orderProviderList => {
      this.orderProviderList = orderProviderList;
    });
        this.authorizationService.getAuthorizationData(NationalSearchConstants.featureId, NationalSearchConstants.nationalEventTableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(NationalSearchConstants.featureId, authorizationData[0]);
      this.dataService.addFeatureFields(NationalSearchConstants.featureId, authorizationData[1]);
    }
        });
      
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('offenderId')) {
        this.filterObj.offenderId = params['offenderId'];
        this.filterObj.caseReferenceNumber= params['caseReferenceNumber'];
        this.filterObj.crcSearchId= params['crcSearchId'];
      }
    });
    this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(NationalSearchConstants.featureId, "Read");
    if(this.authorizedFlag){
    this.onLoad();
  }else {
        this.headerService.setAlertPopup("Not authorized");
      }

  }

  onLoad(){
    let paginationObj={};
    let sortObj={};

    this.nationalSearchService.sortFilterAndPaginateEvent(this.filterObj, paginationObj, sortObj).subscribe((data: any) => {
        this.nationalSearchList=data.content;
      
      });
    
    return false;
  }



 


}
