import { Routes } from '@angular/router';

import { SuDocumentStoreAddComponent } from './document-store-add/su-document-store-add.component';
import { SuDocumentStoreComponent } from './su-document-store.component';
import { SuTDocumentListComponent } from './su-document-list/su-document-list.component';

export const SU_DocumentStore_ROUTES: Routes = [
    {path: "", component: SuTDocumentListComponent, pathMatch: 'full', data: { action: 'Read' } },
    {path: "new", component: SuDocumentStoreAddComponent, data: {action: "Create"}},
   { path: "new", component: SuDocumentStoreAddComponent, pathMatch: 'full', data:{action:'Read'}}

]
