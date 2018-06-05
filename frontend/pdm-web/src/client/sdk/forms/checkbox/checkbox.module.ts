import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckboxComponent } from './checkbox.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        CheckboxComponent
    ],
    exports: [
        CheckboxComponent
    ],
    entryComponents: [CheckboxComponent]
})
export class CheckboxModule {
}
