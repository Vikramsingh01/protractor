import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { PendingTransferService } from "../pending-transfer.service";
import { PendingTransferConstants } from '../pending-transfer.constants';
import { TokenService } from '../../../services/token.service';
import { DataService } from '../../../services/data.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Utility } from '../../../shared/utility';
import { AuthenticationGuard } from '../../../guards/authentication.guard';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { FilterPipe } from '../../../generic-components/filter/filter.pipe';
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { NgForm, FormGroup, FormBuilder ,FormControl, FormArray , Validators } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ConsolatedTransferRequest  } from '../consolatedTransferRequest';
import { PendingTransfer  } from '../pending-transfer';
import {OffenderProfileService} from "../../offenderprofile/offenderprofile.service";
import { log } from 'util';
import { OffenderProfile } from "../../offenderprofile/offenderprofile";
import { ComponentAllocationPendingTransfer } from "../component-allocation-transfer";
import { AfterViewInit } from '@angular/core';


@Component({
  selector: 'tr-consolated-transfer-requests',
  templateUrl: 'consolated-transfer-request-list.component.html'
})
export class ConsolatedTransferRequestComponent implements OnInit ,AfterViewInit  {

    @Input() transferRequestId: number;

    private searchObjs: any[] = [];
    componentAllocationList: any[];
    pendingTransferComponent: ConsolatedTransferRequest[] = [];
    listTransferRequest:ConsolatedTransferRequest[]=[];
    private authorizationData: any;
     private isStatusEmpty: boolean = false;
    private authorizedFlag: boolean = false;
    private isRejectionReasondisplay: boolean = false;
    private locked : boolean = false;
    pendingTransferComponentForm: FormGroup;
    private code: any;
    private checkOMReject: boolean = true;
    private pendingTransfer: PendingTransfer = new PendingTransfer();
    private pendingTransferForm: FormGroup;
    private isOmRequestAccepted:boolean=false;
    private isReject:boolean=false;
    private teams: any = [];
    private officerIds: any = [];
    private users: any = [];
    private orgs: any = [];
    private rejectionReasonId: any = [];
    private listOfBandIds:any=[]=[];
    private isLasu: boolean = false;
    private profileId:any;
    private transferId:number;
    private isRejectChecked:boolean=false;
    private isFormSubmittable:boolean=false;
    private toggleRejectionReasonFlag:boolean=true;
    private listOfRequest:ComponentAllocationPendingTransfer[]=[];
    private isAccept:boolean=true;                                                                                                                                                                                                      private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
		private route: ActivatedRoute,
    private pendingTransferService: PendingTransferService,
    private dataService: DataService,
    private tokenService: TokenService,
    private authorizationService: AuthorizationService,
    private authenticationGuard: AuthenticationGuard,
    private listService: ListService,
    private headerService: HeaderService,
    private confirmService: ConfirmService,
    private _fb: FormBuilder,
    private offenderProfileService: OffenderProfileService,
  ) {
  }
  ngAfterViewInit() {
    this.pendingTransferForm.controls['bandIdForOmRequest'].disable();
  }
  ngOnInit() {


      this.listService.getListData(2548).subscribe(data => {
        this.listOfBandIds = data;
      });

      this.listService.getListData(229).subscribe(data => {

      });


      this.route.params.subscribe((params: any)=>{
        if(params.hasOwnProperty('transferRequestId')) {
          this.transferId = params['transferRequestId'];}
          if(params.hasOwnProperty('profileId')) {
            this.profileId = params['profileId'];}
      });
      this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe(
        (offenderProfile: OffenderProfile ) => {
          let yes = this.listService.getPkValueByTableIdAndCode(244, 'Y');
          if(offenderProfile.restrictionsExistYesNoId == yes || offenderProfile.exclusionsExistYesNoId == yes){
            this.isLasu = true;
          }
        }
      );

      this.listService.getListDataByLookupAndPkValue(387, 522, this.transferId).subscribe(listObj => {
        this.orgs = listObj;
        if (this.orgs.length > 0) {
          this.listService.getListDataByLookupAndPkValue(445, 2, this.orgs[0].key).subscribe(listObj => {
            this.teams = listObj;
            if(this.isLasu){
              this.teams = listObj.filter(team => team.value == 'Unallocated');
            }
          });
        }
      })


        let pendingTransferComponent: ConsolatedTransferRequest = new ConsolatedTransferRequest();
        this.initForm();
        this.route.params.subscribe((params: any)=>{
        if(params.hasOwnProperty('transferRequestId')) {
          pendingTransferComponent.transferRequestId = params['transferRequestId'];
          this.pendingTransferService.getPendingTransferDate(pendingTransferComponent.transferRequestId).subscribe(data => {
            //this.router.navigate(['../../..'], { relativeTo: this.route });
            this.pendingTransfer=data;

        })
      }

    });

    //this.authorizationService.getAuthorizationDataByTableId(NetworkConstants.tableId).subscribe(authorizationData => {
    this.authorizationService.getAuthorizationData(PendingTransferConstants.featureId, PendingTransferConstants.tableId).subscribe(authorizationData => {
        this.authorizationData = authorizationData;
        if (authorizationData.length > 0) {
            this.dataService.addFeatureActions(PendingTransferConstants.featureId, authorizationData[0]);
            this.dataService.addFeatureFields(PendingTransferConstants.featureId, authorizationData[1]);
      }
        //this.authorizedFlag = this.authorizationService.isTableAuthorized(NetworkConstants.tableId, "Read", this.authorizationData);
        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(PendingTransferConstants.featureId, "Read");
        if (this.authorizedFlag) {
            this.pendingTransferService.genrateCTRForPendingTransferComponent(pendingTransferComponent).subscribe(data => {
                this.componentAllocationList = data;
                this.constructingCTRForSubmit(this.componentAllocationList);
                this.componentAllocationList.forEach(eachObj=>{
                if(eachObj.statusId!=null){
                this.isStatusEmpty=true;
                 }
             });
                if(this.componentAllocationList.length  > 1){
                  this.locked = this.componentAllocationList[0].locked;
                }
                this.sortSearchPaginationObj.paginationObj = data;
                this.sortSearchPaginationObj.filterObj = pendingTransferComponent;
            })
        } else {
            this.headerService.setAlertPopup("Not authorized");
        }
    });
        this.searchObjs = [];

}
constructingCTRForSubmit(consolatedResponseList: any[]){
  consolatedResponseList.forEach(pa=>{
      const control = <FormArray>this.pendingTransferForm.controls['consolatedResponseList'];
      control.push(this._fb.group({
          officeTeamId: [pa.officeTeamId ],
          officerId: [pa.officerId ],
          actionId: [pa.actionId],
          transferRequestId: [pa.transferRequestId],
          transferReponseId: [pa.transferReponseId],
          dataId: [pa.dataId],
          tableId: [pa.tableId],
          statusId: [pa.statusId],
          bandId: [pa.bandId],
          component: [pa.component],
          profileId: [pa.profileId],
          descriptionId: [pa.descriptionId],
          rejectionReasonId: [pa.rejectionReasonId],
          providerId: [pa.providerId],
          transferReasonId:[pa.transferReasonId],
      }));
  })

}

