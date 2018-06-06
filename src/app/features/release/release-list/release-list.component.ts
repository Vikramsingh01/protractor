import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { ReleaseService } from "../release.service";
import { Release } from "../release";
import { ReleaseConstants } from '../release.constants';
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
import { EventService } from '../../event/event.service';

@Component({
  selector: 'tr-release',
  templateUrl: 'release-list.component.html'
})
export class ReleaseListComponent implements OnInit {

  @Input() releaseId: number;
  private searchObjs: any[] = [];
  releaseList: any[];
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  releaseFilterForm: FormGroup;
  private releaseTypeIdList: any[] = [];
  private eventJson: any[] = [];
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private isActiveRelease: boolean = false;
  private isThisFirstRelease: boolean = false;
  private isEventTerminated: boolean = false;
  private isActivePss: boolean = false;
  private isReleaseAllowed: boolean = false;
  private isActiveRecall: boolean = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private releaseService: ReleaseService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder,
    private titleService: Title,
    private eventService: EventService) {
  }

  ngOnInit() {
    this.titleService.setTitle("Release");
    this.listService.getListData(211).subscribe(releaseTypeIdList => {
      this.releaseTypeIdList = releaseTypeIdList;
    });
    let release: Release = new Release();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('eventId')) {
        release.eventId = params['eventId'];
      }

    });
    //this.authorizationService.getAuthorizationDataByTableId(ReleaseConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(ReleaseConstants.featureId, ReleaseConstants.tableId).subscribe(authorizationData => {
      this.authorizationData = authorizationData;
      if (authorizationData.length > 0) {
        this.dataService.addFeatureActions(ReleaseConstants.featureId, authorizationData[0]);
        this.dataService.addFeatureFields(ReleaseConstants.featureId, authorizationData[1]);
      }
      //this.authorizedFlag = this.authorizationService.isTableAuthorized(ReleaseConstants.tableId, "Read", this.authorizationData);
      this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ReleaseConstants.featureId, "Read");
      if (this.authorizedFlag) {
        this.eventService.getEvent(release.eventId).subscribe((response: any) => {
          this.eventJson = this.releaseService.removeConstantsFields(response);
          this.releaseService.complexRefDataRequestForDisposal(this.eventJson).subscribe((breResponse: any) => {
            if (breResponse != null && breResponse.resultMap != null && breResponse.resultMap.fieldObjectList != null && breResponse.resultMap.fieldObjectList.length > 0) {
              breResponse.resultMap.fieldObjectList.forEach(element => {
                if (element.fieldName === "isReleaseAllowed") {
                  this.isReleaseAllowed = true;
                }
              });
            }

          });
        });

        this.releaseService.getActiveRecall(release.eventId).subscribe((count: any) => {
          if (count > 0)
            this.isActiveRecall = true;
        });

        this.releaseService.sortFilterAndPaginate(release, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe(data => {
          this.releaseList = data.content;
          if (this.releaseList.length == 0) {
            this.isThisFirstRelease = true;
          }
          this.sortSearchPaginationObj.paginationObj = data;
          this.sortSearchPaginationObj.filterObj = release;
        })
      } else {
        this.headerService.setAlertPopup("Not authorized");
      }
    });

    this.releaseService.getActiveRelease(release.eventId).subscribe((response: any) => {
      if (response.activeRelease != null) {
        this.isActiveRelease = true;
      }
    });

    this.releaseService.isEventTerminated(release.eventId).subscribe((response: any) => {
      if (response != null && response > 0) {
        this.isEventTerminated = true;
      }
    });

    this.releaseService.getActivePss(release.eventId).subscribe((response: any) => {
      if (response > 0) {
        this.isActivePss = true;
      }
    });

    this.searchObjs = [
      { 'field': 'releaseDate', 'type': 'date', 'label': 'Release Date' },
      { 'field': 'releaseTypeId', 'type': 'dropdown', 'tableId': '211', 'label': 'Release Type Id' },
    ];

  }

  delete(releaseId: number) {
    this.confirmService.confirm(
      {
        message: 'You are about to undo this Release. All associated Licence Conditions will be deleted.',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.releaseService.deleteRelease(releaseId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          });
        }
      });
  }


  reset() {
    this.releaseFilterForm.reset();
    let release: Release = new Release();
    this.sortFilterAndPaginate(release, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  searchRelease(filterObj) {
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
    this.releaseService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.releaseList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(ReleaseConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ReleaseConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(ReleaseConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ReleaseConstants.featureId, field, "Read");
  }
}
