import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlMessagesComponent, FromServerMessageValidator } from './control-messages.component';
import { ValidationService } from './validation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ValidationService],
  declarations: [ControlMessagesComponent, FromServerMessageValidator],
  exports: [ControlMessagesComponent, FromServerMessageValidator, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ControlMessagesModule { }
