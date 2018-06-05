// Angular Imports
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { A3_CommonModule } from '../../../common';
import { BISTEL_SDKModule } from '../../../sdk/sdk.module';

// This Module's Components
import { InCondition } from './conditions/in-condition';
import { OutCondition } from './conditions/out-condition';
import { Properties } from './config/properties';
import { PdmReportComponent } from './pdm-report.component';
import { PdmReportChartConfig } from './config/chart.config';
import { ViewConfig } from './config/view.config';
import { BrowserModule } from '@angular/platform-browser'
import { PdmReportContentComponent } from './pdm-report-content/pdm-report-content.component';

@NgModule({
    imports: [
        A3_CommonModule,
        BISTEL_SDKModule,
        BrowserModule
    ],
    declarations: [
        PdmReportComponent,
        PdmReportContentComponent
    ],
    exports: [
        PdmReportComponent,
        PdmReportContentComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class PdmReportModule {
    static config(): any {
        return {
            component: PdmReportComponent,
            properties: Properties,
            inCondition: InCondition,
            outCondition: OutCondition,
            chartConfig: PdmReportChartConfig,
            viewConfig: ViewConfig,
            reportContent: PdmReportContentComponent
        };
    }
}
