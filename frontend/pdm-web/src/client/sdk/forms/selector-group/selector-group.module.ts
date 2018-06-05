import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiSelectorModule } from '../multi-selector/multi-selector.module';

import { SelectorGroupComponent } from './selector-group.component';
import { LocationSelectorComponent } from './partials/location-selector.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        MultiSelectorModule
    ],
    declarations: [
        SelectorGroupComponent,
        LocationSelectorComponent
    ],
    exports: [
        SelectorGroupComponent,
        LocationSelectorComponent
    ],
    entryComponents: [SelectorGroupComponent]
})
export class SelectorGroupModule {
}
