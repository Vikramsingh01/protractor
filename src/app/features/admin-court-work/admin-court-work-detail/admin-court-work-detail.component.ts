import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { AdminCourtWork } from '../admin-court-work';
import { AdminCourtWorkService } from '../admin-court-work.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { AdminCourtWorkConstants } from '../admin-court-work.constants';
import { AssociatedEvent } from '../associatedEvent';
import { DocumentStoreService } from '../../../features/document-store/document-store.service';
import {saveAs } from 'file-saver';


@Component({
  selector: 'tr-admin-court-work-detail',
  templateUrl: 'admin-court-work-detail.component.html'
})
export class AdminCourtWorkDetailComponent implements OnInit {

  private subscription: Subscription;
  adminCourtWork: AdminCourtWork;
  private adminCourtWorkId: any;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private associatedEvent: AssociatedEvent[] = [];
  private eventId: any;

   constructor(private route: ActivatedRoute,
      private authorizationService: AuthorizationService,
      private dataService: DataService,
      private adminCourtWorkService: AdminCourtWorkService,
      private headerService: HeaderService,
      private documentStoreService : DocumentStoreService,
      private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("View Court Work");
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.adminCourtWorkId = params['adminCourtWorkId'];
      this.eventId = params['eventId'];
       //this.authorizationService.getAuthorizationDataByTableId(AdminCourtWorkConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AdminCourtWorkConstants.featureId, AdminCourtWorkConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(AdminCourtWorkConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(AdminCourtWorkConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(AdminCourtWorkConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdminCourtWorkConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.adminCourtWorkService.getAdminCourtWork(this.adminCourtWorkId).subscribe(data => {
                this.adminCourtWork = data;
            });

            this.adminCourtWorkService.getAssociatedEvent(this.adminCourtWorkId, this.eventId).subscribe(data => {
                    this.associatedEvent = data;
            });

        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }

  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(AdminCourtWorkConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(AdminCourtWorkConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(AdminCourtWorkConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(AdminCourtWorkConstants.featureId, field, "Read");
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
