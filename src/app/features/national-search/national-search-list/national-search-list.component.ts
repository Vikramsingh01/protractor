import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { NationalSearchService } from "../national-search.service";
import { NationalSearch } from "../national-search";
import { NationalSearchConstants } from '../national-search.constants';
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
  selector: 'tr-national-search',
  templateUrl: 'national-search-list.component.html'
})
export class NationalSearchListComponent implements OnInit {

  @Input() nationalSearchId: number;
  private searchObjs: any[] = [];
  nationalSearchList: any[]=[];
  nationalSearchResponsDetailsList: any[];
  nationalSearchResponsHeaderList: any[]
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  nationalSearchFilterForm: FormGroup;
  private genderIdList: any[] = [];
  private omProviderList: any[] = [];
  private filterObj:any={};
  private isEmpty:boolean=false;
  private isReset:boolean=false;
  private isExcess:boolean=false;
  private resultCount:any={};
  private Resultlength;
  
  
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
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
    private _fb: FormBuilder,
    private titleService: Title,
   ) {
  }

  ngOnInit() {
    this.nationalSearchService.getResponseList().subscribe(data=>{
      this.resetAllValues();

      if(data!=null && data.length>0){
        this.resultCount=data[0];
        if(data[0].crcSearchNil=='Y'){
          this.isEmpty=true;
          this.isExcess=false;
        }else{
          if(data[0].crcSearchExcess=='Y'){
            this.isExcess=true;
             this.isEmpty=false;
          }
          
          this.onLoad(data[0].crcSearchId);
        }
       
      }
     
      
        

    })
   this.titleService.setTitle("National Search");
    this.listService.getListData(2).subscribe(genderIdList => {
      this.genderIdList = genderIdList;
    });
    this.listService.getListData(193).subscribe(omProviderList => {
      this.omProviderList = omProviderList;
  });
    let nationalSearch: NationalSearch = new NationalSearch();
    this.route.params.subscribe((params: any) => {

    });

  let natSearchRequest = JSON.parse(localStorage.getItem("natSearchListCrcId"));
        if(natSearchRequest!=null && typeof natSearchRequest!='undefined' ){
            let filterObj={"crcSearchId": natSearchRequest};
            let paginationObj={};
            let sortObj={};
            this.nationalSearchService.sortFilterAndPaginateHeader(filterObj, paginationObj, sortObj).subscribe((data: any) => {
                 localStorage.removeItem("natSearchListCrcId");
                if(data.content && data.content.length>0){
                  
                  
                   this.nationalSearchService.setResponseList(data.content);

                }
              });
             
        }





  }

  
  onLoad(crcSearchId){
    let paginationObj={};
    let sortObj={};
    this.filterObj.crcSearchId=crcSearchId;
    this.nationalSearchService.sortFilterAndPaginateSummary(this.filterObj, paginationObj, sortObj).subscribe((data: any) => {
     this.nationalSearchResponsDetailsList=data.content;
     this.Resultlength=this.nationalSearchResponsDetailsList.length
    });
  }

  resetAllValues(){
    this.isReset=true;
    this.nationalSearchResponsDetailsList=[];
    this.resultCount={};
    this.isExcess=false;
    this.isEmpty=false;
    this.Resultlength=0;
    
  }

  trimValue(val){
    if(val!=null || typeof val !=undefined){
      let arr=val.split("/");
      if(arr.length>=2)
          val=arr[1];
    }
      
    return val;
  }
  
}
