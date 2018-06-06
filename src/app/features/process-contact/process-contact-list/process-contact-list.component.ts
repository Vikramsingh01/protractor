import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { ProcessContactService } from "../process-contact.service";
import { ProcessContact } from "../process-contact";
import { ProcessContactConstants } from '../process-contact.constants';
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
import { AssociatedPTO } from '../associated-pto';

@Component({
  selector: 'tr-process-contact',
  templateUrl: 'process-contact-list.component.html'
})
export class ProcessContactListComponent implements OnInit {

  @Input() processContactId: number;
  private searchObjs: any[] = [];
  processContactList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  processContactFilterForm: FormGroup;
  private processTypeIdList: any[] = [];
  private processSubTypeIdList: any[] = [];
  private processStageIdList: any[] = [];
  private processOutcomeIdList: any[] = [];
  private intendedProviderIdList: any[] = [];
  private processManagerProviderIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private profileId:number;
  private action;
  private associatedPTO: AssociatedPTO;
  private loggedInOfficer: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private processContactService: ProcessContactService,
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
    this.titleService.setTitle("Interventions");
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
    this.listService.getListData(193).subscribe(intendedProviderIdList => {
      this.intendedProviderIdList = intendedProviderIdList;
    });
    this.listService.getListData(193).subscribe(processManagerProviderIdList => {
      this.processManagerProviderIdList = processManagerProviderIdList;
    });
    let processContact: ProcessContact = new ProcessContact();
    this.route.params.subscribe((params: any) => {

      if (params.hasOwnProperty('profileId')) {
              this.profileId = params['profileId'];
              processContact.profileId = params['profileId'];
       }


    });
    this.initForm();

    this.processContactService.getPTOfficer().subscribe(data => {
      this.associatedPTO = data
      if(this.associatedPTO.officer.indexOf('/')>0){
        this.loggedInOfficer = this.associatedPTO.officer.split("/")[1];
      }else{
        this.loggedInOfficer = this.associatedPTO.officer;
      }     
    });
    //this.authorizationService.getAuthorizationDataByTableId(ProcessContactConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(ProcessContactConstants.featureId, ProcessContactConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(ProcessContactConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(ProcessContactConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProcessContactConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ProcessContactConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.processContactService.sortFilterAndPaginate(processContact, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.processContactList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = processContact;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });


    /*this.searchObjs = [
      { 'field': 'processTypeId', 'type': 'dropdown', 'tableId': '192', 'label': 'Process Type Id' },
      { 'field': 'processRefDate', 'type': 'date', 'label': 'Process Ref Date' },
      { 'field': 'processStartDate', 'type': 'date', 'label': 'Process Start Date' },
      { 'field': 'processManagerProviderId', 'type': 'dropdown', 'tableId': '193', 'label': 'Process Manager Provider Id' },
    ];*/

  }

  delete(processContactId: number) {
   this.action="Archive";
     this.processContactService.isAuthorize(processContactId,this.action).subscribe((response: any) => {
          
                if (response) {
     this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.processContactService.deleteProcessContact(processContactId).subscribe((data: any) => {
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


  /*reset() {
    this.processContactFilterForm.reset();
    let processContact: ProcessContact = new ProcessContact();
    this.sortFilterAndPaginate(processContact, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
   searchProcessContact(filterObj) {
     this.sortSearchPaginationObj.filterObj = filterObj;
     this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
   }*/
  searchProcessContact() {
    this.sortFilterAndPaginate(this.processContactFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  reset() {
    this.processContactFilterForm.controls['terminatedNsiId'].setValue('');
    this.sortFilterAndPaginate(this.processContactFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj) {
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj) {
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    this.processContactService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.processContactList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(ProcessContactConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ProcessContactConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(ProcessContactConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ProcessContactConstants.featureId, field, "Read");
  }

    initForm() {
        this.processContactFilterForm = this._fb.group({
                        terminatedNsiId:[''],
                        profileId:[this.profileId],
                    });
                    
    }

    parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }

}
