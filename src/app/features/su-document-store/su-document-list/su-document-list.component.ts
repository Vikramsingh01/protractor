import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SuDocumentStoreService } from "../su-document-store.service";
import { OffenderProfileService } from "../../offenderprofile/offenderprofile.service";
import { SuDocumentStore, EntityType } from "../su-document-store";
import { Observable } from "rxjs";
import { DataService } from "../../../services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HeaderService } from '../../../views/header/header.service';
import { ListService } from '../../../services/list.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DocumentEntityFeatureConstants } from '../document-entity-feature.constants';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { saveAs } from 'file-saver';
import { Title } from "@angular/platform-browser";
@Component({
  selector: 'tr-document-list',
  templateUrl: './su-document-list.component.html',
  providers: [SuDocumentStoreService, OffenderProfileService]

})
export class SuTDocumentListComponent implements OnInit {
  private authorizedFlag: boolean = true;
  private documentStore: SuDocumentStore = new SuDocumentStore();
  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  private action: string;
  private documentSearchForm: FormGroup;
  private uploadedDoc: File;
  private entityTypes: any[] = [];
  private documentTypes: any[] = [];

  private linkedToTypes: any[] = [];
  private profileId: number;
  private crn: number;
  private provider: string;
  private documents: Document[] = [];
  private fromDate: Date;
  private toDate: Date;
  private loggedInUserId;
  @Input("showResetButton") showResetButton: Boolean = true;
  private error: boolean = false;
  private dataNotFound: boolean = false;
  
  private visible: boolean = false;
  private releaseDoc = null;
  private urfileDisabled: boolean = false;
  private prevVersionChecked: boolean = false;
  private urErrorMessage = '';
  @ViewChild('urFile')
  private urFile: any;

