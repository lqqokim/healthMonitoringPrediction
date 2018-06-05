import { LegendConfiguration } from '../../model/index';
import { IDisplay } from './../i-display.interface';

export abstract class Legend implements IDisplay {

    colors = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
        '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'];
    _orient: string;
    _series_config: Array<any>;
    _target: any;
    _configuration: LegendConfiguration;
    _container: any;
    _width: number;
    _height: number;
    _chart_selector: string;

    constructor(legendConfig: LegendConfiguration, chartSelector: string) {
        this.configuration = legendConfig;
        this.series_config = this.configuration.series;
        this.orient = this.configuration.orient;
        this.chart_selector = chartSelector;
        this._createSvg();
        this._createContainer();
    }

    set series_config(value: any) {
        this._series_config = value;
        if (value[0].series !== undefined) {
            this._series_config = value[0].series;
        }
    }

    set chart_selector(value: string) {
        this._chart_selector = '#'+value;
    }

    get chart_selector() {
        return this._chart_selector;
    }

    get series_config() {
        return this._series_config;
    }

    set orient(value: string) {
        this._orient = value;
    }

    get orient() {
        return this._orient;
    }

    set target(value: any) {
        this._target = value;
    }

    get target() {
        return this._target;
    }

    set configuration(value: any) {
        this._configuration = value;
    }

    get configuration() {
        return this._configuration;
    }

    set container(value: any) {
        this._container = value;
    }

    get container() {
        return this._container;
    }

    set width( value: number ) {
        this._width = value;
    }

    get width(): number {
        return this._width;
    }

    set height( value: number ) {
        this._height = value;
    }

    get height() {
        return this._height;
    }

    _createSvg() {
        this.target = d3.select(this.configuration.selector).append('svg');
    }

    _createContainer() {
        this.container = this.target.append('g');
    }

    clear() {
        if (this.target) {
            this.target.remove();
            this.target = null;
        }
    }

    updateDisplay(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.target
            .attr('width', width)
            .attr('height', height);
    }

}
