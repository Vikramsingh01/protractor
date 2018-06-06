import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { CourtWorkService } from "../court-work.service";
import { CourtWork } from "../court-work";
import { CourtWorkConstants } from '../court-work.constants';
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
  selector: 'tr-court-work',
  templateUrl: 'court-work-list.component.html',
})
export class CourtWorkListComponent implements OnInit {
  event: Event = new Event();
  private eventId: number;
  @Input() courtWorkId: number;
  private searchObjs: any[] = [];
  courtWorkList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  courtWorkFilterForm: FormGroup;
  private processTypeIdList: any[] = [];
  private processStageIdList: any[] = [];
  private processOutcomeIdList: any[]=[];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private reqTypeIds=[];
  private profileId:number;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private courtWorkService: CourtWorkService,private eventService: EventService,
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
    
    this.titleService.setTitle("Court Work");
    this.listService.getListData(192).subscribe(processTypeIdList => {
      this.processTypeIdList = processTypeIdList;
    });
    this.listService.getListData(191).subscribe(processStageIdList => {
      this.processStageIdList = processStageIdList;
    });
     this.listService.getListData(169).subscribe(processOutcomeIdList => {
      this.processOutcomeIdList = processOutcomeIdList;
    });
    let courtWork: CourtWork = new CourtWork();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        courtWork.eventId = params['eventId'];
      }
       if (params.hasOwnProperty('profileId')) {
              courtWork.profileId = params['profileId'];
              this.profileId = params['profileId'];
       }

       this.eventId = params['eventId'];
       this.event.profileId = params['profileId'];
       this.eventService.getEvent(this.eventId).subscribe((data: Event) => {
         this.event = data;
       });

    });
    this.initForm();
    //this.authorizationService.getAuthorizationDataByTableId(CourtWorkConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(CourtWorkConstants.featureId, CourtWorkConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(CourtWorkConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(CourtWorkConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtWorkConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CourtWorkConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.courtWorkService.sortFilterAndPaginate(courtWork, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.courtWorkList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = courtWork;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });
    this.courtWorkService.getRequestFilteredTypeList().subscribe(data=>{
            this.reqTypeIds=data.reqTypeIds;
         })

  }
  updateCourtWorkList(value: boolean){
    if(value){
    this.courtWorkService.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.courtWorkList = data.content;
          this.sortSearchPaginationObj.paginationObj = data;
          //this.sortSearchPaginationObj.filterObj = filterObj;
        
    })
    }
  }
  delete(courtWorkId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.courtWorkService.deleteCourtWork(courtWorkId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.courtWorkFilterForm.controls['processTypeId'].setValue('');
    this.courtWorkFilterForm.controls['processStageId'].setValue('');
    this.sortFilterAndPaginate(this.courtWorkFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchCourtWork() {
    this.sortFilterAndPaginate(this.courtWorkFilterForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
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
    this.courtWorkService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.courtWorkList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(CourtWorkConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CourtWorkConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(CourtWorkConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CourtWorkConstants.featureId, field, "Read");
  }

  initForm() {
        this.courtWorkFilterForm = this._fb.group({
                        processTypeId:[''],
                        processStageId:[''],
                        eventId:[this.eventId],
                        profileId:[this.profileId],
                    });
                    
    }
}
