import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { ProtectedCharacteristics } from '../protected-characteristics';
import { ProtectedCharacteristicsService } from '../protected-characteristics.service';
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ProtectedCharacteristicsConstants } from '../protected-characteristics.constants';
import { Utility } from '../../../shared/utility';
import { ListService } from '../../../services/list.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'tr-protected-characteristics-detail',
  templateUrl: 'protected-characteristics-detail.component.html'
})
export class ProtectedCharacteristicsDetailComponent implements OnInit {

  private subscription: Subscription;
  protectedCharacteristics: ProtectedCharacteristics;
  private protectedCharacteristicsId: number;
  private authorizationData: any;
  private authorizedFlag: boolean = false;
  private action;
   constructor(private route: ActivatedRoute, 
      private authorizationService: AuthorizationService, 
      private dataService: DataService, 
      private protectedCharacteristicsService: ProtectedCharacteristicsService,
      private listService: ListService,
      private headerService: HeaderService,
      private titleService: Title
    ) { }

  ngOnInit() {
    this.titleService.setTitle('Equality & Diversity');
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.protectedCharacteristicsId = params['profileId'];
       //this.authorizationService.getAuthorizationDataByTableId(ProtectedCharacteristicsConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ProtectedCharacteristicsConstants.featureId, ProtectedCharacteristicsConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(ProtectedCharacteristicsConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(ProtectedCharacteristicsConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProtectedCharacteristicsConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(ProtectedCharacteristicsConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.protectedCharacteristicsService.getProtectedCharacteristics(this.protectedCharacteristicsId).subscribe(data => {
                this.protectedCharacteristics = data;
                
                this.action=this.getAction(this.protectedCharacteristics)
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
    })
  }
getAction(data){
  var action="";
  
  if(data.immigrationNumber==null && 
    data.ethnicityId==null &&
    data.nationalityId ==null &&
    data.secondNationalityId ==null &&
    data.languageId ==null &&
     data.interpreterRequiredYesNoId ==null && data.immigrationStatusId ==null && data.religionId ==null){
    return action="Add"
  }else{
    return action="Edit"
  }
}
  isAuthorized(action){
    //return this.authorizationService.isTableAuthorized(ProtectedCharacteristicsConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(ProtectedCharacteristicsConstants.featureId, action);
  }
  isFeildAuthorized(field){
    //return this.authorizationService.isTableFieldAuthorized(ProtectedCharacteristicsConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(ProtectedCharacteristicsConstants.featureId, field, "Read");
  }

  isGenderReassigned(genderReassignedId){
     let isGenderReassigned : boolean= false;
     if(genderReassignedId !=null && "Yes"==this.getListValueForPk(231,genderReassignedId)){
      isGenderReassigned=true;
     }

    return isGenderReassigned;
  }


  getListValueForPk(tableId,pkValue){
    let listObjLabel: String=null;
    this.listService.getListData(tableId).subscribe(listArrayObj => {
      let listObj = Utility.getObjectFromArrayByKeyAndValue(listArrayObj, 'key', parseInt(pkValue));
      if(listObj != null){
        listObjLabel = listObj.value;
      }
    });
    return listObjLabel;
  }
}
