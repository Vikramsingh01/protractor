import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, UrlTree, UrlSegment } from '@angular/router';
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
import { DataService } from '../../../services/data.service';
import { Contact } from '../../contact/contact';
import { ContactService } from '../../contact/contact.service';
import { DocumentEntityFeatureConstants } from '../document-entity-feature.constants';
import {saveAs } from 'file-saver';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-generate-letter',
  templateUrl: './generate-letter.component.html'
})
export class GenerateLetterComponent implements OnInit {
  private authorizedFlag: boolean = true;
  private uploadedDoc: File;
  private documentStore: DocumentStore = new DocumentStore();
  private contact:Contact;
  private action: string;
  private generateLetterForm: FormGroup;
  private uploadLetterForm: FormGroup;
  private profileId: number;
  private contactId: number;
  private crnNumber: number;
  private error: boolean = false;
  private provider: string;
  private itemList: any=[];
  private generateDoc: any=[];
  private genUrl:any;

  constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private headerService: HeaderService,
        private confirmService: ConfirmService,
        private listService: ListService,
        private dataService: DataService,
        private documentStoreService: DocumentStoreService,
        private contactService: ContactService,
        private offenderProfileService: OffenderProfileService,
        private titleService: Title) {}

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      this.profileId = params['profileId'];
      let data: any=this.route.data;
      this.genUrl = data.value.parentRoute;
    });

   
    this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: any)=>{
      this.crnNumber = data.caseReferenceNumber;
    });


    this.route.params.subscribe((params: any) => {
      this.contactId = params['contactId'];
    });

    this.contactService.getContact(this.contactId).subscribe(data => {
    this.documentStore.linkedToId= data.spgContactId ;
    });

     this.documentStoreService.getTemplateNameList().subscribe(data=>{
      this.itemList=data;
    }, (err) => {
        this.handleErrorResponse(err);
      });

      this.listService.getListDataByLookupAndPkValue(-1, 518, this.dataService.getLoggedInUserId()).subscribe(lookupList => {
      if(lookupList != null && lookupList.length > 0) {
        this.provider = lookupList[0].value;
      }
    });

      this.route.params.subscribe((params: any) => {
      if (!params.hasOwnProperty('documentId')) {
        this.action = "Create";
        this.titleService.setTitle('Generate Letter');
      } else {
        this.action = "Update";
        this.titleService.setTitle('Generate Letter');
      }
    });

     this.contactService.getContact(this.contactId).subscribe(data => {
      this.uploadLetterForm.controls['linkedToId'].setValue(data.spgContactId) ;
        });

    if (this.authorizedFlag) {
      this.initForm();
    } else {
      this.headerService.setAlertPopup("Not authorized");
    }
    this.initForm();
   
  }

generateSubmit(letter: string){
   if (this.generateLetterForm.valid) {
      this.documentStoreService.generateLetter(this.contactId,letter).subscribe((response: any) => {
       var blob = new Blob([response._body], { type:'application/octet-stream'});
       saveAs(blob,letter , true);
      }, (err) => {
         this.headerService.setErrorPopup({ errorMessage: 'Something went wrong. Please contact the system administrator.' });
      });
    }
  }

   onSubmit() {
    if (this.uploadLetterForm.valid) {
      if (this.uploadedDoc != null) {
        
        let allowed = this.documentStoreService.allowedExtension(this.uploadedDoc);

        if (allowed) {
          this.headerService.changeLoading(true);
          let xhr = this.documentStoreService.addDocumet(this.uploadLetterForm.value, this.uploadedDoc, this.crnNumber, this.provider);
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              this.headerService.changeLoading(false);
              if (xhr.status === 200) {
                this.router.navigate(this.genUrl, { relativeTo: this.route });
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
        }
      } else {
        this.headerService.setErrorPopup({ errorMessage: 'Please select document to upload.' });
      }
    }
  }


 navigateTo(url) {
    if (this.uploadLetterForm.touched) {
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

  
initForm() {
  this.generateLetterForm = this._fb.group({
    templateNameId: ['', Validators.compose([Validators.required])]
    });
    
    this.uploadLetterForm = this._fb.group({
      entityType: ['4'],
      linkedToId: [this.documentStore.linkedToId],
      documentName: [this.documentStore.documentName, Validators.compose([Validators.required, Validators.maxLength(200)])],
      file: [this.documentStore.file],
      isReadOnly: [this.documentStore.isReadOnly],
    });

  }

  fileChangeEvent(fileInput: any) {
    this.uploadedDoc = fileInput.target.files[0];
  }

  handleErrorResponse(err: any) {
    if (!(err.status == 0) && !(err._body == 'undefined')) {
      let response = JSON.parse(err._body);
      this.headerService.setErrorPopup({ errorMessage: response.message });
    } else {
      this.headerService.setErrorPopup({ errorMessage: 'Something went wrong. Please contact the system administrator.' });
    }
  }

}
