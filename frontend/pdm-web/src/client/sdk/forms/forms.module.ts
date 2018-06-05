import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DateRangeModule } from './date-range/date-range.module';
import { MultiSelectorModule } from './multi-selector/multi-selector.module';
import { SelectorGroupModule } from './selector-group/selector-group.module';
import { SelectorGroupService } from './selector-group/selector-group.service';
import { SpecAlarmingModule } from './spec-alarming/spec-alarming.module';
import { TextboxModule } from './textbox/textbox.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { ManualTimelineModule } from './manual-timeline/manual-timeline.module';
import { SelectorModule } from "./selector/selector.module";

import { FormBuilderService } from './builder/form-builder.service';
import { DynamicFormComponent } from './builder/dynamic-form.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        DateRangeModule,
        MultiSelectorModule,
        SelectorGroupModule,
        SpecAlarmingModule,
        TextboxModule,
        CheckboxModule,
        SelectorModule,
        ManualTimelineModule
    ],
    declarations: [
        DynamicFormComponent
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,

        DynamicFormComponent,

        DateRangeModule,
        MultiSelectorModule,
        SelectorGroupModule,
        SpecAlarmingModule,
        TextboxModule,
        CheckboxModule,
        SelectorModule,
        ManualTimelineModule
    ],
    entryComponents: [DynamicFormComponent]
})
export class BISTEL_FormsModule {
    static forProviders(): any[] {
        return <any>[
            SelectorGroupService,
            FormBuilderService
        ];
    }
}
