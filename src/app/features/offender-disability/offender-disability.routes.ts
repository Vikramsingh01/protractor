import { Routes } from '@angular/router';

import { OffenderDisabilityListComponent } from './offender-disability-list/offender-disability-list.component';
import { OffenderDisabilityDetailComponent } from './offender-disability-detail/offender-disability-detail.component';
import { OffenderDisabilityAddComponent } from './offender-disability-add/offender-disability-add.component';
import { Provision_ROUTES } from '../provision/provision.routes';

export const OffenderDisability_ROUTES: Routes = [
   { path: "", component: OffenderDisabilityListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: OffenderDisabilityAddComponent, data:{action:'Create'}},
   { path: ":offenderDisabilityId", component: OffenderDisabilityDetailComponent, data:{action:'Read'}},
   { path: "edit/:offenderDisabilityId", component: OffenderDisabilityAddComponent, pathMatch: 'full', data:{action:'Update'}},
   { path: ":disabilityId/provision", children: Provision_ROUTES }
   
];
