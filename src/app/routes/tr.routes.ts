import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "../views/login/login.component";
import { HomeComponent } from "../views/home/home.component";
import { AboutUsComponent } from '../views/about-us/about-us.component';
import { SERVICEUSER_ROUTES } from '../features/service-user/service-user.routes';
import { SERVICEPROVIDER_ROUTES } from '../features/service-provider/service-provider.routes';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { Address_ROUTES } from "../features/address/address.routes";
import { addressConstants } from "../features/address/address.constants";
import { CourtAppearance_ROUTES } from "../features/court-appearance/court-appearance.routes";
import { CourtAppearanceConstants } from "../features/court-appearance/court-appearance.constants";
import { REQUIREMENTMANAGER_ROUTES } from "../features/requirementmanager/requirementmanager.routes";
import { RequirementManagerConstants } from "../features/requirementmanager/requirementmanager.constants";
import { Contact_ROUTES } from "../features/contact/contact.routes";
import { CaseManagerHistory_ROUTES } from "../features/case-manager-history/case-manager-history.routes";
import { CaseManagerHistoryConstants } from "../features/case-manager-history/case-manager-history.constants";
import { TerminateRequirement_ROUTES } from "../features/terminate-requirement/terminate-requirement.routes";
import { TerminateEvent_ROUTES } from "../features/terminate-event/terminate-event.routes";
import { CurrentCaseManagerConstants } from "../features/current-case-manager/current-case-manager.constants";
import { REFERRAL_ROUTES } from "../features/referral/referral.routes";
import { ReferralConstants } from "../features/referral/referral.constants";
import { AssessmentConstants } from "../features/assessment/assessment.constants";
import { COURTREPORT_ROUTES } from "../features/court-report/court-report.routes";
import { CourtReportConstants } from "../features/court-report/court-report.constants";
// import { CUSTODYLOCATION_ROUTES } from "../features/custodylocation/custodylocation.routes";
// import { CustodyLocationConstants } from "../features/custodylocation/custodylocation.constants";
import { PROPOSEDREQUIREMENT_ROUTES } from "../features/proposedrequirement/proposedrequirement.routes";
import { ProposedRequirementConstants } from "../features/proposedrequirement/proposedrequirement.constants";
import { PersonalCircumstance_ROUTES } from "../features/personal-circumstance/personal-circumstance.routes";
import { PersonalCircumstanceConstants } from "../features/personal-circumstance/personal-circumstance.constants";
import { AdditionalIdentifier_ROUTES } from "../features/additional-identifier/additional-identifier.routes";
import { AdditionalIdentifierConstants } from "../features/additional-identifier/additional-identifier.constants";
import { PROVIDERLAODETAIL_ROUTES } from "../features/providerlaodetail/providerlaodetail.routes";
import { ProviderLaoDetailConstants } from "../features/providerlaodetail/providerlaodetail.constants";
import { Release_ROUTES } from "../features/release/release.routes";
import { ReleaseConstants } from "../features/release/release.constants";
import { CustodyPss_ROUTES } from "../features/custody-pss/custody-pss.routes";
import { RegistrationConstants } from "../features/registration/registration.constants";
import { RegistrationReview_ROUTES } from "../features/registration-review/registration-review.routes";
import { ORDERMANAGER_ROUTES } from "../features/ordermanager/ordermanager.routes";
import { OrderManagerConstants } from "../features/ordermanager/ordermanager.constants";
import { LICENCECONDITIONMANAGER_ROUTES } from "../features/licence-condition-manager/licence-condition-manager.routes";
import { LicenceConditionManagerConstants } from "../features/licence-condition-manager/licence-condition-manager.constants";
import { AdditionalOffence_ROUTES } from "../features/additional-offence/additional-offence.routes";
import { AdditionalOffenceConstants } from "../features/additional-offence/additional-offence.constants";
import { PssRequirement_ROUTES } from "../features/pss-requirement/pss-requirement.routes";
import { PssRequirementConstants } from "../features/pss-requirement/pss-requirement.constants";
import { PSSREQUIREMENTMANAGER_ROUTES } from "../features/pss-requirement-manager/pss-requirement-manager.routes";
import { PssRequirementManagerConstants } from "../features/pss-requirement-manager/pss-requirement-manager.constants";
import { OffenderAdditionalSentence_ROUTES } from "../features/offender-additional-sentence/offender-additional-sentence.routes";
import { OffenderAdditionalSentenceConstants } from "../features/offender-additional-sentence/offender-additional-sentence.constants";
import { Recall_ROUTES } from "../features/recall/recall.routes";
import { PSSCONTACT_ROUTES } from "../features/psscontact/psscontact.routes";
import { PssContactConstants } from "../features/psscontact/psscontact.constants";
import { OFFENDERMANAGER_ROUTES } from "../features/offendermanager/offendermanager.routes";
import { OffenderManagerConstants } from "../features/offendermanager/offendermanager.constants";
import { COHORT_ROUTES } from "../features/cohort/cohort.routes";
import { CohortConstants } from "../features/cohort/cohort.constants";
import { OFFENDERPROFILE_ROUTES } from "../features/offenderprofile/offenderprofile-list/offenderprofile.routes";
import { OffenderProfileConstants } from "../features/offenderprofile/offenderprofile.constants";
import { ProcessContact_ROUTES } from "../features/process-contact/process-contact.routes";
import { ProcessContactConstants } from "../features/process-contact/process-contact.constants";
import { OffenderDisability_ROUTES } from "../features/offender-disability/offender-disability.routes";
import { contactinformation_ROUTES } from "../features/contactinformation/contactinformation.routes";
import { contactinformationConstants } from "../features/contactinformation/contactinformation.constants";
import { OffenderDisabilityConstants } from "../features/offender-disability/offender-disability.constants";
import { ProvisionConstants } from "../features/provision/provision.constants";
import { Provision_ROUTES } from "../features/provision/provision.routes";
import { RATECARDINTERVENTION_ROUTES } from "../features/rate-card-intervention/rate-card-intervention.routes";
import { RateCardInterventionConstants } from "../features/rate-card-intervention/rate-card-intervention.constants";
import { EVENT_ROUTES } from "../features/event/event.routes";
import { EventConstants } from "../features/event/event.constants";
import { CommunityRequirement_ROUTES } from "../features/community-requirement/community-requirement.routes";
import { CommunityRequirementConstants } from "../features/community-requirement/community-requirement.constants";
import { APPROVEDPREMISERESIDENCE_ROUTES } from "../features/approvedpremiseresidence/approvedpremiseresidence.routes";
import { ApprovedPremiseResidenceConstants } from "../features/approvedpremiseresidence/approvedpremiseresidence.constants";
import { CaseManagerAllocationComponent } from '../features/case-manager-allocation/case-manager-allocation.component';
import { PENDING_TRANSFER_ROUTES } from "../features/pending-transfer/pending-transfer.routes"
import { TransferOutRequest_ROUTES } from "../features/transfer-out-request/transfer-out-request.routes"
import { APPROVEDPREMISESREFERRAL_ROUTES } from "../features/approvedpremisesreferral/approvedpremisesreferral.routes";
import { ApprovedPremisesReferralConstants } from "../features/approvedpremisesreferral/approvedpremisesreferral.constants";
import { ALLOCATEPROCESS_ROUTES } from "../features/allocateprocess/allocateprocess.routes";
import { AllocateProcessConstants } from "../features/allocateprocess/allocateprocess.constants";
import { INDUCTIONLETTER_ROUTES } from "../features/inductionletter/inductionletter.routes";
import { ChangePasswordComponent } from '../features/change-password/change-password.component';
import { ForgotPasswordComponent } from '../features/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../features/reset-component/reset-password.component';
import { ERROR_PAGE_ROUTES } from '../generic-components/error-page/error-page.routes';
import { SERVICEPROVIDERCONTACT_ROUTES } from '../features/service-provider-contact/service-provider-contact.routes';
import { NetworkConstants } from "../features/network/network.constants";
import { Assessment_ROUTES } from "../features/assessment/assessment.routes";
import { UpwProject_ROUTES } from "../features/upw-project/upw-project.routes";
import { UpwDetail_ROUTES } from "../features/upw-detail/upw-detail.routes";
import { UpwAdjustment_ROUTES } from "../features/upw-adjustment/upw-adjustment.routes";
import { InstitutionalReport_ROUTES } from "../features/institutional-report/institutional-report.routes";
import { AdminCourtWork_ROUTES } from "../features/admin-court-work/admin-court-work.routes";
import { UpwProjectDiary_ROUTES } from "../features/upw-project-diary/upw-project-diary.routes";
import { Enforcement_ROUTES } from "../features/enforcement/enforcement.routes";
import { Cm_Action_ROUTES } from "../features/cm-actions/cm-action.routes";
import { NationSearchComponent } from "../features/nation-search/nation-search.component";

