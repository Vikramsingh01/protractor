import { Routes } from '@angular/router';

import { ProposedRequirementComponent } from '../proposedrequirement';
import { ProposedRequirementDetailComponent } from './proposedrequirement-detail/proposedrequirement-detail.component';
import { ProposedRequirementEditComponent } from './proposedrequirement-edit/proposedrequirement-edit.component';

export const PROPOSEDREQUIREMENT_ROUTES: Routes = [
   { path: "", component: ProposedRequirementComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ProposedRequirementEditComponent, data:{action:'Create'}},
   { path: ":id", component: ProposedRequirementDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: ProposedRequirementEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
