import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { DocumentStore, EntityType } from '../document-store';
import { DocumentStoreService } from '../document-store.service';
import { HeaderService } from '../../../views/header/header.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { OffenderProfileService } from '../../offenderprofile/offenderprofile.service';
import { Utility } from "../../../shared/utility";
@Component({
  selector: 'tr-document-store-add',
  templateUrl: './document-store-add.component.html'
})
export class DocumentStoreAddComponent implements OnInit {
  private authorizedFlag: boolean = true;
  private documentStore: DocumentStore = new DocumentStore();
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
        private documentStoreService: DocumentStoreService,
        private offenderProfileService: OffenderProfileService) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
    });

    this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: any)=>{
      this.crnNumber = data.caseReferenceNumber;
    });

    this.listService.getListData(2542).subscribe(entityTypes => {
      this.entityTypes = entityTypes;
    });

    this.listService.getListDataByLookupAndPkValue(-1, 518, this.profileId).subscribe(lookupList => {
      if(lookupList != null && lookupList.length > 0) {
        this.provider = lookupList[0].value;
      }
    });

    this.route.params.subscribe((params: any) => {
      if (!params.hasOwnProperty('documentId')) {
        this.action = "Create";
      } else {
        this.action = "Update";
      }
    });

    if (this.authorizedFlag) {
      this.initForm();
    } else {
      this.headerService.setAlertPopup("Not authorized");
    }
  }

  updateLinkedToField(entityType) {
    //this.documentStoreForm.controls['linkedToId'].setValue('');
    if(entityType != null && entityType != '') {
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
    if (this.documentStoreForm.valid && this.uploadedDoc != null) {
		this.documentStoreForm.patchValue(Utility.escapeHtmlTags(this.documentStoreForm.value));
      let allowed = this.documentStoreService.allowedExtension(this.uploadedDoc);

      if(allowed) {
        let xhr = this.documentStoreService.addDocumet(this.documentStoreForm.value, this.uploadedDoc, this.crnNumber, this.provider);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  this.router.navigate(['..'], {relativeTo: this.route});
              } else {
                  this.headerService.setAlertPopup('Error in uploading document. Please try after sometime.');
              }
          }
        };
      }
    }
  } 

  initForm() {
    this.documentStoreForm = this._fb.group({
      entityType: ['', Validators.compose([Validators.required])],
      linkedToId: ['', Validators.compose([Validators.required])],
      documentName: [this.documentStore.documentName, Validators.compose([Validators.required, Validators.maxLength(200)])],
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
            this.router.navigate(url, {relativeTo: this.route});
        }
      });
    } else {
      this.router.navigate(url, {relativeTo: this.route});
      return false;
    }
  }

  fetchLookupFromEnityType(entityType): number {
    let lookupId = -1;
    if(entityType == 1) {
      lookupId = -1;
    } else if(entityType == 2) {
      lookupId = 509;
    } else if(entityType == 3) {
      lookupId = 510;
    } else if(entityType == 4) {
      lookupId = 524;
    } else if(entityType == 5) {
      lookupId = 511;
    } else if(entityType == 6) {
      lookupId = 523;
    } else if(entityType == 7) {
      lookupId = 512;
    } else if(entityType == 8) {
      lookupId = 513;
    } else if(entityType == 9) {
      lookupId = 514;
    } else if(entityType == 10) {
      lookupId = 515;
    } else if(entityType == 11) {
      lookupId = 516;
    } else if(entityType == 12) {
      lookupId = -1;
    } else if(entityType == 13) {
      lookupId = -1;
    } else if(entityType == 14) {
      lookupId = 508;
    } else if(entityType == 15) {
      lookupId = 525;
    } else if(entityType == 16) {
      lookupId = 526;
    }
    return lookupId;
  }
}
