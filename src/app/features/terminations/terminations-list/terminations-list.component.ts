import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { TerminationsService } from "../terminations.service";
import { Terminations } from "../terminations";
import { TerminationsConstants } from '../terminations.constants';
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
import { Event } from '../../event/event';
import { EventService } from '../../event/event.service';

@Component({
  selector: 'tr-terminations',
  templateUrl: 'terminations-list.component.html',
})
export class TerminationsListComponent implements OnInit {
  event: Event = new Event();
  private eventId: number;
  @Input() contactId: number;
  private searchObjs: any[] = [];
  terminationsList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  terminationFilterForm: FormGroup;
  private terminationTypeIdList: any[] = [];
  private processTypeIdList: any[] = [];
  private processSubTypeIdList: any[] = [];
  private processStageIdList: any[] = [];
  private processOutcomeIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  officeTeams: any = [];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private terminationService: TerminationsService,private eventService: EventService,
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
    this.initForm();
    this.titleService.setTitle("Terminations");

   this.sortSearchPaginationObj.sortObj.field = "terminationDate";
   // this.sortSearchPaginationObj.sortObj.sort = "asc";
    //this.terminationFilterForm.controls['terminationDueId'].setValue('1');
    
        
    this.listService.getListData(2552).subscribe(terminationTypeIdList => {
      this.terminationTypeIdList = terminationTypeIdList;
    });
   this.listService.getListData(192).subscribe(processTypeIdList => {
      this.processTypeIdList = processTypeIdList;
    });
    this.listService.getListData(170).subscribe(processSubTypeIdList => {
      this.processSubTypeIdList = processSubTypeIdList;
    });
    this.listService.getListData(191).subscribe(processStageIdList => {
      this.processStageIdList = processStageIdList;
    });
     this.listService.getListData(169).subscribe(processOutcomeIdList => {
      this.processOutcomeIdList = processOutcomeIdList;
    });
    
    let terminations: Terminations = new Terminations();
    this.route.params.subscribe((params: any) => {

    });
    


this.listService.getListDataByLookupAndPkValue(263, 533, this.dataService.getLoggedInUserId()).subscribe(listObj => {
      this.officeTeams = listObj;
    });
    //this.authorizationService.getAuthorizationDataByTableId(EnforcementConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(TerminationsConstants.featureId, TerminationsConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(TerminationsConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(TerminationsConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(EnforcementConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(TerminationsConstants.featureId, "Read");
      if (this.authorizedFlag) {
         
        this.terminationService.sortFilterAndPaginate(terminations, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.terminationsList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = terminations;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

    this.searchObjs = [
      { 'field': 'terminationTypeId', 'type': 'dropdown', 'tableId':'2552', 'label': 'TERMINATION TYPE' },
      { 'field': 'terminationDueId', 'type': 'dropdown', 'tableId':'2553', 'label': 'TERMINATION DUE' },
     { 'field': 'officeTeamId', 'type': 'dropdown', 'tableId': '445', 'label': 'team' },
       { 'field': 'offenderIdentityId', 'type': 'dropdown', 'lookup': '521', 'label': 'CRN' },
    ];

  }
  updateCourtWorkList(value: boolean){
    if(value){
    this.terminationService.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.terminationsList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          //this.sortSearchPaginationObj.filterObj = filterObj;
        
    })
    }
  }
  delete(contactId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.terminationService.deleteTerminations(contactId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.terminationFilterForm.controls['terminationTypeId'].setValue('');
    this.terminationFilterForm.controls['terminationDueId'].setValue('');
    this.terminationFilterForm.controls['officeTeamId'].setValue('');
    this.terminationFilterForm.controls['caseReferenceNumber'].setValue('');
    let terminations: Terminations = new Terminations();
    
    this.sortFilterAndPaginate(terminations, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchTermination() {
    this.sortFilterAndPaginate(this.terminationFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj) {
    this.sortSearchPaginationObj.sortObj = sortObj;
    //this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
    this.sortFilterAndPaginate(this.terminationFilterForm.value, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj) {
    this.sortSearchPaginationObj.paginationObj = paginationObj;
   // this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
    this.sortFilterAndPaginate(this.terminationFilterForm.value, paginationObj, this.sortSearchPaginationObj.sortObj);
  }


  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    this.terminationService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.terminationsList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;     
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(EnforcementConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(TerminationsConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(EnforcementConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(TerminationsConstants.featureId, field, "Read");
  }

  initForm() {
        this.terminationFilterForm = this._fb.group({
                        officeTeamId:[''],
                        caseReferenceNumber:[''],
                        terminationTypeId:[''],
                        terminationDueId:[''],
                    });
                    
    }

}

