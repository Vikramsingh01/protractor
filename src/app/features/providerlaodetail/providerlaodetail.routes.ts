import { Routes } from '@angular/router';

import { ProviderLaoDetailComponent } from '../providerlaodetail';
import { ProviderLaoDetailDetailComponent } from './providerlaodetail-detail/providerlaodetail-detail.component';
import { ProviderLaoDetailEditComponent } from './providerlaodetail-edit/providerlaodetail-edit.component';

export const PROVIDERLAODETAIL_ROUTES: Routes = [
   { path: "", component: ProviderLaoDetailComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ProviderLaoDetailEditComponent, data:{action:'Create'}},
   { path: ":id", component: ProviderLaoDetailDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: ProviderLaoDetailEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
