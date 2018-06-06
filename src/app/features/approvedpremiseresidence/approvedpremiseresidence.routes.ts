import { Routes } from '@angular/router';

import { ApprovedPremiseResidenceComponent } from '../approvedpremiseresidence';
import { ApprovedPremiseResidenceDetailComponent } from './approvedpremiseresidence-detail/approvedpremiseresidence-detail.component';
import { ApprovedPremiseResidenceEditComponent } from './approvedpremiseresidence-edit/approvedpremiseresidence-edit.component';

export const APPROVEDPREMISERESIDENCE_ROUTES: Routes = [
   { path: "", component: ApprovedPremiseResidenceComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ApprovedPremiseResidenceEditComponent, data:{action:'Create'}},
   { path: ":id", component: ApprovedPremiseResidenceDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: ApprovedPremiseResidenceEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
