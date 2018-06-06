import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NationalSearchAddComponent } from './national-search-add/national-search-add.component';
import { NationalSearchDetailComponent } from './national-search-detail/national-search-detail.component';
import { NationalSearchListComponent } from './national-search-list/national-search-list.component';
import { NationalSearchService } from './national-search.service';
import { EventListComponent } from './national-search-detail/events/event-list.component'
import { RegistrationDetailComponent } from './national-search-detail/registration/registration-detail.component'
import { ServiceUserDetailComponent } from './national-search-detail/service-user/service-user-detail.component'
import { PersonalDetailComponent } from './national-search-detail/personal-circumstance/personal-circumstance-detail.component'

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [NationalSearchAddComponent, NationalSearchDetailComponent, NationalSearchListComponent,
                PersonalDetailComponent, ServiceUserDetailComponent, RegistrationDetailComponent, EventListComponent],
  providers: [NationalSearchService],
  exports: [NationalSearchAddComponent, NationalSearchDetailComponent,
            PersonalDetailComponent, ServiceUserDetailComponent, RegistrationDetailComponent, EventListComponent, NationalSearchListComponent, SharedModule]
})
export class NationalSearchModule {}