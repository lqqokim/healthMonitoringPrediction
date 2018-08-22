import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

import { AnalysisToolComponent } from './analysis-tool.component';
import {MultiSelectComboComponent } from './component/multi-select-combo/multi-select-combo.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
    ],
    declarations: [
        AnalysisToolComponent,
        MultiSelectComboComponent,
    ],
    entryComponents: [
        AnalysisToolComponent
    ],
    exports:[MultiSelectComboComponent]
})
export class AnalysisToolModule {

    static config(): any {
        return {
            component: AnalysisToolComponent
        };
    }
}