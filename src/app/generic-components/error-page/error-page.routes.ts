import { Routes } from '@angular/router';

import { ErrorPageComponent } from './error-page.component';

export const ERROR_PAGE_ROUTES: Routes = [
   { path: "", component: ErrorPageComponent, pathMatch: 'full'},
];
