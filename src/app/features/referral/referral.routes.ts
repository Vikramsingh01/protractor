import {Routes} from '@angular/router';

import {ReferralListComponent} from './referral-list/referral-list.component';
import {ReferralDetailComponent} from './referral-detail/referral-detail.component';
import {ReferralAddComponent} from './referral-add/referral-add.component';
import { Assessment_ROUTES } from '../assessment/assessment.routes';
import { DrugTestProfile_ROUTES } from '../drug-test-profile/drug-test-profile.routes';
import { DrugTest_ROUTES } from '../drug-test/drug-test.routes';

export const REFERRAL_ROUTES: Routes = [
  {path: "", component: ReferralListComponent, pathMatch: 'full', data: {action: 'Read'}},
  {path: "new", component: ReferralAddComponent, data: {action: 'Create'}},
  {path: ":referralId", component: ReferralDetailComponent, data: {action: 'Read'}},
  {path: "edit/:referralId", component: ReferralAddComponent, pathMatch: 'full', data: {action: 'Update'}},
  {path: ":referralId/assessment", children: Assessment_ROUTES },
  {path: ":referralId/drugTestProfile", children: DrugTestProfile_ROUTES },
  {path: ":referralId/drug-test", children: DrugTest_ROUTES }
];
