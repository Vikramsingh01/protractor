import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceProviderContactService } from "../service-provider-contact.service";
import { ServiceProviderContact } from "../service-provider-contact";
import { ServiceProviderContactConstants } from '../service-provider-contact.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { SortFilterPagination } from '../../../generic-components/pagination/pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
@Component({
    selector: 'tr-service-provider-contact',
    templateUrl: 'service-provider-contact-list.component.html'
})
export class ServiceProviderContactListComponent implements OnInit {

    @Input() serviceProviderContactId: number;
    private searchObjs: any[] = [];
    serviceProviderContactList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    serviceProviderContactFilterForm: FormGroup;
    private titleList: any[] = [];
    private statusList: any[] = [];
    private isSecureEmailList: any[] = [];
    private programmeAccreditationList: any[] = [];
    private serviceProviderNameList: any[] = [];
    private sortFilterPaginationObj: SortFilterPagination = new SortFilterPagination();
     private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private serviceProviderContactService: ServiceProviderContactService,
        private dataService: DataService,
        private tokenService: TokenService,
        private authorizationService: AuthorizationService,
        private authenticationGuard: AuthenticationGuard,
        private listService: ListService,
        private headerService: HeaderService,
        private confirmService: ConfirmService,
        private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.listService.getListData(227).subscribe(titleList => {
            this.titleList = titleList;
        });
        this.listService.getListData(519).subscribe(statusList => {
            this.statusList = statusList;
        });
        this.listService.getListData(244).subscribe(isSecureEmailList => {
            this.isSecureEmailList = isSecureEmailList;
        });

         this.serviceProviderContactService.getServiceProviderNameList().subscribe(data => {
        console.log(data);
            data.forEach((element:any)=>{
                this.serviceProviderNameList.push({key: element.serviceProviderId, value: element.serviceProviderName})
            })
    });
        this.listService.getListData(522).subscribe(programmeAccreditationList => {
            this.programmeAccreditationList = programmeAccreditationList;
        });
        let serviceProviderContact: ServiceProviderContact = new ServiceProviderContact();
        this.route.params.subscribe((params: any) => {

        });
        //this.authorizationService.getAuthorizationDataByTableId(ServiceProviderContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ServiceProviderContactConstants.featureId, ServiceProviderContactConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(ServiceProviderContactConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(ServiceProviderContactConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ServiceProviderContactConstants.tableId, "Read", this.authorizationData);
           this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ServiceProviderContactConstants.featureId, "Read");
            if (this.authorizedFlag) {
                this.serviceProviderContactService.sortFilterAndPaginate(serviceProviderContact, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                    this.serviceProviderContactList = data.content;
                    this.sortSearchPaginationObj.paginationObj = data;
                    this.sortSearchPaginationObj.filterObj = serviceProviderContact;
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
			
			
        });


       this.searchObjs = [ 
            
         ];

  }


    delete(serviceProviderContactId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.serviceProviderContactService.deleteServiceProviderContact(serviceProviderContactId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.serviceProviderContactFilterForm.value, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj);
                    });
                }
            });
    }


    reset() {
        this.serviceProviderContactFilterForm.reset();
        let serviceProviderContact: ServiceProviderContact = new ServiceProviderContact();
        this.sortFilterAndPaginate(serviceProviderContact, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj);
    }
    searchServiceProviderContact(filterObj) {
        this.sortFilterPaginationObj.filterObj = filterObj;
        this.sortFilterAndPaginate(filterObj, this.sortFilterPaginationObj.paginationObj, this.sortFilterPaginationObj.sortObj);
    }

    sort(sortObj) {
        this.sortFilterPaginationObj.sortObj = sortObj;
        this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, this.sortFilterPaginationObj.paginationObj, sortObj);
    }
    paginate(paginationObj) {
        this.sortFilterPaginationObj.paginationObj = paginationObj;
        this.sortFilterAndPaginate(this.sortFilterPaginationObj.filterObj, paginationObj, this.sortFilterPaginationObj.sortObj);
    }

    sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
        this.serviceProviderContactService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
            this.serviceProviderContactList = data.content;
            this.sortFilterPaginationObj.paginationObj = data;
        });
    }

    isAuthorized(action) {
        //return this.authorizationService.isTableAuthorized(ServiceProviderContactConstants.tableId, action, this.authorizationData);
        return this.authorizationService.isFeatureActionAuthorized(ServiceProviderContactConstants.featureId, action);
    }
    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ServiceProviderContactConstants.tableId, field, "Read", this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ServiceProviderContactConstants.featureId, field, "Read");
    }
}