import { OFFENDERPROFILE_MY_TEAM_ROUTES } from "../features/offenderprofile/offenderprofile-list/offenderprofile-my-team.routes";
import { OFFENDERPROFILE_MY_CRC_ROUTES } from "../features/offenderprofile/offenderprofile-list/offenderprofile-my-crc.routes";

import { NationalSearch_ROUTES } from "../features/national-search/national-search.routes";
import { Terminations_ROUTES } from "../features/terminations/terminations.routes";
import {LASU_ROUTES} from "../features/lasu/lasu.routes";
import { PendingTransferRecentAllocatedListComponent } from '../features/pending-transfer/pending-transfer-recent-allocated-list/pending-transfer-recent-allocated-list.component';
import { SURecentViewedListComponent } from '../features/offenderprofile/offenderprofile-list/su-recently-viewed-list.component';


const TR_ROUTES: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "/my-service-user", pathMatch: "full" },
  { path: "about-us", component: AboutUsComponent },
  { path: "service-user", children: SERVICEUSER_ROUTES },
  { path: "service-provider", children: SERVICEPROVIDER_ROUTES },
  { path: "service-provider-contact", children: SERVICEPROVIDERCONTACT_ROUTES },
  { path: "address", children: Address_ROUTES },
  { path: "courtappearance", children: CourtAppearance_ROUTES },
  { path: "referral", children: REFERRAL_ROUTES },
  { path: "courtreport", children: COURTREPORT_ROUTES },
  { path: "personalcircumstance", children: PersonalCircumstance_ROUTES },
  { path: "additionalidentifier", children: AdditionalIdentifier_ROUTES },
  { path: "release", children: Release_ROUTES },
  { path: "custody-pss", children: CustodyPss_ROUTES },
  { path: "providerlaodetail", children: PROVIDERLAODETAIL_ROUTES },
  // { path: "custodylocation", children: CUSTODYLOCATION_ROUTES },
  { path: "proposedrequirement", children: PROPOSEDREQUIREMENT_ROUTES },
  { path: "requirementmanager", children: REQUIREMENTMANAGER_ROUTES },
  { path: "registrationreview", children: RegistrationReview_ROUTES },
  { path: "ordermanager", children: ORDERMANAGER_ROUTES },
  { path: "licence-condition-manager", children: LICENCECONDITIONMANAGER_ROUTES },
  { path: "additional-offence", children: AdditionalOffence_ROUTES },
  { path: "pss-requirement", children: PssRequirement_ROUTES },
  { path: "pss-requirement-manager", children: PSSREQUIREMENTMANAGER_ROUTES },
  { path: "offender-additional-sentence", children: OffenderAdditionalSentence_ROUTES },
  { path: "recall", children: Recall_ROUTES },
  { path: "psscontact", children: PSSCONTACT_ROUTES },
  { path: "offendermanager", children: OFFENDERMANAGER_ROUTES },
  { path: "cohort", children: COHORT_ROUTES },
  { path: "my-service-user", children: OFFENDERPROFILE_ROUTES },
  { path: "team-service-user", children: OFFENDERPROFILE_MY_TEAM_ROUTES },
  { path: "crc-service-user", children: OFFENDERPROFILE_MY_CRC_ROUTES },
  { path: "offenderprofile", children: OFFENDERPROFILE_ROUTES },
  { path: "process-contact", children: ProcessContact_ROUTES },
  { path: "offender-disability", children: OffenderDisability_ROUTES },
  { path: "contactinformation", children: contactinformation_ROUTES },
  { path: "rate-card-intervention", children: RATECARDINTERVENTION_ROUTES },
  { path: "contact", children: Contact_ROUTES },
  { path: "case-manager-history", children: CaseManagerHistory_ROUTES },
  { path: "case-manager-allocation", component: CaseManagerAllocationComponent },
  { path: "terminate-requirement", children: TerminateRequirement_ROUTES },
  { path: "terminate-event", children: TerminateEvent_ROUTES },
  { path: "pending-transfer", children: PENDING_TRANSFER_ROUTES },
  { path: "pending-transfer-out", children: TransferOutRequest_ROUTES },
  { path: "event", children: EVENT_ROUTES },
  { path: "communityrequirement", children: CommunityRequirement_ROUTES },
  { path: "approvedpremiseresidence", children: APPROVEDPREMISERESIDENCE_ROUTES },
  { path: "approvedpremisesreferral", children: APPROVEDPREMISESREFERRAL_ROUTES },
  { path: "allocateprocess", children: ALLOCATEPROCESS_ROUTES },
  { path: "inductionletter", children: INDUCTIONLETTER_ROUTES },
  { path: "login/forgot-password", component: ForgotPasswordComponent, pathMatch: "full" },
  { path: "login/reset-component", component: ResetPasswordComponent },
  { path: "change-password", component: ChangePasswordComponent },
  { path: "error", children: ERROR_PAGE_ROUTES },
  { path: "institutionalReport", children: InstitutionalReport_ROUTES },
  { path: "admin-court-work", children: AdminCourtWork_ROUTES },
  { path: "enforcement", children: Enforcement_ROUTES },
  { path: "upw-project", children: UpwProject_ROUTES },
  { path: "upw-project-diary", children: UpwProjectDiary_ROUTES },
  { path: "national-search", children: NationalSearch_ROUTES },
  { path: "cm-actions", children:Cm_Action_ROUTES },
  { path: "nation-search", component: NationSearchComponent},
  { path: "terminations", children: Terminations_ROUTES },
  { path: "lasu", children: LASU_ROUTES},
  { path: "recently-allocated", component: PendingTransferRecentAllocatedListComponent},
  { path: "recently-viewed", component: SURecentViewedListComponent}
];


export const routing = RouterModule.forRoot(TR_ROUTES);
