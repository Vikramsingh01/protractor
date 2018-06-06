import { Component, Input, OnInit } from '@angular/core';
import { Http,URLSearchParams } from '@angular/http';
import { ContactService } from "../../contact/contact.service";
import { Contact } from "../../contact/contact";
import { ContactConstants } from '../../contact/contact.constants';
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
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { IDate } from '../../../generic-components/date-picker/interfaces/date.interface';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import {Title} from "@angular/platform-browser";
@Component({
    selector: 'tr-plan-appointment',
    templateUrl: 'plan-appointment-list.component.html'
})
export class PlanAppontmentListComponent implements OnInit {

    @Input() contactId: number;
    private searchObjs: any[] = [];
    contactList: any[];
    tmp_filterForm: any={};
    filterForm: any={};
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    contactFilterForm: FormGroup;
    private contactTypeIdList: any[] = [];
     private contactCategoryIdList: any[] = [];
     private relatesToList: any[] = [];
    private providerIdList: any[] = [];
    private contactOutcomeIdList: any[] = [];
    private entryCategoryIdList: any[] = [];
    private enforcementActionIdList: any[] = [];
    private sensitiveContactYesNoIdList: any[] = [];
    private alertYesNoIdList: any[] = [];
    private locationList: any[] = [];
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    private relateto=[];
    private profileId;
    private officerList=[];
    private officerIds: any = [];
    numberOfPages: number[] = [1];
    defaultItemPerPage: number = 5;
    totalPages = [];
    dropdownItems = [5, 10, 15, 20];
    defaultPageNumber = 0;
    private appointmentTypes:any=[];
    private todayDate:IDate={year:new Date().getFullYear(),month:new Date().getMonth()+1,day:new Date().getDate()-1}
    private dateOption:any={disableUntil:this.todayDate}

    flagForPaginatioStuff: boolean = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private contactService: ContactService,
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
        this.titleService.setTitle('Plan Appointment');
        this.initForm();
        this.contactService.getColourCodes().subscribe(data=>{
             this.contactOutcomeIdList = data;
        })

          this.listService.getListData(101).subscribe(data => {
            this.contactCategoryIdList = data;
        });

        this.listService.getListData(104).subscribe(contactTypeIdList => {
            this.contactTypeIdList = contactTypeIdList;
        });
        this.listService.getListData(193).subscribe(providerIdList => {
            this.providerIdList = providerIdList;
        });
        //this.listService.getListData(103).subscribe(contactOutcomeIdList => {
           // this.contactOutcomeIdList = contactOutcomeIdList;
        //});
       this.listService.getListDataWithLookup(270, 502).subscribe(crcList => {
         this.officerList = crcList;
        });

        this.listService.getListData(121).subscribe(enforcementActionIdList => {
            this.enforcementActionIdList = enforcementActionIdList;
        });
        this.listService.getListData(244).subscribe(sensitiveContactYesNoIdList => {
            this.sensitiveContactYesNoIdList = sensitiveContactYesNoIdList;
        });
        this.listService.getListData(244).subscribe(alertYesNoIdList => {
            this.alertYesNoIdList = alertYesNoIdList;
        });
        this.listService.getListData(101).subscribe(entryCategoryIdList => {
            this.entryCategoryIdList = entryCategoryIdList;
        });
        this.listService.getListData(2544).subscribe(locationList => {
            this.locationList = locationList;
        });
        this.contactService.getAppointmentType().subscribe(data=>{
            this.appointmentTypes=data.appointmentTypes;
        })

       /*  this.contactService.getLoggedInUserTeamId().subscribe(data=>{
            if(data!=null && data.hasOwnProperty("teamId")&& data.teamId!=null){
                var  selectedTeamId=data.teamId;
             
            }
        }); */
        this.listService.getListDataByLookupAndPkValue(270, 535, this.dataService.getLoggedInUserId()).subscribe(listObj => {
            this.officerIds = listObj;
        });

