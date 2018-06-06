import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import {CaseManagerAllocationModule} from './features/case-manager-allocation/case-manager-allocation.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './views/header/header.component';
import { LeftPanelComponent } from './views/left-panel/left-panel.component';
import { FooterComponent } from './views/footer/footer.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { HeaderService } from './views/header/header.service';
import { LoginService } from './views/login/login.service';
import { routing } from './routes/tr.routes';
import { TabsModule } from "./generic-components/tabs/tabs.module";

import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component'
import { ChangePasswordComponent } from './features/change-password/change-password.component'
import { ResetPasswordComponent } from './features/reset-component/reset-password.component'

import { ProviderLaoDetailDetailComponent } from './features/providerlaodetail/providerlaodetail-detail/providerlaodetail-detail.component';
import { ProviderLaoDetailEditComponent } from './features/providerlaodetail/providerlaodetail-edit/providerlaodetail-edit.component';
import { ProviderLaoDetailComponent } from './features/providerlaodetail/providerlaodetail.component';

import { ServiceUserEditComponent } from './features/service-user/service-user-edit/service-user-edit.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { TokenService } from './services/token.service';
import { ListService } from './services/list.service';
import { DataService } from './services/data.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthenticationGuard } from './guards/authentication.guard';

import { ServiceUserDetailComponent } from './features/service-user/service-user-detail/service-user-detail.component';

import { ServiceUserComponent } from './features/service-user/service-user.component';
import { HttpInterceptor } from './guards/http-interceptor';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';


import { DatePickerModule } from './generic-components/date-picker/date-picker.module';
//import { DatePicker } from './generic-components/date-picker/date-picker.component';
import { AccordionComponent } from './generic-components/accordion/accordion.component';
//import { InputFocusDirective } from './generic-components/date-picker/directives/date-picker.input.directive';
//import { FilterPipe } from './generic-components/filter/filter.pipe';
import { SharedModule } from './shared/shared.module';
import { MinuteToHourPipe } from './generic-components/filter/min-to-hour.pipe';
import { HourToMinutePipe } from './generic-components/filter/hour-to-min.pipe';
import { PaginationComponent } from './generic-components/pagination/pagination.component';
import { SortDirective } from './generic-components/sort/sort.directive';
import { FocusDirective } from './generic-components/focus/focus.directive';

