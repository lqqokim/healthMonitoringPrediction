import { Subscription } from 'rxjs/Subscription';
import { BestPatternChartComponent } from './partial/best-pattern-chart.component';
import { OutlierPatternChartComponent } from './partial/outlier-pattern-chart.component'
import { MouseEvent } from './../../../sdk/popup/modal/utils/browser';
import { RequestOptions, Headers } from '@angular/http';
import { Component, OnDestroy, ViewEncapsulation, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewInit, ContentChildren } from '@angular/core';
import { ModalAction, ModalApplier, ModalRequester, WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';
import { NotifyService, Util } from '../../../sdk';
import { PdmCurrentAnalysisService } from './pdm-current-analysis.service';
import { ErrorModalModule } from './../pdm-modeler/partial/modal/pdm-error-modal/error-modal.module';

import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'div.a3-widget.widget-pdm-current-analysis',
    templateUrl: 'pdm-current-analysis.component.html',
    styleUrls: ['pdm-current-analysis.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [PdmCurrentAnalysisService]
})
export class PdmCurrentAnalysisComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {
    @ViewChildren(BestPatternChartComponent) bestPatternChartInstance: QueryList<BestPatternChartComponent>;
    @ViewChildren(OutlierPatternChartComponent) outlierPatternChartInstance: QueryList<OutlierPatternChartComponent>;
    @ViewChild('bestPatternChart') bestPatternChart: BestPatternChartComponent;
    @ViewChild('inputFile') inputFileSelector: ElementRef;
    @ViewChild('timeSeriesChart') timeSeriesChart;

    selectedRepeatedNo: number = 3;
    selectedOutlierNo: number = 3;
    dataCount: number = 0;
    repeatedCount: number[] = [];
    outlierCount: number[] = [];
    windowLength: number;
    currentDatas: any;
    selectedFile: any;
    timeValuesData: any;
    timeSeriesChartData: any;
    timeSeriesConfig: any;
    patternDatas: any;
    patternEventLines: any;
    isAnalysisActive: boolean = false;
    fileData: any;
    fileName: string;

    private _subscription: Subscription;

    constructor(
        private currentService: PdmCurrentAnalysisService,
        private service: PdmCurrentAnalysisService,
        private notify: NotifyService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
        private applier: ModalApplier,
    ) {
        super();
    }

    ngOnSetup() {
        this.hideSpinner();
        this.disableConfigurationBtn(true);
    }

    getCurrentPattern(): void {
        this.showSpinner();
        const windowLength = this.windowLength;
        const nearcount = this.selectedRepeatedNo;
        const farcount = this.selectedOutlierNo;
        const params = this.timeValuesData;
        console.log('Request =>', windowLength, nearcount, farcount, params);

        this.currentService.currentPattern(windowLength, nearcount, farcount, params)
            .then((res: any) => {
                if (res.result === 'success') {
                    this.currentDatas = res;
                    this.patternDatas = {
                        window: windowLength,
                        currentDatas: this.currentDatas,
                        timeSeriesChartData: this.timeSeriesChartData
                    };

                    console.log('this.patternDatas', this.patternDatas);

                    this.hideSpinner();
                } else if (res.result === 'fail') {
                    this.hideSpinner();
                    this.openModal(res.data, 'Load Data');
                    this._setWindowLength();
                    return;
                }
            });
    }

    _setchartCountView(): void { // Set chart area count & chart area data binding
        let nearCountArr = [];
        for (let i = 1; i <= this.selectedRepeatedNo; i++) {
            nearCountArr.push(i);
        }

        let farCountArr = [];
        for (let i = 1; i <= this.selectedOutlierNo; i++) {
            farCountArr.push(i);
        }

        this.repeatedCount = nearCountArr;
        this.outlierCount = farCountArr;
    }

    getChartIndex(ev: any, type: string): void {
        let selectedChart: QueryList<any>;
        let otherChart: QueryList<any>;

        if (type === 'best') {
            selectedChart = this.bestPatternChartInstance;
            otherChart = this.outlierPatternChartInstance;
        } else if (type === 'outlier') {
            selectedChart = this.outlierPatternChartInstance;
            otherChart = this.bestPatternChartInstance;
        }

        selectedChart.map((selectedData: any, i: number) => {
            otherChart.map((otherData: any, j: number) => {
                if (i === ev) {
                    otherData.isChartClick = false;
                    selectedData.isChartClick = true;
                } else {
                    selectedData.isChartClick = false;
                }
            });
        });
    }

    timeSeriesChartClick() {
        this._bringEventlineToCanvas();
    }

    changeWindowlength(ev: any): void {
        this.windowLength = ev;
        this._floatCheck();
        this.isAnalysisActive = this._activeAnalysis();
    }

