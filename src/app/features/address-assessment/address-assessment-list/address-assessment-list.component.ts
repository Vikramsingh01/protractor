import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AddressAssessmentService } from "../address-assessment.service";
import { AddressAssessment } from "../address-assessment";
import { AddressAssessmentConstants } from '../address-assessment.constants';
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
  selector: 'tr-address-assessment',
  templateUrl: 'address-assessment-list.component.html'
})
export class AddressAssessmentListComponent implements OnInit {

    @Input() addressAssessmentId: number;
    private searchObjs: any[] = [];
    addressAssessmentList: any[];
    private action;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    addressAssessmentFilterForm: FormGroup;
                                                                                                                                                                    private addressAssessmentProviderIdList: any[] = [];
          private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private addressAssessmentService: AddressAssessmentService,
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
                                                                                                                                                                    this.listService.getListData(193).subscribe(addressAssessmentProviderIdList => {
        this.addressAssessmentProviderIdList = addressAssessmentProviderIdList;
    });
            let addressAssessment: AddressAssessment = new AddressAssessment();
    this.route.params.subscribe((params: any)=>{

       if(params.hasOwnProperty('offenderAddressId')) {
				addressAssessment.offenderAddressId = params['offenderAddressId'];
			}

    });
    //this.authorizationService.getAuthorizationDataByTableId(AddressAssessmentConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(AddressAssessmentConstants.featureId, AddressAssessmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AddressAssessmentConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AddressAssessmentConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AddressAssessmentConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AddressAssessmentConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.addressAssessmentService.sortFilterAndPaginate(addressAssessment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.addressAssessmentList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = addressAssessment;
            })
        } else {
            this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
        }
    });
        

        this.searchObjs = [
                                                                                                                                                                                                                                                                                                                                                        { 'field': 'addressAssessmentProviderId', 'type': 'dropdown',  'tableId':'193', 'label': 'Address Assessment Provider Id' },
                            ];
    
  }

  delete(addressAssessmentId: number) {

         let addressAssessment: AddressAssessment = new AddressAssessment();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        addressAssessment.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.addressAssessmentService.isAuthorize(addressAssessment.profileId,this.action).subscribe((response: any) => {
              
                if (response) {
            this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.addressAssessmentService.deleteAddressAssessment(addressAssessmentId).subscribe((data: any) => {
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
    this.addressAssessmentFilterForm.reset();
    let addressAssessment: AddressAssessment = new AddressAssessment();
    this.sortFilterAndPaginate(addressAssessment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchAddressAssessment(filterObj) {
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
    this.addressAssessmentService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.addressAssessmentList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(AddressAssessmentConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AddressAssessmentConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(AddressAssessmentConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AddressAssessmentConstants.featureId, field, "Read");
  }
}
