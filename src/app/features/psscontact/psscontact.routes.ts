import { Routes } from '@angular/router';

import { PssContactComponent } from '../psscontact';
import { PssContactDetailComponent } from './psscontact-detail/psscontact-detail.component';
import { PssContactEditComponent } from './psscontact-edit/psscontact-edit.component';

export const PSSCONTACT_ROUTES: Routes = [
   { path: "", component: PssContactComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: PssContactEditComponent, data:{action:'Create'}},
   { path: ":id", component: PssContactDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: PssContactEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
