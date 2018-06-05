import { PieSeries } from './pie-series';
import { IDisplay } from './../../i-display.interface';
import { SeriesConfiguration } from './../../../model/index';
import { Series } from '../../series/series';

export class PieSet implements IDisplay {

    private _width: number;
    private _height: number;
    private _target: any;
    private _seriesCnt: number = 0;
    private _radius: number;
    private _manual: string;
    private _series: Array<PieSeries>;
    private _configuration: SeriesConfiguration;
    private _dataProvider: Array<any>;

    constructor(configuration?: SeriesConfiguration) {
        if (configuration) {
            this.configuration = configuration;
        }
    }

    set configuration(value: any) {
        this._configuration = value;
    }

    set width(value: number) {
        this._width = value;
    }

    get width(): number {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }

    get height(): number {
        return this._height;
    }

    set target(value: any) {
        this._target = value;
    }

    get target(): any {
        return this._target;
    }

    set radius(value: number) {
      this._radius = value;
    }

    get radius() {
      return this._radius;
    }

    set series(value: Array<PieSeries>) {
        this._series = value;
        if (this._series) {
            this._seriesCnt = this._series.length;
        }
    }
    get series(): Array<PieSeries> {
        return this._series;
    }

    set dataProvider( data: any[] ) {
        this._dataProvider = data;
        this.radius = Math.min(this.width, this.height) / 2;
        this.updateDisplay(this.width, this.height);
    }

    get dataProvider() {
        return this._dataProvider;
    }

    set manual(value: string) {
        this._manual = value;
        this.series.map((s: Series) => {
            s.manual = this.manual;
        });
    }

    get manual() {
        return this._manual;
    }

    updateDisplay(width?: number, height?: number) {
        const fieldSet: Array<string> = this.series.map((d: Series) => { return d.xField; });
        for ( let i = 0; i < this.series.length; i++ ) {
            this.series[i].seriesCnt = this.series.length;
            this.series[i].seriesIndex = i;
            this.series[i].width = width;
            this.series[i].height = height;
            this.series[i].xField = fieldSet[i];
            this.series[i].radius = this.radius / this.series.length;
            this.series[i].dataProvider = this._dataProvider;
        }
    }
}
