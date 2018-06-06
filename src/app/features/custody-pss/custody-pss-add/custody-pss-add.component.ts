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
import { SortSearchPagination } from '../../../generic-components/search/sort-search-pagination';
import { CustodyPssService } from '../custody-pss.service';
import { CustodyPssConstants } from '../custody-pss.constants';
import { CustodyPss } from '../custody-pss';
import { ValidationService } from '../../../generic-components/control-messages/validation.service';
import { ConfirmService } from '../../../generic-components/confirm-box/confirm.service';

@Component({
    selector: 'tr-custody-pss-edit',
    templateUrl: 'custody-pss-add.component.html'
})
export class CustodyPssAddComponent implements OnInit {

    private subscription: Subscription;
    private pssRequirementId: number;
    private authorizationData: any;
    custodyPssList: any[];
    private authorizedFlag: boolean = false;
    custodyPssAddForm: FormGroup;
    private custodyPss: CustodyPss = new CustodyPss();
    private action;
    private sortSearchPaginationObj: SortSearchPagination = new SortSearchPagination();
    constructor(private _fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private dataService: DataService,
        private custodyPssService: CustodyPssService,
        private validationService: ValidationService,
        private confirmService: ConfirmService,
        private headerService: HeaderService,
        private titleService: Title) { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            if (params.hasOwnProperty('eventId')) {
                this.custodyPss.eventId = params['eventId'];;
            }
            if (!params.hasOwnProperty('pssRequirementId')) {
                this.action = "Create";
                this.titleService.setTitle("Add PSS");
            } else {
                this.action = "Update";
                this.titleService.setTitle("Edit PSS");
            }
            this.custodyPssService.getCustodyPss(this.custodyPss.eventId).subscribe((data: any) => {
                this.custodyPssAddForm.patchValue(data);

            })
        });

        //this.authorizationService.getAuthorizationDataByTableId(CustodyPssConstants.tableId).subscribe(authorizationData => {
        this.authorizationService.getAuthorizationData(CustodyPssConstants.featureId, CustodyPssConstants.tableId).subscribe(authorizationData => {
            this.authorizationData = authorizationData;
            if (authorizationData.length > 0) {
                this.dataService.addFeatureActions(CustodyPssConstants.featureId, authorizationData[0]);
                this.dataService.addFeatureFields(CustodyPssConstants.featureId, authorizationData[1]);
            }
            //this.authorizedFlag = this.authorizationService.isTableAuthorized(CustodyPssConstants.tableId, this.action, this.authorizationData);
            this.authorizedFlag = this.authorizationService.isFeatureActionAuthorized(CustodyPssConstants.featureId, this.action);
            if (this.authorizedFlag) {
                this.initForm();

                this.subscription = this.route.params.subscribe((params: any) => {
                    if (params.hasOwnProperty('pssRequirementId')) {
                        this.pssRequirementId = params['pssRequirementId'];

                        this.custodyPssService.getCustodyPss(this.custodyPss.eventId).subscribe((data: any) => {
                            this.custodyPssAddForm.patchValue(data);
                            this.custodyPssAddForm.controls['actualStartDate'].patchValue(data['commencementDate']);
                        });
                    }
                })
            } else {
                this.headerService.setAlertPopup("Not authorized");
            }
        });
    }
    navigateTo(url) {
        if (this.custodyPssAddForm.touched) {
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
        if (this.custodyPssAddForm.valid) {
            if (this.pssRequirementId != null) {
                this.custodyPssService.updateCustodyPss(this.custodyPss.eventId, this.custodyPssAddForm.value).subscribe((response: any) => {
                    this.router.navigate(['../../'], { relativeTo: this.route });
                });
            } else {
                this.confirmService.confirm(
                    {
                        message: 'You are about to commence a Post Sentence Supervision. All Licence Conditions will be auto-terminated with reason "Start of Post Sentence Supervision"',
                        header: 'Confirm',
                        accept: () => {
                            this.custodyPssService.addCustodyPss(this.custodyPssAddForm.value).subscribe((response: any) => {
                                this.router.navigate(['../'], { relativeTo: this.route });
                            });
                        }
                    });
            }
        }
        else {
            //alert("Invalid Form");
        }
    }

    isFeildAuthorized(field) {
        //return this.authorizationService.isTableFieldAuthorized(CustodyPssConstants.tableId, field, this.action, this.authorizationData);
        return this.authorizationService.isFeildAuthorized(CustodyPssConstants.featureId, field, this.action);

    }
    initForm() {
        this.custodyPssAddForm = this._fb.group({
            pssRequirementId: [this.custodyPss.pssRequirementId, Validators.compose([, , ,])],
            // custodyPssId:[ this.custodyPss.custodyPssId ,  Validators.compose([ Validators.required , , , ]) ],
            eventId: [this.custodyPss.eventId, Validators.compose([Validators.required, , ,])],
            sentence: [{ value: this.custodyPss.sentence, disabled: true }, Validators.compose([, ValidationService.dateValidator, ,])],
            sentenceDate: [{ value: this.custodyPss.sentenceDate, disabled: true }, Validators.compose([, ValidationService.dateValidator, ,])],
            actualStartDate: [this.custodyPss.actualStartDate, Validators.compose([Validators.required, ValidationService.dateValidator, ,])],
            sentenceExpiryDate: [{ value: this.custodyPss.sentenceExpiryDate, disabled: true }, Validators.compose([, ValidationService.dateValidator, ,])],
            actualEndDate: [{ value: this.custodyPss.actualEndDate, disabled: true }, Validators.compose([, ValidationService.dateValidator, ,])],
            licenceExpiryDate: [{ value: this.custodyPss.licenceExpiryDate, disabled: true }, Validators.compose([, ValidationService.dateValidator, ,])],
            latestReleaseDate: [{ value: this.custodyPss.latestReleaseDate, disabled: true }, Validators.compose([, ValidationService.dateValidator, ,])],
            spgPssRequirementId: [0, Validators.compose([, , ,])],

        });
    }
}