  constructor(private _fb: FormBuilder,
    private router: Router,
    private confirmService: ConfirmService,
    private authorizationService: AuthorizationService,
    private route: ActivatedRoute,
    private documentStoreService: SuDocumentStoreService,
    private offenderProfileService: OffenderProfileService,
    private headerService: HeaderService,
    private listService: ListService,
    private dataService: DataService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Documents');
    this.sortSearchPaginationObj.sortObj.field = 'lastModifiedDate';
    this.sortSearchPaginationObj.sortObj.sort = 'desc';
    this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
    });

    this.loggedInUserId = this.dataService.getLoggedInUserId();

    this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: any) => {
      this.crn = data.caseReferenceNumber;
      this.getDocumentList(this.crn);
    });

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
      this.documentStoreService.sortFilterAndPaginate(this.crn, this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((data: any) => {
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
    this.documentStoreService.getDocumentList(crn, this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((response: any) => {
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

  reserveDocument(docId: string) {
    let xhr = this.documentStoreService.reserveDocument(docId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var blob = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') });
          var fileName = xhr.getResponseHeader('X-Doc-Name');
          this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          saveAs(blob, fileName, true);
        } else if (xhr.status == 0) {
          this.headerService.setErrorPopup({ errorMessage: 'Failed to connect to DRS. Please contact the system administrator.' });
        } else if (xhr.status == 403) {
          this.headerService.setErrorPopup({ errorMessage: 'You don\'t have permissions to perform this operation.' });
        } else {
          var rsp = this.arrayBufferToString(xhr.response);
          let response = JSON.parse(rsp);
          this.headerService.setErrorPopup({ errorMessage: response.message });
        }
      }
    }
  }

  downloadDocument(documentAlfrescoId: string, reserved: Boolean, lastReserveUserId: number) {
    if (reserved && lastReserveUserId != null && this.loggedInUserId != lastReserveUserId) {
      this.confirmService.confirm(
        {
          message: 'As the document is reserved, you will not be able to update the document. Document is read only.',
          header: 'Document Reserved',
          accept: () => {
            this.download(documentAlfrescoId);
          }
        });
    } else {
      this.download(documentAlfrescoId);
    }
  }

  download(documentAlfrescoId: string) {
    let xhr = this.documentStoreService.downloadDocument(documentAlfrescoId);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var blob = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') });
          var fileName = xhr.getResponseHeader('X-Doc-Name');
          saveAs(blob, fileName, true);
        } else if (xhr.status == 0) {
          this.headerService.setErrorPopup({ errorMessage: 'Failed to connect to DRS. Please contact the system administrator.' });
        } else if (xhr.status == 403) {
          this.headerService.setErrorPopup({ errorMessage: 'You don\'t have permissions to perform this operation.' });
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
    } else if (entityType == 'RATECARDINTERVENTION') {
      lookupId = 536;
    }

    return lookupId;
  }
  delete(docId: number) {
    this.confirmService.confirm(
      {
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          this.documentStoreService.delete(docId).subscribe((data: any) => {
            this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
          },
            (error) => {
              this.handleErrorResponse(error);
            });
        }
      });
  }

  reset() {
    if (this.showResetButton) {
      this.documentSearchForm.reset();
      this.linkedToTypes = [];
      this.sortSearchPaginationObj = new SortSearchPagination();
      this.sortSearchPaginationObj.sortObj.field = 'lastModifiedDate';
      this.documentStoreService.sortFilterAndPaginate(this.crn, this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj).subscribe((data: any) => {
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
    this.sortSearchPaginationObj.sortObj.sort = 'desc';
    this.sortFilterAndPaginate(this.documentSearchForm.value, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj) {
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortSearchPaginationObj.sortObj.sort = 'desc';
    this.sortFilterAndPaginate(this.documentSearchForm.value, paginationObj, this.sortSearchPaginationObj.sortObj);
  }
  sortFilterAndPaginate(filterObj, paginationObj, sortObj) {
    this.documentStoreService.sortFilterAndPaginate(this.crn, filterObj, paginationObj, sortObj).subscribe((data: any) => {
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

  isAuthorized(action) {
    return this.authorizationService.isFeatureActionAuthorized(DocumentEntityFeatureConstants.featureId, action);
  }

  resetSortObj() {
    this.sortSearchPaginationObj.sortObj.field = 'lastModifiedDate';
    this.sortSearchPaginationObj.sortObj.sort = 'desc';
  }

  handleErrorResponse(err: any) {
    if (!(err.status == 0) && !(err._body == 'undefined')) {
      let response = JSON.parse(err._body);
      let msg = response.message.replace(new RegExp("[0-9]", "g"), "");
      this.headerService.setErrorPopup({ errorMessage: msg });
    } else {
      this.headerService.setErrorPopup({ errorMessage: 'Failed to connect to DRS. Please contact the system administrator.' });
    }
  }

  showReleaseDocPopup(documentAlfrescoId: string, reserved: Boolean, lastReserveUserId: number) {
    this.visible = true;
    this.releaseDoc = {
      "documentAlfrescoId": documentAlfrescoId,
      "reserved": reserved,
      "lastReserveUserId": lastReserveUserId
    };
  }

  hideReleaseDocPopup() {
    this.resetPopupData();
  }

  resetPopupData() {
    this.visible = false;
    this.releaseDoc = null;
    this.uploadedDoc = null;
    this.urfileDisabled = false;
    this.prevVersionChecked = false;
    this.urFile.nativeElement.value = "";
    this.urErrorMessage = '';
  }

  releaseWithPreviousVersion() {
    if (this.releaseDoc != null && this.releaseDoc.reserved && this.releaseDoc.lastReserveUserId != null && this.loggedInUserId == this.releaseDoc.lastReserveUserId) {
      this.documentStoreService.release(this.releaseDoc.documentAlfrescoId).subscribe((data: any) => {
        this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
        this.resetPopupData();
      },
        (err) => {
          if (!(err.status == 0) && !(err._body == 'undefined')) {
            let response = JSON.parse(err._body);
            let msg = response.message.replace(new RegExp("[0-9]", "g"), "");
            this.urErrorMessage = msg;
          } else {
            this.urErrorMessage = 'Failed to connect to DRS. Please contact the system administrator.';
          }
        });
    } else {
      this.urErrorMessage = 'You don\'t have permissions to perform this operation.';
    }
  }

  releaseWithUploadedVersion() {
    let allowed = this.documentStoreService.allowedExtension(this.uploadedDoc);
    if (allowed) {
      if (this.releaseDoc != null && this.releaseDoc.reserved && this.releaseDoc.lastReserveUserId != null && this.loggedInUserId == this.releaseDoc.lastReserveUserId) {
        let xhr = this.documentStoreService.uploadAndRelease(this.uploadedDoc, this.releaseDoc.documentAlfrescoId);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            this.headerService.changeLoading(false);
            if (xhr.status === 200) {
              this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
              this.resetPopupData();
            } else if (xhr.status == 0) {
              this.urErrorMessage = 'Failed to connect to DRS. Please contact the system administrator.';
            } else {
              let response = JSON.parse(xhr.responseText);
              this.urErrorMessage = response.message;
            }
          }
        };
      } else {
        this.urErrorMessage = 'You don\'t have permissions to perform this operation.';
      }
    } else {
      this.urErrorMessage = 'Cannot upload the file, the format is not supported. \n Please choose another format and try again.\n Accepted formats include: DOC / DOCX / JPEG / PDF / PNG.';
    }
  }

  release() {
    if (this.prevVersionChecked) {
      this.releaseWithPreviousVersion();
    } else if (this.uploadedDoc != null) {
      this.releaseWithUploadedVersion();
    } else {
      this.urErrorMessage = 'Please select an option.';
    }
  }

  prevVersionChangeEvent(prevVersion: any) {
    this.urfileDisabled = prevVersion.target.checked == true;
    this.prevVersionChecked = prevVersion.target.checked;
    if (this.uploadedDoc == null && !this.prevVersionChecked) {
      this.urErrorMessage = 'Please select an option.';
    } else {
      this.urErrorMessage = '';
    }
  }

  releaseDocumentChangeEvent(fileInput: any) {
    this.uploadedDoc = fileInput.target.files[0];
    if (this.uploadedDoc == null && !this.urfileDisabled) {
      this.urErrorMessage = 'Please select an option.';
    } else {
      this.urErrorMessage = '';
    }
  }
}
