import { Routes } from '@angular/router';

import { RateCardInterventionComponent } from '../rate-card-intervention';
import { RateCardInterventionDetailComponent } from './rate-card-intervention-detail/rate-card-intervention-detail.component';
import { RateCardInterventionEditComponent } from './rate-card-intervention-edit/rate-card-intervention-edit.component';

export const RATECARDINTERVENTION_ROUTES: Routes = [
   { path: "", component: RateCardInterventionComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: RateCardInterventionEditComponent, data:{action:'Create'}},
   { path: ":id", component: RateCardInterventionDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: RateCardInterventionEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
