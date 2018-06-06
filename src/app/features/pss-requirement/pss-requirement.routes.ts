import { Routes } from '@angular/router';

import { PssRequirementListComponent } from './pss-requirement-list/pss-requirement-list.component';
import { PssRequirementDetailComponent } from './pss-requirement-detail/pss-requirement-detail.component';
import { PssRequirementAddComponent } from './pss-requirement-add/pss-requirement-add.component';

export const PssRequirement_ROUTES: Routes = [
   { path: "", component: PssRequirementListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: PssRequirementAddComponent, data:{action:'Create'}},
   { path: ":pssRequirementId", component: PssRequirementDetailComponent, data:{action:'Read'}},
   { path: "edit/:pssRequirementId", component: PssRequirementAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
