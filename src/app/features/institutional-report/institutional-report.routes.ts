import { Routes } from '@angular/router';

import { InstitutionalReportListComponent } from './institutional-report-list/institutional-report-list.component';
import { InstitutionalReportDetailComponent } from './institutional-report-detail/institutional-report-detail.component';
import { InstitutionalReportAddComponent } from './institutional-report-add/institutional-report-add.component';

export const InstitutionalReport_ROUTES: Routes = [
   { path: "", component: InstitutionalReportListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: InstitutionalReportAddComponent, data:{action:'Create'}},
   { path: ":institutionalReportId", component: InstitutionalReportDetailComponent, data:{action:'Read'}},
   { path: "edit/:institutionalReportId", component: InstitutionalReportAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
