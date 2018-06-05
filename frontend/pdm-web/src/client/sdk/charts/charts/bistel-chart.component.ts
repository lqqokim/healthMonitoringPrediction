import {
    Component,
    ElementRef,
    OnChanges,
    OnInit,
    DoCheck,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { SpinnerComponent } from '../../popup/spinner/spinner.component';
import { ISpinner} from '../../popup/spinner/spinner.interface';
import { ChartApi } from './chart.api';

$.jqplot.config = {
    enablePlugins: true,
    defaultHeight: 300,
    defaultWidth: 400,
    UTCAdjust: false,
    timezoneOffset: new Date(new Date().getTimezoneOffset() * 60000),
    errorMessage: '',
    errorBackground: '',
    errorBorder: '',
    errorFontFamily: '',
    errorFontSize: '',
    errorFontStyle: '',
    errorFontWeight: '',
    catchErrors: false,
    defaultTickFormatString: '%.1f',
    // TODO : color 변경해야함.
    defaultColors: ['#2196f3', '#ff9800', '#4caf50', '#9c27b0', '#ffdf07', '#3f51b5', '#795548', '#673ab7', '#ff538d', '#00d2d4', '#ffc107', '#98d734', '#607d8b', '#9e9e9e', '#708090', '#fffacd', '#ee82ee', '#ffc0cb', '#48d1cc', '#adff2f', '#f08080', '#808080', '#ff69b4', '#cd5c5c', '#ffa07a', '#0000ff'],
    // defaultColors: ['#00ff00', '#000080', '#cccc00', '#800080', '#ffa500', '#00ffff', '#dc143c', '#191970', '#4682b4', '#9400d3', '#f0e68c', '#1e90ff', '#00ff7f', '#ff1493', '#708090', '#fffacd', '#ee82ee', '#ffc0cb', '#48d1cc', '#adff2f', '#f08080', '#808080', '#ff69b4', '#cd5c5c', '#ffa07a', '#0000ff'],
    defaultNegativeColors: ['#ff00ff', '#ffff7f', '#3434ff', '#7fff7f', '#005aff', '#ff0000', '#23ebc3', '#e6e68f', '#b97d4b', '#6bff2c', '#0f1973', '#e16f00', '#ff0080', '#00eb6c', '#8f7f6f', '#000532', '#117d11', '#003f34', '#b72e33', '#5200d0', '#0f7f7f', '#7f7f7f', '#00964b', '#32a3a3', '#005f85', '#ffff00'],
    dashLength: 4,
    gapLength: 4,
    dotGapLength: 2.5,
    loaderTemplate: null
};

@Component({
    selector: 'a3c-bistel-chart, div[a3c-bistel-chart]',
    template: `
        <div a3-spinner #chartSpinner type="'component'"></div>
        <div #chartGenerator style='width:100%;height:100%'></div>
    `,
    // template: '',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    // host: {
    //     'style': 'height: 100%; width: 100%;'
    // }
})
export class BistelChartComponent extends ChartApi implements OnChanges, OnInit, DoCheck, OnDestroy, ISpinner {
    baseType: string = 'bistel';
    uuid: string;
    DEBOUNCE_TIME: number = 200;

    @Input() config: any;
    @Input() data: any;
    @Input() series: any;
    @Input() overlayObjects: any[];
    @Input() windowObjects: any[];
    @Input() specWindows: any[];
    @Input() eventLines: any[];
    @Input() chartEvents: any;
    @Output() completeChart: EventEmitter<any> = new EventEmitter();
    @ViewChild('chartGenerator') chartGeneratorEl: ElementRef;
    @ViewChild('chartSpinner') spinnerEl: SpinnerComponent;

    private _data: any;
    private _config: any;
    private _plot: any;
    // private _chartEl: any;
    private _subscription: any;
    private _previewSize: any = { width: 0, height: 0 };
    private _currentSize: any = { width: 0, height: 0 };

    private _loader: any;
    private _elem: any;
    private _dataChanged: boolean = false;
    private _chartEvents: any;

    private _oldSeries:any[] = [];
    private _oldOverlayObjects:any[] = [];
    private _oldWindowObjects:any[] = [];
    private _oldSpecWindows:any[] = [];
    private _oldEventLines:any[] = [];

    // private _spinner: SpinnerComponent;

    static getDefaultConfig(): any {
        return {
            defaultGridPadding: { top: 10, right: 10, bottom: 23, left: 10 },
            title: '',
            captureRightClick: true,
            multiCanvas: false,
            copyData: false,
            stackSeries: false,
            showLoader: true,
            legend: {
                renderer: $.jqplot.EnhancedLegendRenderer,
                show: true,
                showLabels: true,
                showSwatch: true,
                border: 0,
                rendererOptions: {
                    numberColumns: 1,
                    seriesToggle: 'fast',
                    disableIEFading: false
                },
                placement: 'outsideGrid',
                shrinkGrid: true,
                location: 'e'
            },
            seriesDefaults: {
                renderer: $.jqplot.LineRenderer,
                rendererOptions: {
                    highlightMouseOver: false,
                    highlightMouseDown: false
                },
                shadow: false,
                showLine: true,
                showMarker: true,
                lineWidth: 1,
                isDragable: false,
                stackSeries: false,
                showHighlight: true,
                xaxis: 'xaxis',
                yaxis: 'yaxis',
                strokeStyle: 'rgba(100,100,100,1)',
                breakOnNull: true,
                highlightMouseOver: false,
                markerOptions: {
                    shadow: false,
                    style: 'filledCircle',
                    fillRect: false,
                    strokeRect: false,
                    lineWidth: 1,
                    stroke: true,
                    size: 7,
                    allowZero: true,
                    printSize: false
                },
                dragable: {
                    constrainTo: 'x'
                },
                trendline: {
                    show: false
                },
                pointLabels: {
                    show: false
                }
            },
            series: [],
            sortData: false,
            canvasOverlay: {
                show: true,
                objects: []
            },
            grid: {
                borderWidth: 1,
                marginLeft: '0',
                gridLineWidth: 1,
                background: '#fff',
                borderAntiAliasing: false,
                drawBorder: true,
                drawGridlines: true,
                shadow: false
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.LinearAxisRenderer,
                    rendererOptions: {
                        tickInset: 0.2,
                        minorTicks: 3
                    },
                    drawMajorGridlines: false,
                    drawMinorTickMarks: true,
                    showMinorTicks: true,
                    autoscale: true,
                    tickOptions: {
                        markSize: 6,
                        fontSize: '10px'
                    }
                },
                yaxis: {
                    showMinorTicks: true,
                    drawMajorGridlines: false,
                    renderer: $.jqplot.LinearAxisRenderer,
                    autoscale: true,
                    rendererOptions: {
                        //forceTickAt0: true,
                        minorTicks: 3
                    },
                    padMin: 1,
                    padMax: 1,
                    tickOptions: {
                        markSize: 4,
                        renderer: $.jqplot.CanvasAxisTickRenderer,
                        fontSize: '10px',
                        formatString: '%d'
                    },
                    labelOptions: {
                        fontSize:'10pt',
                        fontFamily: 'arial, sans-serif'
                    },
                    useSeriesColor: false
                }
            },
            noDataIndicator: {
                show: true,
                indicator: '',
                axes: {
                    xaxis: {
                        showTicks: false
                    },
                    yaxis: {
                        showTicks: false
                    }
                }
            },
            cursor: {
                zoom: true,
                style: 'auto',
                showTooltip: false,
                draggable: false,
                dblClickReset: false
            },
            highlighter: {
                show: true,
                tooltipLocation: 'ne',
                fadeTooltip: false,
                tooltipContentEditor: null,
                tooltipFormatString: '%s %s',
                useAxesFormatters: false,
                bringSeriesToFront: true,
                contextMenu: true,
                contextMenuSeriesOptions: {},
                contextMenuBackgroundOptions: {},
                clearTooltipOnClickOutside: false,
                overTooltip: false,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: false
                }
            },
            groupplot: {
                show: false
            },
            pointLabels: {
                show: false
            },
            canvasWindow: {
                show: false
            },
            eventLine: {
                show: false
            },
            multiSelect: {
                show: true
            }
        };
    }

    constructor() {
        super();
    }

    // constructor(protected chartEl: ElementRef) {
    //     this._chartEl = chartEl.nativeElement;
    //     this._elem = $(this._chartEl);
    // }

    ngOnChanges(changes: SimpleChanges) {
        this._onChanges(changes);
    }

    ngOnInit() {
        // this.__listenResizing();
        // this._elem = $(this.chartGeneratorEl);
        // this.setChartEl(this.chartGeneratorEl);
        // this.setSpiner(this.spinnerEl);
    }

    ngDoCheck() {
        this._doCheck();
    }

    ngOnDestroy() {
        this.destroy();
    }

    createChart() {
        if (this._data && this._config) {
            if (this._elem.is(':visible') && this._elem.width() > 0 && this._elem.height() > 0) {
                if (!_.isArray(this._data)) {
                    this._hideLoader();
                    return;
                }

                if (this._loader) {
                    this._loader.detach();
                }

                this._dataChanged = false;

                if (this._plot) {
                    this._plot.destroy();
                }
                this._elem.empty();
                this._elem.unbind();

                if (this._loader) {
                    this._elem.append(this._loader);
                }

                if ($.isPlainObject(this._chartEvents)) {
                    $.each(this._chartEvents, (key: string, eventCallback: any) => {
                        this._elem.unbind(key);
                        this._elem.bind(key, eventCallback);
                    });
                }

                this._elem.bind('jqplotLegendResize', (ev: any, width: number, height: number) => {
                    this._config.legend._width = width;
                    this._config.legend._height = height;
                });

                this._elem.bind('jqPlot.multiSelected', (ev, selected, plot) => {
                    this._config.multiSelect.selected = selected;
                });

                try {
                    this._dataChanged = false;
                    this._elem.jqplot(this._data, this._config);
                    this.chart = this._plot = this._elem.data('jqplot');
                    if (this.config) {
                        this.config.plot = this._plot;
                    }
                } catch (e) {
                    console.log(e.stack);
                } finally {
                    this._hideLoader();
                }
            } else {
                this._dataChanged = true;
            }
            this._emitChart();
            this._setEventCanvasMove();
        }
    }

    destroy() {
        if (this._plot) {
            this._plot.destroy();
            this._plot = null;
        }

        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
    }

    setResize({width = 0, height = 0}) {
        if (!this._elem.is(':visible') || this._elem.find('canvas').length === 0) {
            return;
        }

        const plot = this._plot;

        try {
            if (plot && plot.target && plot.target.is(':visible') && plot.target.width() && plot.target.height()
                && (plot.target.width() !== plot.baseCanvas._elem.width() || plot.target.height() !== plot.baseCanvas._elem.height())) {
                if (width) {
                    this._elem.width(width);
                } else {
                    this._elem.css({
                        width: '100%'
                    });
                }
                if (height) {
                    this._elem.height(height);
                } else {
                    this._elem.css({
                        height: '100%'
                    });
                }

                if (plot.plugins.cursor && plot.plugins.cursor._zoom && plot.plugins.cursor._zoom.isZoomed) {
                    $.each(plot.axes, (axisName: any, axis: any) => {
                        if (axis != null && axis._options && axis._options.show !== false && axis.renderer.constructor === $.jqplot.LinearAxisRenderer) {
                            if (axis.tickInset) {
                                axis.min = axis.min + axis.tickInset * axis.tickInterval;
                                axis.max = axis.max - axis.tickInset * axis.tickInterval;
                            }
                            axis.ticks = [];
                            axis._ticks = [];
                            axis.tickInterval = null;
                            axis.numberTicks = null;
                        }
                    });
                    plot.replot();
                } else {
                    plot.replot({ resetAxes: this.getResetAxes() });
                }
            }
        } catch (e) {
            console.log('target removed');
        }
        this._setEventCanvasMove();
    }

    getResetAxes() {
        const newAxes: any = {};
        const chartOptions: any = $.extend(true, {}, BistelChartComponent.getDefaultConfig(), this._config);

        $.each(chartOptions.axes, (axisName: any, ax: any) => {
            if (ax === null) return;
            if (ax.show !== false) {
                newAxes[axisName] = {
                    min: ax.min,
                    max: ax.max
                };
            } else if (ax.autoscale) {
                newAxes[axisName] = true;
            } else {
                newAxes[axisName] = {
                    min: ax.min,
                    max: ax.max
                };
            }
        });

        return newAxes;
    }

    replot(options:any = {}) {
        if (this._plot && this._plot.plugins.cursor && this._plot.plugins.cursor._zoom && this._plot.plugins.cursor._zoom.isZoomed) {
            $.each(this._plot.axes, (axisName, axis) => {
                if (axis !== null && axis._options && axis._options.show !== false && axis.renderer.constructor === $.jqplot.LinearAxisRenderer) {
                    if (axis.dataType === 'index') {
                        axis.min = axis.__min;
                        axis.max = axis.__max;
                    } else if (axis.tickInset) {
                        axis.min = axis.min + axis.tickInset * axis.tickInterval;
                        axis.max = axis.max - axis.tickInset * axis.tickInterval;
                    }
                    axis.ticks = [];
                    axis._ticks = [];
                    axis.tickInterval = null;
                    axis.numberTicks = null;
                }
            });
            this._plot.replot(options);
        } else {
            this._plot.replot($.extend(true, {}, {resetAxes: this._getReplotAxes()}, options));
        }
        this._setEventCanvasMove();
    }

    private _changeSeries(newValue, oldValue) {
        if (this._plot && this._plot.data.length > 0 && this._plot.data.length !== newValue.length) {
            var addedSeries = _.difference(newValue, oldValue).filter((series) => {
                return _.isArray(series.data) && series.data.length > 0;
            });
            var removedSeries = _.difference(oldValue, newValue);
            if (removedSeries.length) {
                removedSeries.forEach((series) => {
                    var seriesIndex = oldValue.indexOf(series);
                    if (seriesIndex > -1) {
                        this._plot.data.splice(seriesIndex, 1);
                        this._plot.series.splice(seriesIndex, 1);
                        this._plot.seriesStack.splice(this._plot.series.length, 1);
                    }
                });
                this._plot.replot({resetAxes: this.getResetAxes()});
            }
            if (addedSeries.length) {
                this._plot.addSeries(addedSeries, true);
            }
        } else if (_.isArray(newValue)) {
            var hasData = false;
            newValue.forEach((series) => {
                if (_.isArray(series.data) && series.data.length > 0) {
                    this.data.push(series.data);
                    hasData = true;
                }
            });

            if (hasData) {
                this.createChart();
            }
        }
    }

    private _getReplotAxes() {
        var newAxes = {};
        var axes = this._plot.axes;
        $.each(this._plot.options.axes, (axisName, ax) => {
            if (ax === null) return;
            if (ax.rendererOptions && ax.rendererOptions.dataType === 'index') {
                axes[axisName].tempCalcMin = null;
                axes[axisName].tempCalcMax = null;
                axes[axisName].tempCalcResult_p2u = null;
                axes[axisName].tempCalcResult_u2p = null;
                axes[axisName].tempCalcResult_u2p = null;
                newAxes[axisName] = {
                    min: ax.min,
                    max: ax.max
                };
            } else if (ax.show !== false) {
                newAxes[axisName] = {
                    min: ax.min,
                    max: ax.max
                };
            } else if (ax.autoscale) {
                newAxes[axisName] = true;
            } else {
                newAxes[axisName] = {
                min: ax.min,
                max: ax.max
                };
            }
        });
        return newAxes;
    }

    private _arrayDiff(arr1: any[], arr2: any[]): boolean {
        if (arr1.length !== arr2.length) {
            return true;
        }
        let i: number;
        let l: number = arr1.length;
        for (i=0; i < l; i++) {
            if (arr1[i] !== arr2[i]) {
                return true;
            }
        }
        return false;
    }

    private _doCheck() {
        // series
        if (this.series && this._arrayDiff(this._oldSeries, this.series)) {
            console.log('_doCheck series');
            this._changeSeries(this.series, this._oldSeries);
            this._oldSeries = this.series.slice();
        }

        // overlayObjects
        if (this.overlayObjects && this._arrayDiff(this._oldOverlayObjects, this.overlayObjects)) {
            console.log('_doCheck overlayObjects');
            this._drawCanvasOverlay(this.overlayObjects);
            this._oldOverlayObjects = this.overlayObjects.slice();
        }

        // windowObjects
        if (this.windowObjects && this._arrayDiff(this._oldWindowObjects, this.windowObjects)) {
            console.log('_doCheck windowObjects');
            this._drawCanvasWindow(this.windowObjects);
            this._oldWindowObjects = this.windowObjects.slice();
        }

        // specWindows
        if (this.specWindows && this._arrayDiff(this._oldSpecWindows, this.specWindows)) {
            console.log('_doCheck specWindows');
            this._drawSpecWindow(this.specWindows);
            this._oldSpecWindows = this.specWindows.slice();
        }

        // eventLines
        if (this.eventLines && this._arrayDiff(this._oldEventLines, this.eventLines)) {
            console.log('_doCheck eventLines');
            this._drawEventLine(this.eventLines);
            this._oldEventLines = this.eventLines.slice();
        }
    }

    private _onChanges(changes: SimpleChanges) {
        // console.log('_onChanges : ', changes);
        const data = changes['data'];
        const config = changes['config'];
        const series = changes['series'];
        const overlayObjects = changes['overlayObjects'];
        const windowObjects = changes['windowObjects'];
        const specWindows = changes['specWindows'];
        const chartEvents = changes['chartEvents'];
        const eventLines = changes['eventLines'];
        let funcs: any[] = [];

        // first time
        if (data && data.isFirstChange()) {
            // set unique id for chart element
            //this._setIdAttribute();

            this.setChartEl(this.chartGeneratorEl);
            this.setSpiner(this.spinnerEl);
            this._elem = $(this.chartGeneratorEl.nativeElement);
            //this._elem.height(this._elem.parent().height());
            this.__listenResizing();
            // this.listenResizing();

            if (chartEvents) this._chartEvents = chartEvents.currentValue;
        }

        if (data && data.currentValue) {
            this._data = data.currentValue;
        }
        if (config && config.currentValue) {
            this._config = $.extend(true, {}, BistelChartComponent.getDefaultConfig(), config.currentValue);
        }
        if (series && series.currentValue) {
            //this._oldSeries = series.currentValue.slice();
            if (_.isArray(series.currentValue)) {
                this._oldSeries = series.currentValue.slice();
            } else {
                this._oldSeries = Object.assign({}, series.currentValue);
            }
        }

        if (overlayObjects && overlayObjects.currentValue && this._config.canvasOverlay && this._config.canvasOverlay.show) {
            this._config.canvasOverlay.objects = overlayObjects.currentValue;
            funcs.push( () => this._drawCanvasOverlay(overlayObjects.currentValue) );
            this._oldOverlayObjects = overlayObjects.currentValue.slice();
        }

        if (windowObjects && windowObjects.currentValue && this._config.canvasWindow && this._config.canvasWindow.show) {
            this._config.canvasWindow.objects = windowObjects.currentValue;
            funcs.push( () => this._drawCanvasWindow(windowObjects.currentValue) );
            this._oldWindowObjects = windowObjects.currentValue.slice();
        }

        if (specWindows && specWindows.currentValue && this._config.specWindow && this._config.specWindow.show) {
            this._config.specWindow.objects = specWindows.currentValue;
            funcs.push( () => this._drawSpecWindow(specWindows.currentValue) );
            this._oldSpecWindows = specWindows.currentValue.slice();
        }

        if (eventLines && eventLines.currentValue && this._config.eventLine && this._config.eventLine.show) {
            this._config.eventLine.events = eventLines.currentValue;
            funcs.push( () => this._drawEventLine(eventLines.currentValue) );
            this._oldEventLines = eventLines.currentValue.slice();
        }

        if (data && (data.currentValue !== data.previousValue || this._plot === undefined)) {
            const newData = data.currentValue;
            const oldData = data.previousValue;
            if (newData === null && (oldData === null || (_.isArray(oldData) && oldData.length === 0))) {
                return;
            } else {
                this.createChart();
            }
        } else if (this._data && config) {
            try {
                this._optionChange(this._config);
            } catch (e) {
                this.createChart();
            }
        } else if (this._plot && funcs.length > 0) {
            funcs.forEach((func) => {
                func();
            });
        }

        funcs = null;
    }

    private _emitChart() {
        this.completeChart.emit({ component: this });
    }

    private _isChangeSize() {
        this._setCurrentSize();

        if (this._previewSize.width !== this._currentSize.width
            || this._previewSize.height !== this._currentSize.height) {
            this._previewSize = this._currentSize;
            return true;
        } else {
            return false;
        }
    }

    private __listenResizing() {
        const chartParentDOM = this.chartEl.parentElement;
        let lazyLayout = _.debounce((evt) => {
            if (!evt || !evt.target) {
                console.warn('Chart DOM resize evt NULL');
                return;
            }
            const size = {};

            if (this._plot) {
                this.setResize(size);
            } else {
                return;
            }
            // this.setResize(size);
        }, this.DEBOUNCE_TIME);

        $(chartParentDOM).resize(lazyLayout);
    }

    // Don't delete below function!!!!!
    private _listenResizing(resizeObservable$: Observable<any>) {
        this.setResize({});

        this._subscription = resizeObservable$
            .debounce((x: any) => Observable.timer(this.DEBOUNCE_TIME))
            .subscribe((req: string) => {
                this.setResize({});
            });
    }

    /**
     * 차트를 감싸고 있는 바로위의 엘러먼트의 width, height을 구한다.
     */
    private _setCurrentSize() {
        const chartParent = document.querySelector(`#${this.uuid}`).parentElement;
        this._currentSize = {
            width: chartParent.clientWidth,
            height: chartParent.clientHeight
        };
    }

    private _showLoader() {
        if (this._loader == null && this._config.showLoader !== false && !_.isEmpty($.jqplot.config.loaderTemplate)) {
            this._loader = $($.jqplot.config.loaderTemplate);
            this._elem.append(this._loader);
        }
    }

    private _hideLoader() {
        if (this._loader) {
            this._loader.remove();
            this._loader = null;
            if (this._elem.is(':visible')) {
                this._emitChart();
            }
        }
    }

    private _optionChange(options: any) {
        if (!this._elem.is(':visible')) return;

        if (this._plot && this._plot.target.find('canvas').length > 0) {
            this._plot.target.empty();
            if (this._plot.target.width() === 0 || this._plot.target.height() === 0) return;
            try {
                this._plot.replot(options);
            } catch (e) {
                console.log(e.stack);
            }
        }
        this._setEventCanvasMove();
    }

    private _drawCanvasOverlay(objects: any) {
        if (!this._elem.is(':visible')) return;

        if (this._plot && this._plot.options.canvasOverlay && _.isArray(objects)) {
            this._plot.options.canvasOverlay.objects = objects;
            let co = this._plot.plugins.canvasOverlay;
            co.setObjects(this._plot, objects);
            co = null;
        };
    }

    private _drawCanvasWindow(objects: any) {
        if (!this._elem.is(':visible')) return;

        if (this._plot && this._plot.options.canvasWindow && this._plot.options.canvasWindow.show && _.isArray(objects)) {
            this._plot.options.canvasWindow.objects = objects;

            let cw = this._plot.plugins.canvasWindow;
            cw.setObjects(this._plot, objects);
            cw = null;
        };
    }

    private _drawSpecWindow(data: any) {
        if (!this._elem.is(':visible')) return;

        if (this._plot && this._plot.data.length && this._plot.options.specWindow && this._plot.options.specWindow.show &&
            this._plot.target.find('canvas').length && _.isArray(data)) {
            try {
                this._plot.options.specWindow.data = data;
                let axes = this._config.axes;
                this._plot.target.empty();
                if (this._plot.target.width() === 0 || this._plot.target.height() === 0) return;
                this._plot.replot({
                    resetAxes: true,
                    specWindow: {
                        data: data
                    }
                });
            } catch (e) {
                console.log(e.stack);
            }
        };
    };

    private _drawEventLine(events: any) {
        console.log('_drawEventLine : ', events);
        if (!this._elem.is(':visible')) return;

        if (this._plot && this._plot.options.eventLine && this._plot.options.eventLine.show && this._plot.target.find('canvas').length) {
            try {
                this._plot.options.eventLine.events = events;

                let eventLine = this._plot.plugins.eventLine;
                eventLine.setEvents(events);
                eventLine.draw(this._plot);
                eventLine = null;
                // bistel chart bug : event line canvas가 series canvas 보다 뒤에 있음.
                this._setEventCanvasMove();
            } catch (e) {
                console.log(e.stack);
            }
        };
    }

    private _setEventCanvasMove() {
        setTimeout(() => {
            let tempEl = null;
            // const eventCanvasList = [];
            const childNodes = $(this._elem)[0].childNodes;
            const childIndex = childNodes.length;
            for ( let i: number = 0; i < childNodes.length; i++ ) {
                if ((childNodes[i] as any).className === 'jqplot-eventline-canvas') {
                    tempEl = childNodes[i];
                    // eventCanvasList.push(childNodes[i]);
                    if (tempEl) {
                        // this.trendChart.chartEl.appendChild(tempEl);
                        this._elem[0].insertBefore(tempEl, this._elem[0].childNodes[childIndex - 4]);
                    }
                }
            }
        }, 300);
    }
}
