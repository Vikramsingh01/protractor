import { Routes } from '@angular/router';

import { NetworkListComponent } from './network-list/network-list.component';
import { NetworkDetailComponent } from './network-detail/network-detail.component';
import { NetworkAddComponent } from './network-add/network-add.component';

export const NETWORK_ROUTES: Routes = [
   { path: "", component: NetworkListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: NetworkAddComponent, data:{action:'Create'}},
   { path: ":personalContactId", component: NetworkDetailComponent, data:{action:'Read'}},
   { path: "edit/:personalContactId", component: NetworkAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
