import { Routes } from '@angular/router';

import { TransferOutRequestListComponent } from './transfer-out-request-list/transfer-out-request-list.component';
import { TransferOutRequestDetailComponent } from './transfer-out-request-detail/transfer-out-request-detail.component';
import { TransferOutRequestAddComponent } from './transfer-out-request-add/transfer-out-request-add.component';
import {TransferOutRequestEditComponent} from './transfer-out-request-edit/transfer-out-request-edit.component';
import {TransferOutHistoryListComponent} from './transfer-out-history-list/transfer-out-history-list.component';

export const TransferOutRequest_ROUTES: Routes = [
   { path: "", component: TransferOutRequestListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: "new", component: TransferOutRequestAddComponent, data:{action:'Create'}},
    { path: "edit", component: TransferOutRequestEditComponent},
   { path: ":transferOutRequestId", component: TransferOutRequestDetailComponent, data:{action:'Read'}},
   { path: "request", component: TransferOutRequestAddComponent, pathMatch: 'full', data:{action:'Update'}},
   { path: "", component: TransferOutHistoryListComponent, pathMatch: 'full', data:{action:'Read'}},
];
