import { Routes } from '@angular/router';

import { OrderManagerComponent } from '../ordermanager';
import { OrderManagerDetailComponent } from './ordermanager-detail/ordermanager-detail.component';
import { OrderManagerEditComponent } from './ordermanager-edit/ordermanager-edit.component';

export const ORDERMANAGER_ROUTES: Routes = [
   { path: "", component: OrderManagerComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: OrderManagerEditComponent, data:{action:'Create'}},
   { path: ":id", component: OrderManagerDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: OrderManagerEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
