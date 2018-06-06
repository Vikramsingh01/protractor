import { Routes } from '@angular/router';

import { NationalSearchListComponent } from './national-search-list/national-search-list.component';
import { NationalSearchDetailComponent } from './national-search-detail/national-search-detail.component';
import { NationalSearchAddComponent } from './national-search-add/national-search-add.component';

export const NationalSearch_ROUTES: Routes = [
   { path: "", component: NationalSearchListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: NationalSearchAddComponent, data:{action:'Create'}},
   { path: ":crcSearchId/:offenderId/:caseReferenceNumber", component: NationalSearchDetailComponent, data:{action:'Read'}},
   { path: "edit/:nationalSearchId", component: NationalSearchAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
