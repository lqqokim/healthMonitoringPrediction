import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextboxComponent } from './textbox.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        TextboxComponent
    ],
    exports: [
        TextboxComponent
    ],
    entryComponents: [TextboxComponent]
})
export class TextboxModule {
}
