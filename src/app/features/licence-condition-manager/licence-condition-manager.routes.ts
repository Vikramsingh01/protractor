import { Routes } from '@angular/router';

import { LicenceConditionManagerComponent } from '../licence-condition-manager';
import { LicenceConditionManagerDetailComponent } from './licence-condition-manager-detail/licence-condition-manager-detail.component';
import { LicenceConditionManagerEditComponent } from './licence-condition-manager-edit/licence-condition-manager-edit.component';

export const LICENCECONDITIONMANAGER_ROUTES: Routes = [
   { path: "", component: LicenceConditionManagerComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: LicenceConditionManagerEditComponent, data:{action:'Create'}},
   { path: ":id", component: LicenceConditionManagerDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: LicenceConditionManagerEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
