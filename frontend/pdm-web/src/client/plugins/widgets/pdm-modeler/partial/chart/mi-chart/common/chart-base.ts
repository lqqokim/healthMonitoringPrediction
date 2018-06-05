import { AxisConfiguration, SeriesConfiguration } from './../model/index';
import { Axis } from './axis/index';
import { IDisplay } from './i-display.interface';
import { InstanceLoader } from './instance-loader';
import { ChartException } from '../common/error/index';
import { ChartEvent, ChartEventData, EventDispatcher, EventMap } from './event/index';
import { Series } from './series/index';
import { PluginCreator } from './plugin-creator';
import { ChartConfiguration } from '../model/chart.interface';
import { ArrayCollection } from './array-collection';
import { ChartPlugin } from './plugin/index';
import { MultiBrushPlugin } from './plugin/brush/multi-brush-plugin';

export class ChartBase implements IDisplay {

    colors = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
        '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'];

    min: number;
    max: number;
    selectedItem: Array<ChartEventData> = [];

    private _configuration: any;
    private _target: any; // target svg element
    private _width: number;
    private _height: number;
    private _axis: any[] = [];
    private _series: any[] = [];
    private _plugins: any[] = [];
    private _axisGroup: any; // axis group element
    private _seriesGroup: any; // series group element
    private _backgroundGroup: any; // background element
    private _dragGroup: any; // drag area element
    private _margin: any;
    private _domain: any;
    private _dataProvider: Array<any> = [];
    private _arrayCollection: ArrayCollection;
    private _instanceLoader: InstanceLoader;
    private _pluginLoader: PluginCreator;
    private _isStacked = false; // special series ( data parse )
    private _eventMap: EventMap = {}; // chart event list
    private _manuals = ['normal', 'zoom', 'multiselection'];
    private _current_manual = this._manuals[0];
    private OSName = 'none';
    private _isCtrlKey: boolean;

    private _offsetX: number;
    private _offsetY: number;
    private _moveX: number;
    private _moveY: number;
    private _isResetZoom: boolean;


    constructor( config?: ChartConfiguration ) {
        this._instanceLoader = new InstanceLoader();
        this._pluginLoader = new PluginCreator();
        if (config) {
            this.configuration = config;
            this._keyBind();
        }
    }

    set configuration( value: ChartConfiguration ) {
        this._configuration = value;
        if (this._configuration) {
            this.manual = 'multiselection';
            if ( this._configuration.chart.selectionMode ) {
                this.manual = this._configuration.chart.selectionMode;
            }
            if (!this._configuration.chart.data) {
                this._setDefaultData();
            } else {
                this.dataProvider = this._configuration.chart.data;
            }
            this.clear();
            this.margin = this.configuration.chart.margin;
            this._setSize(this.configuration.chart.size.width, this.configuration.chart.size.height);
            const eventDispatch: EventDispatcher = EventDispatcher.getInstance(this._configuration.chart.selector);
            this._createSvgElement();
            this._createComponent();
            // try {
            //     this._createSvgElement();
            //     this._createComponent();
            // } catch (e) {
            //     console.log(e instanceof ChartException);
            //     console.log('Error Code : ', e.status);
            //     console.log('Error Message : ', e.errorContent.message);
            // }
            this._addSvgEvent();
            this._addCustomEvent();
            setTimeout( () => {
                const currentEvent: ChartEventData = new ChartEventData(this, null, ChartEvent.CREATION_COMPLETE);
                dispatchEvent( new CustomEvent(ChartEvent.CREATION_COMPLETE, {detail: currentEvent}));
            }, 1000 );
        }
    }

    get configuration() {
        return this._configuration;
    }

    set manual(value: string) {
        const manualid = this._manuals.indexOf(value);
        if (manualid > -1) {

            this._current_manual = this._manuals[manualid];
            this.series.map((s: Series) => {
                s.manual = this._current_manual;
            });
        } else {
            throw new ChartException(500,
                {message: `not found manual type ${value}! Please select from ${this._manuals.toString()}`});
        }
    }

    set target( value: any ) {
        this._target = value;
    }

    get target(): any {
        return this._target;
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

    set dataProvider( data: any[] ) {
        this._arrayCollection = new ArrayCollection(data);
        this._arrayCollection.addEventListener(ArrayCollection.DATA_ADDED_ITEM, this._dataChangeEvent);
        this._arrayCollection.addEventListener(ArrayCollection.DATA_REMOVED_ITEM, this._dataChangeEvent);
        this.updateDisplay();
    }

    get dataProvider() {
        return this._arrayCollection.source;
    }

    getDataProvider() {
        return this._arrayCollection;
    }

    set axis( value: any[] ) {
        this._axis = this._createAxis(value);
    }

    get axis(): any[] {
        return this._axis;
    }

    set series( value: any[] ) {
        // TODO : series remove 로직 구현.
        if (this._series.length) {
            this._series.map((series: Series) => {
                series.removeAll();
            } );
        }
        this._series = this._createSeries(value);
    }

    get series(): any[] {
        return this._series;
    }

    set plugin( value: any[] ) {
        this._plugins = this._createPlugin(value);
    }

    get plugin() {
        return this._plugins;
    }

    set margin( value: any ) {
        this._margin = value;
    }

    get margin() {
        return this._margin;
    }

    set domain( value: any ) {
        this._domain = value;
    }

    get domain() {
        return this._domain;
    }

    addEventListener(type: string, method: any) {
        const selector = this.configuration.chart.selector;
        addEventListener(selector+ '-' + type, method);
    }

    dispatchEvent(type: string, event: ChartEventData) {
        if (this._eventMap[type]) {
            this._eventMap[type](event);
        }
    }

    updateDisplay(width?: number, height?: number) {
        if ( width && height ) {
            this.target
                .attr('width', width)
                .attr('height', height);
            this._setSize(width, height);
            this._backgroundGroup.select('.background-rect')
                .attr('width', width - this.margin.left - this.margin.right)
                .attr('height', height - this.margin.bottom - this.margin.top);
        }
        this._axisUpdate();
        this._seriesUpdate();
        this._pluginUpdate();
        // try {
        //
        // } catch (e) {
        //     console.log('Error Code : ', e.status);
        //     console.log('Error Message : ', e.errorContent.message);
        // }

    }

    enabledPlugin(pluginClass: string) {
        this._plugins.map((plugin: ChartPlugin)=> {
            if (plugin.className === pluginClass) {
                plugin.enabled();
            }
        });
    }

    disabledPlugin(pluginClass: string) {
        this._plugins.map((plugin: ChartPlugin)=> {
            if (plugin.className === pluginClass) {
                plugin.disabled();
            }
        });
    }

    clear() {
        if (this.target) {
            this.target.remove();
            this.target = null;
            this._axis = [];
            this._series = [];
            this._plugins = [];
            this.dataProvider = [];
        }
    }

    _dataChangeEvent = (type: string, targetValue: any) => {
        this.updateDisplay();
    }

    _keyBind() {
        if (navigator.appVersion.indexOf('Win') !== -1) { this.OSName = 'Win'; }
        if (navigator.appVersion.indexOf('Mac') !== -1) { this.OSName = 'Mac'; }
        if (navigator.appVersion.indexOf('X11') !== -1) { this.OSName = 'UNIX'; }
        if (navigator.appVersion.indexOf('Linux') !== -1) { this.OSName = 'Linux'; }

        const svgRect: any = this.target;
        svgRect.on('focus', () => {
            svgRect
                .on('keydown', () => {
                    this.manual = 'multiselection';
                    if ( this.OSName === 'Win' && d3.event.ctrlKey ) {
                        this._isCtrlKey = true;
                    } else if ( this.OSName === 'Mac' && d3.event.keyCode === 91 ) {
                        this._isCtrlKey = true;
                    } else {
                        this._isCtrlKey = false;
                    }
                })
                .on('keyup', () => {
                    this.manual = 'normal';
                    this._isCtrlKey = false;
                });
        }, svgRect);
    }

    _createSvgElement() {
        this.target = this._createSvg(this.configuration.chart);
        // create background element
        this._backgroundGroup = this.target.append('g')
            .attr('class', 'background')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        this._backgroundGroup.append('rect')
            .attr('class', 'background-rect')
            .style('fill', '#ccc')
            .style('pointer-events', 'all')
            .style('opacity', 0)
        ;
        // generate axis component using this.target
        this._axisGroup = this.target.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0 ,0)');
        // generate series component using this.target
        this._seriesGroup = this.target.append('g')
            .attr('class', 'series')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        this._dragGroup = this.target.append('g')
            .attr('class', 'draging')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    // generate svg element using configuration
    _createComponent() {
        // stacked check
        if (this.configuration.series) {
            this.configuration.series.map( (seriesConfig: SeriesConfiguration ) => {
                const type = seriesConfig.type;
                if (type === 'stacked') { // special case
                    this._isStacked = true;
                }
            } );
        }
        this.axis = this.configuration.axis;
        this.series = this.configuration.series;
        this.plugin = this.configuration.plugin;
    }

    _setSize(width: number, height: number)  {
        this.width = width - (this.margin.left + this.margin.right);
        this.height = height - (this.margin.top + this.margin.bottom);
    }

    _createSvg(chartConfig: any): any {
        return d3.select('#'+chartConfig.selector).append('svg')
            .attr('id', chartConfig.uid);
    }

    _createAxis(axisList: Array<any>) {
        const tempList = <any>[];
        if (!axisList) {
            return tempList;
        }

        axisList.map( (axisConfig: any) => {
            let axis: Axis;

            const axis_params: AxisConfiguration = {
                conditions: axisConfig,
                target: this._axisGroup,
                width: this.width,
                height: this.height,
                margin: this.margin,
                data: this.dataProvider,
                domain: this.domain,
                isStacked: this._isStacked
            };
            if (axisConfig.domain) {
                axis_params.domain = axisConfig.domain;
            }

            // axisConfig: any, axisTarget: any, width: number, height: number, margin: Array<any>, domain: any

            // case 1 : configuration
            axis = this._instanceLoader.axisFactory(axisConfig.axisClass, axis_params);

            // case 2 : properties
            // axis = this._instanceLoader.axisFactory(axisConfig.axisClass, null);
            // axis.configuration = axis_params;
            // axis.target = this._axisGroup;

            axis.updateDisplay( this.width, this.height );

            if (axis.numeric_max && axis.numeric_min) {
                this.min = axis.numeric_min;
                this.max = axis.numeric_max;
            }

            tempList.push(axis);
        });

        return tempList;
    }

    _createSeries(seriesList: Array<any>) {
        const tempList = <any>[];
        if (!seriesList) {
            return tempList;
        }

        if (seriesList.length) {
            seriesList.map( (seriesConfig: any, j: number) => {
                let series: any;
                const type = seriesConfig.type;
                const series_configuration: SeriesConfiguration = {
                    condition: seriesConfig,
                    margin: this.margin,
                    target: this._seriesGroup,
                    type: type,
                };
                if (seriesConfig.plugin) {
                    series_configuration.plugin = seriesConfig.plugin;
                }
                // case1 : configuration
                series = this._instanceLoader.seriesFactory(seriesConfig.seriesClass, series_configuration);

                // case2 : property
                // series = this._instanceLoader.seriesFactory(seriesConfig.seriesClass, null);
                // series.configuration = series_configuration;
                // series.target = this._seriesGroup;

                series.color = this.colors[j];
                if (type === 'group' || type === 'stacked') { // column set series
                    series.series = this._createSeries(seriesConfig.series);
                }
                // series.yAxe = _.find(this._axis, 'field', seriesConfig.yField);
                for ( let i = 0 ; i < this._axis.length; i++ ) {
                    if (this._axis[i].field.split(',').indexOf(seriesConfig.xField) > -1) {
                        series.xAxe =  this._axis[i].axe;
                        series.xAxe.name = this._axis[i].field;
                        break;
                    }
                }

                for ( let i = 0 ; i < this._axis.length; i++ ) {
                    if (this._axis[i].field.split(',').indexOf(seriesConfig.yField) > -1) {
                        series.yAxe =  this._axis[i].axe;
                        series.yAxe.name = this._axis[i].field;
                        break;
                    }
                }

                tempList.push(series);
            });
        }
        return tempList;
    }

    _createPlugin(pluginList: Array<any>) {
        const tempList = <any>[];
        if (pluginList && pluginList.length) {
            pluginList.map((plugin: any) => {
                plugin.margin = this.margin;
                const pluginObj = this._pluginLoader.pluginFactory(plugin.pluginClass, this.target, plugin);
                tempList.push(pluginObj);
            });
        }
        return tempList;
    }

    _axisUpdate() {
        if (this.axis.length === 0) {
            return;
        }
        for (let i = 0 ; i < this._axis.length; i++) {
            this.axis[i].dataProvider = this.dataProvider;
            this.axis[i].numeric_min = this.min;
            this.axis[i].numeric_max = this.max;
            this.axis[i].updateDisplay(this.width, this.height);
        }
    }

    _seriesUpdate() {
        if (this.series.length === 0) {
            return;
        }
        for (let i = 0; i < this.series.length; i++) {
            this.series[i].width = this.width;
            this.series[i].height = this.height;
            this.series[i].dataProvider = this.dataProvider;
        }
    }

    _pluginUpdate() {
        if (!this._plugins) {
            return;
        }
        for (let i = 0; i < this._plugins.length; i++) {
            this._plugins[i].updateDisplay(this.width, this.height);
            if (this._plugins[i].configuration.disable) {
                this._plugins[i].disabled();
            }
        }
    }

    _addSvgEvent() {
        const selector = this.configuration.chart.selector;
        this.target.on('mousedown', () => {

                this._offsetX = d3.event.offsetX - this.margin.left;
                if (d3.event.target) {
                    const currentEvent: ChartEventData = new ChartEventData(
                        d3.event,
                        d3.select(d3.event.target)[0][0].__data__);
                    if (currentEvent.data === undefined) {
                        if (!this._isCtrlKey) {
                            this.target.selectAll('*[class^=selection_box]').remove();
                            this.selectedItem = [];
                            this.series.map((s: Series) => {
                                s.unselectAll();
                            });
                        }
                    } else {
                        if (this._current_manual !== 'multiselection') {
                            this.selectedItem = [];
                        }
                        this.selectedItem.push(currentEvent);
                    }
                    dispatchEvent( new CustomEvent(selector + '-' + ChartEvent.ITEM_CLICK, { detail: currentEvent }));
                }
                this.target.on('mousemove', () => {
                    this._moveX = d3.event.offsetX - 10 - this.margin.left;
                    if ( this._moveX - this._offsetX < -20 ) {
                        this._isResetZoom = true;
                        const currentEvent: ChartEventData = new ChartEventData(this, null, ChartEvent.ZOOM_END);
                        dispatchEvent( new CustomEvent(ChartEvent.ZOOM_END, {detail: currentEvent}));
                    }
                })
            })
            .on('mouseup', () => {
                if (this._isResetZoom) {
                    this.resetZoom();
                    this._isResetZoom = false;
                }
                this.target.on('mousemove', null);

            })
            .on('mouseover', () => {
                if (d3.event.target) {
                    const overTarget: any = d3.select(d3.event.target);
                    const currentEvent: ChartEventData = new ChartEventData(
                        d3.event,
                        overTarget[0][0].__data__);
                    // TODO: TEXT 일 때도 pass why? axis일 경우 이기 때문
                    if (currentEvent.data && typeof currentEvent.data === 'object' ) {

                    }
                    dispatchEvent( new CustomEvent(selector + '-' + ChartEvent.MOUSE_OVER, { detail: currentEvent }));
                }
            })
            .on('mouseout', () => {
                if (d3.event.target) {
                    const currentEvent: ChartEventData = new ChartEventData(
                        d3.event,
                        d3.select(d3.event.target)[0][0].__data__);
                    dispatchEvent( new CustomEvent(selector + '-' + ChartEvent.MOUSE_OUT, { detail: currentEvent }));
                }
            });
    }

    _addCustomEvent() {
        this.target[0][0].addEventListener(ChartEvent.SELECT_ALL_ITEMS, (event: CustomEvent) => {
            this.selectedItem.push(event.detail.item);

            if (this.series.length === this.selectedItem.length) {
                const dispatchItem = {
                    item: this.selectedItem,
                    event: event.detail.event
                };
                dispatchEvent(new CustomEvent(ChartEvent.CONCAT_SELECT_ITEMS, {detail: dispatchItem}));
            }
        });
    }

    _setDefaultData() {
        const testData: Array<any> = [];
        for (let i = 0; i < 20; i++) {
            testData.push( {  category: 'A' + i,
                date: new Date(2017, 0, i).getTime(),
                rate: Math.round( Math.random() * 10 ),
                ratio: Math.round( Math.random() * 110  ),
                revenue: Math.round( Math.random() * 120  ),
                profit: Math.round( Math.random() * 100  ) } );
        }
        this.dataProvider = testData;
    }

    removeFromUid(className: string, uid: any) {
        if (this.target) {
            this.target.select(`.${className}-${uid}`).remove();
        }
        let multiBrush: MultiBrushPlugin = undefined;
        for (let i = 0; i < this._plugins.length ; i++) {
            if (this._plugins[i].className === 'MultiBrushPlugin') {
                multiBrush = this._plugins[i];
                break;
            }
        }
        if (multiBrush) {
            multiBrush.currentRectLength -= 1;
        }
    }

    removeUid(removeUid: any) {
        let multiBrush: MultiBrushPlugin = undefined;
        for (let i = 0; i < this._plugins.length ; i++) {
            if (this._plugins[i].className === 'MultiBrushPlugin') {
                multiBrush = this._plugins[i];
                break;
            }
        }
        if (multiBrush) {
            multiBrush.removeUidInArray(removeUid);
            multiBrush.removedUid = undefined;
        }
    }

    removeBrushRectEvent(className: string, uid: any) {
        if (this.target) {
            this.target.select(`.${className}-${uid}`).on('mousemove', null);
        }
    }

    removeOtherBrush() {
        let multiBrush: MultiBrushPlugin = undefined;
        for (let i = 0; i < this._plugins.length ; i++) {
            if (this._plugins[i].className === 'MultiBrushPlugin') {
                multiBrush = this._plugins[i];
                break;
            }
        }
        multiBrush.removeUids.map((ruid: number) => {
            this.target.select(`.brush-${ruid}`).remove();
        })
        const brushes: any = d3.selectAll('*[class^=brush-]');
        multiBrush.currentRectLength = brushes[0].length;
    }

        // custom zoom
    zoomXAxis(date: Array<any>) {

        const brushes: any = d3.selectAll('*[class^=brush-]');
        brushes.remove();

        const startX: number = new Date(date[0]).getTime();
        const endX: number = new Date(date[1]).getTime();
        this.axis.map((a: Axis) => {
            a.setDomain(startX, endX);
        });

        this._seriesUpdateForScale();
        this._pluginUpdate();

    }

    resetZoom() {
        this.axis.map((a: Axis) => {
            if (a.prevDomain) {
                a.setDomain(a.prevDomain[0], a.prevDomain[1]);
            }
        });
        this._seriesUpdateForScale();
        this._pluginUpdate();
    }

    _seriesUpdateForScale() {
        this.series.map((series: Series) => {
            for ( let i = 0 ; i < this._axis.length; i++ ) {
                if (this._axis[i].field.split(',').indexOf(series.xField) > -1) {
                    series.xAxe =  this._axis[i].axe;
                    series.xAxe.name = this._axis[i].field;
                    break;
                }
            }

            for ( let i = 0 ; i < this._axis.length; i++ ) {
                if (this._axis[i].field.split(',').indexOf(series.yField) > -1) {
                    series.yAxe =  this._axis[i].axe;
                    series.yAxe.name = this._axis[i].field;
                    break;
                }
            }
            series.updateDisplay(this.width, this.height);
        });
    }


}