import { CourtReportModule } from './features/court-report/court-report.module';
import { LicenceConditionManagerComponent } from './features/licence-condition-manager/licence-condition-manager.component';
import { LicenceConditionManagerDetailComponent } from './features/licence-condition-manager/licence-condition-manager-detail/licence-condition-manager-detail.component';
import { LicenceConditionManagerEditComponent } from './features/licence-condition-manager/licence-condition-manager-edit/licence-condition-manager-edit.component';
import { ProposedRequirementComponent } from './features/proposedrequirement/proposedrequirement.component';
import { ProposedRequirementDetailComponent } from './features/proposedrequirement/proposedrequirement-detail/proposedrequirement-detail.component';
import { ProposedRequirementEditComponent } from './features/proposedrequirement/proposedrequirement-edit/proposedrequirement-edit.component';
import { AdditionalContextComponent } from './features/additional-context/additional-context.component';
import { EngagementHistoryComponent } from './features/engagement-history/engagement-history.component';
import { EngagementHistoryDetailComponent } from './features/engagement-history/engagement-history-detail/engagement-history-detail.component';
import { EngagementHistoryEditComponent } from './features/engagement-history/engagement-history-edit/engagement-history-edit.component';
import { AllocateProcessComponent } from './features/allocateprocess/allocateprocess.component';
import { AllocateProcessDetailComponent } from './features/allocateprocess/allocateprocess-detail/allocateprocess-detail.component';
import { AllocateProcessEditComponent } from './features/allocateprocess/allocateprocess-edit/allocateprocess-edit.component';
import { ApprovedPremiseResidenceComponent } from './features/approvedpremiseresidence/approvedpremiseresidence.component';
import { ApprovedPremiseResidenceDetailComponent } from './features/approvedpremiseresidence/approvedpremiseresidence-detail/approvedpremiseresidence-detail.component';
import { ApprovedPremiseResidenceEditComponent } from './features/approvedpremiseresidence/approvedpremiseresidence-edit/approvedpremiseresidence-edit.component';
import { ApprovedPremisesReferralComponent } from './features/approvedpremisesreferral/approvedpremisesreferral.component';
import { ApprovedPremisesReferralDetailComponent } from './features/approvedpremisesreferral/approvedpremisesreferral-detail/approvedpremisesreferral-detail.component';
import { ApprovedPremisesReferralEditComponent } from './features/approvedpremisesreferral/approvedpremisesreferral-edit/approvedpremisesreferral-edit.component';
import { OffenderHeaderComponent } from './features/offender-header/offender-header.component';
import { OffenderManagerComponent } from './features/offendermanager/offendermanager.component';
import { OffenderManagerDetailComponent } from './features/offendermanager/offendermanager-detail/offendermanager-detail.component';
import { OffenderManagerEditComponent } from './features/offendermanager/offendermanager-edit/offendermanager-edit.component';
import { OffenderProfileSummaryComponent } from './features/offenderprofile/offenderprofile-summary/offenderprofile-summary.component';
import { OffenderProfileComponent } from './features/offenderprofile/offenderprofile-list/offenderprofile.component';
import { OffenderProfileMyTeamComponent } from './features/offenderprofile/offenderprofile-list/offenderprofile-my-team.component';
import { OffenderProfileMyCRCComponent } from './features/offenderprofile/offenderprofile-list/offenderprofile-my-crc.component';
import { OffenderProfileDetailComponent } from './features/offenderprofile/offenderprofile-detail/offenderprofile-detail.component';
import { OffenderProfileEditComponent } from './features/offenderprofile/offenderprofile-edit/offenderprofile-edit.component';
import { OrderManagerComponent } from './features/ordermanager/ordermanager.component';
import { OrderManagerDetailComponent } from './features/ordermanager/ordermanager-detail/ordermanager-detail.component';
import { OrderManagerEditComponent } from './features/ordermanager/ordermanager-edit/ordermanager-edit.component';
import { PendingTransferDetailComponent } from './features/pending-transfer/pending-transfer-detail/pending-transfer-detail.component';
import { PendingTransferAllocationComponent } from './features/pending-transfer/pending-transfer-allocation/pending-transfer-allocation.component';
import { CaseManagerAllocationComponent } from './features/case-manager-allocation/case-manager-allocation.component';
import { CohortComponent } from './features/cohort/cohort.component';
import { CohortDetailComponent } from './features/cohort/cohort-detail/cohort-detail.component';
import { CohortEditComponent } from './features/cohort/cohort-edit/cohort-edit.component';
import { CommunityRequirementModule } from './features/community-requirement/community-requirement.module';
import { ContactModule } from './features/contact/contact.module';
import { TerminateRequirementModule } from './features/terminate-requirement/terminate-requirement.module';
import { TerminateEventModule } from './features/terminate-event/terminate-event.module';
import { PendingTransferComponetAllocationComponent } from './features/pending-transfer/pending-transfer-component-allocation/case-manager-allocation.component';
import { CaseManagerHistoryModule } from './features/case-manager-history/case-manager-history.module';
import { OffenderAdditionalSentenceModule } from './features/offender-additional-sentence/offender-additional-sentence.module';
import { CaseManagerHistoryListComponent } from './features/case-manager-history/case-manager-history-list/case-manager-history-list.component';
import { CaseManagerHistoryDetailComponent } from './features/case-manager-history/case-manager-history-detail/case-manager-history-detail.component';

import { CourtAppearanceModule } from './features/court-appearance/court-appearance.module';
import { ProcessContactModule } from './features/process-contact/process-contact.module';


