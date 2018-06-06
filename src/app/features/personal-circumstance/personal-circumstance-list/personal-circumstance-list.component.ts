import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { PersonalCircumstanceService } from "../personal-circumstance.service";
import { PersonalCircumstance } from "../personal-circumstance";
import { PersonalCircumstanceConstants } from '../personal-circumstance.constants';
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
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-personal-circumstance',
  templateUrl: 'personal-circumstance-list.component.html'
})
export class PersonalCircumstanceListComponent implements OnInit {

    @Input() personalCircumstanceId: number;
    private searchObjs: any[] = [];
    personalCircumstanceList: any[];
    private authorizationData: any;
    private action;
    private authorizedFlag: boolean = false;
    personalCircumstanceFilterForm: FormGroup;
    private circumstanceTypeIdList: any[] = [];
    private circumstanceSubTypeIdList: any[] = [];
    private evidencedYesNoIdList: any[] = [];
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
		private route: ActivatedRoute,
    private personalCircumstanceService: PersonalCircumstanceService,
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
    this.titleService.setTitle('Personal Circumstance');
        this.listService.getListData(186).subscribe(circumstanceTypeIdList => {
        this.circumstanceTypeIdList = circumstanceTypeIdList;
    });

        this.listService.getListData(185).subscribe(circumstanceSubTypeIdList => {
        this.circumstanceSubTypeIdList = circumstanceSubTypeIdList;
    });
        
        this.listService.getListData(244).subscribe(evidencedYesNoIdList => {
        this.evidencedYesNoIdList = evidencedYesNoIdList;
    });
    
    let personalCircumstance: PersonalCircumstance = new PersonalCircumstance();
    this.route.params.subscribe((params: any)=>{
       if (params.hasOwnProperty('profileId')) {
        personalCircumstance.profileId = params['profileId'];
      }

    });
    //this.authorizationService.getAuthorizationDataByTableId(PersonalCircumstanceConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(PersonalCircumstanceConstants.featureId, PersonalCircumstanceConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(PersonalCircumstanceConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(PersonalCircumstanceConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(PersonalCircumstanceConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PersonalCircumstanceConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.personalCircumstanceService.sortFilterAndPaginate(personalCircumstance, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.personalCircumstanceList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = personalCircumstance;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
        { 'field': 'profileId', 'type': 'hidden', 'value': personalCircumstance.profileId },
        { 'field': 'startDate', 'type': 'date', 'label': 'Start Date' },
        { 'field': 'endDate', 'type': 'date', 'label': 'End Date' },
        { 'field': 'circumstanceTypeId', 'type': 'dropdown',  'tableId':'186', 'label': 'Circumstance Type Id'},
        { 'field': 'circumstanceSubTypeId', 'type': 'dropdown',  'tableId':'185', 'label': 'Circumstance Sub Type Id' },
                                                                                                                                                                                                                                                                            ];
    
  }

  delete(personalCircumstanceId: number) {

    let personalCircumstance: PersonalCircumstance = new PersonalCircumstance();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        personalCircumstance.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.personalCircumstanceService.isAuthorize(personalCircumstance.profileId,this.action).subscribe((response: any) => {
                if (response) {
       this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.personalCircumstanceService.deletePersonalCircumstance(personalCircumstanceId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
                }
       else {
                this.headerService.setErrorPopup({errorMessage: "You are not authorised to perform this action on this SU record. Please contact the Case Manager."});
            }    
            });
        
    }


  reset(){
    this.personalCircumstanceFilterForm.reset();
    let personalCircumstance: PersonalCircumstance = new PersonalCircumstance();
    this.sortFilterAndPaginate(personalCircumstance, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchPersonalCircumstance(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
   // this.sortSearchPaginationObj.paginationObj.number = 0;
    this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    this.personalCircumstanceService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.personalCircumstanceList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(PersonalCircumstanceConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(PersonalCircumstanceConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(PersonalCircumstanceConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(PersonalCircumstanceConstants.featureId, field, "Read");
  }
}
