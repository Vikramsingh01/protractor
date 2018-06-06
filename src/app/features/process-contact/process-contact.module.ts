import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProcessContactAddComponent } from './process-contact-add/process-contact-add.component';
import { ProcessContactDetailComponent } from './process-contact-detail/process-contact-detail.component';
import { ProcessContactListComponent } from './process-contact-list/process-contact-list.component';
import { ProcessContactService } from './process-contact.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ProcessContactAddComponent, ProcessContactDetailComponent, ProcessContactListComponent],
  providers: [ProcessContactService],
  exports: [ProcessContactAddComponent, ProcessContactDetailComponent, ProcessContactListComponent, SharedModule]
})
export class ProcessContactModule {}
