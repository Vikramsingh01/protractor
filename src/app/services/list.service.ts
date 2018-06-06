import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { DataService } from './data.service';
import { Utility } from '../shared/utility';
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { ServiceUrlConstants, ServerUrl } from '../shared/service-url-constants';
import { APPCONSTANTS } from '../app.constants';
@Injectable()
export class ListService {

  constructor(private tokenService: TokenService, private dataService: DataService, private http: Http) { }

  getListObjById(tableId, pkValue) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LISTBYPARAM + "/1/" + tableId + "?inputparam=" + pkValue, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  getListDataWithLookup(tableId, lookup): Observable<any[]> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LIST + "/1/" + tableId + "?lookup=" + lookup, { headers: headers, body: "" }).map((response: Response) => response.json());
  }
  getListDataByLookupAndPkValue(tableId, lookup, inputParam): Observable<any[]> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LISTBYPARAM + "/1/" + tableId + "?lookup=" + lookup + "&inputparam=" + inputParam, { headers: headers, body: "" }).map((response: Response) => response.json());
  }

   getPkValueByTableIdAndCodeFromDB(tableId, code): Observable<any[]> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LIST + "/tableId/"+tableId+"/code/"+code, { headers: headers, body: "" }).map((response: Response) => response.json());
  }
  getListData(tableId): Observable<any[]> {
    if (APPCONSTANTS.listCache) {
      let listData = this.dataService.getListData();
      if (Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', parseInt(tableId))) {
        let listDataObj = Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', parseInt(tableId));
        return Observable.of(listDataObj.list);
      } else {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("X-Authorization", this.tokenService.getToken());
        return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LIST + "/1/" + tableId, { headers: headers, body: "" }).map((response: Response) => {
          this.dataService.addListData(tableId, response.json());
          return response.json();
        });
      }
    } else {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append("X-Authorization", this.tokenService.getToken());
      return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LIST + "/1/" + tableId, { headers: headers, body: "" }).map((response: Response) => {
        this.dataService.addListData(tableId, response.json());
        return response.json();
      });
    }
  }

  getNSRDData(structureName) {
    const headers = new Headers();
    let url="";
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    let keys=Object.keys(structureName)
      keys.forEach(element => {
        if(element=="personalCircumstanceId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PersonalCircumstance;
        }else if(element=="contactId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CONTACT;
        }else if(element=="assessmentTypeId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.ASSESSMENT;
        }else if(element=="upwAppointmentId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.UpwAppointment;
        }
        else if(element=="pssRequirementId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PSSREQUIREMENT;
        }
     });
    // return this.http.post("http://localhost:4103/neo-contact-api/neocontact/view", {structureName: structureName}, {headers: headers}).map((response: Response) => response.json());
    return this.http.post(url + "/view", { structureName: structureName }, { headers: headers }).map((response: Response) => response.json());
    //return Observable.of([]);
  }
  getNSRDDataForChange(structureName) {
    const headers = new Headers();
    let url="";
    let isReview=false;
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
      let keys=Object.keys(structureName)
      keys.forEach(element => {
        if(element=="personalCircumstanceId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PersonalCircumstance;
        }else if(element=="contactId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CONTACT;
        }else if(element=="assessmentTypeId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.ASSESSMENT;
        } else if(element=="pssRequirementId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PSSREQUIREMENT;
        }
        else if(element=="upwAppointmentId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.UpwAppointment;
        }
        else if(element=="registrationReviewId" ){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.RegistrationReview;
           isReview = true;

        }
        else if(element=="registrationId" && !isReview ){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.Registration;
        }
        else if(element=="courtReportId"){
           url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.CourtReport;
        }
        else if(element=="processId"){
          url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PROCESSCONTACT;

        }else if(element=="transGenderProcessId"){
          url=ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.TRANSGENDERPROCESS;
         }

      });

    return this.http.post(url +"/crd", structureName, { headers: headers }).map((response: Response) => response.json());
    //return Observable.of([]);
  }
  getDependentAnswers(listTableId, listItemId) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AD + listTableId + "/" + listItemId, { headers: headers }).map((response: Response) => response.json());
  }

   getParentDependentAnswers(listTableId, listItemId) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.PARENT_ANSWERS + listTableId + "/" + listItemId, { headers: headers }).map((response: Response) => response.json());
  }

  getAllListData() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LIST + "/all", { headers: headers, body: "" }).map((response: Response) => response.json());
  }
  getAllAuthorizationFeatureFieldsData() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHORIZATION + "/authorized-fields/all", { headers: headers, body: "" }).map((response: Response) => response.json());
  }
  getAllAuthorizationFeatureActionData() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.AUTHORIZATION + "/authorized-features/all", { headers: headers, body: "" }).map((response: Response) => response.json());
  }

  getCodeByTableIdAndPkId(tableId, pkValue){
    let listData = this.dataService.getListData();
      if (Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', tableId)) {
        let listDataObj = Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', tableId);
        let obj = Utility.getObjectFromArrayByKeyAndValue(listDataObj.list, "key", parseInt(pkValue));
        return obj.code;
      }
      else{
        this.getListData(tableId).subscribe(listData=>{
          let obj = Utility.getObjectFromArrayByKeyAndValue(listData, "key", parseInt(pkValue));
          return obj.code;
        });

      }
  }
  getPkValueByTableIdAndCode(tableId, code){
    let listData = this.dataService.getListData();
      if (Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', tableId)) {
        let listDataObj = Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', tableId);
        let obj = Utility.getObjectFromArrayByKeyAndValue(listDataObj.list, "code", code);
        return obj.key;
      }else{
        this.getListData(tableId).subscribe(listData=>{
          let obj = Utility.getObjectFromArrayByKeyAndValue(listData, "code", code);
          return obj.key;
        })
      }
  }
  getLabelByTableIdAndPkId(tableId, pkValue){
    let listData = this.dataService.getListData();
      if (Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', tableId)) {
        let listDataObj = Utility.getObjectFromArrayByKeyAndValue(listData, 'tableId', tableId);
        let obj = Utility.getObjectFromArrayByKeyAndValue(listDataObj.list, "key", parseInt(pkValue));
        return obj.value;
      }
  }

   getlistBreDataByTableId(tableId){
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append("X-Authorization", this.tokenService.getToken());
    return this.http.get(ServerUrl(ServiceUrlConstants.CMS) + ServiceUrlConstants.LIST + "/list-bre/"+tableId, { headers: headers, body: "" }).map((response: Response) => response.json());
  }
}

