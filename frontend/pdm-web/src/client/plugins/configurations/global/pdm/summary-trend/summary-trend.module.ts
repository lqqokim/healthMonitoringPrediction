import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { PluginCommonModule } from '../../../../common/plugins.common.module';

import { SummaryTrendComponent } from './summary-trend.component';
import { SummaryTrendChartComponent} from './component/summary-trend-chart/summary-trend-chart.component';

import { AngularSplitModule } from 'angular-split';

@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        PluginCommonModule,
        AngularSplitModule
        
    ],
    declarations: [
        SummaryTrendComponent,
        SummaryTrendChartComponent,
    ],
    entryComponents: [
        SummaryTrendComponent
    ],
})
export class SummaryTrendModule {

    static config(): any {
        return {
            component: SummaryTrendComponent
        };
    }
}
