import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, ChangeDetectorRef, AfterViewInit, Renderer2 } from '@angular/core';

import { WidgetRefreshType, WidgetApi, OnSetup, RequestType } from '../../../common';
import { Translater, SessionStore } from '../../../sdk';
import { PdmEqpParamAnalysisService } from './pdm-eqp-param-analysis.service';
import { PdmCommonService } from '../../../common/service/pdm-common.service';

import * as wjcInput from 'wijmo/wijmo.input';

import { ModelingTreeComponent } from '../../common/modeling-tree/modeling-tree.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-eqp-param-analysis',
    templateUrl: 'pdm-eqp-param-analysis.html',
    styleUrls: ['pdm-eqp-param-analysis.css'],
    providers: [PdmEqpParamAnalysisService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmEqpParamAnalysisComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {
    @ViewChild('tree') tree: ModelingTreeComponent;

    datas: any;
    isDataLoaded: boolean = false;

    healthIndexData: any;
    healthIndexConfig = {};
    healthIndexEventConfig = {};
    // healthIndexEventConfig = {};
    TrendMetrixChartConfig = {};

    healthIndexChart;
    healthIndexContributeData: any;
    healthIndexContributeConfig = {};
    healthIndexContributeEventConfig = {};
    contributeBarChartData: any;
    contributeBarChartConfig: any = {};
    healthContributeDatas: any;
    isContributionShow: boolean = false;

    trendData: any;
    trendConfig: any = {};
    trendEventConfig = {};

    timeWaveData: any;
    timeWaveConfig: any = {};

    spectrumData: any;
    spectrumConfig: any = {};
    chartEvents: any;

    problemIndexData: any;
    problemIndexConfig = {};
    problemIndexEventConfig = {};

    problemDatas = [];
    problemEventData = [];

    electricCurrentData: any;
    electricCurrentConfig = {};

    measureDatas = [];
    rpms;
    rpmscombo: any[] = [];
    mesaurementValue = 0;

    eventLines: any[] = [];
    healthEventLines: any[] = [];
    healthContributionEventLines: any[] = [];
    trendEventLines: any[] = [];

    spectrumRange: any = [1, 50];
    spectrumMin: any = 1;
    spectrumMax: any = 50;

    timewavedate: any;

    rootcause: any;

    timePeriodFrom: any;
    timePeriodTo: any;

    selectNode: any = '';

    someRange2config: any = {
        behaviour: 'drag',
        connect: true,
        margin: 1,
        limit: 5, // NOTE: overwritten by [limit]="10"
        range: {
            min: 0,
            max: 20
        },
        pips: {
            mode: 'steps',
            density: 5
        }
    };

    nodeClickType: number;
    seriesColors: any[string] = ['#2196f3', '#ff9800', '#4caf50', '#9c27b0', '#ffdf07', '#3f51b5', '#795548', '#673ab7', '#ff538d', '#00d2d4', '#ffc107', '#98d734', '#607d8b', '#9e9e9e', '#708090', '#fffacd', '#ee82ee', '#ffc0cb', '#48d1cc', '#adff2f', '#f08080', '#808080', '#ff69b4', '#cd5c5c', '#ffa07a', '#0000ff'];

    analysisSpec;
    analysisSpecVisible;
    searchTimePeriod: any;

    isHealthContributionLegend: boolean = false;
    isShowTrendLegend: boolean;
    isShowSpectrumLegend: boolean
    isShowTimeWaveLegend: boolean;
    isShowExpandBtn: boolean = true;

    alarmText: string;
    warningText: string;
    analysisText: string;

    _toDate = new Date();
    _fromDate = new Date();
    _prevHealthIndexKey: any = '';
    _trendChartSelectedIndex: number;
    _plantId: string;
    _areaId = '';
    _eqpId = '';
    _paramId = '';
    _nodeType: any;
    _eqpName = '';
    _shopName = '';

    // private readonly EQPTYPE = 2;
    // private readonly PARAMTYPE = 3;

    treeCnt: number;
    private readonly TYPES: any = {
        FAB: 0,
        AREA: 1,
        EQP: 2,
        PARAMETER: 100
    };

    cols = [];
    rows = [];
    col_row = {};
    causeDatas = { "anaylysis": null };

    isVibration: boolean = true;
    isSetupState: boolean = true;


    @ViewChild('chartProblem') chartProblem: ElementRef;
    @ViewChild('chartHealth') chartHealth: ElementRef;
    @ViewChild('chartHealthContribute') chartHealthContribute: ElementRef;
    @ViewChild('chartTrend') chartTrend: ElementRef;
    @ViewChild('chartSpectra') chartSpectra: ElementRef;
    @ViewChild('chartTimeWave') chartTimeWave: ElementRef;
    @ViewChild('chartPopup') chartPopup: wjcInput.Popup;
    @ViewChild('popupBody') popupBody: ElementRef;
    @ViewChild('trendChartPlot') trendChartPlot: ElementRef;
    @ViewChild('chartArea') chartArea: ElementRef;
    @ViewChild('trendChartEl') trendChartEl: any;
    @ViewChild('healthContributeChart') healthContributeChart: any;
    @ViewChild('healthContributeBarChart') healthContributeBarChart: any;
    @ViewChild('contributionModal') contributionModal: any;

    private _specAlarm: number = 90;
    private _paramEuType: string = '';
    private _popupPanelElem: any;
    private _prevPanel: any;
    private _nextPanel: any;
    private _plant: string;
    private _cutoffType: string;
    private _dayPeriod: number;
    private _timePeriod: any;
    private _props: any;


    constructor(private _service: PdmEqpParamAnalysisService,
        private translater: Translater,
        private elementref: ElementRef,
        private _pdmSvc: PdmCommonService,
        private _chRef: ChangeDetectorRef,
        private sessionStore: SessionStore,
        private renderer: Renderer2) {
        super();
    }

    //Init
    ngOnSetup() {
        this.showSpinner();
        this.setGlobalLabel();
        this._props = this.getProperties();
        console.log('Analysis props', this._props);
        this._setProperties(this._props);
        const fromDt = this.addDays(this._toDate.getTime(), -this._dayPeriod);
        this.searchTimePeriod = {
            from: fromDt.getTime(),
            to: this._toDate.getTime()
        };

        this.analysisSpec = this._props[CD.ANALYSIS_SPEC];
        this.analysisSpecVisible = this._props[CD.ANALYSIS_SPEC_VISIBLE];
        this.chartPopup.onLostFocus = (ev) => {
            return false;
        };
        // this.chartPopup.onHidden = (ev) => {
        //     this._restoreChartPanel();
        // };
        this.chartPopup.modal = true;
        this.chartPopup.hideTrigger = wjcInput.PopupTrigger.None;
        this.contributeBarChartData = null;
        this._init();
    }

    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        this._prevHealthIndexKey = '';

        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
            this._props = data;
            this._plant = data[CD.PLANT];
            if (this._plantId !== data[CD.PLANT][CD.PLANT_ID]) {
                // this._plantId = data[CD.PLANT][CD.PLANT_ID];
                this._init(true);
            }
            this._setProperties(this._props);
            // today 기준 dayperiod 설정.
            this.analysisSpec = data.analysisSpec;
            this.analysisSpecVisible = data.analysisSpecVisible;

            const todate = new Date(moment().format('YYYY-MM-DD') + " 00:00:00");
            const fromDt = this.addDays(todate.getTime(), -this._dayPeriod);
            this._timePeriod[CD.FROM] = fromDt.getTime();
            this._timePeriod[CD.TO] = todate.getTime();
            this.searchTimePeriod = {
                from: fromDt.getTime(),
                to: todate.getTime()
            };
            this._chRef.detectChanges();
            // tree 정보를 다시 가져오므로 데이터를 초기화 한다.
            this.healthIndexData = [];
            this.healthIndexContributeData = [];
            this.trendData = [];
            this.spectrumData = [];
            this.timeWaveData = [];
            this.nodeClickType = this.TYPES.EQP;
            if (this._plantId === data[CD.PLANT][CD.PLANT_ID]) {
                this.chartInit();
                this.nodeData(this._nodeType, this._areaId, this._eqpId, this._paramId);
            }

            if (this.isSetupState) {
                this.hideSpinner();
            }
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            //Object.assign(this._props, data);
            this._plant = data[CD.PLANT];
            // TODO : tree를 다시 가져와야 하므로.
            // this._init();
            this._eqpId = data[CD.EQP_ID];
            this._areaId = data[CD.AREA_ID];
            this._timePeriod = data[CD.TIME_PERIOD];
            this.isContributionShow = false;

            if (data[CD.CATEGORY] === 'radar') { //for radar sync
                this.searchTimePeriod = {
                    from: data[CD.TIME_PERIOD][CD.FROM],
                    to: data[CD.TIME_PERIOD][CD.TO]
                };

                if (data[CD.PARAM_ID]) {
                    this._nodeType = 3;
                    this._paramId = data[CD.PARAM_ID];
                    this.selectNode = this._paramId
                } else {
                    this.selectNode = this._eqpId;
                    this._nodeType = 2;
                    this._paramId = '';
                }

                // tree 자동 오픈 (_eqpId, _areaId) 활용
                this.autoTreeOpen();

            } else if (data[CD.CATEGORY] === 'realtime') { //for realtime sync
                this.searchTimePeriod = {
                    from: data[CD.TIME_PERIOD][CD.FROM],
                    to: data[CD.TIME_PERIOD][CD.TO]
                };

                if (data[CD.PARAM_ID]) {
                    this._nodeType = 3;
                    this._paramId = data[CD.PARAM_ID];
                    this.selectNode = this._paramId
                } else {
                    this.selectNode = this._eqpId;
                    this._nodeType = 2;
                    this._paramId = '';
                }
            } else { // for overview sync
                this.selectNode = this._eqpId;

                if (this._timePeriod !== null) {
                    // to 만 사용하고 from은 properties의 내용을 가지고 timeperiod를 생성한다.
                    let fromDt = this.addDays(moment(data[CD.TIME_PERIOD][CD.TO]), -this._dayPeriod);
                    fromDt = new Date(moment(fromDt.getTime()).format('YYYY-MM-DD') + " 00:00:00");
                    this._timePeriod[CD.FROM] = fromDt;
                    this._timePeriod[CD.TO] = data[CD.TIME_PERIOD][CD.TO];
                    // this._props[CD.TIME_PERIOD] = this._timePeriod;
                    this.searchTimePeriod = {
                        from: fromDt.getTime(),
                        to: data[CD.TIME_PERIOD][CD.TO]
                    };
                }
            }

            this._setProperties(this._props);
            this._chRef.detectChanges();
            this.chartInit();
            this.tree.setSelectNode(this._areaId, this._eqpId, this._paramId);
            // this.nodeData(this._nodeType, this._areaId, this._eqpId, this._paramId);
        } else if (type === A3_WIDGET.JUST_REFRESH) {
            if (this.isSetupState) {
                // this._props = this.getProperties();
                // this._setProperties(this._props);
                this.hideSpinner();
            } else {
                this._chRef.detectChanges();
                this.chartInit();
                this.tree.setSelectNode(this._areaId, this._eqpId, this._paramId);
            }
        }

        this._toDate = new Date(this.searchTimePeriod[CD.TO]);
        // this.removeContributioModal();
        // this._init();
    }

    search() {
        this._prevHealthIndexKey = '';
        this.chartInit();
        this.nodeData(this._nodeType, this._areaId, this._eqpId, this._paramId);
        // this._init();
    }

    ngAfterViewInit() {
        //this.hideSpinner();
    }

    ngOnDestroy() {
        this.destroy();
    }

    chartInit() {
        this.healthIndexData = [];
        this.healthIndexData.push([[]]);

        this.healthIndexConfig = {
            legend: {
                show: false
            },
            eventLine: {
                show: true,
                tooltip: {  // default line tooltip options
                    show: false,         // default : true
                    adjust: 5,          // right, top move - default : 5
                    formatter: null,    // content formatting callback (must return content) - default : true
                    style: '',          // tooltip container style (string or object) - default : empty string
                    classes: ''         // tooltip container classes - default : empty string
                },
                events: []
            },
            seriesDefaults: {
                showMarker: false,
                smooth: true
            },
            axes: {
                xaxis: {
                    min: this.searchTimePeriod[CD.FROM],
                    max: this.searchTimePeriod[CD.TO],
                    autoscale: true,
                    drawMajorGridlines: false,
                    // rendererOptions: {
                    //     dataType: 'date'
                    // },
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('YYYY-MM-DD H') : '';
                        }
                    },
                    rendererOptions: {
                        dataType: 'date'
                    }
                },
                yaxis: {
                    autoscale: true,
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    drawMajorGridlines: true,
                    tickOptions: {
                        formatString: '%.2f',
                        formatter: (pattern: any, val: number, plot: any) => {
                            return _.string.sprintf(pattern, val * (90 / this._specAlarm));
                            // return _.string.sprintf(pattern, val);
                        }
                    }
                }
            },
            series: [
                {
                    trendline: {
                        show: true,
                        shadow: false,
                        lineWidth: 1,
                        color: '#0000ff'
                    }
                },
                {
                    showLine: false,
                    showMarker: true,
                    markerOptions: {
                        style: 'filledCircle'
                    }
                }
            ],
            highlighter: {
                isMultiTooltip: false,
                clearTooltipOnClickOutside: false,
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                },
                sizeAdjust: 2,
                stroke: true,
                strokeStyle: '#333',
                // tslint:disable-next-line:max-line-length
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    const dt = moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss');
                    const value = ' [' + (+str.split(',')[1] * (90 / this._specAlarm)).toFixed(2) + ']';
                    tooltipContentProc(dt + value);
                }
            }
        };

        this.healthIndexContributeData = [];
        // this.healthIndexContributeData.push([[]]);

        this.healthIndexContributeConfig = {
            legend: {
                show: this.isHealthContributionLegend,
                _width: 140,
                location: 'e'
            },
            eventLine: {
                show: true,
                tooltip: {  // default line tooltip options
                    show: false,         // default : true
                    adjust: 5,          // right, top move - default : 5
                    formatter: null,    // content formatting callback (must return content) - default : true
                    style: '',          // tooltip container style (string or object) - default : empty string
                    classes: ''         // tooltip container classes - default : empty string
                },
                events: []
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    min: this.searchTimePeriod[CD.FROM],
                    max: this.searchTimePeriod[CD.TO],
                    autoscale: true,
                    rendererOptions: {
                        dataType: 'date'
                    },
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('YYYY-MM-DD H') : '';
                        }
                    }
                },
                yaxis: {
                    show: true,
                    max: 110,
                    min: -10,
                    drawMajorGridlines: true,
                    tickOptions: {
                        show: true,
                        showMark: true,
                        showLabel: true,
                        showGridline: true,
                        formatString: '%.2f'
                    },
                    rendererOptions: {
                        drawBaseline: false
                    }
                }
            },
            series: [],
            seriesColors: this.seriesColors,
            highlighter: {
                isMultiTooltip: false,
                clearTooltipOnClickOutside: false,
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                },
                sizeAdjust: 2,
                stroke: true,
                strokeStyle: '#333',
                // tslint:disable-next-line:max-line-length
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    // tooltipContentProc(plot.data[seriesIndex][pointIndex][1]);
                    const dt = moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss');
                    const value = ' [' + (+str.split(',')[1]).toFixed(2) + ']';
                    tooltipContentProc(dt + value);
                },
            }
        };

        this.removeContributioModal();
        this.healthIndexEventConfig = {
            jqplotDblClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
                if (data !== null && data !== undefined) {
                    const time: number = data.data[0];
                    const fromDt: number = time;
                    const toDt: number = fromDt + 60000;

                    if (this.isContributionShow === false && this.healthIndexContributeData.length === 0) {
                        this._service.getContribute(this._plantId, this._areaId, this._eqpId, fromDt, toDt).then((data: any) => {
                            console.log('call', data);
                            this.healthContributeDatas = data;
                        });
                    } else if ((this.isContributionShow === false && this.healthIndexContributeData.length !== 0) || this.isContributionShow === true) {
                        console.log('exist', this.healthContributeDatas);
                    }

                    setTimeout(() => {
                        this.drawContributeBarChart(time, ev);
                    }, 500);
                }
            }
        };

        this.healthIndexContributeEventConfig = {
            jqplotDataClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
                // data[2] 의 parameter 명칭을 가져와서 tree로 넘겨준다.
                const parentTree = this._service.searchTree('nodeId', this.datas[0], this._eqpId);
                const treeItem = this._service.searchTree('title', parentTree, data[2]);
                this.selectNode = treeItem.nodeId;
            }
        };

        this.TrendMetrixChartConfig = {
            legend: {
                show: false
            },
            eventLine: {
                show: true,
                tooltip: {  // default line tooltip options
                    show: false,         // default : true
                    adjust: 5,          // right, top move - default : 5
                    formatter: null,    // content formatting callback (must return content) - default : true
                    style: '',          // tooltip container style (string or object) - default : empty string
                    classes: ''         // tooltip container classes - default : empty string
                },
                events: []
            },
            seriesDefaults: {
                showMarker: false,
                smooth: true
            },
            axes: {
                xaxis: {
                    min: this.searchTimePeriod[CD.FROM],
                    max: this.searchTimePeriod[CD.TO],
                    autoscale: true,
                    drawMajorGridlines: false,
                    // rendererOptions: {
                    //     dataType: 'date'
                    // },
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('MM-DD H') : '';
                        }
                    },
                    rendererOptions: {
                        dataType: 'date'
                    }
                },
                yaxis: {
                    autoscale: true,
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    drawMajorGridlines: true,
                    tickOptions: {
                        formatString: '%.2f',
                        formatter: (pattern: any, val: number, plot: any) => {
                            // return _.string.sprintf(pattern, val * (90 / this._specAlarm));
                            return _.string.sprintf(pattern, val);
                        }
                    }
                }
            },
            series: [
                {
                    trendline: {
                        show: true,
                        shadow: false,
                        lineWidth: 1,
                        color: '#8A2BE2'
                    }
                },
                {
                    trendline: {
                        show: false,
                        shadow: false,
                        lineWidth: 1,
                        color: '#ff0000'
                    },
                    color: '#ff0000'
                },
                {
                    trendline: {
                        show: false,
                        shadow: false,
                        lineWidth: 1,
                        color: '#ffa500'
                    },
                    color: '#ffa500'
                },
                {
                    trendline: {
                        show: false,
                        shadow: false,
                        lineWidth: 1,
                        color: '#ffa500'
                    },
                    color: '#80FF00'
                },
            ],
            highlighter: {
                isMultiTooltip: false,
                clearTooltipOnClickOutside: false,
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                },
                sizeAdjust: 2,
                stroke: true,
                strokeStyle: '#333',
                // tslint:disable-next-line:max-line-length
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    const dt = moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss');
                    const value = ' [' + (+str.split(',')[1] * (90 / this._specAlarm)).toFixed(2) + ']';
                    tooltipContentProc(dt + value);
                }
            }
        };

        this.isShowTrendLegend = false;
        this.trendEventConfig = {
            jqplotDataClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
                if (seriesIndex < 1) return;
                console.log('trendEventConfig : ', ev, seriesIndex, pointIndex, data);
                // this.timewavedate = moment(data).format('YYYY/MM/DD HH:mm:ss');

                if (seriesIndex !== 2) { //Prevent trend chart series Click
                    this._trendChartSelectedIndex = pointIndex;
                    this.getTimeWaveNSpectrum(this._trendChartSelectedIndex);
                }
            }
        };

        this.trendData = [];
        this.trendData.push([[]]);
        this.trendConfig = this.getTrendDataConfig({});

        this.problemIndexEventConfig = {
            jqplotDataClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
                this.showSpinner();
                let date = this.problemDatas[pointIndex].eventdate;
                this._toDate = new Date(date);
                this.initDate(this._toDate);
                this.nodeData(this._nodeType, this._areaId, this._eqpId, this._paramId);
                //this.getMeasurement();
                this.hideSpinner();
            }
        };

        this.problemIndexData = [];
        this.problemIndexData.push([[]]);

        this.problemIndexConfig = {
            legend: {
                show: false
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    autoscale: true,
                    // rendererOptions: {
                    //     dataType: 'date'
                    // },
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('YYYY-MM-DD H') : '';
                        }
                    },
                    //numberTicks: 15,
                    rendererOptions: {
                        dataType: 'date'
                    }
                },
                yaxis: {
                    show: true,
                    tickOptions: {
                        show: true,
                        showMark: true,
                        showLabel: true,
                        showGridline: true
                    },
                    rendererOptions: {
                        drawBaseline: false
                    }
                }
            },
            series: [
                {},
                {
                    showLine: false,
                    showMarker: true,
                    markerOptions: {
                        style: 'filledCircle'
                    }
                }
            ],
            highlighter: {
                isMultiTooltip: false,
                clearTooltipOnClickOutside: false,
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                },
                sizeAdjust: 2,
                stroke: true,
                strokeStyle: '#333',
                // tslint:disable-next-line:max-line-length
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    const dt = moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss');
                    const value = ' [' + this.problemDatas[pointIndex].failuretype + ']';
                    tooltipContentProc(dt + value);
                },
            }
        };

        this.timeWaveData = [];
        // this.timeWaveData.push(series);
        this.isShowTimeWaveLegend = false;
        this.timeWaveConfig = {
            legend: {
                show: this.isShowTimeWaveLegend
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    autoscale: true
                },
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            },
            series: [
                // {label:'Current'}
                // ,{label:'Model'}
            ]
        };

        this.spectrumData = [];
        // this.spectrumData.push(series);
        this.isShowSpectrumLegend = false;
        this.spectrumConfig = {
            legend: {
                show: this.isShowSpectrumLegend
            },
            eventLine: {
                show: true,
                tooltip: {  // default line tooltip options
                    show: false,         // default : true
                    adjust: 5,          // right, top move - default : 5
                    formatter: null,    // content formatting callback (must return content) - default : true
                    style: '',          // tooltip container style (string or object) - default : empty string
                    classes: ''         // tooltip container classes - default : empty string
                },
                events: []
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    autoscale: true,
                },
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            },
            series: [
                // {label:'Current'}
                // ,{label:'Model'}
            ]
        };

        this.chartEvents = {
            jqplotClick: (ev, gridpos, datapos, neighbor, plot) => {
                this.multiComboCheckedItemsChanged(null);
                this.addClickVerticalGuidLine(ev, gridpos, datapos, neighbor, plot);
            }
        };

        this.electricCurrentData = [];
        // this.timeWaveData.push(series);
        this.electricCurrentConfig = {
            legend: {
                show: false
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    autoscale: true,
                    // rendererOptions: {
                    //     dataType: 'date'
                    // },
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('YYYY-MM-DD h') : '';
                        }
                    },
                    //numberTicks: 15,
                    rendererOptions: {
                        dataType: 'date'
                    }
                },
                yaxis: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            },
            series: [
                {},
                {
                    showLine: false,
                    showMarker: true,
                    markerOptions: {
                        style: 'filledCircle'
                    }
                }
            ]
        };
    }

    _firstCharUpper(value) {
        if (value === undefined || value === '') return value;
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    drawContributeBarChart(time: number, ev: any): void {
        // Set bistel chart data
        const timeIndex: number = this.healthContributeDatas.time.indexOf(time);
        this.contributeBarChartData = [];
        let contributeBarChartData = [[]];
        let paramNames = [];
        let isShowLabel = [];
        let yaxisTicks = [];

        for (let key in this.healthContributeDatas) {
            paramNames.push(key);
        }

        paramNames.splice(paramNames.indexOf('time'), 1);
        paramNames.sort().reverse();

        for (let i = 0; i < paramNames.length; i++) {
            let paramName = paramNames[i];
            contributeBarChartData[0].push(this.healthContributeDatas[paramName][timeIndex]);
            isShowLabel.push({ showLabel: false })
            yaxisTicks.push(`${this.healthContributeDatas[paramName][timeIndex].toFixed(2)}`);
        }

        const contributeBarChartConfig = {
            legend: {
                show: false
            },
            seriesColors: this.seriesColors,
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                // showMarker: false,
                rendererOptions: {
                    varyBarColor: true,
                    barWidth: 20,
                    // barDirection: 'vertical',
                    // barPadding: 1,
                    // barMargin: 15,
                    // smooth: true
                },
                // pointLabels: { show: false }
            },
            series: isShowLabel,
            axes: {
                xaxis: {
                    renderer: jQuery.jqplot.CategoryAxisRenderer,
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer, // tick option renderer
                    showLabel: false,
                    tickOptions: { // tick에 대한 옵션
                        show: true,
                        angle: -48
                    },
                    ticks: paramNames
                },
                yaxis: {
                    autoscale: true,
                    tickOptions: {
                        formatString: '%.2f' // yaxis tick label 표시
                    }
                }
            },
            highlighter: {
                // isMultiTooltip: false,
                // clearTooltipOnClickOutside: false,
                // overTooltip: true,
                // overTooltipOptions: {
                //     showMarker: true,
                //     showTooltip: true,
                //     lineOver: false
                // },
                // sizeAdjust: 2,
                // stroke: true,
                // strokeStyle: '#333',
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    const value = plot.data[0][pointIndex].toFixed(4);
                    const paramName = paramNames[pointIndex];
                    tooltipContentProc(`${paramName}, ${value}`);
                }
            }

        };

        this.contributeBarChartConfig = contributeBarChartConfig;
        this.contributeBarChartData = contributeBarChartData;
        this.showContiributeBarChart(ev);
    }

    showContiributeBarChart(item: any) {
        let top = item.originalEvent.clientY;
        let left = item.originalEvent.clientX;
        let element = document.getElementById('contributionModal');

        if (left > 1311) {
            element.style.left = left - 600 + "px"; // 600: modal dialog size
        } else {
            element.style.left = left + "px";
        }

        element.style.top = top + "px";
        $("#contributionModal").draggable({
            handle: ".modal-header"
        });
        $('#contributionModal').modal('show');
        $('.modal-backdrop').remove();

        // document.getElementById('exampleModalLabel').innerHTML = `top: ${top}, left: ${left}`;
        // element.style.display = 'block';
    }

    removeContributioModal() {
        $('#contributionModal').modal('hide');
        // console.log('modal', this.contributionModal);
        // if (this.contributionModal) {
        //     if (this.contributionModal.nativeElement.className === 'modal in') {
        //         $('#contributionModal').modal('hide');
        //         this.contributionModal.nativeElement = null;
        //     }
        // }
    }

    completeChart(ev: any) {
        // console.log('completeChart', ev);
    }

    clearUnderParameterChart() {
        let prevKey: string = this._plantId + ':' + this._areaId + ':' + this._eqpId;
        if (this._prevHealthIndexKey !== prevKey) {
            this.healthIndexData = [[[]]];
            // this.healthEventLines = [];
            // this.healthContributionEventLines = [];
            // this.healthIndexContributeData = [[[]]];
            this.healthIndexContributeData = [];
        }
        this.clearUnderMeasurement();
    }

    clearUnderMeasurement() {
        // this.trendEventLines = [];
        this.timeWaveData = [[]];
        this.spectrumData = [[]];
        this.eventLines = [];
        this.rootcause = '';
    }
    clearUnderEqp() {
        this.measureDatas = [[]];
        this.clearUnderParameterChart();
    }

    //Data
    nodeData(nodeType, areaId, eqpId, paramId) {
        if (!nodeType) {
            this.healthIndexData = [];
            this.healthIndexContributeData = [];
            this.trendData = [];
            this.spectrumData = [];
            this.timeWaveData = [];
            return;
        }

        this.isSetupState = false;
        this._chRef.detectChanges();
        // this.showSpinner();

        console.log('nodeData => ', ` [nodeType]: ${this._nodeType}`, `[areaId]: ${this._areaId}`, `[eqpId]: ${this._eqpId}`, `[paramId]: ${this._paramId}`);
        try {
            if (nodeType === this.TYPES.EQP) {
                this.nodeClickType = this.TYPES.EQP;
                // this._toDate = new Date();
                // this.initDate(null);
                this.clearUnderEqp();
                //this.getHealthIndexType(nodeType);
                this.getSigleParamType(this._plantId, areaId, eqpId);
                setTimeout(() => {
                    $('.pdm-chart-row-body').animate({ scrollTop: 0 }, 500);
                }, 500);

            } else if (nodeType > this.TYPES.EQP) {
                this.nodeClickType = this.TYPES.PARAMETER;
                this._pdmSvc.getParamDetail(this._plantId, this._paramId).then(paramDetail => {
                    console.log('getParamDetail : ', paramDetail);
                    if (paramDetail.param_type_cd == 'Velocity' || paramDetail.param_type_cd == 'Acceleration' || paramDetail.param_type_cd == 'Enveloping') {
                        this.isVibration = true;
                    } else {
                        this.isVibration = false;
                    }

                    this._paramEuType = paramDetail.eu;
                    this.clearUnderParameterChart();
                    // this.getHealthIndexType(nodeType);
                    this.getSigleParamType(this._plantId, areaId, eqpId);
                    // this.getMaintenanceData(this.searchTimePeriod[CD.FROM], this.searchTimePeriod[CD.TO]).then(() => {
                    //     this.getHealthIndexData(nodeType).then(() => {
                    //         console.log(`${nodeType}-getHealthIndexData`);
                    //         if (this.isContributionShow) {
                    //             this.getHealthIndexContributeData();
                    //         }
                    //     }).catch(() => {
                    //         console.log(`getHealthIndexData catch()`);
                    //     });
                    this.showSpinner();
                    console.log('searchTimePeriod', this.searchTimePeriod);
                    this.getTrendMultiple().then(() => {
                        if (this.isVibration) {
                            this.getMeasurement().then(() => {
                                this.getTrendSpec(this.searchTimePeriod[CD.FROM], this.searchTimePeriod[CD.TO]);
                                this.hideSpinner();
                            }).catch(() => {
                                console.log(`getMeasurement catch()`);
                                this.hideSpinner();
                            });
                        } else {
                            setTimeout(() => {
                                this.hideSpinner();
                            }, 2000);

                        }
                    });
                    setTimeout(() => {
                        $('.pdm-chart-row-body').animate({ scrollTop: $('.metrix-row-chart-group').height() }, 500);
                    }, 500);

                    // }).catch(() => {
                    //     console.log(`${nodeType}-getMaintenanceData catch`);
                    //     this.getHealthIndexData(nodeType).then(() => {
                    //         console.log(`${nodeType}-getHealthIndexData`);
                    //         if (this.isContributionShow) {
                    //             this.getHealthIndexContributeData();
                    //         }
                    //     }).catch(() => {
                    //         console.log(`getHealthIndexData catch()`);
                    //     });
                    //     this.getTrendMultiple().then(() => {
                    //         this.getMeasurement().then(() => {
                    //             this.getTrendSpec(this.searchTimePeriod[CD.FROM], this.searchTimePeriod[CD.TO]);
                    //             this.hideSpinner();
                    //         }).catch(() => {
                    //             console.log(`getMeasurement catch()`);
                    //             this.hideSpinner();
                    //         });
                    //     });
                    // });
                }, (err) => {
                    console.log('getParamDetail Error : ', err);
                });
            } else {
                this.hideSpinner();
            }
        } catch (err) {
            console.log('nodeData Error : ', err);
            this.hideSpinner();
        }
    }

    getSigleParamType(plantId, areaId, eqpId) {
        let prevKey = this._plantId + ':' + this._areaId + ':' + this._eqpId;
        //if (this._nodeType > this.TYPES.EQP && prevKey === this._prevHealthIndexKey) {
        if (prevKey === this._prevHealthIndexKey) {
            return;
        }
        this._prevHealthIndexKey = prevKey;

        this.rows = [];
        this.cols = [];
        this.col_row = [];

        this._service.getParamInfoByEqpId(plantId, areaId, eqpId).then((result) => {
            console.log('getParamInfoByEqpId ==> ', result);


            for (let i = 0; i < result.length; i++) {
                // if (!(result[i].paramType == 10201 || result[i].paramType == 10202)) continue;
                let index = result[i].paramName.lastIndexOf(' ');
                if(index<0){
                    index = result[i].paramName.lastIndexOf('_');
                }
                let name = result[i].paramName.substr(0, index);
                let type = result[i].paramName.substr(index + 1);

                if (this.rows.indexOf(name) < 0) this.rows.push(name);
                if (this.cols.indexOf(type) < 0) this.cols.push(type);
                if (this.col_row[name] == undefined) this.col_row[name] = {};
                this.col_row[name][type] = { paramName: result[i].paramName, paramId: result[i].paramId };
                let col_row_Data = this.col_row[name][type];
                col_row_Data['analysis'] = "Progressing...";
                col_row_Data['analysisSummary'] = "Progressing...";
                col_row_Data['data'] = null;
                let paramId = result[i].paramId;
                let rate = this.analysisSpec / 100;

                this._service.getTrendMultiple(this._plantId,
                    this._areaId,
                    this._eqpId,
                    paramId,
                    this.searchTimePeriod[CD.FROM],
                    this.searchTimePeriod[CD.TO]).then(data => {
                        // console.log('getTrendMultiple', data);
                        let alarm = [];
                        let warning = [];
                        let analysis = [];

                        let prevAlarm = null;
                        let prevWarning = null;
                        if (data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                if (prevAlarm == null || prevAlarm != data[i][2]) {
                                    if (i != 0) {
                                        if (prevAlarm != null) {
                                            alarm.push([data[i - 1][0], prevAlarm]);
                                        }

                                    }
                                    if (data[i][2] != null) {
                                        prevAlarm = data[i][2];
                                        alarm.push([data[i][0], data[i][2]]);
                                    }

                                }
                                if (prevWarning == null || prevWarning != data[i][3]) {
                                    if (i != 0) {
                                        if (prevWarning != null) {
                                            warning.push([data[i - 1][0], prevWarning]);
                                            analysis.push([data[i - 1][0], prevWarning - Math.abs(prevWarning) * (1 - rate)]);
                                        }
                                    }
                                    if (data[i][3] != null) {
                                        prevWarning = data[i][3];
                                        warning.push([data[i][0], data[i][3]]);
                                        analysis.push([data[i][0], data[i][3] - Math.abs(data[i][3]) * (1 - rate)]);
                                    }
                                }
                            }
                            // if (alarm.length > 0 && alarm[alarm.length - 1][0] != data[data.length - 1][0]) {
                            // if (data[data.length - 1][2] != null) {
                            // alarm.push([data[data.length - 1][0], data[data.length - 1][2]]);
                            // }
                            // }
                            // if (warning.length > 0 && warning[warning.length - 1][0] != data[data.length - 1][0]) {
                            // if (data[data.length - 1][3] != null) {
                            // warning.push([data[data.length - 1][0], data[data.length - 1][3]]);
                            // analysis.push([data[data.length - 1][0], data[data.length - 1][3] - Math.abs(data[data.length - 1][3]) * (1 - rate)]);
                            // }
                            // }
                            if (alarm.length > 0) {
                                if (alarm[alarm.length - 1][0] != data[data.length - 1][0]) {
                                    if (data[data.length - 1][2] != null) {
                                        alarm.push([data[data.length - 1][0], data[data.length - 1][2]]);
                                    }
                                }
                                if (alarm[0][0] != data[0][0]) {
                                    alarm.unshift([data[0][0], alarm[0][1]]);
                                }

                            }
                            if (warning.length > 0) {
                                if (warning[warning.length - 1][0] != data[data.length - 1][0]) {
                                    if (data[data.length - 1][3] != null) {
                                        warning.push([data[data.length - 1][0], data[data.length - 1][3]]);
                                        analysis.push([data[data.length - 1][0], data[data.length - 1][3] - Math.abs(data[data.length - 1][3]) * (1 - rate)]);
                                    }
                                }
                                if (warning[0][0] != data[0][0]) {
                                    warning.unshift([data[0][0], warning[0][1]]);
                                    analysis.unshift([data[0][0], warning[0][1] - Math.abs(warning[0][1]) * (1 - rate)]);
                                }

                            }
                        }
                        if (this.analysisSpecVisible) {
                            col_row_Data['data'] = [data, alarm, warning, analysis];
                        } else {
                            col_row_Data['data'] = [data, alarm, warning];
                        }

                        if (data.length > 0 && alarm.length == 0 && warning.length == 0) {
                            this.getSingleParamTypeSpec(col_row_Data, this._eqpId, paramId, this.searchTimePeriod[CD.FROM], this.searchTimePeriod[CD.TO], rate).then(() => {
                                // this.hideSpinner();
                                // }).catch(()=>{
                                // this.hideSpinner(); 
                            }).catch((err) => {
                                console.log(err);
                            });
                        }

                        col_row_Data['areaId'] = this._areaId;
                        col_row_Data['eqpId'] = this._eqpId;
                        col_row_Data['paramId'] = paramId;

                        this._service.getAnalysisInfo(this._plantId, this._areaId, this._eqpId, paramId,
                            this.searchTimePeriod[CD.FROM],
                            this.searchTimePeriod[CD.TO], rate).then((result) => {
                                col_row_Data['analysis'] = result.data;
                                if (result.data == null) {
                                    col_row_Data['analysisSummary'] = "";
                                } else if (result.data.length == 1) {
                                    col_row_Data['analysisSummary'] = result.data[0].causes[0];
                                } else {
                                    col_row_Data['analysisSummary'] = result.data[0].causes[0] + " + Etc:" + (result.data.length - 1);
                                }
                                // console.log(result);
                                this.hideSpinner();
                            }).catch((err) => {
                                console.log(err);
                                col_row_Data['analysisSummary'] = ""
                                col_row_Data['analysis'] =undefined;
                                this.hideSpinner();
                            });
                    }).catch((err) => {
                        console.log(err);
                        col_row_Data['analysis']=undefined;
                        col_row_Data['analysisSummary'] = "";
                        col_row_Data['data'] = [];
                        this.hideSpinner();
                    })
            }
        }).catch((err) => {
            console.log(err);
            this.hideSpinner();
        })
    }

    getSingleParamTypeSpec(col_row_Data, eqpId, paramId, from, to, rate) {
        return this._service.getSpectrumSpecConfig(this._plantId, this._areaId, eqpId, paramId, from, to).then((data) => {
            let spec_alarm = data.alarm;
            let spec_warning = data.warning;
            col_row_Data['trendEventLines'] = [];
            if (spec_alarm) {
                col_row_Data['trendEventLines'].push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255, 0, 0, .5)',
                    line: {
                        name: `${this.alarmText} (${spec_alarm.toFixed(2)})`,
                        show: true, // default : false
                        value: spec_alarm,
                        color: '#ff0000',
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
                                return `${this.alarmText} (${spec_alarm.toFixed(2)})`;
                            }
                        },
                        draggable: {
                            show: false
                        },
                        label: {
                            show: true,         // default : false
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
            }

            if (spec_warning) {
                col_row_Data['trendEventLines'].push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255, 255, 0, .5)',
                    line: {
                        name: `${this.warningText} (${spec_warning.toFixed(2)})`,
                        show: true, // default : false
                        value: spec_warning,
                        color: '#ffa500',
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
                                return `${this.warningText} (${spec_warning.toFixed(2)})`;
                            }
                        },
                        draggable: {
                            show: false
                        },
                        label: {
                            show: true,         // default : false
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
                if (this.analysisSpecVisible) {
                    col_row_Data['trendEventLines'].push({
                        show: true,
                        type: 'line',
                        axis: 'yaxis',
                        //background: true,
                        fill: true,
                        fillStyle: 'rgba(255, 255, 0, .5)',
                        line: {
                            name: `${this.analysisText} (${(spec_warning - Math.abs(spec_warning) * (1 - rate)).toFixed(2)})`,
                            show: true, // default : false
                            value: spec_warning - Math.abs(spec_warning) * (1 - rate),
                            color: '#80ff00',
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
                                    return `${this.analysisText} (${(spec_warning - Math.abs(spec_warning) * (1 - rate)).toFixed(2)})`;
                                }
                            },
                            draggable: {
                                show: false
                            },
                            label: {
                                show: true,         // default : false
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
                }

            }
        })
    }
    getHealthIndexType(nodeType) {
        this.getMaintenanceData(this.searchTimePeriod[CD.FROM], this.searchTimePeriod[CD.TO]).then(() => {
            this.getHealthIndexData(nodeType).then(() => {
                console.log(`${nodeType}-getHealthIndexData`);
                if (this.isContributionShow) {
                    this.getHealthIndexContributeData().then(() => {
                        console.log(`${nodeType}-getHealthIndexContributeData`);
                        this.hideSpinner();
                    }).catch(() => {
                        console.log(`${nodeType}-getHealthIndexContributeData catch`);
                        this.hideSpinner();
                    });
                } else {
                    this.hideSpinner();
                }
            }).catch(() => {
                console.log(`${nodeType}-getHealthIndexData catch`);
                this.hideSpinner();
            });
        }).catch(() => {
            console.log(`${nodeType}-getMaintenanceData catch`);
            this.getHealthIndexData(nodeType).then(() => {
                if (this.isContributionShow) {
                    console.log(`${nodeType}-getHealthIndexData`);
                    this.getHealthIndexContributeData().then(() => {
                        console.log(`${nodeType}-getHealthIndexContributeData`);
                        this.hideSpinner();
                    }).catch(() => {
                        console.log(`${nodeType}-getHealthIndexContributeData catch`);
                        this.hideSpinner();
                    });
                } else {
                    this.hideSpinner();
                }
            }).catch(() => {
                console.log(`${nodeType}-getHealthIndexData catch`);
                this.hideSpinner();
            });
        });
    }
    getTrendSpec(from, to) {
        for (let i = 0; i < this.trendConfig['series'].length; i++) {
            if (this.trendConfig['series'][i].label == "Alarm") {
                console.log('Already exist alarm!');
                return;
            }
        }
        this._service.getSpectrumSpecConfig(this._plantId, this._areaId, this._eqpId, this._paramId, from, to).then((data) => {
            let spec_alarm = data.alarm;
            let spec_warning = data.warning;
            this.trendEventLines = [];
            if (spec_alarm) {
                this.trendEventLines.push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255, 0, 0, .5)',
                    line: {
                        name: `${this.alarmText} (${spec_alarm.toFixed(2)})`,
                        show: true, // default : false
                        value: spec_alarm,
                        color: '#ff0000',
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
                                return `${this.alarmText} (${spec_alarm.toFixed(2)})`;
                            }
                        },
                        draggable: {
                            show: false
                        },
                        label: {
                            show: true,         // default : false
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
            }

            if (spec_warning) {
                this.trendEventLines.push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255, 255, 0, .5)',
                    line: {
                        name: `${this.warningText} (${spec_warning.toFixed(2)})`,
                        show: true, // default : false
                        value: spec_warning,
                        color: '#ffa500',
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
                                return `${this.warningText} (${spec_warning.toFixed(2)})`;
                            }
                        },
                        draggable: {
                            show: false
                        },
                        label: {
                            show: true,         // default : false
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
            }
            for (let i: number = 0; i < this.problemEventData.length; i++) {
                this.trendEventLines.push(Object.assign({}, this.problemEventData[i]));
            }
            setTimeout(() => {
                if (this.measureDatas.length > 0) {
                    this._trendChartSelectedIndex = this.measureDatas.length - 1;
                    this.selectTrendDataPoint(2, 1, this._trendChartSelectedIndex);
                }
            }, 500);
            this.setMinMax(this.trendConfig, this.trendData, spec_alarm, spec_warning);

        });
    }
    analysisSummaryClick(causes) {
        console.log('analysisSummaryClick', causes);
        this.causeDatas = causes;
        $('#causeDetailModal').modal({ show: true, backdrop: false });
    }
    getHealthIndexContributeData() {
        // console.log('from, to', this.searchTimePeriod[CD.FROM], this.searchTimePeriod[CD.TO]);
        return this._service.getContribute(this._plantId,
            this._areaId,
            this._eqpId,
            this.searchTimePeriod[CD.FROM],
            this.searchTimePeriod[CD.TO]).then(data => {
                console.log('healthIndexContributeData.getContribute : ', data);
                let receiveData = [];
                this.healthContributeDatas = data;
                console.log('getHealthIndexContributeData', data);
                this.healthIndexContributeConfig['series'] = [];
                if (Object.keys(data).length === 0) { // event line 만 찍고 패스.
                    this.healthContributionEventLines = [];
                    for (let i: number = 0; i < this.problemEventData.length; i++) {
                        this.healthContributionEventLines.push(Object.assign({}, this.problemEventData[i]));
                    }
                    return;
                }
                let keys = Object.keys(data).sort().reverse();
                let times = data['time'];
                for (let key of keys) {
                    const tempKey = key;
                    let datas = [];
                    if (key !== 'time') {
                        this.healthIndexContributeConfig['series'].push({
                            label: tempKey
                        });
                        const dataSize = data[key].length;
                        for (let i = 0; i < dataSize; i++) {
                            // health index 와 x축 라인을 맞추기 위해 100 곱해줌.
                            // series click 시 파라미터 명칭을 가져오기 위해 key를 같이 넘겨줌.
                            datas.push([times[i], data[key][i] * 100, tempKey]);
                        }
                        receiveData.push(datas);
                    }
                }

                this.healthIndexContributeConfig = Object.assign({}, this.healthIndexContributeConfig);
                this.healthIndexContributeData = [];
                if (receiveData.length) {
                    this.healthIndexContributeData = receiveData;
                    console.log('receiveData', receiveData);
                }
                this.healthIndexContributeData = this.healthIndexContributeData.concat([]);
                this.healthContributionEventLines = [];
                for (let i: number = 0; i < this.problemEventData.length; i++) {
                    this.healthContributionEventLines.push(Object.assign({}, this.problemEventData[i]));
                }
                this.hideSpinner();
            });
    }

    getHealthIndexData(nodeType) {
        //Will be change to HealthIndex
        let from = new Date(this._toDate.getTime());
        from = this.addDays(from, -365 * 2);
        let fromTime = from.getTime();
        let baseDate = Date.parse('2016-01-01');
        if (from.getTime() < baseDate) {
            fromTime = baseDate;
        }
        let prevKey = this._plantId + ':' + this._areaId + ':' + this._eqpId;
        // console.log('getHealthIndexData key check : ', this._prevHealthIndexKey, prevKey);
        if (nodeType >= this.TYPES.EQP && prevKey === this._prevHealthIndexKey) {
            return Promise.reject('already draw');
        }
        this._prevHealthIndexKey = prevKey;
        return this._service.getHealthIndex(this._plantId,
            this._areaId,
            this._eqpId,
            this.searchTimePeriod[CD.FROM],
            this.searchTimePeriod[CD.TO]).then(data => {
                console.log('getHealthIndex : ', data);
                let trendData = [];
                if (data.alarm === undefined) return;

                let spec_alarm = data.alarm;
                this._specAlarm = spec_alarm;
                let spec_warning = data.warning;
                const dataSize = data.data.length;
                for (let i = 0; i < dataSize; i++) {
                    trendData.push([data.data[i][0], data.data[i][1]]);
                }

                this.healthIndexData = [];
                if (trendData.length) {
                    this.healthIndexData.push(trendData);
                }

                this.healthIndexData = this.healthIndexData.concat([]);
                this.healthEventLines = [];
                this.healthEventLines.push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255, 0, 0, .5)',
                    line: {
                        name: `${this.alarmText} (${(spec_alarm * (90 / this._specAlarm)).toFixed(2)})`,
                        show: true, // default : false
                        value: spec_alarm,
                        color: '#ff0000',
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
                                return `${this.alarmText} (${(spec_alarm * (90 / this._specAlarm)).toFixed(2)})`;
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
                this.healthEventLines.push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255,255, 0, .5)',
                    line: {
                        name: `${this.warningText} (${(spec_warning * (90 / this._specAlarm)).toFixed(2)})`,
                        show: true, // default : false
                        value: spec_warning,
                        color: '#ffa500',
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
                                return `${this.warningText} (${(spec_warning * (90 / this._specAlarm)).toFixed(2)})`;
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
                for (let i: number = 0; i < this.problemEventData.length; i++) {
                    this.healthEventLines.push(Object.assign({}, this.problemEventData[i]));
                }
            });
    }

    getTrendMultiple() {
        return this._service.getTrendMultiple(this._plantId,
            this._areaId,
            this._eqpId,
            this._paramId,
            this.searchTimePeriod[CD.FROM],
            this.searchTimePeriod[CD.TO]).then(data => {
                let trendData = [];
                let values = [];
                // let yVal = Math.random()*10;
                let max = 0;
                let min = Infinity;
                let alarm = [];
                let warning = [];

                let prevAlarm = null;
                let prevWarning = null;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        trendData.push([data[i][0], data[i][1]])
                        // values.push(data[i][1]);
                        max = Math.max(max, data[i][1]);
                        min = Math.min(min, data[i][1]);

                        if (prevAlarm == null || prevAlarm != data[i][2]) {
                            if (i != 0) {
                                if (prevAlarm != null) {
                                    alarm.push([data[i - 1][0], prevAlarm]);
                                }

                            }
                            if (data[i][2] != null) {
                                prevAlarm = data[i][2];
                                alarm.push([data[i][0], data[i][2]]);
                            }

                        }
                        if (prevWarning == null || prevWarning != data[i][3]) {
                            if (i != 0) {
                                if (prevWarning != null) {
                                    warning.push([data[i - 1][0], prevWarning]);
                                }
                            }
                            if (data[i][3] != null) {
                                prevWarning = data[i][3];
                                warning.push([data[i][0], data[i][3]]);
                            }
                        }
                    }
                    // if (alarm.length > 0 && alarm[alarm.length - 1][0] != data[data.length - 1][0]) {
                    //     if (data[data.length - 1][2] != null)
                    //         alarm.push([data[data.length - 1][0], data[data.length - 1][2]]);
                    // }
                    // if (warning.length > 0 && warning[warning.length - 1][0] != data[data.length - 1][0]) {
                    //     if (data[data.length - 1][3] != null)
                    //         warning.push([data[data.length - 1][0], data[data.length - 1][3]]);
                    // }



                    if (alarm.length > 0) {
                        if (alarm[alarm.length - 1][0] != data[data.length - 1][0]) {
                            if (data[data.length - 1][2] != null) {
                                alarm.push([data[data.length - 1][0], data[data.length - 1][2]]);
                            }
                        }
                        if (alarm[0][0] != data[0][0]) {
                            alarm.unshift([data[0][0], alarm[0][1]]);
                        }

                    }
                    if (warning.length > 0) {
                        if (warning[warning.length - 1][0] != data[data.length - 1][0]) {
                            if (data[data.length - 1][3] != null) {
                                warning.push([data[data.length - 1][0], data[data.length - 1][3]]);
                            }
                        }
                        if (warning[0][0] != data[0][0]) {
                            warning.unshift([data[0][0], warning[0][1]]);
                        }

                    }


                }

                this.mesaurementValue = (max - min) / 2 + min;

                this.trendData = [];
                let trendTempData = [];
                if (trendData.length) {
                    if (alarm.length > 0 && warning.length > 0) {
                        trendTempData.push(alarm);
                        trendTempData.push(warning);
                    }
                    trendTempData.push(trendData);
                }

                this.trendData = trendTempData.concat([]);
                this.trendConfig = this.getTrendDataConfig({});
                this.trendConfig.axes.yaxis.label = this._paramEuType;
                this.trendConfig['series'] = [];
                this.trendConfig['legend']['labels'] = [];

                if (trendData.length > 0) {
                    if (alarm.length > 0 && warning.length > 0) {
                        this.trendConfig['series'].push({
                            label: 'Alarm',
                            showLine: true,
                            showMarker: false,
                            renderer: $.jqplot.LineRenderer,
                            rendererOptions: {
                                pointLabels: {
                                    show: true
                                }
                            },
                            color: '#ff0000'
                        });
                        this.trendConfig['series'].push({
                            label: 'Warning',
                            showLine: true,
                            showMarker: false,
                            renderer: $.jqplot.LineRenderer,
                            rendererOptions: {
                                pointLabels: {
                                    show: true
                                }
                            },
                            color: '#ffa500'
                        });
                        this.trendConfig['legend']['labels'].push("Alarm");
                        this.trendConfig['legend']['labels'].push("Warning");
                    }

                    this.trendConfig['series'].push({
                        // trendline: {
                        //     show: true,
                        //     shadow: false,
                        //     lineWidth: 1,
                        //     color: '#0000ff'
                        // }
                        showLine: true,
                        showMarker: false,
                        renderer: $.jqplot.LineRenderer,
                        rendererOptions: {
                            pointLabels: {
                                show: true
                            }
                        }
                    }
                    );
                    this.trendConfig['legend']['labels'].push("RMS");
                    this.trendConfig['legend']['labels'].push("TraceRaw");


                    this.setMinMax(this.trendConfig, this.trendData, null, null);

                }
            });
    }
    setMinMax(config, data, alarm_spec, warning_spec) {
        try {
            let lowest = Number.POSITIVE_INFINITY;
            let highest = Number.NEGATIVE_INFINITY;
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                for (let index1 = 0; index1 < element.length; index1++) {
                    let element1 = element[index1][1];
                    let tmp = element1;
                    if (tmp < lowest) lowest = tmp;
                    if (tmp > highest) highest = tmp;

                }
            }
            if (alarm_spec != null) {
                let tmp = alarm_spec;
                if (tmp < lowest) lowest = tmp;
                if (tmp > highest) highest = tmp;

            }
            if (warning_spec != null) {
                let tmp = warning_spec;
                if (tmp < lowest) lowest = tmp;
                if (tmp > highest) highest = tmp;
            }

            config['axes']['yaxis']['min'] = lowest - Math.abs(lowest) * 0.5;
            config['axes']['yaxis']['max'] = highest + Math.abs(lowest) * 0.5;

        } catch (err) {
            console.log(err);
        }
    }
    getMeasurement() {
        this.clearUnderMeasurement();
        return this._service.getMeasurements(this._plantId,
            this._areaId,
            this._eqpId,
            this._paramId,
            this.searchTimePeriod[CD.FROM],
            this.searchTimePeriod[CD.TO]).then(data => {
                console.log('getMeasurements data ==> ', data)
                this.measureDatas = data;
                // console.log('getMeasurements : ', data);
                let measurement = [];
                for (let i = 0; i < data.length; i++) {
                    measurement.push([data[i].measureDtts, this.mesaurementValue]);
                }
                this.trendConfig = this.getTrendDataConfig(this.trendConfig);
                this.trendConfig.axes.yaxis.label = this._paramEuType;

                this.trendConfig['series'].push({
                    showLine: false,
                    showMarker: true,
                    markerOptions: {
                        size: 7,
                        lineWidth: 2,
                        stroke: true,
                        color: '#ff00ff',
                        style: 'circle'
                    },
                    renderer: $.jqplot.LineRenderer,
                    rendererOptions: {
                        pointLabels: {
                            show: true
                        }
                    }
                });

                // let trendData = [];
                this.trendData.push(measurement);
                // this.trendData = trendData.concat([]);

                if (data.length > 0) this.getTimeWaveNSpectrum(data.length - 1);
            });
    }

    selectTrendDataPoint(chartIdx, seriesIdx, counter) {
        const seriesIndex = seriesIdx; //0 as we have just one series
        const data = this.trendData[seriesIndex];
        const pointIndex = counter;
        if (!this.trendChartPlot) return;
        const x = (this.trendChartPlot as any)._plot.axes.xaxis.series_u2p(data[pointIndex][0]);
        const y = (this.trendChartPlot as any)._plot.axes.yaxis.series_u2p(data[pointIndex][1]);
        const r = 3;
        const drawingCanvas = $('.jqplot-multi-select-canvas')[chartIdx]; //$(".jqplot-series-canvas")[0];
        const context = drawingCanvas.getContext('2d');
        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); //plot.replot();
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }

    getMaintenanceData(from?: any, to?: any) {
        let prevKey = this._plantId + ':' + this._areaId + ':' + this._eqpId;
        if (this._nodeType > this.TYPES.EQP && prevKey === this._prevHealthIndexKey) {
            return Promise.reject('getMaintenanceData already draw');
        }
        let before1year = new Date();
        before1year = this.addDays(before1year, -365 * 5);
        let toDate = new Date();
        const fomDt = from ? from : before1year.getTime();
        const toDt = to ? to : toDate.getTime();
        return this._service.getMaintenance(this._plantId, this._areaId, this._eqpId, fomDt, toDt).then(data => {
            console.log('getMaintenanceData : ', data);
            this.problemIndexConfig['axes']['xaxis']['min'] = before1year.getTime();
            this.problemIndexConfig['axes']['xaxis']['max'] = toDate.getTime();
            this.problemIndexConfig = Object.assign({}, this.problemIndexConfig);
            this.problemDatas = data;
            let problem = [];
            // let yVal = Math.random()*10;
            for (let i = 0; i < data.length; i++) {
                problem.push([data[i].eventdate, 1]);
            }
            if (this.problemIndexData.length > 1) {
                this.problemIndexData.splice(1, 1);
            }
            this.problemIndexData.push(problem);
            this.problemIndexData = this.problemIndexData.concat([]);
            this.problemEventData = [];
            // health index, health contribution, trend chart 에 vertical line 추가.
            for (let i = 0; i < data.length; i++) {
                const eventLineObj = {
                    show: true,
                    name: data[i].failuretype,
                    type: 'line',
                    axis: 'xaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(0, 0, 255, .5)',
                    line: {
                        name: `${data[i].failuretype}`,
                        show: true, // default : false
                        value: data[i].eventdate,
                        color: '#f44242',
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
                            show: false
                        },
                        draggable: {
                            show: false
                        },
                        label: {
                            show: true,         // default : false
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
                };
                this.problemEventData.push(eventLineObj);
            }
        });
    }

    getTimeWaveNSpectrum(pointIndex) {
        this.showSpinner();
        let calls = [];

        this.timeWaveData = [];
        this.spectrumData = [];

        this.timeWaveConfig['series'] = [];
        this.spectrumConfig['series'] = [];

        this.timeWaveConfig.axes.yaxis.label = this._paramEuType;
        this.spectrumConfig.axes.yaxis.label = this._paramEuType;

        //current measurementdata
        let measurementId = this.measureDatas[pointIndex].measurementId;
        console.log('getTimeWaveNSpectrum : ', this.measureDatas[pointIndex], measurementId);

        this.timewavedate = moment(this.measureDatas[pointIndex].measureDtts).format('YYYY/MM/DD HH:mm:ss');

        calls.push(this._service.getTimewave(this._plantId, this._areaId, this._eqpId, measurementId).then(data => {
            this.timeWaveData = [data];
            this.timeWaveConfig['series'].push({ label: 'Current', color: 'rgb(51, 88, 255 )' });
            this.timeWaveConfig = Object.assign({}, this.timeWaveConfig);
        }));
        calls.push(this._service.getSpectrum(this._plantId, this._areaId, this._eqpId, measurementId).then(data => {
            this.spectrumData = [data];
            console.log('spectrum data ==> ', this.spectrumData);
            this.spectrumConfig['series'].push({ label: 'Current', color: 'rgb(51, 88, 255 )' });
            this.spectrumConfig = Object.assign({}, this.spectrumConfig);

        }));
        calls.push(this._service.getMeasureRPM(this._plantId, this._areaId, this._eqpId, measurementId).then(data => {
            //this.spectrumData = [data];
            this.rpms = data;
            this.rpmscombo = [];
            if (data.partsNameRPMs == undefined || data.partsNameRPMs.length == 0 || Object.keys(data.partsNameRPMs).length == 0) {
                if (this.rpms.part1x !== null) {
                    let keys = Object.keys(this.rpms.part1x);
                    for (let i = 0; i < keys.length; i++) {
                        let keyData = this.rpms.part1x[keys[i]];
                        this.rpmscombo.push({ 'display': this.rpms.partName[keys[i]], data: keyData, selected: false });
                    }
                    console.log(this.rpmscombo);
                }

            } else {
                let keys = Object.keys(data.partsNameRPMs);
                for (let i = 0; i < keys.length; i++) {
                    let keyData = data.partsNameRPMs[keys[i]];
                    if (keyData) {
                        keyData = keyData / 60;
                    }
                    this.rpmscombo.push({ 'display': keys[i], data: keyData, selected: false });
                }

            }
        }));
        calls.push(this._service.getAnalysis(this._plantId, this._areaId, this._eqpId, measurementId).then(data => {
            //this.spectrumData = [data];
            this.rootcause = '';
            if (data.causes.length > 0) {
                for (let i = 0; i < data.causes.length; i++) {
                    this.rootcause += ', [ ' + data.causes[i] + ' ]';
                    this.set1X(data.causes[i]);
                }
                if (this.rootcause.length > 0) {
                    this.rootcause = this.rootcause.substring(2);
                }
                this.multiComboCheckedItemsChanged(null);
            }
        }));
        // calls.push(this._service.getModelMeasurement(this._plantId, this._areaId, this._eqpId, measurementId).then((data: any) => {
        //     if (data !== null && Object.keys(data).length > 0) {
        //         let measurementId_b3 = data.measurementId;
        //         console.log('getModelMeasurement : ', data, data.measurementId);
        //         calls.push(this._service.getTimewave(this._plantId, this._areaId, this._eqpId, measurementId_b3).then((data: any) => {
        //             this.timeWaveData.push(data);
        //             this.timeWaveConfig['series'].push({ label: 'Model', color: 'rgba(63, 255, 51,0.75)' });
        //             this.timeWaveConfig = Object.assign({}, this.timeWaveConfig);
        //         }));
        //         calls.push(this._service.getSpectrum(this._plantId, this._areaId, this._eqpId, measurementId_b3).then((data: any) => {
        //             this.spectrumData.push(data);
        //             this.spectrumConfig['series'].push({ label: 'Model', color: 'rgba(63, 255, 51,0.75)' });
        //             this.spectrumConfig = Object.assign({}, this.spectrumConfig);
        //         }));
        //     }
        // }));

        Promise.all(calls).then((values) => {
            this._chRef.detectChanges();
            this.hideSpinner();
        });
    }

    set1X(cause: any) {
        try {
            // let firstX = cause.split("'")[2].split(':')[0].trim();
            let firstX = cause.split(/'/)[2].split(':')[0].trim();
            this.rpmscombo.forEach((data) => {
                // console.log(Object.keys(data.data), Object.keys(data.data).indexOf(firstX), firstX);
                if (data.display === firstX || (data.data !== null && Object.keys(data.data).indexOf(firstX) >= 0)) {
                    data.selected = true;
                    return;
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    electricCurrentDrawChart() {
        this.showSpinner();
        this.getElectricCurrent().then(() => {
            this.hideSpinner();
        }).catch(() => {
            this.hideSpinner();
        });
    }

    getElectricCurrent() {
        // this.timePeriodFrom.getTime(), this.timePeriodTo.getTime()
        return this._service.getElectricCurrent(this._plantId,
            this._areaId,
            this._eqpId,
            this.searchTimePeriod[CD.FROM],
            this.searchTimePeriod[CD.TO]).then(data => {
                let currData = [];
                // let yVal = Math.random()*10;
                for (let i = 0; i < data.length; i++) {
                    currData.push([data[i][0], data[i][1]]);
                }
                this.electricCurrentData = [];
                // if (this.electricCurrentData.length > 1) {
                //     this.problemIndexData.splice(1, 1);
                // }
                if (currData.length === 0) return;
                this.electricCurrentData.push(currData);
                this.electricCurrentData = this.electricCurrentData.concat([]);
            });
    }

    getTrendDataConfig(config) {
        let curConfig = {
            legend: {
                show: this.isShowTrendLegend,
                labels: ['RMS', 'TraceRaw']
            },
            eventLine: {
                show: true,
                tooltip: {  // default line tooltip options
                    show: false,         // default : true
                    adjust: 5,          // right, top move - default : 5
                    formatter: null,    // content formatting callback (must return content) - default : true
                    style: '',          // tooltip container style (string or object) - default : empty string
                    classes: ''         // tooltip container classes - default : empty string
                },
                events: []
            },
            seriesDefaults: {
                showMarker: false
            },
            axes: {
                xaxis: {
                    min: this.searchTimePeriod[CD.FROM],
                    max: this.searchTimePeriod[CD.TO],
                    autoscale: true,
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('MM-DD H') : '';
                        }
                    },
                    rendererOptions: {
                        dataType: 'date'
                    }
                },
                yaxis: {
                    drawMajorGridlines: true,
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        formatString: '%.2f'
                    }
                }
            },
            series: [
                {
                    label: 'Overall'
                },
                {
                    label: 'Measurement'
                }
            ],
            highlighter: {
                isMultiTooltip: false,
                clearTooltipOnClickOutside: false,
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                },
                // size: 2,
                sizeAdjust: 8.3,
                stroke: true,
                strokeStyle: '#acafaa',
                // tslint:disable-next-line:max-line-length
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    tooltipContentProc(moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
                },
            }
        };
        return Object.assign(curConfig, config);
    }

    //Event
    nodeClick(node: any) {
        if (node.treeview) {
            //FAB: 0,
            // AREA: 1,
            // EQP: 2,
            // PARAMETER: 100
            if (node.treeview.nodeType.toString().toUpperCase() == 'AREA') {
                this._nodeType = 1;
            } else if (node.treeview.nodeType.toString().toUpperCase() == 'EQP') {
                this._nodeType = 2;
            } else if (node.treeview.nodeType.toString().toUpperCase() == 'PARAMETER') {
                this._nodeType = 100;
            } else {
                this._nodeType = node.treeview.nodeType;
            }
            if (this._nodeType === this.TYPES.EQP) {
                this._eqpId = node.treeview.nodeId;
                this._areaId = node.treeview.parentnode.nodeId;
                this._eqpName = node.treeview.nodeName;
                this._shopName = node.treeview.parentnode.nodeName;

                // node.nodeName = node.eqpName;
                // node.nodeId = node.eqpId;
                // node.nodeType = this.TYPES.EQP;
                // node.iconClass = this._getImagePath(node.nodeType);
                // node.children = [];

            } else if (this._nodeType > this.TYPES.EQP) {
                this._eqpId = node.treeview.parentnode.nodeId;
                this._areaId = node.treeview.parentnode.parentnode.nodeId;
                this._paramId = node.treeview.nodeId;
                this._eqpName = node.treeview.parentnode.nodeName;
                this._shopName = node.treeview.parentnode.parentnode.nodeName;
            } else {
                this.healthIndexData = [];
                this.healthIndexContributeData = [];
                this.trendData = [];
                this.spectrumData = [];
                this.timeWaveData = [];
                return;
            }
        }

        this.removeContributioModal();
        this.nodeData(this._nodeType, this._areaId, this._eqpId, this._paramId);
    }

    // 데이터 로딩이 끝난 뒤 호출 될 함수
    nodeDataRes(): void {
        this.isDataLoaded = true;
    }

    // 자동으로 트리 오픈
    autoTreeOpen(): void {
        
        // 테이터를 불러온적이 없다면 트리 오픈 x
        if( !this.isDataLoaded ){ return; }

        // 첫번째 트리 오픈
        this.tree.initialTreeDatas[0].isChecked = false;
        this.tree.initialTreeDatas[0].isChildLoaded = true;
        this.tree.initialTreeDatas[0].isOpen = true;

        const treeChilds: any = this.tree.initialTreeDatas[0].children;
        const len: number = treeChilds.length;
        let i: number = 0;
        let row: any;
        let areaRow: any;

        // 2번째 area 오픈
        for( i=0; i<len; i++ ){
            row = treeChilds[i];
            if( row.areaId === this._areaId ){
                row.isChecked = false;
                row.isChildLoaded = false;
                row.isOpen = true;
                areaRow = row;
                break;
            }
        }

        const areaLen: number = areaRow.length;
        // 3번째 eqp 오픈
        for( i=0; i<areaLen; i++ ){
            if( areaRow[i].eqpId === this._eqpId ){
                areaRow[i].isChecked = false;
                areaRow[i].isChildLoaded = false;
                areaRow[i].isOpen = true;
            }
        }
    }

    matrixDblClick(item) {
        if (item == null) { return; }
        this.tree.setSelectNode(item.areaId, item.eqpId, item.paramId);
    }
    removeContributionBarChart() {
        this.renderer.setStyle(this.healthContributeChart.chartEl.parentElement.parentElement, 'width', "100%");
        this.contributeBarChartData = null;
    }

    multiComboCheckedItemsChanged(event) {
        let isStandard = true;
        if (this.rpms.partsNameRPMs == undefined || this.rpms.partsNameRPMs.length == 0 || Object.keys(this.rpms.partsNameRPMs).length == 0) {
            isStandard = false;
        }

        this.eventLines = [];
        for (let i = 0; i < this.rpmscombo.length; i++) {
            let pmId = '';
            //let value:number = null;
            if (this.rpmscombo[i].selected) {

                if (isStandard == true) {
                    let key = this.rpmscombo[i].display;
                    let value = this.rpmscombo[i].data;
                    this.eventLines.push({
                        show: true,
                        name: key,
                        type: 'line',
                        axis: 'xaxis',
                        //background: true,
                        fill: true,
                        fillStyle: 'rgba(0, 0, 255, .5)',
                        line: {
                            name: `${key} - 1x (${value.toFixed(2)})`,
                            show: true, // default : false
                            value: value,
                            color: '#ff0000',
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
                                    return `${key} - 1x (${value.toFixed(2)})`;
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

                } else {
                    pmId = this.rpmscombo[i].display;
                    let subData = this.rpmscombo[i].data;
                    let subKeys = Object.keys(subData);
                    for (let iSub = 0; iSub < subKeys.length; iSub++) {
                        let key = subKeys[iSub];
                        let value = subData[key];

                        this.eventLines.push({
                            show: true,
                            name: pmId,
                            type: 'line',
                            axis: 'xaxis',
                            //background: true,
                            fill: true,
                            fillStyle: 'rgba(0, 0, 255, .5)',
                            line: {
                                name: `${key} - 1x (${value.toFixed(2)})`,
                                show: true, // default : false
                                value: value,
                                color: '#ff0000',
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
                                        return `${key} - 1x (${value.toFixed(2)})`;
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
                    }
                }

            }
        }
    }

    addClickVerticalGuidLine(ev, gridpos, datapos, neighbor, plot) {
        if (!this.spectrumData.length) {
            return;
        }
        const compareValue = Math.round(+datapos.xaxis);
        // 0 - pass
        if (compareValue <= 0) {
            return;
        }
        const maxValue = +this.spectrumData[0][this.spectrumData[0].length - 1][0];
        const cnt = Math.floor(maxValue / compareValue);
        for (let i = 1; i < cnt + 1; i++) {
            this.eventLines.push({
                show: true,
                name: i + 'x',
                type: 'line',
                axis: 'xaxis',
                //background: true,
                fill: true,
                fillStyle: 'rgba(0, 0, 255, .5)',
                line: {
                    name: `${i}x`,
                    show: true, // default : false
                    value: compareValue * i,
                    color: '#c4be9b',
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
                        show: false
                    },
                    draggable: {
                        show: false
                    },
                    label: {
                        show: true,         // default : false
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
        }
    }

    healthIndexCompleteChart(event) {
        // this.healthIndexChart = event.component;
    }

    setHealthLegendStatus() {
        this.isHealthContributionLegend = !this.isHealthContributionLegend;
        const tempConfig: any = Object.assign({}, this.healthIndexContributeConfig);
        tempConfig.legend.show = this.isHealthContributionLegend;
        this.healthIndexContributeConfig = tempConfig;
    }

    showLegend(ev: any, index: number, isShow: boolean): void {
        let tempConfig: any;
        let legendShow: boolean;

        if (isShow === true) {
            legendShow = true;
        } else {
            legendShow = false;
        }

        if (index === 2) {
            tempConfig = Object.assign({}, this.trendConfig);
            tempConfig.legend.show = legendShow;
            this.trendConfig = tempConfig;
        } else if (index === 3) {
            tempConfig = Object.assign({}, this.spectrumConfig);
            tempConfig.legend.show = legendShow;
            this.spectrumConfig = tempConfig;
        } else if (index === 4) {
            tempConfig = Object.assign({}, this.timeWaveConfig);
            tempConfig.legend.show = legendShow;
            this.timeWaveConfig = tempConfig;
        }
    }

    expandChart(ev, panel, index) {
        this.isShowExpandBtn = false;
        this.chartPopup.show();
        const popupElem = $(this.popupBody.nativeElement);
        this._popupPanelElem = $(panel);
        if (index === 0) {
            this._prevPanel = null;
            this._nextPanel = $(this.chartHealthContribute.nativeElement);
        } else if (index === 1) {
            this._prevPanel = $(this.chartHealth.nativeElement);
            this._nextPanel = null;
        } else if (index === 2) {
            this._prevPanel = $(this.chartHealthContribute.nativeElement);
            this._nextPanel = null;

            // setTimeout(() => {
            //     this.selectTrendDataPoint(4, 1, this._trendChartSelectedIndex);
            // }, 500);
        } else if (index === 3) {
            this._prevPanel = $(this.chartTrend.nativeElement);
            this._nextPanel = null;
        } else if (index === 4) {
            this._prevPanel = $(this.chartSpectra.nativeElement);
            this._nextPanel = null;
        }
        popupElem.empty();
        setTimeout(() => {
            this._popupPanelElem.appendTo(popupElem);
        }, 500);

    }

    closePopup() {
        this.isShowExpandBtn = true;
        this._restoreChartPanel();
        this.chartPopup.hide();
    }

    // tslint:disable-next-line:no-empty
    onSliderChange(event) {

    }

    fromToChange(data: any) {
        this.searchTimePeriod = data;
    }

    changedDateFrom(event) {
        this.timePeriodFrom = new Date(event.datetime);
    }

    changedDateTo(event) {
        this.timePeriodTo = new Date(event.datetime);
    }

    showModeling() {
        if (this._shopName.length > 0 && this._eqpName.length > 0) {
            let outCd = this.getOutCondition('config');
            outCd[CD.PLANT] = this._plant;
            outCd[CD.AREA_ID] = this._areaId;
            outCd[CD.EQP_ID] = this._eqpId;
            this.syncOutCondition(outCd);
        }
    }

    showContributionChart() {
        this.showSpinner();
        if (this.healthIndexContributeData && !this.healthIndexContributeData.length) {
            this.getHealthIndexContributeData();
        } else {
            this.hideSpinner();
        }
        this.isContributionShow = !this.isContributionShow;
        console.log('healthIndexContributeData', this.healthIndexContributeData);
    }

    hideContributionChart() {
        this.isContributionShow = !this.isContributionShow;
    }

    // Util
    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    addHours(date, hours) {
        var result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }

    formatDate(date) {
        return moment(date).format('YYYY/MM/DD HH');
    }

    reduceTreeData(datas) {
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].children !== undefined && datas[i].children.length > 0) {
                datas[i]['isFolder'] = true;
                this.reduceTreeData(datas[i].children);
            }
        }
    }

    private _restoreChartPanel() {
        if (this._popupPanelElem) {
            if (this._prevPanel) {
                this._prevPanel.after(this._popupPanelElem);
            } else {
                this._nextPanel.before(this._popupPanelElem);
            }
            this._popupPanelElem = null;
            // setTimeout(() => {
            //     this.selectTrendDataPoint(2, 1, this._trendChartSelectedIndex);
            // }, 500);
        }
    }

    private _setProperties(props) {
        this._plant = props[CD.PLANT];
        this._cutoffType = props[CD.CUTOFF_TYPE];
        this._dayPeriod = props[CD.DAY_PERIOD];
        this._timePeriod = props[CD.TIME_PERIOD];
        // this.initDate(null);
    }

    private initDate(toDate: any) {
        if (this._cutoffType === 'DAY') {
            if (toDate === null) {
                let today = Date.now() - (Date.now() % 86400000) + (new Date().getTimezoneOffset() * 60000);
                this._toDate = new Date(today);
            } else {
                this._toDate = toDate;
            }
            this._fromDate = this.addDays(this._toDate, -this._dayPeriod);
            this.searchTimePeriod = {
                from: this._fromDate.getTime(),
                to: this._toDate.getTime()
            };
        } else {
            if (toDate === null) {
                this._toDate = new Date(this._timePeriod.to);
                this._fromDate = new Date(this._timePeriod.from);
            } else {
                this._toDate = toDate;
                this._fromDate = this.addDays(this._toDate, -(this._timePeriod.to - this._timePeriod.from) / (1000 * 60 * 60 * 24));
            }
        }
        // this.timePeriodTo = this._toDate;
        this.timePeriodTo = new Date('2016-08-29 17:32:00');
        this.timePeriodFrom = this.addHours(this.timePeriodTo, -1);
    }

    setTreeData(node): void {
        if (node.nodeType === this.TYPES.FAB) {
            node.icon = this._getImagePath('fab');
        }

        if (node.children.length > 0) {
            node.children.forEach((child) => {
                if (child.nodeType === this.TYPES.AREA) {//1
                    child.icon = this._getImagePath('area');
                } else if (child.nodeType === this.TYPES.EQP) {//2
                    child.icon = this._getImagePath('eqp');
                } else if (child.nodeType === this.TYPES.PARAMETER) {//100
                    child.icon = this._getImagePath('parameter');
                }

                this.setTreeData(child);
            });
        }
    }

    private setGlobalLabel(): void {
        let translater = this.translater;
        this.alarmText = translater.instant('PDM.SPEC.ALARM');
        this.warningText = translater.instant('PDM.SPEC.WARNING');
        this.analysisText = translater.instant('PDM.LABEL.ANALYSIS');
    }

    private _getImagePath(type: string): string {
        return `assets/images/pdm-master-${type}.png`;
    }

    private _init(isRefresh: boolean = false) {
        if (this._plant) {
            this._plantId = this._plant[CD.PLANT_ID];
            console.log('_init plantId', this._plantId);
            this.chartInit();
            // this._service.getNodeTree(this._plantId).then(data => {
            //     const tempTree = JSON.parse(JSON.stringify(data));
            //     this.setTreeData(tempTree[0]);

            //     let strData = JSON.stringify(tempTree);
            //     strData = strData.replace(/nodeName/g, 'title');

            //     const lDatas = JSON.parse(strData);
            //     this._service.reduceTreeData(lDatas);
            //     this.datas = lDatas;

            //     if (isRefresh) {
            //         this._nodeType = this.TYPES.EQP;
            //         const parentTree = this._service.searchTree('nodeId', this.datas[0], this._props[CD.EQP_ID]);
            //         const treeItem = this._service.searchTree('title', parentTree, data[2]);
            //         this.selectNode = treeItem.nodeId;
            //         this._eqpId = this._props[CD.EQP_ID];
            //         this._areaId = this._props[CD.AREA_ID];
            //     }
            //     this.hideSpinner();
            // }).catch(e => {
            //     console.log(e);
            //     this.hideSpinner();
            // });

            this.hideSpinner();
        } else {
            this.showNoData();
        }
    }
}
