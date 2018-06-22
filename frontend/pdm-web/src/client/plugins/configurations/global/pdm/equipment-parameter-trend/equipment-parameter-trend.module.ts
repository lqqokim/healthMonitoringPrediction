import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';
import { PluginCommonModule } from '../../../../common/plugins.common.module';

import { EquipmentParameterTrendComponent } from './equipment-parameter-trend.component';
import { EquipmentParameterTrendChartComponent} from './component/equipment-parameter-trend-chart/equipment-parameter-trend-chart.component';


@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        PluginCommonModule
    ],
    declarations: [
        EquipmentParameterTrendChartComponent,
        EquipmentParameterTrendComponent
    ],
    entryComponents: [
        EquipmentParameterTrendComponent
    ],
})
export class EquipmentParameterTrendModule {

    static config(): any {
        return {
            component: EquipmentParameterTrendComponent
        };
    }
}
