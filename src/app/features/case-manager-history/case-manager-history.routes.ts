import { Routes } from '@angular/router';

import { CaseManagerHistoryListComponent } from './case-manager-history-list/case-manager-history-list.component';
import { CaseManagerHistoryDetailComponent } from './case-manager-history-detail/case-manager-history-detail.component';
import { CaseManagerHistoryAddComponent } from './case-manager-history-add/case-manager-history-add.component';
import { CaseManagerHistoryModule } from '../case-manager-history/case-manager-history.module';

export const CaseManagerHistory_ROUTES: Routes = [
   { path: "", component: CaseManagerHistoryListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: CaseManagerHistoryAddComponent, data:{action:'Read'}},
   { path: "", component: CaseManagerHistoryModule, data:{action:'Create'}},
   { path: ":caseManagerHistoryId", component: CaseManagerHistoryDetailComponent, data:{action:'Read'}},
   { path: ":caseManagerHistoryId/edit", component: CaseManagerHistoryAddComponent, pathMatch: 'full', data:{action:'Update'}}
   
];
