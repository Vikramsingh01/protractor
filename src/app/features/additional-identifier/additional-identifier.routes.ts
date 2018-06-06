import { Routes } from '@angular/router';

import { AdditionalIdentifierListComponent } from './additional-identifier-list/additional-identifier-list.component';
import { AdditionalIdentifierDetailComponent } from './additional-identifier-detail/additional-identifier-detail.component';
import { AdditionalIdentifierAddComponent } from './additional-identifier-add/additional-identifier-add.component';

export const AdditionalIdentifier_ROUTES: Routes = [
   { path: "", component: AdditionalIdentifierListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: AdditionalIdentifierAddComponent, data:{action:'Create'}},
   { path: ":additionalIdentifierId", component: AdditionalIdentifierDetailComponent, data:{action:'Read'}},
   { path: "edit/:additionalIdentifierId", component: AdditionalIdentifierAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
