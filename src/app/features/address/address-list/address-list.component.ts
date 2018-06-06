import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { addressService } from "../address.service";
import { Address } from "../address";
import { addressConstants } from '../address.constants';
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
import { AddressAssessmentService } from '../../address-assessment/address-assessment.service';

@Component({
  selector: 'tr-address',
  templateUrl: 'address-list.component.html'
})
export class addressListComponent implements OnInit {

  @Input() addressId: number;
  private searchObjs: any[] = [];
  addressList: any[];
  private action;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  addressFilterForm: FormGroup;
  private addressStatusIdList: any[] = [];
  private noFixedAbodeYesNoIdList: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  addressAssessmentList: any[];
  assignedAddressAssessments: number[] = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private addressService: addressService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private addressAssessmentService: AddressAssessmentService,
    private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.listService.getListData(83).subscribe(addressStatusIdList => {
      this.addressStatusIdList = addressStatusIdList;
    });
    this.listService.getListData(244).subscribe(noFixedAbodeYesNoIdList => {
      this.noFixedAbodeYesNoIdList = noFixedAbodeYesNoIdList;
    });
    let address: Address = new Address();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        address.profileId = params['profileId'];
      }
    });
    //this.authorizationService.getAuthorizationDataByTableId(addressConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(addressConstants.featureId, addressConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(addressConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(addressConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(addressConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(addressConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.addressService.sortFilterAndPaginate(address, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.addressList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = address;
        })

        this.addressAssessmentService.getAddressAssessmentListByProfileId(address.profileId).subscribe(data => {
          this.addressAssessmentList = data;
          var addressAssessmentArr: number[] = [];
          this.addressAssessmentList.forEach(element => {
            addressAssessmentArr.push(parseInt(element.value, 10));
          });
          this.assignedAddressAssessments = addressAssessmentArr;
          console.log("=====sss===" + this.assignedAddressAssessments);
        });

      } else {
        this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
      }
    });


    this.searchObjs = [
      { 'field': 'addressStatusId', 'type': 'dropdown', 'tableId': '83', 'label': 'Address Status Id' },
      { 'field': 'postcode', 'type': 'text', 'label': 'Postcode' },
      { 'field': 'startDate', 'type': 'date', 'label': 'Start Date' },
      { 'field': 'endDate', 'type': 'date', 'label': 'End Date' },
    ];

  }

  isAddressAssesmentExists(offenderAddressId: number){
      if(this.assignedAddressAssessments.indexOf(offenderAddressId)>-1){
          return true;
        }
        return false;
  }
  delete(offenderAddressId: number) {

   let address: Address = new Address();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('profileId')) {
        address.profileId = params['profileId'];
      }
    });
    this.action="ARCHIVE";
     this.addressService.isAuthorize(address.profileId,this.action).subscribe((response: any) => {
              
                if (response) {
     let offenderAddress = Utility.getObjectFromArrayByKeyAndValue(this.addressList, "offenderAddressId", offenderAddressId);
    if(this.listService.getCodeByTableIdAndPkId(83,offenderAddress.addressStatusId) == "M"){
       this.headerService.setErrorPopup({errorMessage: "Unable to delete main address, please change the address type and try again"});
      //this.router.navigate(['']);
   
    }else{
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.addressService.deleteaddress(offenderAddressId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
    }
    }
       else {
                this.headerService.setErrorPopup({errorMessage: "You are not authorised to perform this action on this SU record. Please contact the Case Manager."});
            }    
            });

    
  }


  reset() {
    this.addressFilterForm.reset();
    let address: Address = new Address();
    this.sortFilterAndPaginate(address, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchaddress(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
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
    this.addressService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.addressList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(addressConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(addressConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(addressConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(addressConstants.featureId, field, "Read");
  }
}
