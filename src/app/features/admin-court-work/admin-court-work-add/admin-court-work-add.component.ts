import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Rx";
import { Title } from "@angular/platform-browser";
import { TokenService } from '../../../services/token.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { DataService } from '../../../services/data.service';
import { ListService } from '../../../services/list.service';
import { HeaderService } from '../../../views/header/header.service';
import { AdminCourtWorkService } from '../admin-court-work.service';
import { AdminCourtWorkConstants } from '../admin-court-work.constants';
import { AdminCourtWork } from '../admin-court-work';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';
import { Event } from '../../event/event';
import { EventService } from '../../event/event.service';
import { RequestSubType } from '../requestSubType';
import { IDate, IMonth, IWeek, IDayLabels, IMonthLabels, IOptions } from "../../../generic-components/date-picker/index";
import { AssociatedEvent } from '../associatedEvent';
import { Utility } from "../../../shared/utility";
import { DocumentStore } from '../../../features/document-store/document-store';
import { DocumentStoreService } from '../../../features/document-store/document-store.service';
import { OffenderProfileService } from '../../offenderprofile/offenderprofile.service';
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'tr-admin-court-work-edit',
    templateUrl: 'admin-court-work-add.component.html'
})
export class AdminCourtWorkAddComponent implements OnInit {

    event: Event = new Event();
    private eventId: any;
    private subscription: Subscription;
    private adminCourtWorkId: number;
    private authorizationData: any;
    private authorizedFlag: boolean = false;
    adminCourtWorkAddForm: FormGroup;
    private adminCourtWork: AdminCourtWork = new AdminCourtWork();
    private documentStore: DocumentStore = new DocumentStore();
    private action;
    private divisionIds = [];
    private processTypeList = [];
    private processOutcomeList = [];
    private associatedEvent: AssociatedEvent[] = [];
    private uploadedDoc: File;
    private crnNumber: number;
    private provider: string;
    private profileId: number;
    private documentTypes: any[] = [];
    private alfrescoDocId: string;
    private nsrdData: any = [];
    private childAnswers: any = [];
    private previousNotes: string = "";
    private team: string = "";
    private officer: string = "";
    private crcMapping : any = {'C04':'N02','C05':'N02', 'C06':'N01', 'C07':'N01', 'C20':'N05'} ;

    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private adminCourtWorkService: AdminCourtWorkService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private listService: ListService,
        private documentStoreService: DocumentStoreService,
        private offenderProfileService: OffenderProfileService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            /*if (params.hasOwnProperty('eventId')) {
               this.referral.eventId = params['eventId'];
            }*/


