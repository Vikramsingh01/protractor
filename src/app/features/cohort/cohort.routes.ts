import { Routes } from '@angular/router';

import { CohortComponent } from '../cohort';
import { CohortDetailComponent } from './cohort-detail/cohort-detail.component';
import { CohortEditComponent } from './cohort-edit/cohort-edit.component';

export const COHORT_ROUTES: Routes = [
   { path: "", component: CohortComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CohortEditComponent, data:{action:'Create'}},
   { path: ":id", component: CohortDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: CohortEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
