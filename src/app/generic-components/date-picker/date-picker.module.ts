import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { DatePicker } from "./date-picker.component";
import { InputFocusDirective } from "./directives/date-picker.input.directive";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [DatePicker, InputFocusDirective],
    exports: [DatePicker, InputFocusDirective, ReactiveFormsModule]
})
export class DatePickerModule {
}