        let contact: Contact = new Contact();
        
        
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                contact.profileId = params['profileId'];
                this.profileId=params['profileId'];
            }

        });
        if(contact!=null && contact.profileId!=null){
            this.contactService.getRelatedToList(contact.profileId).subscribe(data=>{
                this.relateto=data;
           });
        }
             
        let sortFields: any[] = [];
        sortFields.push({field: "contactDate", sort: "desc" }, {field: "contactStartTime", sort: "desc" });
        //this.authorizationService.getAuthorizationDataByTableId(ContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ContactConstants.featureId, ContactConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(ContactConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(ContactConstants.featureId, authorizationData[1]);
            }
                 
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ContactConstants.tableId, "Read", this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ContactConstants.featureId, "Read");
            if (this.authorizedFlag) {
                if(this.contactFilterForm.value.fromDate==null || (this.contactFilterForm.value.fromDate!=null && this.trimValue(this.contactFilterForm.value.fromDate)=="") ){
                     this.contactFilterForm.controls['fromDate'].setValue(Utility.convertDateToString(new Date()));
                }
                if(this.contactFilterForm.value.toDate==null || (this.contactFilterForm.value.toDate!=null && this.trimValue(this.contactFilterForm.value.toDate)=="") ){
                    this.contactFilterForm.controls['toDate'].setValue(Utility.convertDateToString(new Date()));
                }
                this.contactService.getPlanedAppointment(this.contactFilterForm.value, this.sortSearchPaginationObj.paginationObj, sortFields).subscribe(data => {
                    this.contactList = data.content;
                    this.sortSearchPaginationObj.paginationObj = data;
                    this.sortSearchPaginationObj.filterObj = contact;
                    
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });


        this.searchObjs = [
            { 'field': 'rarDay', 'type': 'dropdown', 'label': 'RAR Day' },
            
            { 'field': 'contactOutcomeId', 'type': 'dropdown', 'label': 'Outstanding Enforcements ' },
            
            { 'field': 'contactTypeId', 'type': 'dropdown', 'tableId': '104', 'label': 'Entry Type ' },

            { 'field': 'relatesTo', 'type': 'dropdown', 'tableId': '104' ,'label': 'RelatesTo' },

        ];

    }


  onSubmit() {
    if(this.contactFilterForm.valid)
  this.searchContact(this.contactFilterForm.value)
  return false;
  }

  getPage(page: number, itemPerPage: number) {
    this.totalPages = [];
    
   if(this.tmp_filterForm.fromDate==null || (this.tmp_filterForm.fromDate!=null &&  this.trimValue(this.tmp_filterForm.fromDate)=="")){
        this.tmp_filterForm.fromDate=Utility.convertDateToString(new Date());
   }
   if(this.tmp_filterForm.toDate==null || (this.tmp_filterForm.toDate!=null &&  this.trimValue(this.tmp_filterForm.toDate)=="")){
    this.tmp_filterForm.toDate=Utility.convertDateToString(new Date());
   }
   this.contactService.getPlanedAppointment(this.tmp_filterForm, 5, page - 1).subscribe((data: any) => {
      for (var i = 1; i <= data.totalPages; i++) {
        this.totalPages.push(i);
      }
      this.contactList = data.content;

    });
  }
    delete(contactId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.contactService.deleteContact(contactId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.contactFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


    reset(form: FormGroup) {
       form.reset();
        var filterObj:any={};
        this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
        return false ;   
    }
    searchContact(filterObj) {
        this.sortSearchPaginationObj.filterObj = filterObj;
        this.sortSearchPaginationObj.paginationObj.number = 0;
        this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);

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

        if(filterObj!=null && filterObj.hasOwnProperty("activitesList") && filterObj.activitesList==1)
            filterObj.caseManager=null;
        if(filterObj.fromDate==null || (filterObj.fromDate!=null &&  this.trimValue(filterObj.fromDate)=="")){
             filterObj.fromDate=Utility.convertDateToString(new Date());
        }
        if(filterObj.toDate==null || (filterObj.toDate!=null &&  this.trimValue(filterObj.toDate)=="")){
            filterObj.toDate=Utility.convertDateToString(new Date());
        }

        this.contactService.getPlanedAppointment(filterObj, paginationObj, sortObj).subscribe((data: any) => {
            this.contactList = data.content;
            this.sortSearchPaginationObj.paginationObj = data;
        });
    }

    isAuthorized(action) {
        //return this.authorizationService.isTableAuthorized(ContactConstants.tableId, action, this.authorizationData);
        return this.authorizationService.isFeatureActionAuthorized(ContactConstants.featureId, action);
    }
    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ContactConstants.tableId, field, "Read", this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ContactConstants.featureId, field, "Read");
    }
      initForm() {
        this.contactFilterForm = this._fb.group({
            fromDate:['', Validators.compose([ValidationService.DateBefore(Utility.convertDateToString(new Date()))])],
            toDate:['', Validators.compose([ValidationService.DateBefore(Utility.convertDateToString(new Date()))])],
            activities:[],
            caseManager:[],
            activitesList:[],
            appointmentType:[]
        });
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