    _bringEventlineToCanvas(): void { // Bring event lines to canvas (Bistel chart bug)
        let tempEl = null;
        const childNodes = this.timeSeriesChart.chartEl.childNodes;
        for (let i: number = 0; i < childNodes.length; i++) {
            if ((childNodes[i] as any).className === 'jqplot-eventline-canvas') {
                tempEl = childNodes[i];
                break;
            }
        }

        if (tempEl) {
            // this.trendChart.chartEl.appendChild(tempEl);
            const childIndex = this.timeSeriesChart.chartEl.childNodes.length;
            this.timeSeriesChart.chartEl.insertBefore(tempEl, this.timeSeriesChart.chartEl.childNodes[childIndex - 4]);
        }
        // $('.jqplot-eventline-canvas')
    }

    analyzeData(): void {
        if (this.patternDatas !== null || this.patternEventLines.length !== 0) {
            this.patternDatas = null;
            this.patternEventLines = []; // Remove previous event lines
        }

        this._setTimeSeriesConfig();
        this._setchartCountView();
        this.getCurrentPattern();
        this._jqplotZoomHandle();
    }

    _jqplotZoomHandle() {
        $('#timeSeriesChart').on('jqplotResetZoom', // Jqplot zoom out detect event
            (ev, gridpos, datapos, plot, cursor) => {
                this._bringEventlineToCanvas();
            }
        );

        $('#timeSeriesChart').on('jqplotZoom', // Jqplot zoom detect event
            (ev, gridpos, datapos, plot, cursor) => {
                this._bringEventlineToCanvas();
            }
        );
    }

    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        this._initCondition();
        this.hideSpinner();
    }

    fileSelect(): void {
        this.inputFileSelector.nativeElement.value = ''; // For detect change same file
    }

    fileChangeEvent(ev: any): void {
        if (ev) { // Init chart and condition when file change 
            this._initCondition();
        }

        try {
            const file = this.inputFileSelector.nativeElement.files[0];

            if (file) {
                let reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (evt: any) => {
                    this._parseFileData(file, evt);
                }

                reader.onerror = (evalat: any) => {
                    throw new Error("Failed to load file.");
                }
            } else {
                throw new Error("The file is not valid.");
            }
        } catch (err) {
            this.openModal(err.message, 'Load Data');
        } finally {
            this._initCondition();
        }
    }

    _parseFileData(file: any, evt: any): void {
        this.showSpinner();

        try {
            this.timeValuesData = {
                time: [],
                values: []
            };

            this.fileData = evt.currentTarget.result;
            let lines = this.fileData.split("\n");
            if (!lines[lines.lnegth - 1]) { // Remove last null line
                lines.splice(lines.length - 1, 1);
            }

            const headers = lines[0].split(",");

            if (headers[0].toUpperCase() !== "TIME" && headers[1].toUpperCase() !== 'VALUES') {
                throw new Error(`The format of the header should be ["time", "values"].`);
            }

            this.fileName = file.name;
            this._setDataCount(lines);
            this.hideSpinner();
        } catch (err) {
            this.hideSpinner();
            this.openModal(err.message, 'Header Format');
            this._initCondition();
            return;
        }
    }

    _setDataCount(lines: any): void {
        try {
            this.dataCount = lines.length - 1; // Data count about remove header line
            if (this.dataCount < 100) {
                throw new Error("Data size must be at least greater than 100.");
            } else {
                this._setWindowLength();
                this._setTimeValuesData(lines);
            }
        } catch (err) {
            this.openModal(err.message, 'Data Size');
            this._initCondition();
        } finally {
            return;
        }
    }

    _setWindowLength(): void {
        if (this.windowLength < 4) {
            this.windowLength = 4;
        } else {
            this.windowLength = (this.dataCount / 20) - 1;
            this._floatCheck();
        }
    }

    _floatCheck(): void {
        if (this.windowLength) {
            let numCheck = /^([0-9]*)[\.]?([0-9])?$/;

            if (numCheck.test(this.windowLength.toString())) {
                this.windowLength = Math.floor(this.windowLength);
                (<HTMLInputElement>document.getElementById('windowInput')).value = `${this.windowLength}`;
            }
            // if(!Number.isInteger(this.windowLength)) { // float chaek
            //     this.windowLength = Math.floor(this.windowLength);
        }
    }

    _setTimeValuesData(lines: string[]): void {
        let timeArr = [];
        let valuesArr = [];

        for (let i = 1; i < lines.length; i++) {
            const linesSplit = lines[i].split(",");
            timeArr.push(Number(linesSplit[0]));
            valuesArr.push(Number(linesSplit[1]));
        }

        this.timeValuesData = {
            time: timeArr,
            values: valuesArr
        };

        this._setTimeSeriesConfig(); // Set time series data   
        this.hideSpinner();
    }

    _setTimeSeriesConfig(): void {
        const yaxisPads = this._setYaxisPad();
        this.timeSeriesConfig = {
            legend: {
                show: false
            },
            eventLine: {
                show: true,
                tooltip: {              // default line tooltip options
                    show: false,        // default : true
                    adjust: 5,          // right, top move - default : 5
                    formatter: null,    // content formatting callback (must return content) - default : true
                    style: '',          // tooltip container style (string or object) - default : empty string
                    classes: ''         // tooltip container classes - default : empty string
                },
                events: []
            },
            seriesDefaults: {
                trendline: {
                    show: false,
                    shadow: false,
                    lineWidth: 1,
                    color: '#00FA9A'
                },
                showLine: true,
                showMarker: false,
                markerOptions: {
                    style: 'filledCircle'
                }
            },
            axes: {
                xaxis: {
                    autoscale: true,
                    drawMajorGridlines: false,
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('YYYY-MM-DD h') : '';
                        }
                    },
                    rendererOptions: {
                        dataType: 'date',
                        drawBaseline: false
                    }
                },
                yaxis: {
                    min: yaxisPads[0],
                    max: yaxisPads[1],
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    drawMajorGridlines: true,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            },
            cursor: {
                zoom: true,
                looseZoom: true,
                style: 'auto',
                showTooltip: false,
                draggable: false,
                dblClickReset: true
            },
            seriesColors: ["#98FB98"],
            highlighter: {
                isMultiTooltip: false,
                clearTooltipOnClickOutside: false,
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                },
                sizeAdjust: 5,
                stroke: true,
                strokeStyle: '#333',
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    const dt = moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD hh:mm:ss');
                    tooltipContentProc("[Time] " + dt + " [Value] " + str.split(',')[1]);
                }
            }
        }

        this.timeSeriesChartData = [[]];
        for (let i = 0; i < this.timeValuesData.time.length; i++) {
            this.timeSeriesChartData[0].push([this.timeValuesData.time[i], this.timeValuesData.values[i]]);
        }

        this.isAnalysisActive = this._activeAnalysis(); // Judges activation of analysis button        
    }

    _setYaxisPad(): number[] { // Time series chart padding
        const minValues = Math.min(...(this.timeValuesData.values));
        const maxValues = Math.max(...(this.timeValuesData.values));
        const yaxisMaxPad = maxValues + (maxValues * 0.1);
        let yaxisMinPad;

        if (minValues.toFixed(2) === '0.00') {
            yaxisMinPad = -0.1;
        } else {
            yaxisMinPad = minValues - (minValues * 0.1);
        }

        return [yaxisMinPad, yaxisMaxPad];
    }

    _activeAnalysis(): boolean {
        if (this.fileData && this.windowLength) {
            return true;
        } else {
            return false;
        }
    }

    eventLines(ev: any) {
        this.patternEventLines = [];
        let position;
        let color;

        for (let i = 0; i < ev.length; i++) {
            position = ev[i].position;
            color = ev[i].color;

            this.addEventLine(position, color);
        }
    }

    addEventLine(position, color) {
        this.patternEventLines.push({
            show: true,
            type: 'line',
            axis: 'xaxis',
            //background: true,
            fill: true,
            fillStyle: 'rgba(255,255, 0, .5)',
            line: {
                name: position,
                show: true, // default : false
                value: position,
                color: color,
                width: 1,       // default : 1
                adjust: 0,      // default : 0
                pattern: null,  // default : null
                shadow: false,  // default : false
                eventDistance: 3,   // default : 3
                offset: {       // default : 0, 0
                    top: 0,
                    left: 0,
                },
                tooltip: {
                    show: true,
                    formatter: () => {
                        return position;
                    }
                },
                draggable: {
                    show: false
                },
                label: {
                    show: false,         // default : false
                    formatter: null,    // default : null (callback function)
                    classes: '',        // default : empty string (css class)
                    style: '',          // default : empty string (be able object or string)
                    position: 'n',      // default : n
                    offset: {           // default : 0, 0
                        top: 0,
                        left: 0
                    }
                }
            }
        });

        setTimeout(() => {
            this._bringEventlineToCanvas();
        }, 300);
    }

    openModal(errorMsg: string, title: string) {
        this.modalAction.showConfiguration({
            module: ErrorModalModule,
            requester: this.modalRequester,
            info: {
                title: title,
                errorData: errorMsg,
                applier: this.applier
            }
        });

        this._listenApplied();
    }

    _listenApplied() {
        this._subscription = this.applier
            .listenApplySuccess()
            .subscribe((response: any) => {
                if (response.type === 'APPLIED') {
                    this.hideSpinner();
                    this.modalRequester.destroy();
                } else if (response.type === 'FAILED') {
                    alert('Failed');
                    this.hideSpinner();
                }
            },
            (err: any) => {
                console.log('Apply exception', err.getMessage());
            });
    }

    private _initCondition() {
        this.timeSeriesChartData = null;
        this.timeValuesData = null;
        this.patternDatas = null;
        this.currentDatas = null;
        this.fileName = null;
        this.windowLength = undefined;
        this.patternEventLines = [];
        this.timeSeriesConfig = null;
        this.selectedRepeatedNo = 3;
        this.selectedOutlierNo = 3;
        this.dataCount = 0;
        this.isAnalysisActive = this._activeAnalysis();
    }

    onRepeatedNoChange(ev: any): void {
        this.selectedRepeatedNo = ev;
    }

    onOutlierNoChange(ev: any): void {
        this.selectedOutlierNo = ev;
    }

    timeSeriesCompleteChart(ev: any): void {

    }

    ngAfterViewInit() {
        // this.bestPatternChartInstance.changes.subscribe(() => {

        // });
    }

    ngOnDestroy() {
        this.destroy();
    }
}

