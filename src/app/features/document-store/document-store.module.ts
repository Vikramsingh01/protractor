import { NgModule } from '@angular/core';
import { DocumentStoreComponent } from './document-store.component';
import { DocumentStoreAddComponent } from './document-store-add/document-store-add.component';
import { DocumentStoreService } from './document-store.service';

@NgModule({
    //declarations: [DocumentStoreComponent, DocumentStoreAddComponent],
    providers: [DocumentStoreService]
    //exports: [DocumentStoreComponent, DocumentStoreAddComponent]
})
export class DocumentStoreModule {}