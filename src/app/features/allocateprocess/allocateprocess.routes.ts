import { Routes } from '@angular/router';

import { AllocateProcessComponent } from '../allocateprocess';
import { AllocateProcessDetailComponent } from './allocateprocess-detail/allocateprocess-detail.component';
import { AllocateProcessEditComponent } from './allocateprocess-edit/allocateprocess-edit.component';

export const ALLOCATEPROCESS_ROUTES: Routes = [
   { path: "", component: AllocateProcessComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: AllocateProcessEditComponent, data:{action:'Create'}},
   { path: ":id", component: AllocateProcessDetailComponent, data:{action:'Read'}},
   { path: ":id/edit", component: AllocateProcessEditComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
