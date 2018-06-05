import { Observable } from 'rxjs/Observable';
import { WidgetApi, WidgetConfigApi, ContextMenuTemplateInfo } from '../../../../common';
import { ContextMenuType } from '../../../../sdk';

export class PdmCurrentAnalysisChartConfig extends WidgetConfigApi {

    getChartConfig(type: string, info: any): any {
        return {};
    }

}
