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
  selector: 'tr-national-search-personal-circumstance-detail',
  templateUrl: 'personal-circumstance-detail.html'
})
export class PersonalDetailComponent implements OnInit {

  private subscription: Subscription;
  nationalSearch: NationalSearch;
  private nationalSearchId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = true;
  private personalCircumstanceTypeList: any[] = [];
  private personalCircumstanceSubTypeList: any[] = [];
  filterObj:any={};
  nationalSearchList: any[];
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private nationalSearchService: NationalSearchService,
      private headerService: HeaderService,
      private listService: ListService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Personal Circumstance");
    this.listService.getListData(186).subscribe(personalCircumstanceTypeList => {
      this.personalCircumstanceTypeList = personalCircumstanceTypeList;
    });
    this.listService.getListData(185).subscribe(personalCircumstanceSubTypeList => {
      this.personalCircumstanceSubTypeList = personalCircumstanceSubTypeList;
    });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('offenderId')) {
             this.filterObj.offenderId = params['offenderId'];
        this.filterObj.caseReferenceNumber= params['caseReferenceNumber'];
        this.filterObj.crcSearchId= params['crcSearchId'];
      }
    });
    this.subscription = this.route.params.subscribe((params: any)=>{
     
       //this.authorizationService.getAuthorizationDataByTableId(NationalSearchConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(NationalSearchConstants.featureId, NationalSearchConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(NationalSearchConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(NationalSearchConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(NationalSearchConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(NationalSearchConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.onLoad();
         
        } else {
            // this.headerService.setAlertPopup("Not authorized");
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
    this.nationalSearchService.sortFilterAndPaginateCircumstance(this.filterObj, paginationObj, sortObj).subscribe((data: any) => {
        console.log(data)
        this.nationalSearchList=data.content;
      
      });
    
    return false;
  }
}
