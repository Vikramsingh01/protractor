import { Routes } from '@angular/router';

import { ProvisionListComponent } from './provision-list/provision-list.component';
import { ProvisionDetailComponent } from './provision-detail/provision-detail.component';
import { ProvisionAddComponent } from './provision-add/provision-add.component';

export const Provision_ROUTES: Routes = [
   { path: "", component: ProvisionListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ProvisionAddComponent, data:{action:'Create'}},
   { path: ":provisionId", component: ProvisionDetailComponent, data:{action:'Read'}},
   { path: "edit/:provisionId", component: ProvisionAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
