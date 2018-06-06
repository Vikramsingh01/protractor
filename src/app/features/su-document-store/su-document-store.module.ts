import { NgModule } from '@angular/core';
import { SuTDocumentListComponent } from './su-document-list/su-document-list.component';
import { SuDocumentStoreService } from './su-document-store.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [SuTDocumentListComponent],
    imports: [CommonModule,SharedModule],
    providers: [SuDocumentStoreService],
    exports: [SharedModule,SuTDocumentListComponent]
})

export class SuDocumentStoreModule { }