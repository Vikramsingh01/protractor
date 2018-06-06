import { Routes } from '@angular/router';

import { AliasListComponent } from './alias-list/alias-list.component';
import { AliasDetailComponent } from './alias-detail/alias-detail.component';
import { AliasAddComponent } from './alias-add/alias-add.component';

export const Alias_ROUTES: Routes = [
   { path: "", component: AliasListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: AliasAddComponent, data:{action:'Create'}},
   { path: ":aliasId", component: AliasDetailComponent, data:{action:'Read'}},
   { path: "edit/:aliasId", component: AliasAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
