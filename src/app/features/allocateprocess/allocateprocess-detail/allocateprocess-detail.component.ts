import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { AllocateProcess } from '../allocateprocess';
import { AllocateProcessService } from '../allocateprocess.service';
import { AllocateProcessConstants } from '../allocateprocess.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';

@Component({
  selector: 'tr-allocateprocess-detail',
  templateUrl: 'allocateprocess-detail.component.html',
  providers: [AllocateProcessService, TokenService]
})
export class AllocateProcessDetailComponent implements OnInit {

  private subscription: Subscription;
  allocateProcess: AllocateProcess;
  private allocateProcessId: number;

  constructor(private route: ActivatedRoute, private authorizationService: AuthorizationService, private dataService: DataService, private allocateProcessService: AllocateProcessService) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any)=>{
      this.allocateProcessId = params['id'];
      this.authorizationService.getAuthorizationData(AllocateProcessConstants.featureId, AllocateProcessConstants.tableId).map(res=>{
        if(res.length>0){
          this.dataService.addFeatureActions(AllocateProcessConstants.featureId, res[0]);
          this.dataService.addFeatureFields(AllocateProcessConstants.featureId, res[1]);
        }
      }).flatMap((data)=>this.allocateProcessService.getAllocateProcess(this.allocateProcessId)).subscribe((data:any)=>{
        this.allocateProcess = data;
      })
    })
  }

  isAuthorized(action){
    return this.authorizationService.isFeatureActionAuthorized(AllocateProcessConstants.featureId, action);
  }
  isFeildAuthorized(field){
    return this.authorizationService.isFeildAuthorized(AllocateProcessConstants.featureId, field, "Read");
  }

}
