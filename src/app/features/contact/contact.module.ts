import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ContactAddComponent } from './contact-add/contact-add.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactService } from './contact.service';
import { EnforcementDetailComponent } from './enforcement-detail/enforcemnt-detail.component'

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ContactAddComponent, ContactDetailComponent, ContactListComponent, ContactEditComponent, EnforcementDetailComponent],
  providers: [ContactService],
  exports: [ContactAddComponent, ContactDetailComponent, ContactListComponent, ContactEditComponent, SharedModule]
})
export class ContactModule {}