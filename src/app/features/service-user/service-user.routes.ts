import { Routes } from '@angular/router';

import { ServiceUserComponent } from '../service-user';
import { ServiceUserDetailComponent } from './service-user-detail/service-user-detail.component';
import { ServiceUserEditComponent } from './service-user-edit/service-user-edit.component';

export const SERVICEUSER_ROUTES: Routes = [
   { path: "", component: ServiceUserComponent, pathMatch: 'full'},
   { path: "new", component: ServiceUserEditComponent},
   { path: ":id", component: ServiceUserDetailComponent},
   { path: ":id/edit", component: ServiceUserEditComponent, pathMatch: 'full'}
   
];
