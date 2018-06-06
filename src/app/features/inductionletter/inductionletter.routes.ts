import { Routes } from '@angular/router';

import { InductionLetterEditComponent } from './inductionletter-edit/inductionletter-edit.component';

export const INDUCTIONLETTER_ROUTES: Routes = [

    {path: "new", component: InductionLetterEditComponent, data: { action: 'Create' },},
    //{ path: "/pending-transfer", component: PendingTransferComponent, pathMatch: 'full', data:{action:'Read'}},
];
