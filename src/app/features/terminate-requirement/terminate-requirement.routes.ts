import { Routes } from '@angular/router';

import { TerminateRequirementListComponent } from './terminate-requirement-list/terminate-requirement-list.component';
import { TerminateRequirementDetailComponent } from './terminate-requirement-detail/terminate-requirement-detail.component';
import { TerminateRequirementAddComponent } from './terminate-requirement-add/terminate-requirement-add.component';

export const TerminateRequirement_ROUTES: Routes = [
   { path: "", component: TerminateRequirementListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: TerminateRequirementAddComponent, data:{action:'Create'}},
   { path: ":terminateRequirementId", component: TerminateRequirementDetailComponent, data:{action:'Read'}},
   { path: "edit/:terminateRequirementId", component: TerminateRequirementAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
