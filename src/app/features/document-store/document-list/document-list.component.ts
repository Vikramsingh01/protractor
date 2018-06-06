import { Component, OnInit, Input } from '@angular/core';
import { DocumentStoreService } from "../document-store.service";
import { OffenderProfileService } from "../../offenderprofile/offenderprofile.service";
import { DocumentStore, EntityType } from "../document-store";
import { Observable } from "rxjs";
import { DataService } from "../../../services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { ListService } from '../../../services/list.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HeaderService } from '../../../views/header/header.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DocumentEntityFeatureConstants } from '../document-entity-feature.constants';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import {saveAs } from 'file-saver';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-document-list',
  templateUrl: './document-list.component.html',
  providers: [DocumentStoreService, OffenderProfileService]

})
export class DocumentListComponent implements OnInit {
  private authorizedFlag: boolean = true;
  private crn: string;
  private documents: Document[] = [];
  private searchObjs: any[] = [];
  private entityTypes: any[] = [];
  private linkedToTypes: any[] = [];
  private documentTypes: any[] = [];

  private profileId;
  // private drsResponseStatus: String = "";
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private documentStore: DocumentStore = new DocumentStore();
  private documentSearchForm: FormGroup;
  private buttonLabel: String = "";
  private error: boolean = false;
  private dataNotFound: boolean = false;
  private provider: string;
  @Input("showResetButton") showResetButton: Boolean = true;

  constructor(private _fb: FormBuilder, private router: Router,
    private documentStorService: DocumentStoreService,
    private offenderProfileService: OffenderProfileService,
    private headerService: HeaderService,
    private listService: ListService,
    private route: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Documents');
    this.sortSearchPaginationObj.sortObj.field = 'lastModifiedDate';
    this.sortSearchPaginationObj.sortObj.sort = 'desc';
    this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
    });
    this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe(res => {
      this.crn = res.caseReferenceNumber;
      this.getDocumentList(this.crn);
    })

    this.listService.getListData(2542).subscribe(entityTypes => {
      this.entityTypes = entityTypes;
    });

    this.listService.getListData(2541).subscribe(documentTypes => {
      this.documentTypes = documentTypes;
    });

    this.listService.getListDataByLookupAndPkValue(-1, 518, this.profileId).subscribe(lookupList => {
      if (lookupList != null && lookupList.length > 0) {
        this.provider = lookupList[0].value;
      }
    });

    if (this.authorizedFlag) {
      this.initForm();
    } else {
      this.headerService.setAlertPopup("Not authorized");
    }
  }

 onSubmit() {
    if (this.documentSearchForm.valid) {
      this.resetSortObj();
      this.documentStorService.sortFilterAndPaginate(this.crn, this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((data: any) => {
        this.documents = data.content;
        this.sortSearchPaginationObj.paginationObj = data;
        this.error = false
        if (data.numberOfElements == 0) {
          this.dataNotFound = true;
        } else {
          this.dataNotFound = false;
        }
      }, (err) => {
        this.handleErrorResponse(err);
      });
    }
  }


  initForm() {
    this.documentSearchForm = this._fb.group({
      entityType: [''],
      docType: [this.documentStore.docType],
      documentName: [this.documentStore.documentName],
      isReadOnly: [this.documentStore.isReadOnly],
      fromDate: [this.documentStore.fromDate, Validators.compose([ValidationService.dateValidator])],
      toDate: [this.documentStore.toDate, Validators.compose([ValidationService.dateValidator])]
    });
  }


getDocumentList(crn) {
    this.documentStorService.getDocumentList(crn, this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((response: any) => {
      this.documents = response.content;
      if (response.numberOfElements == 0) {
        this.dataNotFound = true;
      } else {
        this.dataNotFound = false;
      }
    },
      (err) => {
        this.handleErrorResponse(err);
      });
  }
  isFeildAuthorized(field) {
    return true;
  }


  downloadDocument(documentAlfrescoId: string) {
    let xhr = this.documentStorService.downloadDocument(documentAlfrescoId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var blob = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') });
          saveAs(blob,xhr.getResponseHeader('filename') , true);
          } else if (xhr.status == 0) {
          this.headerService.setErrorPopup({ errorMessage: 'Failed to connect to DRS. Please contact the system administrator.' });
        } else {
          var rsp = this.arrayBufferToString(xhr.response);
          let response = JSON.parse(rsp);
          this.headerService.setErrorPopup({ errorMessage: response.message });
        }
      }
    }
  }

