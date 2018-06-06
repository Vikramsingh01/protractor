import { Routes } from '@angular/router';

import { ApprovedPremisesReferralComponent } from '../approvedpremisesreferral';
import { ApprovedPremisesReferralDetailComponent } from './approvedpremisesreferral-detail/approvedpremisesreferral-detail.component';
import { ApprovedPremisesReferralEditComponent } from './approvedpremisesreferral-edit/approvedpremisesreferral-edit.component';
import { APPROVEDPREMISERESIDENCE_ROUTES } from '../approvedpremiseresidence/approvedpremiseresidence.routes';

export const APPROVEDPREMISESREFERRAL_ROUTES: Routes = [
   { path: "", component: ApprovedPremisesReferralComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ApprovedPremisesReferralEditComponent, data:{action:'Create'}},
   { path: ":approvedPremisesReferralId", component: ApprovedPremisesReferralDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: ApprovedPremisesReferralEditComponent, pathMatch: 'full', data:{action:'Update'}},
   { path: ":approvedPremisesReferralId/approved-premises-residence", children: APPROVEDPREMISERESIDENCE_ROUTES }
   
];
