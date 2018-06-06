import { Routes } from '@angular/router';

import { ServiceProviderContactListComponent } from './service-provider-contact-list/service-provider-contact-list.component';
import { ServiceProviderContactDetailComponent } from './service-provider-contact-detail/service-provider-contact-detail.component';
import { ServiceProviderContactAddComponent } from './service-provider-contact-add/service-provider-contact-add.component';

export const SERVICEPROVIDERCONTACT_ROUTES: Routes = [
   { path: "", component: ServiceProviderContactListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ServiceProviderContactAddComponent, data:{action:'Create'}},
   { path: ":serviceProviderContactId", component: ServiceProviderContactDetailComponent, data:{action:'Read'}},
   { path: "edit/:serviceProviderContactId", component: ServiceProviderContactAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
