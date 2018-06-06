import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, UrlTree, UrlSegment } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { DocumentStore, EntityType } from '../../document-store/document-store';
import { CourtWorkService } from "../court-work.service";
import { DocumentStoreService } from '../../document-store/document-store.service';
import { HeaderService } from '../../../views/header/header.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { OffenderProfileService } from '../../offenderprofile/offenderprofile.service';
import { Utility } from "../../../shared/utility";
import { DataService } from '../../../services/data.service';
import { Contact } from '../../contact/contact';
import { ContactService } from '../../contact/contact.service';
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
 // private uploadLetterForm: FormGroup;
  private profileId: number;
  private courtWorkId: number;
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
       private courtWorkService: CourtWorkService,
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
      this.courtWorkId = params['courtWorkId'];
    });

    this.courtWorkService.getCourtWork(this.courtWorkId).subscribe(data => {
    this.documentStore.linkedToId= data.spgProcessContactId ;
    });

     this.courtWorkService.getTemplateNameList().subscribe(data=>{
          this.itemList=data;
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

     if (this.authorizedFlag) {
      this.initForm();
    } else {
      this.headerService.setAlertPopup("Not authorized");
    }
    this.initForm();
   
  }

  
generateSubmit(letter: string){
    let xhr = this.courtWorkService.generateLetter(this.courtWorkId,letter);
     xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var blob = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') });
          var fileName = xhr.getResponseHeader('X-Doc-Name');
          saveAs(blob, fileName, true);
        } else if (xhr.status == 0) {
          this.headerService.setErrorPopup({ errorMessage: 'Failed to connect to DRS. Please contact the system administrator.' });
        }else if (xhr.status == 403) {
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


   
initForm() {
  this.generateLetterForm = this._fb.group({
    templateNameId: ['', Validators.compose([Validators.required])]
    });
    
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