import { CurrentCaseManagerModule } from './features/current-case-manager/current-case-manager.module';
import { PlanComponent } from './features/plan/plan.component';
import { ContactInformationComponent } from './features/contact-information/contact-information.component';
import { CourtAndCustodyComponent } from './features/court-and-custody/court-and-custody.component';
import { DocumentListComponent } from './features/document-store/document-list/document-list.component';
import { EnablersComponent } from './features/enablers/enablers.component';
import { EventComponent } from './features/event/event.component';
import { EventDetailComponent } from './features/event/event-detail/event-detail.component';
import { EventEditComponent } from './features/event/event-edit/event-edit.component';
import { HealthAndAvailabilityComponent } from './features/health-and-availability/health-and-availability.component';
import { InductionLetterEditComponent } from './features/inductionletter/inductionletter-edit/inductionletter-edit.component';
import { PssRequirementModule } from './features/pss-requirement/pss-requirement.module';
import { PssRequirementManagerComponent } from './features/pss-requirement-manager/pss-requirement-manager.component';
import { PssRequirementManagerDetailComponent } from './features/pss-requirement-manager/pss-requirement-manager-detail/pss-requirement-manager-detail.component';
import { PssRequirementManagerEditComponent } from './features/pss-requirement-manager/pss-requirement-manager-edit/pss-requirement-manager-edit.component';
import { PssContactComponent } from './features/psscontact/psscontact.component';
import { PssContactDetailComponent } from './features/psscontact/psscontact-detail/psscontact-detail.component';
import { PssContactEditComponent } from './features/psscontact/psscontact-edit/psscontact-edit.component';
import { RateCardInterventionComponent } from './features/rate-card-intervention/rate-card-intervention.component';
import { RateCardInterventionDetailComponent } from './features/rate-card-intervention/rate-card-intervention-detail/rate-card-intervention-detail.component';
import { RateCardInterventionEditComponent } from './features/rate-card-intervention/rate-card-intervention-edit/rate-card-intervention-edit.component';
import { RecallModule } from './features/recall/recall.module';
import { RequirementManagerComponent } from './features/requirementmanager/requirementmanager.component';
import { RequirementManagerDetailComponent } from './features/requirementmanager/requirementmanager-detail/requirementmanager-detail.component';
import { RequirementManagerEditComponent } from './features/requirementmanager/requirementmanager-edit/requirementmanager-edit.component';
import { UpwComponent } from './features/upw/upw.component';
import { AppService } from './app.service';
import { NgIdleModule } from './generic-components/idle/module';
import { ConfirmBoxComponent } from './generic-components/confirm-box/confirm-box.component';
import { SearchComponent } from './generic-components/search/search.component';
import { AliasModule } from './features/alias/alias.module';
import { AccordionHeaderComponent } from './generic-components/accordion/accordion-header/accordion-header.component';
import { BreadcrumbComponent } from "./generic-components/breadcrumb/breadcrumb.component"
import { BreadcrumbService } from "./generic-components/breadcrumb/breadcrumb.service"
import { BreadcrumbMappingService } from "./generic-components/breadcrumb/breadcrumb-mapping-service"
import { Timepicker } from './generic-components/time-picker/timepicker.component';
import { AddressGenericModule } from "./generic-components/address-generic/address-generic.module";
//import { BreadcrumbModule } from './generic-components/breadcrumb/breadcrumb.module';
import { NsrdDropdownComponent } from './generic-components/nsrd-dropdown/nsrd-dropdown.component'
import { ReCaptchaModule } from 'angular2-recaptcha';
import { ErrorPageComponent } from './generic-components/error-page/error-page.component';
import { ProvisionModule } from './features/provision/provision.module';
import { OffenderDisabilityModule } from './features/offender-disability/offender-disability.module';
import { AdditionalIdentifierModule } from './features/additional-identifier/additional-identifier.module'
import { ServiceProviderModule } from './features/service-provider/service-provider.module';
import { ServiceProviderContactModule } from './features/service-provider-contact/service-provider-contact.module';
import { NetworkModule } from './features/network/network.module';
import { ProtectedCharacteristicsModule } from './features/protected-characteristics/protected-characteristics.module';
import { PersonalCircumstanceModule } from './features/personal-circumstance/personal-circumstance.module';
import { LicenceConditionModule } from './features/licence-condition/licence-condition.module';
import { AddressAssessmentModule } from './features/address-assessment/address-assessment.module';
import { DocumentStoreComponent } from './features/document-store/document-store.component';
import { DocumentStoreAddComponent } from './features/document-store/document-store-add/document-store-add.component';
import { SuDocumentStoreComponent } from './features/su-document-store/su-document-store.component';
import { SuDocumentStoreAddComponent } from './features/su-document-store/document-store-add/su-document-store-add.component';
import { AdditionalOffenceModule } from './features/additional-offence/additional-offence.module';
import { AddressModule } from "./features/address/address.module";
import { TransferOutRequestModule } from "./features/transfer-out-request/transfer-out-request.module";
import { ReferralModule } from "./features/referral/referral.module";
import { AssessmentModule } from "./features/assessment/assessment.module";
import { UpwProjectModule } from "./features/upw-project/upw-project.module";
import { contactinformationModule } from "./features/contactinformation/contactinformation.module"
import { UpwDetailModule } from "./features/upw-detail/upw-detail.module"
import { UpwAppointmentModule } from './features/upw-appointment/upw-appointment.module';
import { UPWSummaryComponent } from "./features/upw-summary/upw-summary.component";
import { DrugTestProfileModule } from './features/drug-test-profile/drug-test-profile.module';
import { PendingTransferModule } from './features/pending-transfer/pending-transfer.module';
import { UpwAdjustmentModule } from "./features/upw-adjustment/upw-adjustment.module";
import { CourtWorkModule } from "./features/court-work/court-work.module";
import { AdminCourtWorkModule } from "./features/admin-court-work/admin-court-work.module";
import { DrugTestModule } from './features/drug-test/drug-test.module';
import { InstitutionalReportModule} from "./features/institutional-report/institutional-report.module";
import { DrugTestResultModule } from './features/drug-test-result/drug-test-result.module';
import { DocumentStoreModule } from './features/document-store/document-store.module';
import { SuDocumentStoreModule } from './features/su-document-store/su-document-store.module';
import { ThroughcareComponent } from './features/throughcare/throughcare.component';
import { CustodyKeyDateModule } from './features/custody-key-date/custody-key-date.module';
import { ReleaseModule } from './features/release/release.module';
import { UpwProjectDiaryModule } from './features/upw-project-diary/upw-project-diary.module';
import { EnforcementModule } from "./features/enforcement/enforcement.module";
import { ConsolatedTransferRequestComponent } from './features/pending-transfer/pending-transfer-requests/consolated-transfer-request-list';
import { RegistrationModule } from "./features/registration/registration.module";
import { ProjectAttendaceModule } from './features/project-attendance/project-attendance.module';
import { RegistrationReviewModule } from './features/registration-review/registration-review.module';
import { CustodyLocationModule } from './features/custody-location/custody-location.module';
import { ThroughCareHistoryListComponent } from './features/throughcare-history/throughcare-history-list/throughcare-history-list.component';
import { ThroughCareHistoryService } from './features/throughcare-history/throughcare-history.service';
import { GenerateLetterComponent } from './features/document-store/generate-letter/generate-letter.component';
import { NationalSearchModule} from './features/national-search/national-search.module';
import { CmActionsComponent } from './features/cm-actions/cm-actions.component';
import { NationSearchComponent } from './features/nation-search/nation-search.component';
import { CustodyPssModule } from './features/custody-pss/custody-pss.module';
import {OfflocModule} from "./features/offloc/offloc.module";
import { TerminationsModule } from "./features/terminations/terminations.module";
import { SummaryEventComponent } from './features/offenderprofile/offenderprofile-summary/event/event.component'
import { CmActionModule } from './features/cm-actions/cm-action.module'
import {LasuModule} from "./features/lasu/lasu.module";
import {SURecentViewedListComponent} from "./features/offenderprofile/offenderprofile-list/su-recently-viewed-list.component";
@NgModule({
    declarations: [
        SummaryEventComponent,
        NsrdDropdownComponent,
        ConfirmBoxComponent,
        AppComponent,
        HeaderComponent,
        LeftPanelComponent,
        FooterComponent,
        LoginComponent,
        HomeComponent,
        AboutUsComponent,
        ServiceUserDetailComponent,
        ServiceUserComponent,
        ServiceUserEditComponent,
        ServiceUserComponent,
        PlanComponent,

        ProviderLaoDetailDetailComponent,
        ProviderLaoDetailEditComponent,
        ProviderLaoDetailComponent,
        ForgotPasswordComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        LicenceConditionManagerDetailComponent,
        LicenceConditionManagerEditComponent,
        LicenceConditionManagerComponent,
        CourtAndCustodyComponent,
        UpwComponent,
        //ListLabelComponent,
        ContactInformationComponent,
        AdditionalContextComponent,
        HealthAndAvailabilityComponent,
        // DatePicker,
        // InputFocusDirective,
        OffenderHeaderComponent,
        EnablersComponent,
        DocumentListComponent,

        LicenceConditionManagerComponent,
        LicenceConditionManagerDetailComponent,
        LicenceConditionManagerEditComponent,
        ProposedRequirementComponent,
        ProposedRequirementDetailComponent,
        ProposedRequirementEditComponent,
        AdditionalContextComponent,
        AllocateProcessComponent,
        AllocateProcessDetailComponent,
        AllocateProcessEditComponent,
        ApprovedPremiseResidenceComponent,
        ApprovedPremiseResidenceDetailComponent,
        ApprovedPremiseResidenceEditComponent,
        ApprovedPremisesReferralComponent,
        ApprovedPremisesReferralDetailComponent,
        ApprovedPremisesReferralEditComponent,
        EngagementHistoryComponent,
        EngagementHistoryDetailComponent,
        EngagementHistoryEditComponent,
        OffenderHeaderComponent,
        OffenderManagerComponent,
        OffenderManagerDetailComponent,
        OffenderManagerEditComponent,
        OffenderProfileComponent,
        OffenderProfileMyTeamComponent,
        OffenderProfileMyCRCComponent,
        OffenderProfileDetailComponent,
        OffenderProfileSummaryComponent,
        OffenderProfileEditComponent,
        OrderManagerComponent,
        OrderManagerDetailComponent,
        OrderManagerEditComponent,
        PendingTransferDetailComponent,
        PendingTransferAllocationComponent,
        PendingTransferComponetAllocationComponent,
        CaseManagerAllocationComponent,
        CohortComponent,
        CohortDetailComponent,
        CohortEditComponent,
        ContactInformationComponent,
        CourtAndCustodyComponent,
        DocumentListComponent,
        EnablersComponent,
        EventComponent,
        EventDetailComponent,
        EventEditComponent,

        HealthAndAvailabilityComponent,
        InductionLetterEditComponent,
        InductionLetterEditComponent,
        ProviderLaoDetailComponent,
        ProviderLaoDetailDetailComponent,
        ProviderLaoDetailEditComponent,
        PssRequirementManagerComponent,
        PssRequirementManagerDetailComponent,
        PssRequirementManagerEditComponent,
        PssContactComponent,
        PssContactDetailComponent,
        PssContactEditComponent,
        RateCardInterventionComponent,
        RateCardInterventionDetailComponent,
        RateCardInterventionEditComponent,

        LeftPanelComponent,
        RequirementManagerComponent,
        RequirementManagerDetailComponent,
        RequirementManagerEditComponent,
        UpwComponent,
        UPWSummaryComponent,
        DocumentListComponent,
        MinuteToHourPipe,
        HourToMinutePipe,
        BreadcrumbComponent,
        ErrorPageComponent,
        DocumentStoreComponent,
        DocumentStoreAddComponent,
        SuDocumentStoreComponent,
        SuDocumentStoreAddComponent,
        ThroughcareComponent,
        ConsolatedTransferRequestComponent,
        GenerateLetterComponent,
        ThroughCareHistoryListComponent,
        CmActionsComponent,
        NationSearchComponent,
        SURecentViewedListComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RegistrationModule,
        HttpModule,
        routing,
        ReactiveFormsModule,
        OfflocModule,
        TabsModule,
        AddressGenericModule,
        CaseManagerAllocationModule,
        AliasModule,
        PersonalCircumstanceModule,
        CourtAppearanceModule,
        AdditionalIdentifierModule,
        ProvisionModule,
        RecallModule,
        OffenderDisabilityModule,
        AddressModule,
        CaseManagerHistoryModule,
        TerminateRequirementModule,
        TerminateEventModule,
        CurrentCaseManagerModule,
        ContactModule,
        NetworkModule,
        ReCaptchaModule,
        NgIdleModule.forRoot(),
        ServiceProviderModule,
        ServiceProviderContactModule,
        ProtectedCharacteristicsModule,
        contactinformationModule,
        ReferralModule,
        CourtWorkModule,
        AdminCourtWorkModule,
        EnforcementModule,
        CommunityRequirementModule,
        TransferOutRequestModule,
        AddressAssessmentModule,
        AssessmentModule,
        UpwProjectModule,
        UpwDetailModule,
        UpwAppointmentModule,
        PendingTransferModule,
        LicenceConditionModule,
        PssRequirementModule,
        DrugTestProfileModule,
        OffenderAdditionalSentenceModule,
        DrugTestModule,
        UpwAdjustmentModule,
        InstitutionalReportModule,
        DrugTestResultModule,
        CourtReportModule,
	    DocumentStoreModule,
        SuDocumentStoreModule,
        AdditionalOffenceModule,
        CustodyKeyDateModule,
        ReleaseModule,
        UpwProjectDiaryModule,
        ProjectAttendaceModule,
        RegistrationReviewModule,
        CustodyLocationModule,
        NationalSearchModule,
        ProcessContactModule,
        CustodyPssModule,
		TerminationsModule,
        CmActionModule,
        LasuModule
    ],

        providers: [
        HeaderService,
        TokenService,
        LoginService,
        AuthenticationGuard,
        DataService,
        AuthorizationService,
        ListService,
        AppService,
        BreadcrumbService,
        BreadcrumbMappingService,
        ThroughCareHistoryService,

        {
            provide: LocationStrategy, useClass: HashLocationStrategy
        },
        {
            provide: Http,
            useFactory: httpInterceptor,
            deps: [XHRBackend, RequestOptions, Router, HeaderService, AppService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function httpInterceptor(xhrBackend: XHRBackend, requestOptions: RequestOptions, router: Router, headerService: HeaderService, appService: AppService) {
    return new HttpInterceptor(xhrBackend, requestOptions, router, headerService, appService);
}
