import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from "@angular/platform-browser";
import { CaseManagerAllocationService } from "../case-manager-allocation.service";
import { ComponentManager } from "../component-management";
import { } from "";
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
import { NgForm, FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Subscription } from "rxjs/Rx";
import {LasuRestrictionService} from "../../lasu/lasu-restriction.service";
import {element} from "protractor";
@Component({
  selector: 'tr-case-manager-allocation',
  templateUrl: 'case-manager-allocation-list.component.html'
})
export class CaseManagerAllocationListComponent implements OnInit {
  private subscription: Subscription;
  private componentManager1: ComponentManager = new ComponentManager();
  private cmaform: FormGroup;
  componentManagerAllocationAddForm: FormGroup;
  CaseManagerAllocationListForm: FormGroup;
  private authorizedFlag:boolean=false;
   private checkFlag:boolean=false;
  private profileId: number;
  caseManagerAllocationList: any[];
  ComponentManagerJson: any;
  ComponentManagerJsonArr: any[] = [];
  private componentManager: ComponentManager = new ComponentManager();
  teams: any = [];
  officerIds: any = [];
  orgs: any = [];
  reason: any = [];
  lasu: boolean;
  allowSubmit : boolean=false;

  private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
  constructor(private router: Router,
    private _fb: FormBuilder,
    private caseManagerAllocationService: CaseManagerAllocationService,
    private route: ActivatedRoute, private listService: ListService,
    private authorizationService: AuthorizationService,
     private headerService:HeaderService,
     private titleService: Title,
      private confirmService: ConfirmService,
              private lasuService: LasuRestrictionService
  ) {
  }
  ngOnInit() {
    this.titleService.setTitle('SU Management');
    this.route.params.subscribe((params: any) => {
      this.componentManager.profileId = params['profileId'];

    });

    this.lasuService.checkIsLasu(this.componentManager.profileId).subscribe(response => {
      if(response){
        this.lasu = true;
      }else{
        this.lasu = false;
      }
    });

  this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(101, "Read");
        if (this.authorizedFlag){

        }else{
          this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
        }

    this.initForm();
    this.initTransferRequest();
    this.listService.getListDataByLookupAndPkValue(263, 533, localStorage.getItem("loggedInUserId")).subscribe(listObj => {
      this.orgs = listObj.filter(element =>
        element['value'] != 'Unallocated');
      if (this.orgs.length > 0) {
        this.listService.getListDataByLookupAndPkValue(445, 2, this.orgs[0].key).subscribe(listObj => {
          this.teams = listObj;
        })
      }
    })

  }
  onSubmit() {
      this.checkFlag = this.authorizationService.isFeatureActionAuthorized(101, "Update");

        if (this.checkFlag){

        }else{
          this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
        }
    if (this.componentManagerAllocationAddForm.valid) {
      // let transferOutRequests = this.componentManagerAllocationAddForm.value.transferOutRequests;
      // transferOutRequests.forEach(transferOut => {
      //   transferOut['teamId'] = this.componentManagerAllocationAddForm.value.officeTeamId;
      //   transferOut['officerId'] = this.componentManagerAllocationAddForm.value.officerId;
      // });

      this.caseManagerAllocationService.addComponetManager(this.componentManagerAllocationAddForm.value).subscribe(response => {
       //this.router.navigate(['.'], { relativeTo: this.route });
         this.initForm();
         this.initTransferRequest();
      });

    }
  }
  initForm() {
    this.componentManagerAllocationAddForm = this._fb.group({
      officeTeamId: ['', Validators.compose([Validators.required, , ,])],
      //officerId: ['', Validators.compose([Validators.required, , ,])],
      //teamId as officerId
      officerId: ['', Validators.compose([Validators.required, , ,])],
      transferReasonId: [''],
      listOfCaseManagerAllocationJson: this._fb.array([]),
    });
  }

  initTransferRequest() {
    this.subscription = this.route.params.subscribe((params: any) => {
      let componentManager: ComponentManager = new ComponentManager();
      if (params.hasOwnProperty('profileId')) {
        this.profileId = params['profileId'];
      }

      this.caseManagerAllocationService.sortFilterAndPaginateForComponentManager(this.profileId, componentManager).subscribe(transferOutRequestData => {
        transferOutRequestData.forEach(element => {
          if(element.enableComponet == true){
            this.allowSubmit = true;
          }
          const control = <FormArray>this.componentManagerAllocationAddForm.controls['listOfCaseManagerAllocationJson'];
          control.push(this._fb.group({
            type: element.type,
            transferToProviderId: element.transferToProviderId,
            officerName:element.officerName,
            endDate: element.endDate,
            startDate: element.startDate,
            officeTeamId: element.officeTeamId,
            officeTeam:element.officeTeam,
            transferToResponsibleOfficerId: element.transferToResponsibleOfficerId,
            dataId: element.dataId,
            descriptionId: element.descriptionId,
            transferReasonId:'',
            tableId: element.tableId,
            userId:element.userId,
            enableComponet:element.enableComponet,
          }));
        });
      });
    });
  }

navigateTo(url) {
        if (this.componentManagerAllocationAddForm.touched) {
            this.confirmService.confirm(
                {
                    message: 'Do you want to leave this page without saving?',
                    header: 'Confirm',
                    accept: () => {
                        this.router.navigate(url, { relativeTo: this.route });
                    }
                });
        } else {
            this.router.navigate(url, { relativeTo: this.route });
            return false;
        }
    }

  change(option) {
   this.componentManagerAllocationAddForm.controls['officerId'].setValue('');
    if (option.selectedIndex > 0) {
      let selectedTeamId = this.orgs[option.selectedIndex - 1].key;
      this.listService.getListDataByLookupAndPkValue(270, 402, selectedTeamId).subscribe(listObj => {

        this.officerIds = listObj;
        this.lasuService.getOfficers(this.componentManager.profileId).subscribe(response => {
            if (response['restriction']) {
              let restrictionList = response['restriction'];
              if(this.officerIds){
                let commonIds = [];
                restrictionList.forEach(restrictionPerson => {
                  this.officerIds.forEach(officerId => {
                    if(officerId['key'] == restrictionPerson){
                      commonIds.push(restrictionPerson);
                    }
                  });
                });
                this.officerIds = this.officerIds.filter(element => commonIds.indexOf(element['key'])!== -1);
              }
            }
            else if (response['exclusion']) {
              let exclusionList = response['exclusion'];
              if(this.officerIds){
                exclusionList.forEach(element=>{
                  let commonIds = [];
                  exclusionList.forEach(exclusionPerson => {
                    this.officerIds.forEach(officerId => {
                      if(officerId['key'] == exclusionPerson){
                        commonIds.push(exclusionPerson);
                      }
                    });
                  });
                  this.officerIds = this.officerIds.filter(element => commonIds.indexOf(element['key']) === -1);
                });
              }
            }
          }
        );
        if (this.officerIds.length == 0) {
          this.componentManagerAllocationAddForm.value.officerIds = null ;
        }
      })

    }

  }







}
