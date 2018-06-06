import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { SuDocumentStore, EntityType } from '../su-document-store';
import { SuDocumentStoreService } from '../su-document-store.service';
import { HeaderService } from '../../../views/header/header.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { OffenderProfileService } from '../../offenderprofile/offenderprofile.service';
import { DataService } from '../../../services/data.service';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'su-document-store-add',
  templateUrl: './su-document-store-add.component.html'
})
export class SuDocumentStoreAddComponent implements OnInit {
  private authorizedFlag: boolean = true;
  private documentStore: SuDocumentStore = new SuDocumentStore();
  private action: string;
  private documentStoreForm: FormGroup;
  private uploadedDoc: File;
  private entityTypes: any[] = [];
  private linkedToTypes: any[] = [];
  private profileId: number;
  private crnNumber: number;
  private provider: string;

  constructor(private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private listService: ListService,
    private dataService: DataService,
    private documentStoreService: SuDocumentStoreService,
    private offenderProfileService: OffenderProfileService,
    private titleService: Title) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
    });

    this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: any) => {
      this.crnNumber = data.caseReferenceNumber;
    });

    this.listService.getListData(2542).subscribe(entityTypes => {
      this.entityTypes = entityTypes.filter(element => element['selectable'] == true);
    });

    this.listService.getListDataByLookupAndPkValue(-1, 518, this.dataService.getLoggedInUserId()).subscribe(lookupList => {
      if (lookupList != null && lookupList.length > 0) {
        this.provider = lookupList[0].value;
      }
    });

    this.route.params.subscribe((params: any) => {
      if (!params.hasOwnProperty('documentId')) {
        this.action = "Create";
        this.titleService.setTitle('Add Document');
      } else {
        this.action = "Update";
        this.titleService.setTitle('Edit Document');
      }
    });

    if (this.authorizedFlag) {
      this.initForm();
    } else {
      this.headerService.setAlertPopup("Not authorized");
    }
  }

  updateLinkedToField(entityType) {
    this.documentStoreForm.controls['linkedToId'].setValue('');
    if (entityType != null && entityType != '') {
      let et: EntityType = JSON.parse(entityType);
      let lookupId: number = this.fetchLookupFromEnityType(et.key);
      this.listService.getListDataByLookupAndPkValue(-1, lookupId, this.profileId).subscribe(lookupList => {
        this.linkedToTypes = lookupList;
      });
    } else {
      this.linkedToTypes = [];
    }
  }

  isFeildAuthorized(field) {
    return true;
  }

  onSubmit() {
    if (this.documentStoreForm.valid) {
      if (this.uploadedDoc != null) {
        let allowed = this.documentStoreService.allowedExtension(this.uploadedDoc);

        if (allowed) {
          this.headerService.changeLoading(true);
          let xhr = this.documentStoreService.addDocumet(this.documentStoreForm.value, this.uploadedDoc, this.crnNumber, this.provider);
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              this.headerService.changeLoading(false);
              if (xhr.status === 200) {
                this.router.navigate(['..'], { relativeTo: this.route });
              } else if (xhr.status == 0) {
                this.headerService.setAlertPopup('Failed to connect to DRS. Please contact the system administrator.');
              } else if (xhr.status == 422) {
                let response = JSON.parse(xhr.responseText);
                if (response.data != null) {
                  this.headerService.setformSererValidator(response.data);
                } else {
                  this.headerService.setAlertPopup(response.message);
                }
              } else {
                let response = JSON.parse(xhr.responseText);
                this.headerService.setAlertPopup(response.message);
              }
            }
          };
        } else {
          this.headerService.setErrorPopup({ 'errorMessage': 'Cannot upload the file, the format is not supported. \n Please choose another format and try again.\n Accepted formats include: DOC / DOCX / JPEG / PDF / PNG.' });
        }
      } else {
        this.headerService.setErrorPopup({ errorMessage: 'Please select document to upload.' });
      }
    }
  }

  initForm() {
    this.documentStoreForm = this._fb.group({
      entityType: ['', Validators.compose([Validators.required])],
      linkedToId: ['', Validators.compose([Validators.required])],
      documentName: [this.documentStore.documentName, Validators.compose([Validators.required, Validators.maxLength(60)])],
      file: [this.documentStore.file],
      isReadOnly: [this.documentStore.isReadOnly],
    });
  }

  fileChangeEvent(fileInput: any) {
    this.uploadedDoc = fileInput.target.files[0];
  }

  navigateTo(url) {
    if (this.documentStoreForm.touched) {
      this.confirmService.confirm(
        {
          message: 'Do you want to leave this page without saving?',
          header: 'Confirm',
          accept: () => {
            this.router.navigate(url, { relativeTo: this.route });
          }
        });
    } else {
      this.router.navigate(url, { relativeTo: this.route });
      return false;
    }
  }

  fetchLookupFromEnityType(entityType): number {
    let lookupId = -1;
    if (entityType == 1) {
      lookupId = -1;
    } else if (entityType == 2) {
      lookupId = 509;
    } else if (entityType == 3) {
      lookupId = 510;
    } else if (entityType == 4) {
      lookupId = 524;
    } else if (entityType == 5) {
      lookupId = 511;
    } else if (entityType == 6) {
      lookupId = 523;
    } else if (entityType == 7) {
      lookupId = 512;
    } else if (entityType == 8) {
      lookupId = 513;
    } else if (entityType == 9) {
      lookupId = 514;
    } else if (entityType == 10) {
      lookupId = 515;
    } else if (entityType == 11) {
      lookupId = 516;
    } else if (entityType == 12) {
      lookupId = -1;
    } else if (entityType == 13) {
      lookupId = -1;
    } else if (entityType == 14) {
      lookupId = 508;
    } else if (entityType == 15) {
      lookupId = 525;
    } else if (entityType == 16) {
      lookupId = 526;
    }else if (entityType == 17) {
      lookupId = 536;
    }

    return lookupId;
  }
}
