import { Routes } from '@angular/router';

import { RequirementManagerComponent } from '../requirementmanager';
import { RequirementManagerDetailComponent } from './requirementmanager-detail/requirementmanager-detail.component';
import { RequirementManagerEditComponent } from './requirementmanager-edit/requirementmanager-edit.component';
import { CommunityRequirementDetailComponent } from '../community-requirement/community-requirement-detail/community-requirement-detail.component';

export const REQUIREMENTMANAGER_ROUTES: Routes = [
   { path: "", component: RequirementManagerComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: RequirementManagerEditComponent, data:{action:'Create'}},
   { path: ":id", component: RequirementManagerDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: RequirementManagerEditComponent, pathMatch: 'full', data:{action:'Update'}}
 //,{ path: "/offenderprofile/:profileId/event/:eventId/communityrequirement/24", component: NeoCommunityRequirementDetailComponent, data:{action:'Read'}},
];
