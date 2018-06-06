import { Routes } from '@angular/router';

import { DocumentStoreAddComponent } from './document-store-add/document-store-add.component';
import { DocumentStoreComponent } from './document-store.component';
import { GenerateLetterComponent } from './generate-letter/generate-letter.component';
import { DocumentListComponent } from './document-list/document-list.component';

export const DocumentStore_ROUTES: Routes = [
    {path: "", component: DocumentListComponent, pathMatch: 'full', data: { action: 'Read' } },
    {path: "new", component: DocumentStoreAddComponent, data: {action: "Create"}},
   { path: "new", component: DocumentListComponent, pathMatch: 'full', data:{action:'Read'}}

]
