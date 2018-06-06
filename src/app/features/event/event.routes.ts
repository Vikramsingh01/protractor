import { Routes } from '@angular/router';

import { EventComponent } from '../event';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { Recall_ROUTES } from '../recall/recall.routes';
import { Release_ROUTES } from '../release/release.routes';
import { LicenceCondition_ROUTES } from '../licence-condition/licence-condition.routes';
import { ORDERMANAGER_ROUTES } from '../ordermanager/ordermanager.routes';
import { AdditionalOffence_ROUTES } from '../additional-offence/additional-offence.routes';
import { OffenderAdditionalSentence_ROUTES } from '../offender-additional-sentence/offender-additional-sentence.routes';
import { PSSCONTACT_ROUTES } from '../psscontact/psscontact.routes';
// import { CUSTODYLOCATION_ROUTES } from '../custodylocation/custodylocation.routes';
import { CourtAppearance_ROUTES } from '../court-appearance/court-appearance.routes';
import { REFERRAL_ROUTES } from '../referral/referral.routes';
import { CourtWork_ROUTES } from "../court-work/court-work.routes";
import { ProcessContact_ROUTES } from "../process-contact/process-contact.routes";
import { CourtAndCustodyComponent } from '../court-and-custody/court-and-custody.component';
import { EnablersComponent } from '../enablers/enablers.component';
import { UPW_ROUTES } from '../upw-summary/upw-summary.routes';
import { COHORT_ROUTES } from '../cohort/cohort.routes';
import { CommunityRequirement_ROUTES } from "../community-requirement/community-requirement.routes";
import { APPROVEDPREMISESREFERRAL_ROUTES } from '../approvedpremisesreferral/approvedpremisesreferral.routes';
import { PssRequirement_ROUTES } from '../pss-requirement/pss-requirement.routes';
import { TerminateRequirement_ROUTES } from '../terminate-requirement/terminate-requirement.routes';
import { InstitutionalReport_ROUTES } from '../institutional-report/institutional-report.routes';
import { ThroughcareComponent } from '../../features/throughcare/throughcare.component';
import { COURTREPORT_ROUTES } from '../../features/court-report/court-report.routes';
import { CustodyKeyDate_ROUTES } from '../../features/custody-key-date/custody-key-date.routes';
import { TerminateEvent_ROUTES } from '../terminate-event/terminate-event.routes';
import {  CustodyLocation_ROUTES } from "../../features/custody-location/custody-location.routes";
import {Offloc_ROUTES} from "../offloc/offloc.routes";
import {CustodyPss_ROUTES} from "../../features/custody-pss/custody-pss.routes";

export const EVENT_ROUTES: Routes = [
   { path: "", component: EventComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: EventEditComponent, data:{action:'Create'}},
   { path: ":eventId/event-details", component: EventDetailComponent, data:{action:'Read'}},
   { path: ":eventId/edit", component: EventEditComponent, pathMatch: 'full', data:{action:'Update'}},
   { path: ":eventId/cohort", children: COHORT_ROUTES },
   { path: ":eventId/event-details/community-requirement", children: CommunityRequirement_ROUTES },
   { path: ":eventId/approvedpremisesreferral", children: APPROVEDPREMISESREFERRAL_ROUTES },
   { path: ":eventId/event-details/terminate-event", children: TerminateEvent_ROUTES},
   { path: ":eventId/event-details/licence-condition", children: LicenceCondition_ROUTES },
   { path: ":eventId/ordermanager", children: ORDERMANAGER_ROUTES },
   { path: ":eventId/additional-offence", children: AdditionalOffence_ROUTES },
   { path: ":eventId/offender-additional-sentence", children: OffenderAdditionalSentence_ROUTES },
   { path: ":eventId/psscontact", children: PSSCONTACT_ROUTES },
   { path: ":eventId/event-details/pss-requirement", children: PssRequirement_ROUTES },
   { path: ":eventId/ThroughCare/recall", children: Recall_ROUTES },
   { path: ":eventId/court-and-custody", component: CourtAndCustodyComponent },
   { path: ":eventId/court-appearance", children: CourtAppearance_ROUTES},
//    { path: ":eventId/court-and-custody/custodylocation", children: CUSTODYLOCATION_ROUTES },
   { path: ":eventId/event-details/community-requirement/terminate-requirement", children: TerminateRequirement_ROUTES },
   { path: ":eventId/enablers", component: EnablersComponent },
   { path: ":eventId/referral", children: REFERRAL_ROUTES },
   { path: ":eventId/ThroughCare", component: ThroughcareComponent },
   { path: ":eventId/court-work", children: CourtWork_ROUTES },
   { path: ":eventId/process-contact", children: ProcessContact_ROUTES },
   { path: ":eventId/ThroughCare/institutional-report", children: InstitutionalReport_ROUTES },
   { path: ":eventId/ThroughCare/custody-key-date", children: CustodyKeyDate_ROUTES },
   { path: ":eventId/court-report", children: COURTREPORT_ROUTES },
   { path: ":eventId/ThroughCare/release", children: Release_ROUTES },
   { path: ":eventId/ThroughCare/custody-location", children: CustodyLocation_ROUTES},
   { path: ":eventId/offloc", children: Offloc_ROUTES},
   { path: ":eventId/ThroughCare/custody-pss", children: CustodyPss_ROUTES }

];
