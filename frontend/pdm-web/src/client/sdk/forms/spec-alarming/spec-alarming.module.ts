import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpecAlarmingComponent } from './spec-alarming.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        SpecAlarmingComponent
    ],
    exports: [
        SpecAlarmingComponent
    ],
    entryComponents: [SpecAlarmingComponent]
})
export class SpecAlarmingModule {
}
