import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { RegistrationService } from "../registration.service";
import { Registration } from "../registration";
import { RegistrationConstants } from '../registration.constants';
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
import { deregistrationConstants } from '../../deregistration/deregistration.constants';

@Component({
    selector: 'tr-registration',
    templateUrl: 'registration-list.component.html'
})
export class RegistrationListComponent implements OnInit {

    @Input() registrationId: number;
    private searchObjs: any[] = [];
    registrationList: any[];
    private authorizationData: any;
    private action;
    private authorizedFlag: boolean = false;
    registrationFilterForm: FormGroup;
    private registerTypeIdList: any[] = [];
    private registrationProviderIdList: any[] = [];
    private registeringTeamList: any[] = [];
    private registeringOfficerList: any[] = [];
    private registrationCategoryIdList: any[] = [];
    private registrationLevelIdList: any[] = [];
    private registerTypeFlagList: any[] = [];
    private activeYesNoIdList: any[] = [];
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private registrationService: RegistrationService,
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
        this.titleService.setTitle("Registrations");
        this.listService.getListData(207).subscribe(registerTypeIdList => {
            this.registerTypeIdList = registerTypeIdList;
        });
        this.listService.getListData(193).subscribe(registrationProviderIdList => {
            this.registrationProviderIdList = registrationProviderIdList;
        });

        this.listService.getListDataWithLookup(445, 501).subscribe(registeringTeamList => {
            this.registeringTeamList = registeringTeamList;
        });
        this.listService.getListDataWithLookup(270, 502).subscribe(registeringOfficerList => {
            this.registeringOfficerList = registeringOfficerList;
        });

        this.listService.getListData(205).subscribe(registrationCategoryIdList => {
            this.registrationCategoryIdList = registrationCategoryIdList;
        });
        this.listService.getListData(206).subscribe(registrationLevelIdList => {
            this.registrationLevelIdList = registrationLevelIdList;
        });

        this.listService.getListData(208).subscribe(registerTypeFlagList => {
            this.registerTypeFlagList = registerTypeFlagList;
        });

        this.listService.getListData(244).subscribe(activeYesNoIdList => {
            this.activeYesNoIdList = activeYesNoIdList;
        });
        let registration: Registration = new Registration();
        this.route.params.subscribe((params: any) => {

            if (params.hasOwnProperty('profileId')) {
                registration.profileId = params['profileId'];
                this.registrationFilterForm = this._fb.group({
                    profileId: [registration.profileId],
                    activeFlagId: [''],
                    registerTypeFlagId: ['']
                })
            }

        });

        //this.authorizationService.getAuthorizationDataByTableId(RegistrationConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(RegistrationConstants.featureId, RegistrationConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(RegistrationConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(RegistrationConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(RegistrationConstants.tableId, "Read", this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RegistrationConstants.featureId, "Read");
            if (this.authorizedFlag) {
                this.registrationService.sortFilterAndPaginate(registration, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                    this.registrationList = data.content;
                    this.sortSearchPaginationObj.paginationObj = data;
                    this.sortSearchPaginationObj.filterObj = registration;
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });


        this.searchObjs = [
            { 'field': 'profileId', 'type': 'hidden', 'value': registration.profileId },
            { 'field': 'registerTypeFlagId', 'type': 'dropdown',  'tableId':'208', 'label': 'Flag Type' },
            { 'field': 'activeFlagId', 'type': 'dropdown', 'tableId':'244', 'label': 'Show Inactive Registrations?' }
        ];
    }

    delete(registrationId: number) {

       let registration: Registration = new Registration();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        registration.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.registrationService.isAuthorize(registration.profileId,this.action).subscribe((response: any) => {

                if (response) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.registrationService.deleteRegistration(registrationId).subscribe((data: any) => {
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


    reset() {
        this.registrationFilterForm.controls['registerTypeFlagId'].setValue(null);
        this.registrationFilterForm.controls['activeFlagId'].setValue(null);
        this.sortSearchPaginationObj.filterObj.registerTypeFlagId = null;
        this.sortSearchPaginationObj.filterObj.activeFlagId = null;
        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }
    search() {
        this.sortSearchPaginationObj.filterObj = this.registrationFilterForm.value;
        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }
    searchRegistration(filterObj) {
        this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
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
        this.registrationService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
            this.registrationList = data.content;
            this.sortSearchPaginationObj.paginationObj = data;
        });
    }

    isAuthorized(action) {
        //return this.authorizationService.isTableAuthorized(RegistrationConstants.tableId, action, this.authorizationData);
        return this.authorizationService.isFeatureActionAuthorized(RegistrationConstants.featureId, action);
    }
    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(RegistrationConstants.tableId, field, "Read", this.authorizationData);
        return this.authorizationService.isFeildAuthorized(RegistrationConstants.featureId, field, "Read");
    }
    isDeregistrationAuthorized(action){
      return this.authorizationService.isFeatureActionAuthorized(deregistrationConstants.featureId, action);
    }
}
