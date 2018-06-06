import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { CourtWork } from '../court-work';
import { CourtWorkService } from '../court-work.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { CourtWorkConstants } from '../court-work.constants';
import { AssociatedEvent} from '../associatedEvent';
import { DocumentStoreService } from '../../../features/document-store/document-store.service';
import {saveAs } from 'file-saver';


@Component({
  selector: 'tr-court-work-detail',
  templateUrl: 'court-work-detail.component.html'
})
export class CourtWorkDetailComponent implements OnInit {

  private subscription: Subscription;
  courtWork: CourtWork;
  private courtWorkId: any;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private eventId: any;
  private associatedEvent: AssociatedEvent[] = [];
   constructor(private route: ActivatedRoute,
      private authorizationService: AuthorizationService,
      private dataService: DataService,
      private courtWorkService: CourtWorkService,
      private headerService: HeaderService,
      private documentStoreService : DocumentStoreService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Court Work");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.courtWorkId = params['courtWorkId'];
      this.eventId = params['eventId'];
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
            this.courtWorkService.getCourtWork(this.courtWorkId).subscribe(data => {
                this.courtWork = data;
            })

            	this.courtWorkService.getAssociatedEvent(this.courtWorkId, this.eventId).subscribe(data => {
                    this.associatedEvent = data
                });
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(CourtWorkConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(CourtWorkConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(CourtWorkConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(CourtWorkConstants.featureId, field, "Read");
  }


  downloadDocument(documentAlfrescoId: string) {
    let xhr = this.documentStoreService.downloadDocument(documentAlfrescoId);
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


}
