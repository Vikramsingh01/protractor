import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePickerModule } from '../generic-components/date-picker/date-picker.module';
import { FilterPipe } from '../generic-components/filter/filter.pipe';
import { ExcludeFilterPipe, IncludeFilterPipe } from '../generic-components/filter/exludefilter.pipe';
import { DropdownComponent } from '../generic-components/dropdown/dropdown.component';
import { DropdownService } from '../generic-components/dropdown/dropdown.service';
import { ConfirmService } from '../generic-components/confirm-box/confirm.service';
import { ListLabelComponent } from '../generic-components/list-label/list-label.component';
import { ListRefreshComponent } from '../generic-components/list-refresh/list-refresh.component';
import { AccordionModule } from '../generic-components/accordion/accordion.module';
import { SearchComponent } from '../generic-components/search/search.component';
import { PaginationComponent } from '../generic-components/pagination/pagination.component';
import { SortDirective } from '../generic-components/sort/sort.directive';
import { FocusDirective } from '../generic-components/focus/focus.directive';
import { ControlMessagesModule } from '../generic-components/control-messages/control-messages.module';
import { BreadcrumbModule } from '../generic-components/breadcrumb/breadcrumb.module';
import { Timepicker } from '../generic-components/time-picker/timepicker.component';
import { MultiselectDropdownComponent } from '../generic-components/multiselect-dropdown/multiselect-dropdown.component'
import { RadioButtonComponent } from '../generic-components/radio-button/radio-button.component';
import { NotesModule } from '../generic-components/notes/notes.module';
import { TabsModule } from "../generic-components/tabs/tabs.module";
@NgModule({
  imports: [
    CommonModule,
    DatePickerModule,
    RouterModule,
    AccordionModule,
    ControlMessagesModule,
    BreadcrumbModule,
    NotesModule,
    TabsModule
  ],

  providers: [DropdownService, ConfirmService ],
  declarations: [FilterPipe, ExcludeFilterPipe, IncludeFilterPipe, DropdownComponent, ListLabelComponent, SearchComponent, PaginationComponent, FocusDirective,SortDirective, Timepicker, MultiselectDropdownComponent, RadioButtonComponent,ListRefreshComponent],
  exports: [FilterPipe, ExcludeFilterPipe, IncludeFilterPipe, DropdownComponent, RadioButtonComponent, ListLabelComponent,ListRefreshComponent, SearchComponent, PaginationComponent, FocusDirective,SortDirective, Timepicker, AccordionModule, BreadcrumbModule, ControlMessagesModule, CommonModule, FormsModule, RouterModule, DatePickerModule,Timepicker, MultiselectDropdownComponent, NotesModule, TabsModule]

})
export class SharedModule { }
