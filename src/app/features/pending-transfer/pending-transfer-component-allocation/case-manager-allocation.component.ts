import { Component, OnInit, Input } from '@angular/core';
import { ListService } from '../../../services/list.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CaseManagerAllocationService } from "../../case-manager-allocation/case-manager-allocation.service";

import { ComponentAllocationPendingTransfer } from "../component-allocation-transfer";
import {ExtraValidators} from "../extraValidator.component"
import { OffenderProfileService } from "../../offenderprofile/offenderprofile.service";
import { OffenderProfile } from "../../offenderprofile/offenderprofile";
import { AdditionalIdentifierService } from "../../additional-identifier/additional-identifier.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { Http } from '@angular/http';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service'
import { PendingTransferService } from "../pending-transfer.service";
import { HeaderService } from '../../../views/header/header.service';
import { AuthorizationService } from '../../../services/authorization.service';
import {Title} from "@angular/platform-browser";
@Component({
  selector: 'tr-case-manager-team',
  templateUrl: './case-manager-allocation.component.html',
  providers: [CaseManagerAllocationService, OffenderProfileService, PendingTransferService]
})
export class PendingTransferComponetAllocationComponent implements OnInit {
  private subscription: Subscription;
  private listObjLabel;
  private showOMTR: boolean = true;
  private reasonNull:boolean=true;
  private count:number;
  private editStatusId:number;
  @Input("dropdown") dropdown: FormGroup;
  private authorizedFlag:boolean=false;
  //private transferRequestId: number;
  private component: any;
  butDisabled: boolean = true;
  private selectedLink: string = "accept";
  private componentAllocationPendingTransfer: ComponentAllocationPendingTransfer = new ComponentAllocationPendingTransfer();
  private offProfile: OffenderProfile = new OffenderProfile();
  private isLasu: boolean = false;

  @Input("pkValue") pkValue;


  private cmaform: FormGroup;
  private teams: any = [];
  private officerIds: any = [];
  private users: any = [];
  private orgs: any = [];
  private rejectionReasonId: any = [];


  constructor(private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private listService: ListService,
    private caseManagerAllocationService: CaseManagerAllocationService,
    private offenderProfileService: OffenderProfileService,
    private headerService:HeaderService,
    private pendingTransferService: PendingTransferService,
    private confirmService: ConfirmService, private authorizationService: AuthorizationService,
    private titleService: Title) {

  }

