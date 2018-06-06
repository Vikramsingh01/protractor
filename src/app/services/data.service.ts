import { Utility } from './../shared/utility';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Observable } from "rxjs";
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class DataService {

  loggedInUserId: number;
  loggedInUserName: string;
  hobbies: any[];
  features: any[];
  featureFields: any[] = [];;
  featureActions: any[] = [];
  drsRequestCRNs: any[] = [];
  listData: any[] = [];
  daysLeft: any;
  eventData: any[] = [];

  constructor(private tokenService: TokenService, private http: Http) { }

  setLoggedInUserId(userId){
    //this.loggedInUserId = userId;
    localStorage.setItem("loggedInUserId", userId);
  }
  getLoggedInUserId(){
    return localStorage.getItem("loggedInUserId");
  }

  setLoggedInUserName(userName){
    localStorage.setItem("loggedInUserName", userName);
  }

  setLoggedInUser(userName){
    localStorage.setItem("loggedInUser", userName);
  }

  getLoggedInUser(){
    return localStorage.getItem("loggedInUser");
  }

  getLoggedInUserName(){
    return localStorage.getItem("loggedInUserName");
  }

  setFeatures(features){
    localStorage.setItem("features",JSON.stringify(features));
    //this.features = features;
  }
  getFeatures(){
    return JSON.parse(localStorage.getItem("features"));
    //return this.features;
  }

  getFeatureByFeatureId(featureId){
    let features = JSON.parse(localStorage.getItem("features"));
    return Utility.getObjectFromArrayByKeyAndValue(features, 'featureId', featureId);
  }

  setFeatureFields(featureFields){
    localStorage.setItem("featureFields",JSON.stringify(featureFields));
    //this.featureFields = featureFields;
  }

  getFeatureFields(){
    return JSON.parse(localStorage.getItem("featureFields"));
    //return this.featureFields;
  }
  setHobbies(hobbies){
    localStorage.setItem("hobbies",JSON.stringify(hobbies));
  }

  getHobbies(){
    return JSON.parse(localStorage.getItem("hobbies"));
  }
  setFeatureActions(featureActions){
    localStorage.setItem("featureActions",JSON.stringify(featureActions));
    //this.featureFields = featureFields;
  }
  addFeatureActions(featureId, featureActionsNew){
    this.featureActions = JSON.parse(localStorage.getItem("featureActions"));
    if(Utility.filterArrayByKeyAndValue(this.featureActions, 'featureId', featureId).length<1){
      let featureActionsObj = {};
      featureActionsObj['featureId'] = featureId;
      featureActionsObj['featureActions'] = featureActionsNew;
      this.featureActions.push(featureActionsObj);
      localStorage.setItem("featureActions",JSON.stringify(this.featureActions));
    }
  }
  addFeatureFields(featureId, featureFieldsNew){
    this.featureFields = JSON.parse(localStorage.getItem("featureFields"));
    if(Utility.filterArrayByKeyAndValue(this.featureFields, 'featureId', featureId).length<1){
      let featureFieldsObj = {};
      featureFieldsObj['featureId'] = featureId;
      featureFieldsObj['featureFields'] = featureFieldsNew;
      this.featureFields.push(featureFieldsObj);
      localStorage.setItem("featureFields",JSON.stringify(this.featureFields));
    }
  }

  getFeatureActions(){
    return JSON.parse(localStorage.getItem("featureActions"));
    //return this.featureFields;
  }

  setDrsRequestCRNs(drsRequestCRNs){
    localStorage.setItem("drsRequestCRNs",JSON.stringify(drsRequestCRNs));
    //this.features = features;
  }

  getDrsRequestCRNs(){
    return JSON.parse(localStorage.getItem("drsRequestCRNs"));
  }

  addDrsRequestCRNs(crn, messageId){
    this.drsRequestCRNs = JSON.parse(localStorage.getItem("drsRequestCRNs"));
    if(this.drsRequestCRNs==null){
      localStorage.setItem("drsRequestCRNs","[]");
      this.drsRequestCRNs = JSON.parse(localStorage.getItem("drsRequestCRNs"));
    }
    if(Utility.filterArrayByKeyAndValue(this.drsRequestCRNs, 'crn', crn).length<1){
      let drsRequestCRNObj = {};
      drsRequestCRNObj['crn'] = crn;
      drsRequestCRNObj['messageId'] = messageId;
      this.drsRequestCRNs.push(drsRequestCRNObj);
      localStorage.setItem("drsRequestCRNs",JSON.stringify(this.drsRequestCRNs));
    }
  }

  addListData(tableId, listDataNew){
    this.listData = JSON.parse(localStorage.getItem("listData"));
    if(Utility.filterArrayByKeyAndValue(this.listData, 'tableId', tableId).length<1){
      let listObj = {};
      listObj['tableId'] = tableId;
      listObj['list'] = listDataNew;
      this.listData.push(listObj);
      localStorage.setItem("listData",JSON.stringify(this.listData));
    }
  }

  setListData(listData){
    localStorage.setItem("listData",JSON.stringify(listData));
    //this.featureFields = featureFields;
  }
  getListData(){
    if(localStorage.getItem("listData") == null){
      localStorage.setItem('listData', '[]');
    }
    return JSON.parse(localStorage.getItem("listData"));
  }

  setPasswordChangeDaysLeft(daysLeft){
    localStorage.setItem("daysLeft", daysLeft);
  }

  getPasswordChangeDaysLeft(){
    return localStorage.getItem("daysLeft");
  }

  setEventData(eventData){
    this.eventData = JSON.parse(localStorage.getItem("eventData"));
    if(this.eventData==null){
      localStorage.setItem("eventData","[]");
      this.eventData = JSON.parse(localStorage.getItem("eventData"));
    }
    if(Utility.getObjectFromArrayByKeyAndValue(this.eventData, 'eventId', eventData.eventId) != null){
      let existingData: any[] = Utility.removeFromArray(this.eventData, 'eventId', eventData.eventId);
      existingData.push(eventData);
      localStorage.setItem("eventData", JSON.stringify(existingData));
    }
    else{
      let existingData: any[] = JSON.parse(localStorage.getItem("eventData"));
      existingData.push(eventData);
      localStorage.setItem("eventData", JSON.stringify(existingData));
    }
  }

  getEventData(eventId){
    this.eventData = JSON.parse(localStorage.getItem("eventData"));
    if(this.eventData == null){
      localStorage.setItem("eventData","[]");
      this.eventData = JSON.parse(localStorage.getItem("eventData"));
    }
    return Utility.getObjectFromArrayByKeyAndValue(this.eventData, 'eventId', parseInt(eventId));
  }
  clearEventData(){
    localStorage.setItem("eventData","[]");
  }
}
