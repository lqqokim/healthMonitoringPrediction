import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MultiSelectorComponent } from '../multi-selector/multi-selector.component';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        PipesModule,
        DirectivesModule
    ],
    declarations: [
        MultiSelectorComponent
    ],
    exports: [
        MultiSelectorComponent
    ],
    entryComponents: [MultiSelectorComponent]
})
export class MultiSelectorModule {
}
