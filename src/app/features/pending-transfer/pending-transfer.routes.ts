import { Routes } from '@angular/router';

import { PendingTransferListComponent } from './pending-transfer-list/pending-transfer-list.component';
import { PendingTransferDetailComponent } from './pending-transfer-detail';
import { PendingTransferComponetAllocationComponent } from './pending-transfer-component-allocation';
import { PendingTransferAllocationComponent } from './pending-transfer-allocation';
import { CaseManagerAllocationComponent } from '../case-manager-allocation/case-manager-allocation.component';
import { ENGAGEMENTHISTORY_ROUTES } from '../engagement-history/engagement-history.routes';
import {INDUCTIONLETTER_ROUTES} from '../inductionletter/inductionletter.routes';
import {DocumentListComponent} from '../document-store/document-list/document-list.component';

export const PENDING_TRANSFER_ROUTES: Routes = [
   { path: "", component: PendingTransferListComponent, pathMatch: 'full', data:{action:'Read'}},
   { path: ":profileId/:transferRequestId", component: PendingTransferAllocationComponent, data:{action:'Read'}},
   { path: ":profileId/:transferRequestId/details", component: PendingTransferDetailComponent, data:{action:'Read'}},
   { path: ":profileId/:transferRequestId/case-manager-allocation/:transferResponseId", component: CaseManagerAllocationComponent, data:{action:'Read'}},
   { path: ":profileId/:transferRequestId/component-allocation/:transferResponseId", component: PendingTransferComponetAllocationComponent, data:{action:'Read'}},
   { path: ":profileId/:transferRequestId/case-manager-allocation/:transferResponseId/inductionletter", children: INDUCTIONLETTER_ROUTES},
   { path: ":profileId/engagement-history", children: ENGAGEMENTHISTORY_ROUTES},
   { path: ":profileId/:transferRequestId/component-allocation/", component: PendingTransferComponetAllocationComponent, data:{action:'Read'}},
   { path: ":profileId/:transferRequestId/:dataId/:tableId", component: PendingTransferComponetAllocationComponent, data:{action:'Read'}},
    { path: ":profileId/:transferRequestId/:dataId/:tableId/:transferResponseId", component: PendingTransferComponetAllocationComponent, data:{action:'Read'}},
   { path: ":profileId/:transferRequestId/document-list", component: DocumentListComponent, data:{action:'Read'}},
];
