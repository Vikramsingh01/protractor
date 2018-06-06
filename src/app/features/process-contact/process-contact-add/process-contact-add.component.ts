import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { HeaderService } from '../../../views/header/header.service';
import { ProcessContactService } from '../process-contact.service';
import { ProcessContactConstants } from '../process-contact.constants';
import { ProcessContact } from '../process-contact';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { ListService } from '../../../services/list.service';
import { Utility } from '../../../shared/utility';
import { AssociatedPTO } from '../associated-pto';
import { ExtraValidators } from "../extraValidator.component";
@Component({
    selector: 'tr-process-contact-edit',
    templateUrl: 'process-contact-add.component.html'
})
export class ProcessContactAddComponent implements OnInit {

    private subscription: Subscription;
    private processContactId: number;
    private processTypeId: number;
    private count : number = 0;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    processContactAddForm: FormGroup;
    private processContact: ProcessContact = new ProcessContact();
    private action;
    private id;
    private type: any[];
    private processTypeList: any[];
    private unitsList: any;
    private associatedPTO: AssociatedPTO;
    private relateto = [];
    private relateToEdit = [];
    private nsrdData: any = [];
    childAnswers: any = [];
    private team: string = "";
    private officer: string = "";
    private processTypeExcludeList = [];
    private nsiProvisionListIds = [];
    private previousNotes: string = "";
    private intendedProvider: any;
    childParentAnswers: any = [];
    private showUnitCode: boolean;
    private isUpdateForExternal: boolean = true;
    private hideLength: boolean = false;
    private externalTeam;
    private externalOfficer;
    private teamsId;
    private maxLenght;
    private minLenght;
    private officersId;
    private showTeamAndOfficer: Boolean = true;
    orgs: any = [];
    teams: any = [];
    officerIds: any = [];
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private processContactService: ProcessContactService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private titleService: Title) { }

    ngOnInit() {
        this.listService.getlistBreDataByTableId(192).subscribe(listResponse => {
            this.type = listResponse.filter(item => item['selectable'] === true);
            this.processTypeList =  this.type;
            this.dataService.addListData(192,  this.type);
        });
        this.route.params.subscribe((params: any) => {
            if (!params.hasOwnProperty('processContactId')) {
                this.action = "Create";
                this.titleService.setTitle("Add Interventions");
            } else {
                this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('profileId')) {
                        this.id = params['profileId'];
                    }
                });
                this.action = "Update";
                this.processTypeId = params['processTypeId'];
                this.titleService.setTitle("Edit Interventions");
            }
            if (params.hasOwnProperty('profileId')) {
                this.processContact.profileId = params['profileId'];
            }
        });
        this.listService.getListDataByLookupAndPkValue(263, 533, localStorage.getItem("loggedInUserId")).subscribe(listObj => {
            this.orgs = listObj;
            if (this.orgs.length > 0) {
                this.listService.getListDataByLookupAndPkValue(445, 2, this.orgs[0].key).subscribe(listObj => {
                    this.teams = listObj;
                })
            }
        })
        //this.authorizationService.getAuthorizationDataByTableId(ProcessContactConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(ProcessContactConstants.featureId, ProcessContactConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(ProcessContactConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(ProcessContactConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(ProcessContactConstants.tableId, this.action, this.authorizationData);
            this.initForm();
            if (this.action == "Update") {
                this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('processContactId')) {
                        //this.id = params['profileId'];
                        this.showTeamAndOfficer = false;
                    }
                });
            } else {
                this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('profileId')) {
                        this.id = params['profileId'];
                    }
                });
            }
            this.processContactService.isAuthorize(this.id,this.action).subscribe((response: any) => {
                this.authorizedFlag = response;
                
                if (this.authorizedFlag) {
                    this.initForm();
                    this.subscription = this.route.params.subscribe((params: any) => {
                        this.processContactAddForm.controls['processManagerProviderId'].disable();


                        this.processContactService.getPTOfficer().subscribe(data => {
                            this.associatedPTO = data;
                            this.processContactService.getRequestFilteredTypeList(this.associatedPTO.provider).subscribe(data => {
                                this.nsiProvisionListIds = data.nsiProvisionListIds;
                            })

                            this.processContactAddForm.controls['processManagerProviderId'].setValue(this.associatedPTO.provider);
                            this.processContactAddForm.controls['intendedProviderId'].setValue(this.associatedPTO.provider);
                           this.processContactAddForm.controls['nsiOfficer'].setValue(this.associatedPTO.officer.split("/")[1]);
                            this.processContactAddForm.controls['nsiTeam'].setValue(this.associatedPTO.team.split("/")[1]);

                        });

                        if (params.hasOwnProperty('processContactId')) {
                            this.processContactAddForm.controls['relatesTo'].disable();
                            this.processContactAddForm.controls['intendedProviderId'].disable();
                            this.processContactAddForm.controls['processTypeId'].disable();
                            this.processContactAddForm.controls['processSubTypeId'].disable();
                            this.processContactAddForm.controls['processRefDate'].disable();
                            this.processContactAddForm.controls['nsiTeam'].disable();
                            this.processContactAddForm.controls['nsiOfficer'].disable();

                            this.processContactId = params['processContactId'];
                            this.processContactService.getRelatedToList(this.processContact.profileId).subscribe(data => {
                                this.relateToEdit = data;
                                this.processContactService.getProcessContact(this.processContactId,this.processTypeId).subscribe((data: any) => {
                                    if (data.locked == "false") {
                                       this.processContactAddForm.controls['intendedProviderId'].setValue(data.intendedProviderId);
                                        this.intendedProvider = data.intendedProviderId;

                                        if (data.intendedProviderId != data.processManagerProviderId) {
                                            this.isUpdateForExternal = false;
                                            this.externalOfficer = data.nsiOfficer;
                                            this.externalTeam = data.nsiTeam;
                                            // this.processContactAddForm.controls['nsiTeam'].disable();
                                            // this.processContactAddForm.controls['nsiOfficer'].disable();
                                        }
                                        this.officer = data.nsiOfficer;
                                        this.team = data.nsiTeam;
                                        // data.nsiOfficer = data.nsiOfficer.split("/")[1];
                                        // if (this.isUpdateForExternal) {
                                        //     data.nsiTeam = data.nsiTeam.split("/")[1];
                                        //     data.nsiOfficer = this.parseOfficer(data.nsiOfficer);
                                        // }
                                        this.previousNotes = data.processNote;
                                        data.processNote = "";
                                        data.nsiOfficer = this.parseOfficer(data.nsiOfficer);
                                        data.nsiTeam = data.nsiTeam.split("/")[1].split("[")[0];

                                        this.processContactAddForm.patchValue(data);
                                        if (this.processContactAddForm.controls['processEndDate'] != null && this.processContactAddForm.controls['processOutcomeId'] != null && this.processContactAddForm.controls['processEndDate'].value != null && this.processContactAddForm.controls['processEndDate'].value != "" && this.processContactAddForm.controls['processOutcomeId'].value != null && this.processContactAddForm.controls['processOutcomeId'].value != "") {
                                            this.processContactAddForm.controls['processEndDate'].disable();
                                            this.processContactAddForm.controls['processOutcomeId'].disable();
                                            this.processContactAddForm.controls['processStageId'].disable();
                                        }
                                        if(data.length!=null){
                                            this.hideLength=true;
                                        }
                                        data = this.processContactService.removeConstantsFields(data);
                                        if (!this.showUnitCode) {
                                            this.processContactService.getProcessContactCrd(data).subscribe((breResponse: any) => {
                                                this.listService.getParentDependentAnswers(193, this.intendedProvider).subscribe((childParentAnswers: any) => {
                                                    this.childParentAnswers = childParentAnswers;
                                                    this.updateDataNsrd(breResponse.resultMap);
                                                });
                                                this.listService.getDependentAnswers(192, data.processTypeId).subscribe((childAnswers: any) => {
                                                    this.childAnswers = childAnswers;
                                                });

                                            });
                                            this.showUnitCode = true;
                                        }



                                    }
                                    else {
                                        this.headerService.setAlertPopup("The record is locked");

                                    }
                                });
                            });



                        }


                    })

                } else {
                    this.headerService.setAlertPopup("You are not authorised to perform this action on this SU record. Please contact the Case Manager.");
                }
            });
        });

        this.processContactService.getProcessTypeExcludeList().subscribe(data => {
            this.processTypeExcludeList = data.processTypeExcludeList;
        })

        this.processContactService.getRelatedToList(this.processContact.profileId).subscribe(data => {
            this.relateto = data;
        });

        // this.processContactService.getRequestFilteredTypeList(this.associatedPTO.provider).subscribe(data => {
        //     this.nsiProvisionListIds = data.nsiProvisionListIds;
        // })
    }


    isNsrdFieldActive(fieldName) {
        let obj = Utility.getObjectFromArrayByKeyAndValue(this.nsrdData, "fieldName", fieldName);
        if (!obj.active) {
            return false;
        } else {
            return true;
        }
    }
    updateParentAnswers(childParentAnswers) {

      
        if( this.count > 0 ) {
        if( this.count > 0 &&  this.showTeamAndOfficer == false){
             this.showTeamAndOfficer = true;
        }else {
          this.showTeamAndOfficer = false;
        }
        }else{
        this.showTeamAndOfficer = false;
        }
      
        this.count++;
        this.childParentAnswers = childParentAnswers;
        let typeArray: any[] = childParentAnswers[192];
        let filteredTypeArray: any[] = [];
        let breList = this.type;
        let breachRefId = this.listService.getPkValueByTableIdAndCode(192, 'BRES');
        let cwRefId = this.listService.getPkValueByTableIdAndCode(192, 'CRTS');
        let breachId = this.listService.getPkValueByTableIdAndCode(192, 'BRE');
        let cwId = this.listService.getPkValueByTableIdAndCode(192, 'CRT');
        typeArray.forEach(typeObj => {
            if (Utility.getObjectFromArrayByKeyAndValue(this.type, 'key', parseInt(typeObj.key)) != null) {
                if (typeObj.key != breachRefId + "" && typeObj.key != cwRefId + "" && typeObj.key != breachId + "" && typeObj.key != cwId + "") {
                    filteredTypeArray.push(typeObj);
                }
            }
        })
        this.processTypeList = filteredTypeArray;
    }


    onChange(data) {
        if(data!="null" &&   this.processContactAddForm.controls['intendedProviderId'].value != "" ){
            
      
        this.processContactService.processTypeByRelatesTo(this.processContactAddForm.value).subscribe(processTypeList => {
            this.processTypeList = processTypeList;
        });
          }
        this.processContactAddForm.controls['processTypeId'].setValue(null);
        this.processContactAddForm.controls['processSubTypeId'].setValue(null);
        this.processContactAddForm.controls['processRefDate'].setValue(null);
    }


    change(option) {
        if (option.selectedIndex > 0) {
            let selectedTeamId = this.orgs[option.selectedIndex - 1].key;
            this.listService.getListDataByLookupAndPkValue(270, 538, selectedTeamId).subscribe(listObj => {
                this.officerIds = listObj;
                if (this.officerIds.length == 0) {
                    this.processContactAddForm.value.officerIds = null;
                }
            })
        }

    }


    updateAnswers(childAnswers) {
        this.childAnswers = childAnswers;
        //   this.processContactService.getUnitsCode(this.processContactAddForm.controls['processTypeId'].value).subscribe(unitsList => {
        //     this.unitsList = unitsList;
        //     // if(this.unitsList.length>0){
        //     //     this.hideLength=true;
        //     // }
        // });
    }
    isNsrdFieldMandatory(fieldName) {
        let obj = Utility.getObjectFromArrayByKeyAndValue(this.nsrdData, "fieldName", fieldName);
        if (!obj.mandatory) {
            return false;
        } else {
            this.processContactAddForm.controls[fieldName].setValidators(Validators.required);
            return true;
        }
    }

    //   updateDataNsrd(breData) {

    //    if (!(typeof breData == undefined)) {

    //        //var data= nsrdData.fieldDataObjectList
    //           for (var i = 0; i < breData.length; i++) {
    //             this.nsrdData[breData[i].fieldName] = {};
    //                 this.nsrdData[breData[i].fieldName].active = breData[i].active;
    //                this.nsrdData[breData[i].fieldName].mandatory = breData[i].mandatory;

    //                  this.processContactAddForm.controls[breData[i].fieldName].setValue(breData[i].value);
    //              }
    //              // breData.forEach(element => {
    //             //     this.nsrdData[element.fieldName] = {};
    //             //     this.nsrdData[element.fieldName].active = element.active;
    //     //         //     this.nsrdData[element.fieldName].mandatory = element.mandatory;

    //     //         //     this.processContactAddForm.controls[element.fieldName].setValue(element.value);
    //     //         // });

    //     //     }

    //     }
    //   }
    updateDataNsrd(nsrdData) {

        if (nsrdData.hasOwnProperty('fieldDataObjectList')) {
            //this.hideLength = true;
            var data = nsrdData.fieldDataObjectList;
            data.forEach(element => {
                this.nsrdData[element.fieldName] = {};
                this.nsrdData[element.fieldName].active = element.active;
                this.nsrdData[element.fieldName].mandatory = element.mandatory;
                if (element.fieldName == 'unitsCode' && element.value == null) {
                    this.hideLength = false;
                }
                if (element.fieldName == 'unitsCode' && element.value != null) {
                    this.hideLength = true;
                      this.processContactAddForm.controls['length'].setValidators(Validators.compose([Validators.required]));
                      //this.processContactAddForm.controls['processEndAttCount'].setValidators(Validators.required);
                      //this.processContactAddForm.controls['length'].setValidators(Validators.maxLeeeength(6));
                }
                if (element.value != null) {
                    this.processContactAddForm.controls[element.fieldName].setValue(element.value);
                }
            });
        }

        if (nsrdData.hasOwnProperty('fieldObjectList')) {
            let fieldObjectList: any[] = nsrdData.fieldObjectList;
            let lengthObj = Utility.getObjectFromArrayByKeyAndValue(fieldObjectList, 'fieldName', 'length');
            if (lengthObj != null) {
                this.processContactAddForm.controls['length'].setValidators(Validators.compose([Validators.required, ValidationService.MinValue(1), ValidationService.MaxValue(6)]));
                this.processContactAddForm.controls['length'].updateValueAndValidity();
                // this.length_is_mandatory = true;
                this.hideLength = true;
            } 
        }

        // var data = nsrdData.fieldDataObjectList;
        // data.forEach(element => {
        //     this.nsrdData[element.fieldName] = {};
        //     this.nsrdData[element.fieldName].active = element.active;
        //     this.nsrdData[element.fieldName].mandatory = element.mandatory;

        //     this.processContactAddForm.controls[element.fieldName].setValue(element.value);
        // });



    }





    //    updateNsrd(nsrdData) {
    //      if (!(typeof nsrdData == "undefined")) {
    //     //     if (nsrdData.hasOwnProperty('resultMap')) {
    //     //         if (nsrdData.resultMap.hasOwnProperty('fieldObjectList')) {
    //                 //this.nsrdData = nsrdData.resultMap.fieldObjectList;
    //                 nsrdData.forEach((element: any) => {
    //                     this.nsrdData[element.fieldName] = {};
    //                     let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), "fieldName", element.fieldName);
    //                     if (element.active) {
    //                         this.nsrdData[element.fieldName].active = element.active;
    //                         this.processContactAddForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
    //                         if (element.mandatory) {
    //                             this.nsrdData[element.fieldName].mandatory = element.mandatory;
    //                             currentControl.validators.push(Validators.required);
    //                             this.processContactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
    //                         } else {
    //                             this.processContactAddForm.controls[element.fieldName].setValidators(currentControl.validators);
    //                         }
    //                     } else {
    //                         this.processContactAddForm.removeControl(element.fieldName);
    //                     }


    //                     if (element.active) {
    //                         this.processContactAddForm.controls[element.fieldName].updateValueAndValidity();
    //                     }
    //                 });
    //     //         }
    //     //     }
    //    }


    // }

    updateAd(childAnswers) {
        this.childAnswers = childAnswers;
    }
    ngAfterViewInit() {

    }

    navigateTo(url) {
        if (this.processContactAddForm.touched) {
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
    onSubmit() {
        if (this.processContactAddForm.valid) {
            let formTeam = this.processContactAddForm.controls['nsiTeamId'].value;
            let formOfficer = this.processContactAddForm.controls['nsiOfficerId'].value;

            if (this.processContactId != null) {

                let relatesTo = this.processContactAddForm.getRawValue().relatesTo;
                this.relateto.forEach((element, index) => {
                    if (element.key.description == relatesTo) {
                        this.processContactAddForm.controls['relatesTo'].setValue(JSON.stringify(element.key));
                    }
                });

                let formTeamForUpdate = this.processContactAddForm.controls['nsiTeam'].value;
                let formOfficerForUpdate = this.processContactAddForm.controls['nsiOfficer'].value;

                if (formTeamForUpdate.indexOf("/") < 0) {
                    formTeamForUpdate = this.team.split("/")[0] + "/" + formTeamForUpdate;
                } if (formOfficerForUpdate.indexOf("/") < 0) {
                    formOfficerForUpdate = this.officer.split("/")[0] + "/" + formOfficerForUpdate;
                }

                this.processContactAddForm.value.processManagerProviderId = this.processContactAddForm.controls['processManagerProviderId'].value;
                this.processContactAddForm.value.relatesTo = this.processContactAddForm.controls['relatesTo'].value;
                this.processContactAddForm.value.nsiTeam = formTeamForUpdate;
                this.processContactAddForm.value.nsiOfficer = formOfficerForUpdate;
                this.processContactAddForm.value.intendedProviderId = this.processContactAddForm.controls['intendedProviderId'].value;
                this.processContactAddForm.value.processTypeId = this.processContactAddForm.controls['processTypeId'].value;
                this.processContactAddForm.value.processSubTypeId = this.processContactAddForm.controls['processSubTypeId'].value;
                this.processContactAddForm.value.processRefDate = this.processContactAddForm.controls['processRefDate'].value;

                if (!this.isUpdateForExternal) {
                    this.processContactAddForm.value.nsiTeam = this.externalTeam;
                    this.processContactAddForm.value.nsiOfficer = this.externalOfficer;
                }
                this.processContactService.updateProcessContact(this.processContactId, this.processTypeId,this.processContactAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../..'], { relativeTo: this.route });
                },
                    err => {
                        if (!(typeof this.relateto == "undefined")) {
                            this.relateto.forEach((element, index) => {
                                if (element.key.description == relatesTo) {
                                    this.processContactAddForm.controls['relatesTo'].setValue(element.key.description);
                                }
                            });
                        }
                        if (JSON.parse(err._body).errorMessage == "Edit operation is not allowed.") {
                            this.headerService.setErrorPopup(JSON.parse(err._body))
                        }
                    });
            } else {
                if(this.showTeamAndOfficer == true){
                if (formTeam.indexOf("/") < 0) {
                    formTeam = this.associatedPTO.team.split("/")[0] + "/" + formTeam;
                } if (formOfficer.indexOf("/") < 0) {
                    formOfficer = this.associatedPTO.officer.split("/")[0] + "/" + formOfficer;
                }

                this.processContactAddForm.value.nsiTeam = formTeam.split("/")[1];
                this.processContactAddForm.value.nsiOfficer = formOfficer;
                }
                else{
                    this.processContactAddForm.value.nsiOfficer = this.associatedPTO.officer
                }
                this.processContactAddForm.value.processManagerProviderId = this.processContactAddForm.controls['processManagerProviderId'].value;
                
                this.processContactService.addProcessContact(this.processContactAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                });
            }
        }
        else {
            // alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(ProcessContactConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(ProcessContactConstants.featureId, field, this.action);
    }


    initForm() {
        this.processContactAddForm = this._fb.group({
            processId: [this.processContact.processId],
            profileId: [this.processContact.profileId],
            spgVersion: [this.processContact.spgVersion],
            spgUpdateUser: [this.processContact.spgUpdateUser],
            processTypeId: [this.processContact.processTypeId, Validators.compose([Validators.required, , ,])],
            processSubTypeId: [this.processContact.processSubTypeId, Validators.compose([ Validators.required, , ,])],
            processRefDate: [this.processContact.processRefDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            processExpectedStartDate: [this.processContact.processExpectedStartDate, Validators.compose([, ValidationService.dateValidator, ,])],
            processStartDate: [this.processContact.processStartDate, Validators.compose([, ValidationService.dateValidator, ,])],
            processExpectedEndDate: [this.processContact.processExpectedEndDate, Validators.compose([, ValidationService.dateValidator, ,])],
            processEndDate: [this.processContact.processEndDate, Validators.compose([, ValidationService.dateValidator, ,])],
            processStageId: [this.processContact.processStageId, Validators.compose([Validators.required, , ,])],
            processStageDate: [this.processContact.processStageDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            processNote: [this.processContact.processNote, Validators.compose([, , ,])],
            processOutcomeId: [this.processContact.processOutcomeId, Validators.compose([, , ,])],
            processEndAttCount: [this.processContact.processEndAttCount, Validators.compose([, , ,])],
            intendedProviderId: [this.processContact.intendedProviderId, Validators.compose([Validators.required, , ,])],
            spgProcessContactId: ['0', Validators.compose([Validators.required, , ,])],
            processManagerProviderId: [{ value: this.processContact.processManagerProviderId, disabled: true }, , Validators.compose([Validators.required, , ,])],
            nsiTeam: [this.processContact.nsiTeam, Validators.compose([, , ,])],
            nsiOfficer: [this.processContact.nsiOfficer, Validators.compose([, , ,])],
            // createdBy:[ this.processContact.createdBy , ],
            // createdByUserId:[ this.processContact.createdByUserId , ],
            // createdDate:[ this.processContact.createdDate , ],
            // modifiedBy:[ this.processContact.modifiedBy , ],
            // modifiedByUserId:[ this.processContact.modifiedByUserId , ],
            // modifiedDate:[ this.processContact.modifiedDate , ],
            // deleted:[ this.processContact.deleted , ],
            // deletedBy:[ this.processContact.deletedBy , ],
            // deletedByUserId:[ this.processContact.deletedByUserId , ],
            // deletedDate:[ this.processContact.deletedDate , ],
            // locked:[ this.processContact.locked , ],
            // version:[ this.processContact.version , ],
            relatesTo: [this.processContact.relatesTo, Validators.compose([Validators.required, , ,])],
            unitsCode: [],
            length: [this.processContact.length, Validators.compose([
                ExtraValidators.conditional(
                    group => this.hideLength === true,
                    Validators.required
                ),
            ])
            ],
            // length: [this.processContact.length],
            nsiOfficerId: [this.processContact.nsiOfficerId, Validators.compose([
                ExtraValidators.conditional(
                    group => this.action === "Create" &&  this.showTeamAndOfficer === true,
                    Validators.required
                ),
            ])
            ],
            nsiTeamId: [this.processContact.nsiTeamId,  Validators.compose([
                ExtraValidators.conditional(
                    group => this.action === "Create" &&  this.showTeamAndOfficer === true ,
                    Validators.required
                ),
            ])
            ],
        });
    }




    getNSRDFormObj() {
        let formObjArray: any[] = [];
        let processTypeId: any = {};
        processTypeId.fieldName = "processTypeId";
        processTypeId.field = { value: '' };
        processTypeId.validators = [],
            formObjArray.push(processTypeId);

        let processEndAttCount: any = {};
        processEndAttCount.fieldName = "processEndAttCount";
        processEndAttCount.field = { value: '' };
        processEndAttCount.validators = [],
            formObjArray.push(processEndAttCount);

        return formObjArray;
    }

    parseOfficer(officerName){
     if(officerName!=null && typeof officerName !=undefined){
        return officerName.substring(officerName.indexOf("/")+1).replace(/\[[0-9]*\]/g,"");
     }else
        return officerName;
  }

}