setIsRejectCheckedFlag(event){

  this.isAccept=event;
  if(event == true){
    this.isRejectChecked=true;
    this.isRejectionReasondisplay=false;
    this.pendingTransferForm.controls['teamId'].enable();
    this.pendingTransferForm.controls['officerId'].enable();
    this.pendingTransferForm.controls['bandIdForOmRequest'].disable();
    this.toggleRejectionReasonFlag=event;
    let control: FormArray = <FormArray>this.pendingTransferForm.controls['consolatedResponseList'];
        for (let i = 0; i < control.length; i++) {
          let formGroup: any =  control.at(i);
          if(formGroup.controls['rejectionReasonId'].enable){
            formGroup.controls['rejectionReasonId'].disable();
            this.isFormSubmittable=false;
            formGroup.controls['statusId'].setValue('');
            formGroup.controls['rejectionReasonId'].setValue('');
            this.isRejectChecked = false;
          }
        }

  }else{
        this.isFormSubmittable=false;
        this.isRejectionReasondisplay=true;
        this.isRejectChecked=false;
        this.pendingTransferForm.controls['teamId'].disable();
        this.pendingTransferForm.controls['officerId'].disable();
        this.pendingTransferForm.controls['bandIdForOmRequest'].disable();
        this.pendingTransferForm.controls['teamId'].setValue(null);
        this.pendingTransferForm.controls['officerId'].setValue(null);
        this.resetPendingTransferForm();
        // let control: FormArray = <FormArray>this.pendingTransferForm.controls['consolatedResponseList'];
        // for (let i = 0; i < control.length; i++) {
        //   let formGroup: any =  control.at(i);
        //   formGroup.controls['statusId'].setValue(false);
        //   formGroup.controls['rejectionReasonId'].enable();
        // }
     }

}