  changeFlagAccept() {
      this.cmaform.controls['officeTeamId'].enable();
      this.cmaform.controls['officerId'].enable();
      this.cmaform.controls['bandId'].enable();

      this.cmaform.controls['rejectionReasonId'].disable();
       this.cmaform.controls['rejectionReasonId'].setValue("");
      this.cmaform.value.rejectionReasonId=1;
      this.showOMTR = true;
   }
  changeFlagReject(){
      this.cmaform.controls['rejectionReasonId'].enable();
      this.cmaform.controls['officeTeamId'].disable();
      this.cmaform.controls['officerId'].disable();
      // this.cmaform.controls['bandId'].value=-1;
      this.cmaform.controls['bandId'].disable();
      this.cmaform.controls['bandId'].setValue("");
      this.cmaform.controls['officeTeamId'].reset();
      this.cmaform.controls['officerId'].reset();
      this.cmaform.controls['officeTeamId'].setValue("");
      this.cmaform.controls['officerId'].setValue("");
      //this.cmaform.value.bandId=1;
    }
 ngOnInit() {
      this.titleService.setTitle('Allocation');
      this.route.params.subscribe((params: any) => {
      this.componentAllocationPendingTransfer.profileId = params['profileId'];
      this.componentAllocationPendingTransfer.transferReponseId = params['transferResponseId'];
      this.componentAllocationPendingTransfer.transferRequestId = params['transferRequestId'];
      this.componentAllocationPendingTransfer.dataId = params['dataId'];
      this.componentAllocationPendingTransfer.tableId = params['tableId'];
      if(!params.hasOwnProperty('transferResponseId')){
      this.componentAllocationPendingTransfer.actionId=3;
    }

        this.offenderProfileService.getOffenderProfileByProfileId(+params['profileId']).subscribe(
          (offenderProfile: OffenderProfile ) => {
            let yes = this.listService.getPkValueByTableIdAndCode(244, 'Y');
            if(offenderProfile.restrictionsExistYesNoId == yes || offenderProfile.exclusionsExistYesNoId == yes){
              this.isLasu = true;
            }
          }
        );

        this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(101, "Create");
        if (this.authorizedFlag){

        }else{
          this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
        }
        this.caseManagerAllocationService.getCaseManagerForEdit(this.componentAllocationPendingTransfer).subscribe((response: any) => {
        if(response.rejectionReasonId==null){
           response.rejectionReasonId="";
           this.cmaform.controls['rejectionReasonId'].setValue("");
        //  this.cmaform.controls['rejectionReasonId'].setValue(0);
          //this.dropdown.controls[this.rejectionReasonId].setValue('');
        }
        if(response.officeTeamId==null && response.officerId==null){
           response.officeTeamId="";
           response.officerId=""
           this.cmaform.controls['officeTeamId'].setValue("");
           this.cmaform.controls['officerId'].setValue("");
        //  this.cmaform.controls['rejectionReasonId'].setValue(0);
          //this.dropdown.controls[this.rejectionReasonId].setValue('');
        }
        delete response.actionId;
        this.cmaform.patchValue(response);

          this.route.params.subscribe((params: any) => {
          if(params.hasOwnProperty('transferResponseId')){
           if(response.rejectionReasonId != ''){
            this.cmaform.controls['rejectionReasonId'].setValue(response.rejectionReasonId);
            this.cmaform.controls['actionId'].setValue(4);
            this.componentAllocationPendingTransfer.actionId=4;
            }
            else{
                this.cmaform.controls['actionId'].setValue(3);
                this.componentAllocationPendingTransfer.actionId=3;
            }
          }
        });

         this.cmaform.controls['component'].setValue(this.componentAllocationPendingTransfer.component);
          //this.cmaform.controls['descriptionId'].setValue(this.componentAllocationPendingTransfer.descriptionId);
         if(response.officeTeamId!=null){
         this.changeForEdit(response.officeTeamId);
         }
         else{
          this.reasonNull=false;
         }
    response.component = this.componentAllocationPendingTransfer.component;

    if(response.descriptionId != null){
      if (this.componentAllocationPendingTransfer.tableId == 4) {
        this.componentAllocationPendingTransfer.component = "Service User";
      }
      else if (this.componentAllocationPendingTransfer.tableId == 337) {
        this.componentAllocationPendingTransfer.component = "Order Supervision";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(421, response.descriptionId);
      }
      else if (this.componentAllocationPendingTransfer.tableId == 17) {
        this.componentAllocationPendingTransfer.component = "Order Requirement";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(215, response.descriptionId);
      }
      else if (this.componentAllocationPendingTransfer.tableId == 38) {
        this.componentAllocationPendingTransfer.component = "NSI";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(192, response.descriptionId);
      }
      else if (this.componentAllocationPendingTransfer.tableId == 48) {
        this.componentAllocationPendingTransfer.component = "NSI";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(192, response.descriptionId);
      }
      else if (this.componentAllocationPendingTransfer.tableId == 19) {
        this.componentAllocationPendingTransfer.component = "PSS Requirement";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(197, response.descriptionId);
      }
      else if (this.componentAllocationPendingTransfer.tableId == 31) {
        this.componentAllocationPendingTransfer.component = "Institutional Report";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(149, response.descriptionId);
      }
      else if (this.componentAllocationPendingTransfer.tableId == 29) {
        this.componentAllocationPendingTransfer.component = "Court Report";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(108, response.descriptionId);
      } else if (this.componentAllocationPendingTransfer.tableId == 18) {
        this.componentAllocationPendingTransfer.component = "Licence Condition";
        this.componentAllocationPendingTransfer.componentType = this.listService.getLabelByTableIdAndPkId(422, response.descriptionId);
      }

      this.cmaform.controls['component'].setValue(this.componentAllocationPendingTransfer.component);
      this.cmaform.controls['componentType'].setValue(this.componentAllocationPendingTransfer.componentType);
    }
    if(this.componentAllocationPendingTransfer.actionId==3){
      this.cmaform.controls['officeTeamId'].enable();
      this.cmaform.controls['officerId'].enable();
      this.cmaform.controls['bandId'].enable();


      this.cmaform.controls['rejectionReasonId'].disable();
       this.cmaform.controls['rejectionReasonId'].setValue("");
    }
    if(this.componentAllocationPendingTransfer.actionId==4){
      this.cmaform.controls['rejectionReasonId'].enable();
      this.cmaform.controls['officeTeamId'].disable();
      this.cmaform.controls['officerId'].disable();
      this.cmaform.controls['bandId'].disable();
      this.cmaform.controls['bandId'].setValue("");
      this.componentAllocationPendingTransfer.actionId=4;
      this.showOMTR=false;
    }
        });

  });

     this.listService.getListDataByLookupAndPkValue(387, 522, this.componentAllocationPendingTransfer.transferRequestId).subscribe(listObj => {
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



    this.initForm();
    this.listService.getListData(229).subscribe(listData=>{

    })
  }

  initForm() {
    this.cmaform = this._fb.group({
      officeTeamId: ['', Validators.compose([Validators.required, , ,])],
      officerId: ['', Validators.compose([Validators.required, , ,])],
      actionId: [this.componentAllocationPendingTransfer.actionId],
      rejectionReasonId: [{value:this.componentAllocationPendingTransfer.rejectionReasonId,disabled: true},Validators.compose([Validators.required, , ,])],

      transferRequestId: [this.componentAllocationPendingTransfer.transferRequestId],
       transferReponseId: [this.componentAllocationPendingTransfer.transferReponseId],
      dataId: [this.componentAllocationPendingTransfer.dataId],
      tableId: [this.componentAllocationPendingTransfer.tableId],
      statusId: [this.componentAllocationPendingTransfer.statusId],
      bandId: [this.componentAllocationPendingTransfer.bandId, Validators.compose([
            ExtraValidators.conditional(
                group => group.controls.component.value === 'Service User',
                Validators.required
            ),
        ])
    ],
      component: [this.componentAllocationPendingTransfer.component],
      profileId: [this.componentAllocationPendingTransfer.profileId],
      componentType:[this.componentAllocationPendingTransfer.componentType]
    })
  }

  onSubmit() {
    if (this.cmaform.valid) {

     if (this.cmaform.value.officeTeamId != null) {
          this.cmaform.controls['statusId'].setValue(this.listService.getPkValueByTableIdAndCode(229, 'TA'));
          this.cmaform.controls['actionId'].setValue("1");
      } else {
          this.cmaform.controls['statusId'].setValue(this.listService.getPkValueByTableIdAndCode(229, 'TR'));
          this.cmaform.controls['actionId'].setValue("0");

      }

        let transferResponseId = this.route.snapshot.params['transferResponseId'];
     if(this.componentAllocationPendingTransfer.transferReponseId!=null){
        this.cmaform.controls['transferReponseId'].setValue(transferResponseId);
        this.pendingTransferService.addCTRAndCMA(this.cmaform.value).subscribe((response: any) => {
          this.offenderProfileService.getOffenderProfileByProfileId(this.componentAllocationPendingTransfer.profileId).subscribe((data: OffenderProfile) => {
            this.headerService.publishOffenderDetailsData(data);
            this.router.navigate(['../../..'], { relativeTo: this.route });
           });


        // this.caseManagerAllocationService.addCaseManagerForPendingTransfer(this.cmaform.value).subscribe((response: any) => {

        // });

      });
    }
      else{
         //this.cmaform.controls['transferReponseId'].setValue(transferResponseId);
        this.pendingTransferService.addCTRAndCMA(this.cmaform.value).subscribe((response: any) => {
          this.offenderProfileService.getOffenderProfileByProfileId(this.componentAllocationPendingTransfer.profileId).subscribe((data: OffenderProfile) => {
            this.headerService.publishOffenderDetailsData(data);
            this.router.navigate(['../..'], { relativeTo: this.route });
           });

        // this.caseManagerAllocationService.addCaseManagerForPendingTransfer(this.cmaform.value).subscribe((response: any) => {

        // });

      });
      }
    }
  }

  change(option) {
  this.cmaform.controls['officerId'].setValue('');
    if (option.selectedIndex > 0) {
      let selectedTeamId = this.teams[option.selectedIndex - 1].key;
      this.listService.getListDataByLookupAndPkValue(270, 402, selectedTeamId).subscribe(listObj => {

        // this.officerId = listObj;
        this.officerIds = listObj;
        if (this.officerIds.length == 0) {
          this.cmaform.value.officerId = -1;
        }
      })
    }

  }

   changeForEdit(selectedTeamId) {

      this.listService.getListDataByLookupAndPkValue(270, 402, selectedTeamId).subscribe(listObj => {
       this.officerIds = listObj;
        if (this.officerIds.length == 0) {
          this.cmaform.value.officerId = -1;
        }
      })


  }

  submitCancle(){
    this.route.params.subscribe((params: any) => {
      if(!params.hasOwnProperty('transferResponseId')){
        this.router.navigate(['../..'], { relativeTo: this.route });
      }else{
        this.router.navigate(['../../..'], { relativeTo: this.route });
      }
    });

  }

  navigateTo(url) {
    if (this.cmaform.touched) {
        this.confirmService.confirm(
        {
          message: 'Do you want to leave this page without saving?',
          header: 'Confirm',
          accept: () => {
               this.submitCancle();
          }
        });
    } else {
        this.submitCancle();
        return false;
    }
  }
}
