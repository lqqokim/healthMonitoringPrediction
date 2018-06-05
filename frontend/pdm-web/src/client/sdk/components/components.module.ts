import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefreshClockComponent } from './clock/refresh-clock.component';
import { SliderbarComponent } from './sliderbar/sliderbar.component';
import { TwitterBootstrapModule } from './bootstrap/twitter-bootstrap.module';
import { FilterSelect } from './filter-selector/filter-selector';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { FilterColorSelect } from './filter-selector/filter-color-selector';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
    imports: [
        FormsModule,
        PipesModule,
        CommonModule,
        DirectivesModule
    ],
    declarations: [
        RefreshClockComponent,
        SliderbarComponent,
        FilterSelect,
        FilterColorSelect
    ],
    exports: [
        RefreshClockComponent,
        TwitterBootstrapModule,
        FilterSelect,
        FilterColorSelect
    ]
})
export class BISTEL_ComponentsModule {
    static forProviders(): any[] {
        return <any>[
        ];
    }
}