toggleBandField(event,component){


    if(component.controls['tableId'].value == 4 ){
      if(event.target.checked == true && this.isRejectChecked == false ){
        this.pendingTransferForm.controls['bandIdForOmRequest'].enable();

      }else if(event.target.checked == false && this.isRejectChecked == false){
        this.pendingTransferForm.controls['bandIdForOmRequest'].disable();

      }else{
        if(this.isRejectChecked == true ){
          this.pendingTransferForm.controls['bandIdForOmRequest'].disable();

        }
      }
    }
    if(this.isAccept==false && event.target.checked == true &&  this.isRejectChecked == true){
      this.toggleRejectanReason(component.controls['tableId'].value,false, component.controls['dataId'].value);
    }
    else if(this.isAccept==false && event.target.checked == false &&  this.isRejectChecked == true){
      this.toggleRejectanReason(component.controls['tableId'].value,true, component.controls['dataId'].value);
    }
    else if(this.isAccept==true &&  event.target.checked == true &&  this.isRejectChecked == true){
      this.toggleRejectanReason(component.controls['tableId'].value,false, component.controls['dataId'].value);
    }

    this.validateForSubmit();

}
toggleRejectanReason(tableId,enableOrDisableFlag,dataId){
  let control: FormArray = <FormArray>this.pendingTransferForm.controls['consolatedResponseList'];
  for (let i = 0; i < control.length; i++) {

    let formGroup: any =  control.at(i);
    // if(formGroup.controls['statusId'].value == true && formGroup.controls['tableId'].value == tableId){
    //   formGroup.controls['rejectionReasonId'].enable();
    // }else if(formGroup.controls['statusId'].value == false && formGroup.controls['tableId'].value == tableId){
    //   formGroup.controls['rejectionReasonId'].disable();
    // }
    let formControl: FormControl = formGroup.controls['rejectionReasonId'];
    if(enableOrDisableFlag == false && formGroup.controls['tableId'].value == tableId && dataId == formGroup.controls['dataId'].value ){
      formControl.enable();
      formControl.setValidators(Validators.required);
      formControl.updateValueAndValidity();
    }else if(enableOrDisableFlag == true && formGroup.controls['tableId'].value == tableId && dataId == formGroup.controls['dataId'].value) {
      formControl.disable();
      formControl.clearValidators();
      formControl.updateValueAndValidity();
    }
  }

}
validateForSubmit(){

  let isSubmittable:boolean=false;
  let control: FormArray = <FormArray>this.pendingTransferForm.controls['consolatedResponseList'];

  for (let i = 0; i < control.length; i++) {
    let formGroup: any =  control.at(i);
     if(formGroup.controls['statusId'].value == true){
      isSubmittable=true;
    }
    if(isSubmittable){
      this.isFormSubmittable=true;
    }else{
      this.isFormSubmittable=false;
    }
  }
}
resetPendingTransferForm(){
  let control: FormArray = <FormArray>this.pendingTransferForm.controls['consolatedResponseList'];
  this.pendingTransferForm.controls['teamId'].setValue('')
  this.pendingTransferForm.controls['officerId'].setValue('');
  this.pendingTransferForm.controls['bandIdForOmRequest'].setValue('');
  let statusId = this.pendingTransferForm.controls;
  this.isRejectChecked=true;

  for (let i = 0; i < control.length; i++) {
    let formGroup: any =  control.at(i);
    formGroup.controls['statusId'].setValue('');
    formGroup.controls['bandId'].setValue('');

  }

}

