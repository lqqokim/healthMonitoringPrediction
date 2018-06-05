import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatetimePickerComponent } from './partials/datetime-picker.component';
import { FromToComponent } from './partials/from-to.component';
import { DateRangeComponent } from './date-range.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        DatetimePickerComponent,
        FromToComponent,
        DateRangeComponent

    ],
    exports: [
        DatetimePickerComponent,
        FromToComponent,
        DateRangeComponent
    ],
    entryComponents: [DateRangeComponent]
})
export class DateRangeModule {
}
