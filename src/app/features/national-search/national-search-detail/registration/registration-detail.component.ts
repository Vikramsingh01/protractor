import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { NationalSearch } from '../../national-search';
import { NationalSearchService } from '../../national-search.service';
import { TokenService } from '../../../../services/token.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { DataService } from '../../../../services/data.service';
import { HeaderService } from '../../../../views/header/header.service';
import { NationalSearchConstants } from '../../national-search.constants';
import { ListService } from '../../../../services/list.service';


@Component({
  selector: 'tr-national-search-registration-detail',
  templateUrl: 'registration-detail.html'
})
export class RegistrationDetailComponent implements OnInit {

  private subscription: Subscription;
  nationalSearch: NationalSearch;
  private nationalSearchId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = true;
  filterObj:any={};
  nationalSearchList: any[];
  private registerTypeList: any[] = [];
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private nationalSearchService: NationalSearchService,
      private headerService: HeaderService,
      private listService: ListService,
      private titleService: Title) { }
 ngOnInit() {
    this.titleService.setTitle("View National Search");
    this.listService.getListData(207).subscribe(registerTypeList => {
      this.registerTypeList = registerTypeList;
    });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('offenderId')) {
        this.filterObj.offenderId = params['offenderId'];
        this.filterObj.caseReferenceNumber= params['caseReferenceNumber'];
        this.filterObj.crcSearchId= params['crcSearchId'];
      }
    });
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.nationalSearchId = params['nationalSearchId'];
       //this.authorizationService.getAuthorizationDataByTableId(NationalSearchConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(NationalSearchConstants.featureId, NationalSearchConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(NationalSearchConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(NationalSearchConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(NationalSearchConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(NationalSearchConstants.featureId, "Read");
        if (true) {
            this.onLoad();
        } else {
            //this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(NationalSearchConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(NationalSearchConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(NationalSearchConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(NationalSearchConstants.featureId, field, "Read");
  }

  onLoad(){
    let paginationObj={};
    let sortObj={};
    this.nationalSearchService.sortFilterAndPaginateRegistration(this.filterObj, paginationObj, sortObj).subscribe((data: any) => {
        console.log(data)
        this.nationalSearchList=data.content;
      
      });
    
    return false;
  }
}
