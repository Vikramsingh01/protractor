import { Routes } from '@angular/router';

import { CommunityRequirementListComponent } from './community-requirement-list/community-requirement-list.component';
import { CommunityRequirementDetailComponent } from './community-requirement-detail/community-requirement-detail.component';
import { CommunityRequirementAddComponent } from './community-requirement-add/community-requirement-add.component';

export const CommunityRequirement_ROUTES: Routes = [
   { path: "", component: CommunityRequirementListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CommunityRequirementAddComponent, data:{action:'Create'}},
   { path: ":communityRequirementId", component: CommunityRequirementDetailComponent, data:{action:'Read'}},
   { path: "edit/:communityRequirementId", component: CommunityRequirementAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
