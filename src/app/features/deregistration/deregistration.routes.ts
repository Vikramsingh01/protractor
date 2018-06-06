import { Routes } from '@angular/router';

import { DeregistrationListComponent } from './deregistration-list/deregistration-list.component';
import { DeregistrationDetailComponent } from './deregistration-detail/deregistration-detail.component';
import { DeregistrationAddComponent } from './deregistration-add/deregistration-add.component';

export const deregistration_ROUTES: Routes = [
   { path: "", component: DeregistrationListComponent, pathMatch: 'full', data:{action:'Read'}},
  
   { path: ":deregistrationId", component: DeregistrationDetailComponent, data:{action:'Read'}}
   
];