            if (params.hasOwnProperty('profileId')) {
                this.adminCourtWork.profileId = params['profileId'];
            }
            if (params.hasOwnProperty('eventId')) {
              this.eventId = params['eventId'];
            }
            if (!params.hasOwnProperty('adminCourtWorkId')) {
                this.action = "Create";
                this.titleService.setTitle("Court Work");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit Court Work");
            }
        });

        this.listService.getListData(2541).subscribe(documentTypes => {
            this.documentTypes = documentTypes;
        });
        //this.courtWorkAddForm.controls['processRefDate'].enable();
        //this.authorizationService.getAuthorizationDataByTableId(CourtWorkConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(AdminCourtWorkConstants.featureId, AdminCourtWorkConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(AdminCourtWorkConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(AdminCourtWorkConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(CourtWorkConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(AdminCourtWorkConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();
                this.adminCourtWorkAddForm.controls['processRefDate'].disable();
                this.adminCourtWorkAddForm.controls['processTypeId'].disable();
                this.adminCourtWorkAddForm.controls['processSubTypeId'].disable();
                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('adminCourtWorkId')) {
                        this.adminCourtWorkId = params['adminCourtWorkId'];
                        this.adminCourtWorkService.getAdminCourtWork(this.adminCourtWorkId).subscribe((data: any) => {
                            if (data.locked == "false") {
                                this.previousNotes = data.processNote;
                                data.processNote = "";

                                this.listService.getDependentAnswers(192, data.processTypeId).subscribe(dependentList => {
                                    this.processTypeList = dependentList[191];
                                    this.processOutcomeList = dependentList[169];
                                })
                                if (data.processStageId == 0) {
                                    data.processStageId = '';
                                }
                                this.profileId = data.profileId;
                                this.offenderProfileService.getOffenderProfileByProfileId(this.profileId).subscribe((data: any) => {
                                    this.crnNumber = data.caseReferenceNumber;
                                });
                                this.adminCourtWorkAddForm.controls['linkedToId'].setValue(data.spgProcessContactId);
                                this.documentStore.linkedToId = data.spgProcessContactId;
                                this.alfrescoDocId = data.alfrescoDocId;
                                if (data.documentName != undefined) {
                                    data.documentName = data.documentName.split("_")[0];
                                }
                                if (this.alfrescoDocId != null && this.alfrescoDocId != '' && this.alfrescoDocId != undefined) {
                                    /*this.adminCourtWorkAddForm.controls['docType'].disable();
                                    this.adminCourtWorkAddForm.controls['documentName'].disable();
                                    this.adminCourtWorkAddForm.controls['file'].disable();*/
                                } else {
                                    this.adminCourtWorkAddForm.controls['docType'].setValue("");
                                }
                                this.adminCourtWorkAddForm.patchValue(data);
                                let observables: Observable<any>[] = [];
                                observables.push(this.listService.getListData(193));
                                observables.push(this.listService.getListDataByLookupAndPkValue(268,518,this.dataService.getLoggedInUserId()));
                                Observable.forkJoin(observables).subscribe(data => {
                                    let providerList = data[0];
                                    if(data[1] !=null && data[1].length > 0){
                                        let userCRCCode = data[1][0].value;
                                        this.provider = data[1][0].value;
                                        let intendedProviderCode = this.crcMapping[userCRCCode];
                                        this.adminCourtWorkAddForm.controls['intendedProviderId'].setValue(this.listService.getPkValueByTableIdAndCode(193, intendedProviderCode));
                                    }
                                });
                            }
                            else {
                                this.headerService.setAlertPopup("The record is locked");

                            }
                        });
                    }
                })

                this.adminCourtWorkService.getAssociatedEvent(this.adminCourtWorkId, this.eventId).subscribe(data => {
                    this.associatedEvent = data;
                });

            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });

        this.adminCourtWorkService.getRequestFilteredTypeList().subscribe(data => {
            this.divisionIds = data.divisionIds;
        })

    }




    navigateTo(url) {
        if (this.adminCourtWorkAddForm.touched) {
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
        if (this.adminCourtWorkAddForm.valid) {
            if (this.adminCourtWorkId != null) {
                if (((this.uploadedDoc == null || this.uploadedDoc == undefined) && (this.adminCourtWorkAddForm.value.docType == null || this.adminCourtWorkAddForm.value.docType.length == 0) && (this.adminCourtWorkAddForm.value.documentName == null || this.adminCourtWorkAddForm.value.documentName.length == 0)) || (this.alfrescoDocId != null && this.alfrescoDocId != '' && this.alfrescoDocId != undefined)) {
                    this.adminCourtWorkService.updateAdminCourtWork(this.adminCourtWorkId, this.adminCourtWorkAddForm.getRawValue()).subscribe((response: any) => {
                        this.router.navigate(['../../../..'], { relativeTo: this.route });
                    });
                } else {
                    if (this.uploadedDoc != null && this.uploadedDoc != undefined) {
                        if ((this.adminCourtWorkAddForm.value.docType == null || this.adminCourtWorkAddForm.value.docType.length == 0) || (this.adminCourtWorkAddForm.value.documentName == null || this.adminCourtWorkAddForm.value.documentName.length == 0)) {
                            this.headerService.setErrorPopup({ errorMessage: 'Please select document type/name to upload.' });
                        } else {
                            let allowed = this.documentStoreService.allowedExtension(this.uploadedDoc);
                            if (allowed) {
                                this.headerService.changeLoading(true);
                                let xhr = this.adminCourtWorkService.addDocumet(this.adminCourtWorkAddForm.value, this.uploadedDoc, this.crnNumber, this.provider);
                                xhr.onreadystatechange = () => {
                                    if (xhr.readyState === 4) {
                                        this.headerService.changeLoading(false);
                                        if (xhr.status === 200) {
                                            this.adminCourtWorkService.updateAdminCourtWork(this.adminCourtWorkId, this.adminCourtWorkAddForm.getRawValue()).subscribe((response: any) => {
                                                this.router.navigate(['../../../..'], { relativeTo: this.route });
                                            });
                                        } else if (xhr.status == 0) {
                                            this.headerService.setAlertPopup('Failed to connect to DRS. Please contact the system administrator.');
                                        } else if (xhr.status == 422) {
                                            let response = JSON.parse(xhr.responseText);
                                            if (response.data != null) {
                                                this.headerService.setformSererValidator(response.data);
                                            } else {
                                                this.headerService.setAlertPopup(response.message);
                                            }
                                        } else {
                                            let response = JSON.parse(xhr.responseText);
                                            this.headerService.setAlertPopup(response.message);
                                        }
                                    }
                                };
                            }
                        }

                    } else if (this.adminCourtWorkAddForm.value.docType.length != 0 || this.adminCourtWorkAddForm.value.documentName.length != 0) {
                        this.headerService.setErrorPopup({ errorMessage: 'Please select document to upload.' });
                    }

                }

            } else {
                this.adminCourtWorkService.addAdminCourtWork(this.adminCourtWorkAddForm.getRawValue()).subscribe((response: any) => {
                    this.router.navigate(['..'], { relativeTo: this.route });
                });
            }
        }
        else {
            // alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        return this.authorizationService.isFeildAuthorized(AdminCourtWorkConstants.featureId, field, this.action);
    }

    initForm() {
        this.adminCourtWorkAddForm = this._fb.group({
            processId: [this.adminCourtWork.processId],
            profileId: [this.adminCourtWork.profileId, Validators.compose([Validators.required, , ,])],
            processTypeId: [this.adminCourtWork.processTypeId, Validators.compose([Validators.required, , ,])],
            processSubTypeId: ['', Validators.compose([, , ,])],
            processRefDate: [this.adminCourtWork.processRefDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            processStageId: [this.adminCourtWork.processStageId, Validators.compose([Validators.required, , ,])],
            processStageDate: [this.adminCourtWork.processStageDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            // processOutcomeId: [this.adminCourtWork.processOutcomeId, Validators.compose([, , ,])],
            processNote: [this.adminCourtWork.processNote],
            intendedProviderId: ['', Validators.compose([Validators.required, , ,])],
            spgProcessContactId: ['0'],
            documentType: [''],
            linkedToId: [this.documentStore.linkedToId],
            documentName: [this.documentStore.documentName],
            file: [this.documentStore.file],
            isReadOnly: [this.documentStore.isReadOnly],
            docType: [this.documentStore.docType],
        });

    }

    fileChangeEvent(fileInput: any) {
        this.uploadedDoc = fileInput.target.files[0];
    }
    updateNsrd(nsrdData) {
        nsrdData.forEach((element: any) => {
            this.nsrdData[element.fieldName] = {};
            let currentControl = Utility.getObjectFromArrayByKeyAndValue(this.getNSRDFormObj(), 'fieldName', element.fieldName);
            if (element.active) {
                this.nsrdData[element.fieldName].active = element.active;
                this.adminCourtWorkAddForm.addControl(element.fieldName, this._fb.control({ value: currentControl.field.value, disabled: currentControl.field.disabled }, currentControl.validators));
                if (element.mandatory) {
                    this.nsrdData[element.fieldName].mandatory = element.mandatory;
                    currentControl.validators.push(Validators.required);
                    this.adminCourtWorkAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                } else {
                    this.adminCourtWorkAddForm.controls[element.fieldName].setValidators(currentControl.validators);
                }
            } else {
                this.nsrdData[element.fieldName].active = element.active;
                this.adminCourtWorkAddForm.removeControl(element.fieldName);
            }


            if (element.active) {
                this.adminCourtWorkAddForm.controls[element.fieldName].updateValueAndValidity();
            }
        });


    }


    getNSRDFormObj() {
        let formObjArray: any[] = [];
        let processOutcomeId: any = {};
        processOutcomeId.fieldName = 'processOutcomeId';
        processOutcomeId.field = { value: '' };
        processOutcomeId.validators = [];
        formObjArray.push(processOutcomeId);



        return formObjArray;
    }

}

