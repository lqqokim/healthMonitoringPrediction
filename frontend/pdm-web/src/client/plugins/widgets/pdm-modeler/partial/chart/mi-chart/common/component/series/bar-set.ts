import { BarSeries } from './bar-series';
import { IDisplay } from './../../i-display.interface';
import { Axe } from './../../axis/index';
import { SeriesConfiguration } from './../../../model/index';
import { Dragable } from '../../plugin/drag-selector/model/drag-model';
import { Series } from '../../series/series';
import { PluginCreator } from '../../plugin-creator';

export class BarSet implements IDisplay {

    private _width: number;
    private _height: number;
    private _target: any;
    private _type: string;
    private _xAxe: Axe;
    private _yAxe: Axe;
    private _x: any;
    private _y: any;
    private _manual: string;
    private _seriesCnt: number;
    private _series: Array<BarSeries>;
    private _configuration: SeriesConfiguration;
    private _dataProvider: Array<any>;
    private _pluginLoader: PluginCreator;
    private _componentPlugin: Array<any> = [];

    constructor(configuration?: SeriesConfiguration) {
        if (configuration) {
            this.configuration = configuration;
        }
    }

    set configuration(value: any) {
        this._pluginLoader = new PluginCreator();
        this._configuration = value;
        if (this._configuration) {
            this.type = this._configuration.type;
            this.target = this._configuration.target;
        }
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

    set series(value: Array<BarSeries>) {
        this._series = value;
        if (this._series) {
            this._seriesCnt = this._series.length;
        }
    }
    get series(): Array<BarSeries> {
        return this._series;
    }

    set type(value: string) {
        this._type = value;
        console.log('set type : ', this._type);
    }

    get type(): string {
        return this._type;
    }

    set xAxe( value: Axe ) {
        this._xAxe = value;
    }

    get xAxe(): Axe {
        return this._xAxe;
    }

    set yAxe( value: Axe ) {
        this._yAxe = value;
    }

    get yAxe(): Axe {
        return this._yAxe;
    }

    set x(value: any) {
        this._x = value;
    }

    get x(): any {
        return this._x;
    }

    set y(value: any) {
        this._y = value;
    }

    get y(): any {
        return this._y;
    }

    set dataProvider( data: any[] ) {
        this._dataProvider = data;
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
            this.series[i].type = this.type;
            this.series[i].stackField = fieldSet;
            this.series[i].dataProvider = this._dataProvider;
        }
        this._pluginCreate();
    }

    _pluginCreate() {

        if (this._configuration.plugin) {
            this._configuration.plugin.map((p: any) => {
                this._componentPlugin.push(this._pluginLoader.pluginFactory(p.pluginClass, this.target, p));
            });
        }
        this._componentPlugin.map((p: any) => {
            for ( let i = 0; i < this.series.length; i++ ) {
                p.seriesInfo = this.series[i];
                p.updateDisplay();
            }
        });
    }

    unselectAll() {
        for ( let i = 0; i < this.series.length; i++ ) {
            this.series[i].unselectAll();
        }
    }
    selectAll(event: Dragable) {
        for ( let i = 0; i < this.series.length; i++ ) {
            this.series[i].selectAll(event);
        }
    }
}
