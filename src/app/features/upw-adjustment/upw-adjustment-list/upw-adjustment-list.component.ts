import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { UpwAdjustmentService } from "../upw-adjustment.service";
import { UpwAdjustment } from "../upw-adjustment";
import { UpwAdjustmentConstants } from '../upw-adjustment.constants';
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
  selector: 'tr-upw-adjustment',
  templateUrl: 'upw-adjustment-list.component.html'
})
export class UpwAdjustmentListComponent implements OnInit {

    @Input() upwAdjustmentId: number;
    private searchObjs: any[] = [];
    upwAdjustmentList: any[];
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    upwAdjustmentFilterForm: FormGroup;
                                                                                                                                                                              private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private upwAdjustmentService: UpwAdjustmentService,
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
    this.titleService.setTitle("Community Payback Adjustment");
                                                                                                                                                                                let upwAdjustment: UpwAdjustment = new UpwAdjustment();
    this.route.params.subscribe((params: any)=>{

    });
    //this.authorizationService.getAuthorizationDataByTableId(UpwAdjustmentConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(UpwAdjustmentConstants.featureId, UpwAdjustmentConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(UpwAdjustmentConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(UpwAdjustmentConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(UpwAdjustmentConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(UpwAdjustmentConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.upwAdjustmentService.sortFilterAndPaginate(upwAdjustment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
                this.upwAdjustmentList = data.content;
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = upwAdjustment;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        

        this.searchObjs = [
                                { 'field': 'adjustmentType', 'type': 'text', 'label': 'Adjustment Type' },
                                                        { 'field': 'adjustmentDate', 'type': 'date', 'label': 'Adjustment Date' },
                                                                        { 'field': 'adjustmentAmount', 'type': 'text', 'label': 'Adjustment Amount' },
                                                        { 'field': 'eventId', 'type': 'text', 'label': 'Event Id' },
                                                                                                                                                                                                                                                                                                    ];
    
  }

  delete(upwAdjustmentId: number) {
        this.confirmService.confirm(
            {
                message: 'Do you want to delete this record?',
                header: 'Delete Confirmation',
                icon: 'fa fa-trash',
                accept: () => {
                    this.upwAdjustmentService.deleteUpwAdjustment(upwAdjustmentId).subscribe((data: any) => {
                        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
                    });
                }
            });
    }


  reset(){
    this.upwAdjustmentFilterForm.reset();
    let upwAdjustment: UpwAdjustment = new UpwAdjustment();
    this.sortFilterAndPaginate(upwAdjustment, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchUpwAdjustment(filterObj) {
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
    this.upwAdjustmentService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.upwAdjustmentList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(UpwAdjustmentConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(UpwAdjustmentConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(UpwAdjustmentConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(UpwAdjustmentConstants.featureId, field, "Read");
  }
}
