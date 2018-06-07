import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { FilterAnalysisComponent } from './filter-analysis.component';
import {MultiSelectComboComponent } from './component/multi-select-combo/multi-select-combo.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        FilterAnalysisComponent,
        MultiSelectComboComponent,
    ],
    entryComponents: [
        FilterAnalysisComponent
    ],
    exports:[MultiSelectComboComponent]
})
export class FilterAnalysisModule {

    static config(): any {
        return {
            component: FilterAnalysisComponent
        };
    }
}
