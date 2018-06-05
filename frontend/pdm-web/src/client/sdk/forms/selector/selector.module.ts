import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectorComponent } from './selector.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        SelectorComponent
    ],
    exports: [
        SelectorComponent
    ],
    entryComponents: [SelectorComponent]
})
export class SelectorModule {
}
