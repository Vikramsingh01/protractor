import { Routes } from '@angular/router';

import { ServiceProviderListComponent } from './service-provider-list/service-provider-list.component';
import { ServiceProviderDetailComponent } from './service-provider-detail/service-provider-detail.component';
import { ServiceProviderAddComponent } from './service-provider-add/service-provider-add.component';

export const SERVICEPROVIDER_ROUTES: Routes = [
   { path: "", component: ServiceProviderListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ServiceProviderAddComponent, data:{action:'Create'}},
   { path: ":serviceProviderId", component: ServiceProviderDetailComponent, data:{action:'Read'}},
   { path: "edit/:serviceProviderId", component: ServiceProviderAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
