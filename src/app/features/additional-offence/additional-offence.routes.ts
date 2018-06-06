import { Routes } from '@angular/router';

import { AdditionalOffenceListComponent } from './additional-offence-list/additional-offence-list.component';
import { AdditionalOffenceDetailComponent } from './additional-offence-detail/additional-offence-detail.component';
import { AdditionalOffenceAddComponent } from './additional-offence-add/additional-offence-add.component';

export const AdditionalOffence_ROUTES: Routes = [
   { path: "", component: AdditionalOffenceListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: AdditionalOffenceAddComponent, data:{action:'Create'}},
   { path: ":additionalOffenceId", component: AdditionalOffenceDetailComponent, data:{action:'Read'}},
   { path: "edit/:additionalOffenceId", component: AdditionalOffenceAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
