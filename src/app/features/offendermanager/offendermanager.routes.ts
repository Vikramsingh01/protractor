import { Routes } from '@angular/router';

import { OffenderManagerComponent } from '../offendermanager';
import { OffenderManagerDetailComponent } from './offendermanager-detail/offendermanager-detail.component';
import { OffenderManagerEditComponent } from './offendermanager-edit/offendermanager-edit.component';

export const OFFENDERMANAGER_ROUTES: Routes = [
   { path: "", component: OffenderManagerComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: OffenderManagerEditComponent, data:{action:'Create'}},
   { path: ":id", component: OffenderManagerDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: OffenderManagerEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
