import { Routes } from '@angular/router';

import { PssRequirementManagerComponent } from '../pss-requirement-manager';
import { PssRequirementManagerDetailComponent } from './pss-requirement-manager-detail/pss-requirement-manager-detail.component';
import { PssRequirementManagerEditComponent } from './pss-requirement-manager-edit/pss-requirement-manager-edit.component';

export const PSSREQUIREMENTMANAGER_ROUTES: Routes = [
   { path: "", component: PssRequirementManagerComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: PssRequirementManagerEditComponent, data:{action:'Create'}},
   { path: ":id", component: PssRequirementManagerDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: PssRequirementManagerEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
