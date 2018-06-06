import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { NationalSearch } from '../national-search';
import { NationalSearchService } from '../national-search.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { NationalSearchConstants } from '../national-search.constants';
import { Location } from '@angular/common';


@Component({
  selector: 'tr-national-search-detail',
  templateUrl: 'national-search-detail.component.html'
})
export class NationalSearchDetailComponent implements OnInit {

  private subscription: Subscription;
  nationalSearch: NationalSearch;
  private nationalSearchId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = true;
  private filterObj:any={};
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private nationalSearchService: NationalSearchService,
      private headerService: HeaderService,
      private titleService: Title,
       private location:Location) { }

  ngOnInit() {
    this.titleService.setTitle("View National Search");
   
     this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('crcSearchId')) {
        localStorage.setItem("natSearchListCrcId",params['crcSearchId'] ) ;
      }
    });
  
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
            // this.nationalSearchService.getNationalSearch(this.nationalSearchId).subscribe(data => {
            //     this.nationalSearch = data;
            // })
        } else {
           // this.headerService.setAlertPopup("Not authorized");
        }
    });

      this.location.subscribe(()=>{
         console.log("Backkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
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

  
}
