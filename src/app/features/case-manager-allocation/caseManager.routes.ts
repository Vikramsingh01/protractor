import { Routes } from '@angular/router';
import { CaseManagerAllocationListComponent } from './case-manager-allocation-list/case-manager-allocation-list.component';

export const CASEPF_ROUTES: Routes = [
     { path: "", component: CaseManagerAllocationListComponent, pathMatch: 'full', data:{action:'Read'}},
];
