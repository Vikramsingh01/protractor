import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { ContactService } from "../../../contact/contact.service";
import { RegisterReviewService } from "../register-reviews.service";
import { RegisterReview } from "../registerreviews";
import { RegisterRegistrationReview } from '../register-registration-review';
import { RegisterReviewConstants } from '../register-reviews.constants';
import { TokenService } from '../../../../services/token.service';
import { DataService } from '../../../../services/data.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../../shared/utility';
import { AuthenticationGuard } from '../../../../guards/authentication.guard';
import { ListService } from '../../../../services/list.service';
import { HeaderService } from '../../../../views/header/header.service';
import { FilterPipe } from '../../../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../../../generic-components/search/sort-search-pagination';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { ConfirmService } from '../../../../generic-components/confirm-box/confirm.service';

@Component({
    selector: 'tr-register-review',
    templateUrl: 'register-reviews-list.component.html'
})
export class RegisterReviewListComponent implements OnInit {

    @Input() registrationId: number;
    private searchObjs: any[] = [];
    registrationList: any[];
    private authorizationData: any;
    private action;
    private authorizedFlag: boolean = false;
    registerReviewFilterForm: FormGroup;
    private registerTypeIdList: any[] = [];
    private registrationProviderIdList: any[] = [];
    private registeringTeamList: any[] = [];
    private registeringOfficerList: any[] = [];
    private registrationCategoryIdList: any[] = [];
    private registrationLevelIdList: any[] = [];
    private registerTypeFlagList: any[] = [];
    private activeYesNoIdList: any[] = [];
    private officerIds: any = [];
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private router: Router,
        private route: ActivatedRoute,
        private contactService: ContactService,
        private registrationService: RegisterReviewService,
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
        this.titleService.setTitle("Register Review");
        this.initForm();

        this.listService.getListData(207).subscribe(registerTypeIdList => {
            this.registerTypeIdList = registerTypeIdList;
        });
        
        this.listService.getListData(208).subscribe(registerTypeFlagList => {
            this.registerTypeFlagList = registerTypeFlagList;
        });
        
        let registration: RegisterReview = new RegisterReview();
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('profileId')) {
                registration.profileId = params['profileId'];
                this.registerReviewFilterForm = this._fb.group({
                    profileId: [registration.profileId],
                    activeFlagId: [''],
                    registerTypeFlagId: ['']
                })
            }

        });

       /*  this.contactService.getLoggedInUserTeamId().subscribe(data=>{
            if(data!=null && data.hasOwnProperty("teamId")&& data.teamId!=null){
                var  selectedTeamId=data.teamId;
               
            }
        }); */

        this.listService.getListDataByLookupAndPkValue(270, 535, this.dataService.getLoggedInUserId()).subscribe(listObj => {
            this.officerIds = listObj;
        });

        this.authorizationService.getAuthorizationData(RegisterReviewConstants.featureId, RegisterReviewConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(RegisterReviewConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(RegisterReviewConstants.featureId, authorizationData[1]);
            }

            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(RegisterReviewConstants.featureId, "Read");
            if (this.authorizedFlag) {
                this.sortSearchPaginationObj.sortObj.field = 'familyName';
                this.sortSearchPaginationObj.sortObj.sort = 'asc';
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
    
    reset(form: FormGroup) {
        form.reset();
        var filterObj:any={};
        this.sortSearchPaginationObj.filterObj.registerDue = null;
        this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
    }

    search() {
        this.sortSearchPaginationObj.filterObj = this.registerReviewFilterForm.value;

        if(this.sortSearchPaginationObj.filterObj!=null && this.sortSearchPaginationObj.filterObj.hasOwnProperty("caseManager") && this.sortSearchPaginationObj.filterObj.caseManager=='null')
            this.sortSearchPaginationObj.filterObj.caseManager = null;

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
        if(filterObj!=null && filterObj.hasOwnProperty("registerServiceUser") && filterObj.registerServiceUser==1)
            filterObj.caseManager=null;

        this.registrationService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
            this.registrationList = data.content;
            this.sortSearchPaginationObj.paginationObj = data;
        });
    }

    isAuthorized(action) {
        return this.authorizationService.isFeatureActionAuthorized(RegisterReviewConstants.featureId, action);
    }

    isFeildAuthorized(field) {
        return this.authorizationService.isFeildAuthorized(RegisterReviewConstants.featureId, field, "Read");
    }

    initForm() {
        this.registerReviewFilterForm = this._fb.group({
            registerServiceUser:[],
            caseManager:[],
            registerDue:[]
        });
    }
}