arrayBufferToString(buffer) {
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if (/[\u0080-\uffff]/.test(str)) {
      throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
  }

 updateLinkedToField(entityType) {
    if (entityType != null && entityType != '') {
      let lookupId: number = this.fetchLookupFromEnityType(entityType);
      this.listService.getListDataByLookupAndPkValue(-1, lookupId, this.profileId).subscribe(lookupList => {
        this.linkedToTypes = lookupList;
      });
    } else {
      this.linkedToTypes = [];
    }
  }

   fetchLookupFromEnityType(entityType): number {
    let lookupId = -1;
    if (entityType == '') {
      lookupId = -1;
    } else if (entityType == 'REFERRAL') {
      lookupId = 509;
    } else if (entityType == 'COURTREPORT') {
      lookupId = 510;
    } else if (entityType == 'INSTITUTIONALREPORT') {
      lookupId = 524;
    } else if (entityType == 'CONTACT') {
      lookupId = 511;
    } else if (entityType == 'OFFENDER') {
      lookupId = 523;
    } else if (entityType == 'PERSONALCONTACT') {
      lookupId = 512;
    } else if (entityType == 'EVENT') {
      lookupId = 513;
    } else if (entityType == 'ADDRESSASSESSMENT') {
      lookupId = 514;
    } else if (entityType == 'ASSESSMENT') {
      lookupId = 515;
    } else if (entityType == 'PROCESSCONTACT') {
      lookupId = 516;
    } else if (entityType == 'RATECARDINTERVENTION') {
      lookupId = -1;
    } else if (entityType == 'CASEALLOCTION') {
      lookupId = -1;
    } else if (entityType == 'PERSONALCIRCUMSTANCE') {
      lookupId = 508;
    } else if (entityType == 'UPWDETAILS') {
      lookupId = 525;
    } else if (entityType == 'UPWAPPOINTMENT') {
      lookupId = 526;
    }
    return lookupId;
  }

   reset() {
    if (this.showResetButton) {
      this.documentSearchForm.reset();
      this.linkedToTypes = [];
      this.sortSearchPaginationObj = new SortSearchPagination();
      this.sortSearchPaginationObj.sortObj.field = 'lastModifiedDate';
      this.documentStorService.sortFilterAndPaginate(this.crn, this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((data: any) => {
        this.documents = data.content;
        this.error = false
        if (data.numberOfElements == 0) {
          this.dataNotFound = true;
        } else {
          this.dataNotFound = false;
        }
      },
        (err) => {
          this.handleErrorResponse(err);
        });
    }
  }

  sort(sortObj) {
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj) {
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.documentSearchForm.value, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

   sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    this.documentStorService.sortFilterAndPaginate(this.crn, filterObj, paginationObj, sortObj).subscribe((data: any) => {
      this.documents = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
      if (data.numberOfElements == 0) {
        this.dataNotFound = true;
      } else {
        this.dataNotFound = false;
      }
    },
      (err) => {
        this.handleErrorResponse(err);
      });
  }

  isAuthorized(action, entityType) {
    return this.authorizationService.isFeatureActionAuthorized(DocumentEntityFeatureConstants[entityType], action);
  }

  resetSortObj() {
    this.sortSearchPaginationObj.sortObj.field = 'lastModifiedDate';
    this.sortSearchPaginationObj.sortObj.sort = 'desc';
  }

  handleErrorResponse(err: any) {
    if (!(err.status == 0) && !(err._body == 'undefined')) {
      let response = JSON.parse(err._body);
      this.headerService.setErrorPopup({ errorMessage: response.message });
    } else {
      this.headerService.setErrorPopup({ errorMessage: 'Failed to connect to DRS. Please contact the system administrator.' });
    }
  }

}
