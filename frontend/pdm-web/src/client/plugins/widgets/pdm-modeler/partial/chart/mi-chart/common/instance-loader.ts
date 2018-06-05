import { DateTimeAxis, CategoryAxis, NumericAxis } from './component/axis/index';
import { ColumnSeries, LineSeries, ColumnSet, BarSeries, BarSet, PieSeries, PieSet, ImageSeries } from './component/series/index';
import { AxisConfiguration, SeriesConfiguration } from './../model/index';
import { ChartException } from './error/index';

export class InstanceLoader {
    instance: any;

    constructor() {
        this._settingInstance();
    }

    _settingInstance() {
        this.instance = {
            CategoryAxis: CategoryAxis,
            NumericAxis: NumericAxis,
            DateTimeAxis: DateTimeAxis,
            ColumnSeries: ColumnSeries,
            ColumnSet: ColumnSet,
            LineSeries: LineSeries,
            BarSeries: BarSeries,
            BarSet: BarSet,
            PieSeries: PieSeries,
            PieSet: PieSet,
            ImageSeries: ImageSeries
        };
    }

    _getCtor( name: string ): any {
        const instance: any = this.instance[name];
        if (!instance) {
            return null;
        } else {
            return instance;
        }
    }

    // name: string ,config: any, target: any, width: number, height: number, margin: Array<any>, domain: any
    axisFactory(name: string, axisparams: AxisConfiguration): any {
        const instance: any = this._getCtor(name);
        let classInstance: any;
        if (!instance) {
            throw new ChartException(404, {message: `not found axis component ${name}`});
        }
        classInstance = new instance(axisparams);
        return classInstance;
    }

    // name: string, config: any, target: any, margin: any
    seriesFactory(name: string, seriesparams: SeriesConfiguration): any {
        const instance: any = this._getCtor(name);
        if (!instance) {
            throw new ChartException(404, {message: `not found series component ${name}`});
        }
        let classInstance: any;
        classInstance = new instance(seriesparams);
        return classInstance;
    }
};

