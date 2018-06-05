import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManualTimelineComponent } from './manual-timeline.component';
import { DateRangeModule } from '../date-range/date-range.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        DateRangeModule
    ],
    declarations: [
        ManualTimelineComponent
    ],
    exports: [
        ManualTimelineComponent
    ],
    entryComponents: [ManualTimelineComponent]
})
export class ManualTimelineModule {
}
