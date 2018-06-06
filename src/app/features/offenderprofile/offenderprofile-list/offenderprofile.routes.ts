import { Routes } from '@angular/router';

import { OffenderProfileComponent } from '../offenderprofile-list/offenderprofile.component';
import { SURecentViewedListComponent } from '../offenderprofile-list/su-recently-viewed-list.component';
import {OffenderManagerComponent} from '../../offendermanager';
import { OffenderProfileSummaryComponent } from '../offenderprofile-summary/offenderprofile-summary.component';
import { OffenderProfileDetailComponent } from '../offenderprofile-detail/offenderprofile-detail.component';
import { OffenderProfileEditComponent } from '../offenderprofile-edit/offenderprofile-edit.component';
import { EVENT_ROUTES } from '../../event/event.routes';
import { Alias_ROUTES } from '../../alias/alias.routes';
import { PersonalCircumstance_ROUTES } from "../../personal-circumstance/personal-circumstance.routes";
import { PersonalCircumstanceConstants } from '../../personal-circumstance/personal-circumstance.constants';
import { RATECARDINTERVENTION_ROUTES } from '../../rate-card-intervention/rate-card-intervention.routes';
import { AdditionalIdentifier_ROUTES } from '../../additional-identifier/additional-identifier.routes';
import { OFFENDERMANAGER_ROUTES } from '../../offendermanager/offendermanager.routes';
import { CaseManagerHistoryListComponent } from '../../case-manager-history/case-manager-history-list/case-manager-history-list.component';
import { CaseManagerHistory_ROUTES } from "../../case-manager-history/case-manager-history.routes";
import { CurrentCaseManager_ROUTES } from "../../current-case-manager/current-case-manager.routes";
import { ContactModule } from '../../contact/contact.module';
import { ContactInformationComponent } from '../../contact-information/contact-information.component';
import { AdditionalContextComponent } from '../../additional-context/additional-context.component';
import { HealthAndAvailabilityComponent } from '../../health-and-availability/health-and-availability.component';
import { APPROVEDPREMISESREFERRAL_ROUTES } from '../../approvedpremisesreferral/approvedpremisesreferral.routes';
import { Registration_ROUTES } from '../../registration/registration.routes';
import { RegistrationConstants } from '../../registration/registration.constants';
import { ProcessContact_ROUTES } from '../../process-contact/process-contact.routes';
import { ALLOCATEPROCESS_ROUTES } from '../../allocateprocess/allocateprocess.routes';
import { TransferOutRequestEditComponent } from '../../../features/transfer-out-request/transfer-out-request-edit/transfer-out-request-edit.component';
import { OffenderDisability_ROUTES } from '../../offender-disability/offender-disability.routes';
//import { DocumentListComponent } from '../document-store/document-list/document-list.component';
import { NETWORK_ROUTES } from "../../network/network.routes";
import { contactinformation_ROUTES } from "../../contactinformation/contactinformation.routes";
import { ProtectedCharacteristics_ROUTES } from "../../protected-characteristics/protected-characteristics.routes";
import { Address_ROUTES } from "../../../features/address/address.routes";
import { PlanComponent } from '../../../features/plan/plan.component';
import { TransferOutRequestAddComponent } from '../../../features/transfer-out-request/transfer-out-request-add/transfer-out-request-add.component';
import { Contact_ROUTES } from "../../../features/contact/contact.routes";
import { UPW_ROUTES } from "../../../features/upw-summary/upw-summary.routes";
import { SU_DocumentStore_ROUTES } from '../../../features/su-document-store/su-document-store.routes';
import {CaseManagerAllocationListComponent} from '../../../features/case-manager-allocation/case-manager-allocation-list/case-manager-allocation-list.component';
import { EnforcementDetailComponent } from '../../../features/contact/enforcement-detail/enforcemnt-detail.component'
export const OFFENDERPROFILE_ROUTES: Routes = [
   { path : "", component: OffenderProfileComponent, pathMatch: 'full', data:{action:'Read'}},
   { path : "new", component: OffenderProfileEditComponent, data:{action:'Create'}},
   { path : ":profileId/profile", component: OffenderProfileSummaryComponent, data:{action:'Read'}},
   { path : ":profileId/profile/identifier", component: OffenderProfileDetailComponent, data:{action:'Read'}},
   { path : ":profileId/profile/identifier/edit", component: OffenderProfileEditComponent, pathMatch: 'full', data:{action:'Update'}},
   { path : ":profileId/event", children: EVENT_ROUTES},
   { path : ":profileId/profile/identifier/alias", children: Alias_ROUTES},
   { path : ":profileId/profile/protected-characteristics", children: ProtectedCharacteristics_ROUTES},
   { path : ":profileId/profile/personalcircumstance", children: PersonalCircumstance_ROUTES},
   { path : ":profileId/profile/component-management",component: CaseManagerAllocationListComponent, data:{action:'Read'}},
   { path : ":profileId/profile/identifier/rate-card-intervention", children: RATECARDINTERVENTION_ROUTES},
   { path : ":profileId/profile/identifier/additionalidentifier", children: AdditionalIdentifier_ROUTES},
   { path : ":profileId/profile/case-manager-history", component:CaseManagerHistoryListComponent,data:{action:'Read'}},
   { path : ":profileId/profile/case-manager-history", children: CaseManagerHistory_ROUTES},
   { path : ":profileId/profile/transfers", children: CurrentCaseManager_ROUTES},
   { path : ":profileId/profile/health-and-availability", component: HealthAndAvailabilityComponent},
   { path : ":profileId/profile/address", children: Address_ROUTES},
   { path : ":profileId/profile/case-chronology", component: ContactModule },
   { path : ":profileId/profile/contact-information", children: contactinformation_ROUTES},
   { path : ":profileId/profile/contact-information/approvedpremisesreferral", children: APPROVEDPREMISESREFERRAL_ROUTES},
   { path : ":profileId/profile/contact-information/network", children: NETWORK_ROUTES},
   { path : ":profileId/profile/contact-information/address", children: Address_ROUTES},
   { path : ":profileId/profile/additional-context", component: AdditionalContextComponent },
   { path : ":profileId/profile/additional-context/process-contact", children: ProcessContact_ROUTES },
   { path : ":profileId/profile/additional-context/allocateprocess", children: ALLOCATEPROCESS_ROUTES },
   { path : ":profileId/profile/registration", children: Registration_ROUTES },
   { path : ":profileId/profile/process-contact", children: ProcessContact_ROUTES},
   { path : ":profileId/profile/offender-disability", children: OffenderDisability_ROUTES},
   { path : ":profileId/plan", component: PlanComponent},
   { path :":profileId/plan/ns-summary", component:EnforcementDetailComponent, pathMatch: 'full'},
   { path : ":profilrId/profile/transferout", component: TransferOutRequestAddComponent},
   { path : ":profileId/plan/contact", children: Contact_ROUTES},
   { path : ":profileId/profile/transfers/edit/:profileId", component: TransferOutRequestEditComponent},
   { path : ":profileId/plan/upw", children: UPW_ROUTES},
   { path: ":profileId/profile/document-store", children: SU_DocumentStore_ROUTES },
    { path : "my-service-user/:profileId/profile", component: SURecentViewedListComponent},

];