acceptPendingTransfer(){


  if (this.pendingTransferForm.valid) {

  let control: FormArray = <FormArray>this.pendingTransferForm.controls['consolatedResponseList'];

  for (let i = 0; i < control.length; i++) {

    let formGroup: any =  control.at(i);

    formGroup.controls['actionId'].setValue("0");
    formGroup.controls['officeTeamId'].setValue(this.pendingTransferForm.controls['teamId'].value);
    formGroup.controls['officerId'].setValue(this.pendingTransferForm.controls['officerId'].value);
    formGroup.controls['officerId'].setValue(this.pendingTransferForm.controls['officerId'].value);
    let status:boolean = formGroup.controls['statusId'].value;


    if(status  && this.isRejectChecked == false){


      formGroup.controls['statusId'].setValue(this.listService.getPkValueByTableIdAndCode(229, 'TA'));
      formGroup.controls['actionId'].setValue("1");


    }else if(status  && this.isRejectChecked == true){

      formGroup.controls['statusId'].setValue(this.listService.getPkValueByTableIdAndCode(229, 'TR'));
      formGroup.controls['actionId'].setValue("0");
    }else{
      formGroup.controls['statusId'].setValue(this.listService.getPkValueByTableIdAndCode(229, 'PN'));
    }
    if(  formGroup.controls['tableId'].value == 4 )
        formGroup.controls['bandId'].setValue(this.pendingTransferForm.controls['bandIdForOmRequest'].value);
    }
    if(this.pendingTransferForm.controls['acceptRejectFlag'].value == true){
      let list = this.pendingTransferForm.controls['consolatedResponseList'].value.filter(x=>x.statusId == this.listService.getPkValueByTableIdAndCode(229, 'TA'));
      this.createResponseAndAllocateCM(list);
    }else {
      let list = this.pendingTransferForm.controls['consolatedResponseList'].value.filter(x=>x.statusId == this.listService.getPkValueByTableIdAndCode(229, 'TR'));
      this.createResponseAndAllocateCM(list);;
    }

    }


}
  createResponseAndAllocateCM(listOfRequest){

    this.pendingTransferService.createConsolatedTransferResponseAndAllocateCM(listOfRequest).subscribe((response: any) => {
      this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: OffenderProfile) => {
        this.headerService.publishOffenderDetailsData(data);
        this.router.navigate(['../..'], { relativeTo: this.route});
      })
    });
  }


  searchNetwork(filterObj) {
    this.sortSearchPaginationObj.filterObj = filterObj;
		this.sortSearchPaginationObj.paginationObj.number=0;
    this.sortFilterAndPaginate(filterObj, this.sortSearchPaginationObj.paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sort(sortObj){
    this.sortSearchPaginationObj.sortObj = sortObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, this.sortSearchPaginationObj.paginationObj, sortObj);
  }
  paginate(paginationObj){
    this.sortSearchPaginationObj.paginationObj = paginationObj;
    this.sortFilterAndPaginate(this.sortSearchPaginationObj.filterObj, paginationObj, this.sortSearchPaginationObj.sortObj);
  }

  sortFilterAndPaginate(filterObj, paginationObj, sortObj){
    this.pendingTransferService.sortFilterAndPaginate(filterObj, paginationObj, sortObj).subscribe((data: any)=>{
      this.componentAllocationList = data.content;
      this.sortSearchPaginationObj.paginationObj = data;
    });
  }

  isAuthorized(action) {
    //return this.authorizationService.isTableAuthorized(NetworkConstants.tableId, action, this.authorizationData);
    return this.authorizationService.isFeatureActionAuthorized(PendingTransferConstants.featureId, action);
  }
  isFeildAuthorized(field) {
    //return this.authorizationService.isTableFieldAuthorized(NetworkConstants.tableId, field, "Read", this.authorizationData);
    return this.authorizationService.isFeildAuthorized(PendingTransferConstants.featureId, field, "Read");
  }
  navigateTo(url) {

        this.router.navigate(url, { relativeTo: this.route });
  }

  change(option) {
    this.pendingTransferForm.controls['officerId'].setValue('');
      if (option.selectedIndex > 0) {
        let selectedTeamId = this.teams[option.selectedIndex - 1].key;
        this.listService.getListDataByLookupAndPkValue(270, 402, selectedTeamId).subscribe(listObj => {

          // this.officerId = listObj;
          this.officerIds = listObj;
          if (this.officerIds.length == 0) {
            this.pendingTransferForm.value.officerId = -1;
          }
        })
      }

    }





  initForm() {
    this.pendingTransferForm = this._fb.group({
      acceptRejectFlag: [true],
      teamId: ['',Validators.compose([Validators.required, , ,])],
      officerId:['',Validators.compose([Validators.required, , ,])],
      bandIdForOmRequest: ['',Validators.compose([Validators.required, , ,])],
      consolatedResponseList: this._fb.array([])
  });


}
}

