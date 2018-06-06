import { Routes } from '@angular/router';

import { LicenceConditionListComponent } from './licence-condition-list/licence-condition-list.component';
import { LicenceConditionDetailComponent } from './licence-condition-detail/licence-condition-detail.component';
import { LicenceConditionAddComponent } from './licence-condition-add/licence-condition-add.component';

export const LicenceCondition_ROUTES: Routes = [
   { path: "", component: LicenceConditionListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: LicenceConditionAddComponent, data:{action:'Create'}},
   { path: ":licenceConditionId", component: LicenceConditionDetailComponent, data:{action:'Read'}},
   { path: "edit/:licenceConditionId", component: LicenceConditionAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
