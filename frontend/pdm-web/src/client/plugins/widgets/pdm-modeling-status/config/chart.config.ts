import { WidgetConfigApi } from '../../../../common';

/*******************************************
 * getChartConfig(<info>)를 위젯에서 호출한다.
 *******************************************/
export class PdmModelingStatusChartConfig extends WidgetConfigApi {
    charts: any;
    data: any;
    tooltipFunction: any;
    addWindowFunction: any;

    getChartConfig(info: any):any {
        this.charts = info.charts;
        this.data = info.data;
        this.tooltipFunction = info.tooltipFunction;
        this.addWindowFunction = info.addWindowFunction;

        return {}; //getBistelChartConfig(this.data, this.tooltipFunction, this.addWindowFunction);
    }
}

