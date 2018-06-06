import { Routes } from '@angular/router';

import { ReleaseListComponent } from './release-list/release-list.component';
import { ReleaseDetailComponent } from './release-detail/release-detail.component';
import { ReleaseAddComponent } from './release-add/release-add.component';

export const Release_ROUTES: Routes = [
   { path: "", component: ReleaseListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: ReleaseAddComponent, data:{action:'Create'}},
   { path: ":releaseId", component: ReleaseDetailComponent, data:{action:'Read'}},
   { path: "edit/:releaseId", component: ReleaseAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
