//Angular
import { Component, OnInit, Output, OnChanges, Input, ViewChild, ViewEncapsulation, SimpleChanges, EventEmitter, ChangeDetectorRef } from '@angular/core';

//MI
import { PdmModelService } from './../../../../common';
import { PdmRadarService } from './../model/pdm-radar.service';
import * as pdmRadarI from './../model/pdm-radar.interface';

import { PdmRadarWidgetComponent } from './../pdm-radar-widget.component';
import { ContextMenuType } from '../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'alarm-warning-variation',
    templateUrl: './alarm-warning-variation.html',
    styleUrls: ['./alarm-warning-variation.css'],
    providers: [PdmModelService, PdmRadarService],
    encapsulation: ViewEncapsulation.None
})
export class AlarmWarningVariationComponent implements OnInit, OnChanges {
    @ViewChild('TrendChart') TrendChart: any;
    @ViewChild('Backdrop') Backdrop: any;

    @Input() condition: any;
    @Input() fullScreen: any;
    @Output() showContext: EventEmitter<any> = new EventEmitter();
    @Output() showParamContext: EventEmitter<any> = new EventEmitter();
    @Output() endLoading: EventEmitter<any> = new EventEmitter();
    @Output() countAlarmWarning: EventEmitter<any> = new EventEmitter();
    @Output() onScroll: EventEmitter<any> = new EventEmitter();

    trendParamId: any = "";
    selectedItem: any;
    trendParamName = "";
    trendEqpName = "";
    trendValue = "";
    trendEqpId = "";
    trendAreaId = "";
    trendPlantId;
    trendFromDate;
    trendToDate;
    trendSpecWarning;

    isMouseEnterDetail: any = false;
    showInfo: boolean = false;
    showX: any;
    showY: any;

    trendShow: boolean = false;
    trendX: any;
    trendY: any;
    trendHeight: any;

    AWNodataCtn: number;
    alarmWarningDatas: any;
    alarmDatas: any;
    B5Datas: any;
    G5Datas: any;
    chartType = "";

    fabId: number;
    timePeriod: any;

    mouseY: any = 0;

    isParamContext: boolean = false;
    isShowInfo: boolean = false;

    colIndex: number;

    selectedAWSection: number;
    selectedBadSection: number;
    selectedGoodSection: number;

    temp: number = 0;

    paramSelected = false;

    constructor(
        private _pdmModelService: PdmModelService,
        private _pdmRadarService: PdmRadarService,
        private _chRef: ChangeDetectorRef,
    ) {

    }

    ngOnInit() {
        // this.alarmWarningDatas = this.getSampleData("AW");
        // this.B5Datas = this.getSampleData("B5");
        // this.G5Datas = this.getSampleData("G5");
    }

    onscroll(ev: any) {
        this.onScroll.emit(ev);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['condition'] != null && changes['condition']['currentValue']) {
            let currentValue = changes['condition']['currentValue'];
            this.fabId = currentValue['fabId'];
            this.timePeriod = currentValue['timePeriod'];
            this._initData();

            this.getRadarDatas("AW");
            this.getRadarDatas("B5");
            this.getRadarDatas("G5");
        } else if (changes['fullScreen'] != null && changes['fullScreen']['currentValue'] != null) {
            this.trendShow = false;

            if (changes['fullScreen']['currentValue']) {
                // let height = $('.pdm-radar-wrapper.alram-type-danger').height();
                let height = $('.alarm-warning-type:first-child').height();

                if (height != null) {
                    $('.pdm-radar-wrapper.alram-type-danger').attr('style', 'height:' + height + "px !important");
                    $('.pdm-radar-wrapper.alram-type-warning').attr('style', 'height:' + height + "px !important");
                }

                $('.alarm-warning-type').attr('style', 'height:100% !important');
                $('.Bad5-type').hide();
                $('.Good5-type').hide();
            } else {
                // let height = $('alarm-type-danger')[0].height();
                $('.pdm-radar-wrapper.alram-type-danger').attr('style', '');
                $('.pdm-radar-wrapper.alram-type-warning').attr('style', '');
                $('.alarm-warning-type').attr('style', '');
                $('.Bad5-type').show();
                $('.Good5-type').show();
            }
        }
    }

    getSampleData(type) {
        let datas = [];
        if (type != undefined) {
            for (let i = 0; i < 5; i++) {
                let data_type = type;
                if (type == "AW") {
                    if (i > 2) {
                        data_type = "warning";
                    } else {
                        data_type = "alarm";
                    }
                }

                let data = [
                    [
                        { axis: "Email", value: 1 },
                        { axis: "Social Networks", value: 1 },
                        { axis: "Internet Banking", value: 1 },
                        { axis: "News Sportsites", value: 1 },
                        { axis: "Search Engine", value: 1 },
                        { axis: "View Shopping sites", value: 1 },
                        { axis: "Paying Online", value: 1 },
                        { axis: "Buy Online", value: 1 },
                    ],
                    [
                        { axis: "Email", value: 0.8 },
                        { axis: "Social Networks", value: 0.8 },
                        { axis: "Internet Banking", value: 0.8 },
                        { axis: "News Sportsites", value: 0.8 },
                        { axis: "Search Engine", value: 0.8 },
                        { axis: "View Shopping sites", value: 0.8 },
                        { axis: "Paying Online", value: 0.8 },
                        { axis: "Buy Online", value: 0.8 },
                    ], [
                        { axis: "Email", value: this.getValue(data_type) },
                        { axis: "Social Networks", value: this.getValue(data_type) },
                        { axis: "Internet Banking", value: this.getValue(data_type) },
                        { axis: "News Sportsites", value: this.getValue(data_type) },
                        { axis: "Search Engine", value: this.getValue(data_type) },
                        { axis: "View Shopping sites", value: this.getValue(data_type) },
                        { axis: "Paying Online", value: this.getValue(data_type) },
                        { axis: "Buy Online", value: this.getValue(data_type) },
                    ], [
                        { axis: "Email", value: this.getValue(data_type) },
                        { axis: "Social Networks", value: this.getValue(data_type) },
                        { axis: "Internet Banking", value: this.getValue(data_type) },
                        { axis: "News Sportsites", value: this.getValue(data_type) },
                        { axis: "Search Engine", value: this.getValue(data_type) },
                        { axis: "View Shopping sites", value: this.getValue(data_type) },
                        { axis: "Paying Online", value: this.getValue(data_type) },
                        { axis: "Buy Online", value: this.getValue(data_type) },
                    ], [
                        { axis: "Email", value: this.getValueMain(data_type) },
                        { axis: "Social Networks", value: this.getValueMain(data_type) },
                        { axis: "Internet Banking", value: this.getValueMain(data_type) },
                        { axis: "News Sportsites", value: this.getValueMain(data_type) },
                        { axis: "Search Engine", value: this.getValueMain(data_type) },
                        { axis: "View Shopping sites", value: this.getValueMain(data_type) },
                        { axis: "Paying Online", value: this.getValueMain(data_type) },
                        { axis: "Buy Online", value: this.getValueMain(data_type) },
                    ]
                ];

                let options = {
                    maxValue: 0.6,
                    levels: 6,
                    // ExtraWidthX: 300,
                    series: [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }, { fill: true, circle: false }],
                    color: (i) => {
                        let c = ['red', 'yellow', 'olive', 'aqua', 'yellow', 'green', 'blue'];
                        return c[i];
                    }
                }
                if (type == "AW") {
                    if (i > 2) { // warning
                        options.color = (i) => {
                            let c = ['red', 'yellow', 'olive', 'aqua', 'yellow', 'green', 'blue'];
                            return c[i];
                        }
                        datas.push({ type: 'warning', name: 'W-eqp' + i, duration: '2h 30m', problemreason: '', chartData: data, options: options });
                    } else { // alarm
                        options.color = (i) => {
                            let c = ['red', 'yellow', 'olive', 'aqua', 'red', 'green', 'blue'];
                            return c[i];

                        }
                        datas.push({ type: 'alarm', name: 'A-eqp' + i, duration: '2h 30m', problemreason: 'alarm problem', chartData: data, options: options });
                    }
                } else if (type == "B5") {
                    options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }, { fill: true, circle: false }]


                    options.color = (i) => {
                        let c = ['red', 'yellow', 'olive', 'aqua', 'blue', 'green', 'blue'];
                        return c[i];

                    }
                    datas.push({ type: 'B5', name: 'B5-eqp' + i, duration: '', problemreason: '', chartData: data, options: options });
                } else if (type == "G5") {
                    options.color = (i) => {
                        let c = ['red', 'yellow', 'olive', 'aqua', 'green', 'green', 'blue'];
                        return c[i];
                    }
                    datas.push({ type: 'G5', name: 'G5-eqp' + i, duration: '', problemreason: '', chartData: data, options: options });
                }
            }
        }
        // console.log('datas', datas);
        return datas;
    }

    getValue(type: string): any {
        let min = 0.2;
        let max = 0.6;
        // if (type == "alarm") {
        //     min = 0.7;
        //     max = 1.0;
        // } else if (type == "warning") {
        //     min = 0.5;
        //     max = 0.8;
        // }
        return Math.random() * (max - min) + min;
    }

    getValueMain(type: string): any {
        let min = 0.4;
        let max = 0.8;

        if (type == "alarm") {
            min = 0.7;
            max = 1.0;
        } else if (type == "warning") {
            min = 0.5;
            max = 0.8;
        }

        return Math.random() * (max - min) + min;
    }

    getRadarDatas(type: string): any {
        let radarEqpsParam: pdmRadarI.RadarEqpsRequestParam = {
            fabId: undefined,
            params: {
                fromDate: undefined,
                toDate: undefined,
                radarType: undefined
            }
        };

        radarEqpsParam.fabId = this.fabId;
        radarEqpsParam.params.radarType = type;
        radarEqpsParam.params.fromDate = this.timePeriod['from'];
        radarEqpsParam.params.toDate = this.timePeriod['to'];

        if (type === "AW") {
            this.getAWDatas(radarEqpsParam);
        } else if (type === "B5") {
            this.getB5Datas(radarEqpsParam);
        } else if (type === "G5") {
            this.getG5Datas(radarEqpsParam);
        }
    }

    getAWDatas(req): void {
        this._pdmRadarService.getRadarEqps(req)
            .then((eqps: any) => {
                let alarmWarningDatas = [];

                if (eqps.length && eqps.length > 0) {
                    let promises = [];

                    for (let i = 0; i < eqps.length; i++) {
                        promises.push(this._getAWRadars(eqps[i]));
                    }

                    Promise.all(promises)
                        .then((results) => {
                            let alarmDatas = [];
                            let warningDatas = [];

                            for (let i = 0; i < results.length; i++) {
                                if (results[i].type === "alarm") {
                                    alarmDatas.push(results[i]);
                                } else if (results[i].type === "warning") {
                                    warningDatas.push(results[i]);
                                }
                            }

                            this.alarmDatas = alarmDatas;
                            this.countAlarmWarning.emit({
                                alarmCount: alarmDatas.length,
                                warningCount: warningDatas.length
                            });

                            alarmWarningDatas = alarmDatas.concat(warningDatas);

                            if (alarmWarningDatas.length < 5) {
                                const dataLength = alarmWarningDatas.length;

                                for (let i = 0; i < 5 - dataLength; i++) {
                                    alarmWarningDatas.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
                                }

                            } else if (alarmWarningDatas.length % 5 === 0 && alarmWarningDatas.length > 5) {

                            } else if (alarmWarningDatas.length % 5 !== 0 && alarmWarningDatas.length > 5) {
                                const dataLength = alarmWarningDatas.length % 5;

                                for (let i = 0; i < 5 - dataLength; i++) {
                                    alarmWarningDatas.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
                                }

                            }


                            //     if (alarmDatas.length > 0 && warningDatas.length > 0) {
                            //         alarmWarningDatas = alarmDatas.concat(warningDatas);

                            //         if (alarmWarningDatas.length < 5) {
                            //             const dataLength = alarmWarningDatas.length;
                            //             for (let i = 0; i < 5 - dataLength; i++) {
                            //                 alarmWarningDatas.push({ type: 'warning', name: '', duration: '', problemreason: '', chartData: null, options: null });
                            //             }
                            //         }
                            //     } else if (alarmDatas.length > 0 && !warningDatas.length) {
                            //         alarmWarningDatas = alarmDatas;

                            //         if (alarmWarningDatas.length < 5) {
                            //             const dataLength = alarmWarningDatas.length;
                            //             for (let i = 0; i < 5 - dataLength; i++) {
                            //                 alarmWarningDatas.push({ type: 'alarm', name: '', duration: '', problemreason: '', chartData: null, options: null });
                            //             }
                            //         }
                            //     } else if (!alarmDatas.length && warningDatas.length > 0) {
                            //         alarmWarningDatas = warningDatas;

                            //         if (alarmWarningDatas.length < 5) {
                            //             const dataLength = alarmWarningDatas.length;
                            //             for (let i = 0; i < 5 - dataLength; i++) {
                            //                 alarmWarningDatas.push({ type: 'warning', name: '', duration: '', problemreason: '', chartData: null, options: null });
                            //             }
                            //         }
                            //     } else if (!alarmDatas.length && !alarmDatas.length) {
                            //         for (let i = 0; i < 5; i++) {
                            //             alarmWarningDatas.push({ type: 'alarm', name: '', duration: '', problemreason: '', chartData: null, options: null });
                            //         }
                            //     }

                            //     this.alarmWarningDatas = alarmWarningDatas;
                            //     console.log('alarmWarningDatas', this.alarmWarningDatas);

                            // }).catch(e => {
                            //     console.log('AW Promise all catch', e.message);
                            //     for (let i = 0; i < 5; i++) {
                            //         alarmWarningDatas.push({ type: 'alarm', name: '', duration: '', problemreason: '', chartData: null, options: null });
                            //     }

                            this.alarmWarningDatas = alarmWarningDatas;
                        });
                } else if (!eqps.length) {
                    // this.endLoading.emit(true);
                    for (let i = 0; i < 5; i++) {
                        alarmWarningDatas.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
                    }

                    this.alarmWarningDatas = alarmWarningDatas;
                }
            });
    }

    _getAWRadars(eqp: any): Promise<any> {
        let alarmData: any = {};
        let warningData: any = {};
        let alarmWarningData: any = {};
        let radarParamsParam: pdmRadarI.RadarParamsRequestParam = {
            fabId: undefined,
            eqpId: undefined,
            params: {
                fromDate: undefined,
                toDate: undefined
            }
        };

        radarParamsParam.fabId = this.fabId;
        radarParamsParam.eqpId = eqp.eqpId;
        radarParamsParam.params.fromDate = this.timePeriod['from'];
        radarParamsParam.params.toDate = this.timePeriod['to'];
        return this._pdmRadarService.getRadarParams(radarParamsParam)
            .then((params: any) => {
                let options: any = this.getChartOption();
                let data = [];
                let alarms = [];
                let wanrs = [];
                let avgSpecs = [];
                let avgDailys = [];
                let avgWithAWs = [];
                let AWwithAvgs = [];
                let variations = [];
                let classifications = [];

                for (let i = 0; i < params.length; i++) {
                    let param: any = params[i];

                    alarms.push({ //경고
                        axis: param.paramName,
                        value: param.alarm
                    });

                    wanrs.push({ //주의
                        axis: param.paramName,
                        value: param.warn
                    });

                    avgSpecs.push({ //90일평균
                        axis: param.paramName,
                        value: param.avgSpec
                    });

                    let avgDaily: number;
                    if(param.avgDaily > 1) {
                        avgDaily = 1;
                    } else {
                        avgDaily = param.avgDaily;
                    }

                    avgDailys.push({ //하루평균
                        axis: param.paramName,
                        value: avgDaily
                    });

                    let avgWithAW: number;
                    if(param.avgWithAW > 1) {
                        avgWithAW = 1;
                    } else {
                        avgWithAW = param.avgWithAW;
                    }

                    avgWithAWs.push({ //평균값(Warning, Alarm)
                        axis: param.paramName,
                        value: avgWithAW,
                        data: param
                    })

                    AWwithAvgs.push(param.avgWithAW);//for max alarm or waring
                    variations.push(param.variation);
                }

                // data = [alarms, wanrs, avgSpecs, avgDailys, avgWithAWs];
                data = [alarms, wanrs, avgDailys, avgWithAWs];
                options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];

                // const maxAvgWithAW = avgWithAWs.reduce((prev, current) => {// Find max avgWithAW
                //     return (prev.value > current.value) ? prev : current
                // });

                const maxAWwithAvg = Math.max(...AWwithAvgs);
                let details: any = {};
                let maxParam;

                for (let i = 0; i < params.length; i++) {
                    try{
                        if (maxAWwithAvg === params[i].avgWithAW) {
                            maxParam = params[i];
                            details = {
                                maxParamName: params[i].paramName,
                                maxDailyAvg: this.sliceDecimal(params[i].avgDaily, 4),
                                maxSpecAvg: this.sliceDecimal(params[i].avgSpec, 4),
                                maxAvgWithAW: this.sliceDecimal(params[i].avgWithAW, 4),
                                maxAWwithAvg: this.sliceDecimal(maxAWwithAvg, 4)
                            };

                            options.SelectLabel = params[i].paramName;

                            break;
                        }
                    }catch(err){
                        console.log(err);
                    }
                }

                this.temp++;

                // if (eqp.type === "Alarm" && parseInt((this.temp % 2).toString()) === 0) {
                if (eqp.type === "Warning") {
                    options.color = (i: number) => {
                        // let c: string[] = ['red', 'yellow', 'olive', 'aqua', 'yellow', 'green', 'blue'];
                        // let c: string[] = ['#eea29a', '#ffff56', 'olive', 'aqua', 'orange', 'green', 'blue'];
                        let c: string[] = ['#eea29a', '#ffff56', 'olive', 'orange'];
                        return c[i];
                    }

                    warningData = {
                        type: 'warning',
                        id: eqp.eqpId,
                        name: eqp.name,
                        problemreason: '',
                        details: details,
                        chartData: data,
                        options: options
                    };

                    alarmWarningData = warningData;
                    // } else if (eqp.type === 'Alarm' && parseInt((this.temp % 2).toString()) !== 0) {
                } else if (eqp.type === 'Alarm') {
                    options.color = (i: number) => {
                        // let c: string[] = ['#eea29a', '#ffff56', 'olive', 'aqua', 'red', 'green', 'blue'];
                        let c: string[] = ['#eea29a', '#ffff56', 'olive', 'red'];
                        return c[i];
                    }
                    alarmData = {
                        type: 'alarm',
                        id: eqp.eqpId,
                        name: eqp.name,
                        problemreason: maxParam.classifications,
                        details: details,
                        chartData: data,
                        options: options,
                        areaId: eqp.area_id
                    };

                    alarmWarningData = alarmData;
                }

                return Promise.resolve(alarmWarningData);
            });
    }

    getB5Datas(req): void {
        this._pdmRadarService.getRadarEqps(req).then(
            (eqps: any) => {
                if (eqps.length && eqps.length > 0) {
                    let promises = [];

                    for (let i = 0; i < eqps.length; i++) {
                        promises.push(this._getB5Radars(eqps[i]));
                    }

                    Promise.all(promises)
                        .then((results) => {
                            const resultLength = results.length;

                            if (resultLength && resultLength < 5) {
                                for (let i = 0; i < 5 - resultLength; i++) {
                                    results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null, areaId: null });
                                }
                            }

                            this.B5Datas = results;
                            console.log("B5Datas", results);
                        }).catch((e) => {

                        });
                } else if (!eqps.length) {
                    // this.endLoading.emit(true);
                    let results = [];

                    for (let i = 0; i < 5; i++) {
                        results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null, areaId: null });
                    }

                    this.B5Datas = results;
                }
            });
    }

    _getB5Radars(eqp: any): Promise<any> {
        let B5Data: any = {};
        let radarParamsParam: pdmRadarI.RadarParamsRequestParam = {
            fabId: undefined,
            eqpId: undefined,
            params: {
                fromDate: undefined,
                toDate: undefined
            }
        };

        radarParamsParam.fabId = this.fabId;
        radarParamsParam.eqpId = eqp.eqpId;
        radarParamsParam.params.fromDate = this.timePeriod['from'];
        radarParamsParam.params.toDate = this.timePeriod['to'];
        return this._pdmRadarService.getRadarParams(radarParamsParam).then(
            (params: any) => {
                let options: any = this.getChartOption();
                let data = [];
                let alarms = [];
                let wanrs = [];
                let avgSpecs = [];
                let avgDailys = [];
                let variations = [];
                let ratioVariations = [];

                for (let i = 0; i < params.length; i++) {
                    let param: any = params[i];

                    alarms.push({ // 경고
                        axis: param.paramName,
                        value: param.alarm
                    });

                    wanrs.push({ // 주의
                        axis: param.paramName,
                        value: param.warn
                    });

                    let avgSpec: number;
                    if(param.avgSpec > 1) {
                        avgSpec = 1
                    } else {
                        avgSpec = param.avgSpec;
                    }

                    avgSpecs.push({ // 90일평균
                        axis: param.paramName,
                        value: avgSpec
                    });

                    let avgDaily: number;
                    if(param.avgDaily > 1) {
                        avgDaily = 1
                    } else {
                        avgDaily = param.avgDaily;
                    }

                    avgDailys.push({ // 하루평균
                        axis: param.paramName,
                        value: avgDaily,
                        data: param
                    });

                    if (param.avgDaily != null && param.avgSpec != null) {
                        ratioVariations.push(param.avgDaily - param.avgSpec); // For max variation(daily-spec)
                    }

                    variations.push(param.variation);

                    // console.log(radarParamsParam.eqpId, param.paramName, param.avgDaily - param.avgSpec)
                }

                data = [alarms, wanrs, avgSpecs, avgDailys];
                options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];
                options.color = (i: number) => {
                    let c: string[] = ['#eea29a', '#ffff56', 'olive', '#ff009d', 'aqua', 'green', 'blue'];
                    return c[i];
                }

                const maxRatioVariation = Math.max(...ratioVariations);
                let details: any = {};

                for (let i = 0; i < params.length; i++) {
                    try{
                        if (maxRatioVariation === params[i].avgDaily - params[i].avgSpec) {
                            let minMaxRatioVariation = maxRatioVariation;
                            if (maxRatioVariation != 0) {
                                minMaxRatioVariation = this.sliceDecimal(maxRatioVariation, 4)
                            }

                            details = {
                                maxParamName: params[i].paramName,
                                maxDailyAvg: this.sliceDecimal(params[i].avgDaily, 4),
                                maxSpecAvg: this.sliceDecimal(params[i].avgSpec, 4),
                                minMaxRatioVariation: minMaxRatioVariation
                            };

                            options.SelectLabel = params[i].paramName;

                            break;
                        }
                    }catch(err){
                        console.log(err);
                    }
                }

                B5Data = {
                    type: 'B5',
                    id: eqp.eqpId,
                    name: eqp.name,
                    duration: '',
                    problemreason: '',
                    details: details,
                    chartData: data,
                    options: options,
                    labelColor: '#ff009d',
                    areaId: eqp.area_id
                };

                return Promise.resolve(B5Data);
            });
    }

    getG5Datas(req): void {
        this._pdmRadarService.getRadarEqps(req)
            .then((eqps: any) => {
                if (eqps.length && eqps.length > 0) {
                    let promises = [];

                    for (let i = 0; i < eqps.length; i++) {
                        promises.push(this._getG5Radars(eqps[i]));
                    }

                    Promise.all(promises)
                        .then((results) => {
                            const resultLength = results.length;

                            if (resultLength && resultLength < 5) {
                                for (let i = 0; i < 5 - resultLength; i++) {
                                    results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
                                }
                            }

                            this.G5Datas = results;
                            console.log("G5Datas", results);
                            setTimeout(() => {
                                this.endLoading.emit(true);
                            }, 1000)
                        }).catch((e) => {

                        });
                } else if (!eqps.length) {
                    this.endLoading.emit(true);
                    let results = [];

                    for (let i = 0; i < 5; i++) {
                        results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
                    }

                    this.G5Datas = results;
                }
            });
    }

    _getG5Radars(eqp): Promise<any> {
        let G5Data: any = {};
        let radarParamsParam: pdmRadarI.RadarParamsRequestParam = {
            fabId: undefined,
            eqpId: undefined,
            params: {
                fromDate: undefined,
                toDate: undefined
            }
        };

        radarParamsParam.fabId = this.fabId;
        radarParamsParam.eqpId = eqp.eqpId;
        radarParamsParam.params.fromDate = this.timePeriod['from'];
        radarParamsParam.params.toDate = this.timePeriod['to'];
        return this._pdmRadarService.getRadarParams(radarParamsParam).then(
            (params: any) => {
                let options: any = this.getChartOption();
                let data = [];
                let alarms = []
                let wanrs = [];
                let avgSpecs = [];
                let avgDailys = [];
                let variations = [];
                let ratioVariations = [];

                for (let i = 0; i < params.length; i++) {
                    let param: any = params[i];

                    alarms.push({ // 경고
                        axis: param.paramName,
                        value: param.alarm
                    });

                    wanrs.push({ // 주의
                        axis: param.paramName,
                        value: param.warn
                    });

                    let avgSpec: number;
                    if(param.avgSpec > 1) {
                        avgSpec = 1
                    } else {
                        avgSpec = param.avgSpec;
                    }

                    avgSpecs.push({ // 90일평균
                        axis: param.paramName,
                        value: avgSpec
                    });

                    let avgDaily: number;
                    if(param.avgDaily > 1) {
                        avgDaily = 1
                    } else {
                        avgDaily = param.avgDaily;
                    }

                    avgDailys.push({ // 하루평균
                        axis: param.paramName,
                        value: avgDaily,
                        data: param
                    });

                    if (param.avgDaily != null && param.avgSpec != null) {
                        ratioVariations.push(param.avgDaily - param.avgSpec); // For max variation(daily-spec)
                    }

                    variations.push(param.variation);
                }

                data = [alarms, wanrs, avgSpecs, avgDailys];
                options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];
                options.color = (i: number) => {
                    let c: string[] = ['#eea29a', '#ffff56', 'olive', '#22b8cf', 'aqua', 'green', 'blue'];
                    return c[i];
                };

                const minRatioVariation = Math.min(...ratioVariations);
                let details: any = {};

                for (let i = 0; i < params.length; i++) {
                    try{
                        if (params[i].avgDaily != null && params[i].avgSpec != null && minRatioVariation === params[i].avgDaily - params[i].avgSpec) {
                            let minMaxRatioVariation = minRatioVariation;
                            if (minMaxRatioVariation != 0) {
                                minMaxRatioVariation = this.sliceDecimal(minRatioVariation, 4)
                            }
                            details = {
                                maxParamName: params[i].paramName,
                                maxDailyAvg: this.sliceDecimal(params[i].avgDaily, 4),
                                maxSpecAvg: this.sliceDecimal(params[i].avgSpec, 4),
                                minMaxRatioVariation: minMaxRatioVariation
                            };

                            options.SelectLabel = params[i].paramName;

                            break;
                        }
                    }catch(err){
                        console.log(err);
                    }
                }

                G5Data = {
                    type: 'G5',
                    id: eqp.eqpId,
                    name: eqp.name,
                    duration: '',
                    problemreason: '',
                    details: details,
                    chartData: data,
                    options: options,
                    labelColor: '#6e79d2',
                    areaId: eqp.area_id
                };

                return Promise.resolve(G5Data);
            });
    }

    getChartOption(): any {
        return {
            maxValue: 0.6,
            levels: 6,
            // ExtraWidthX: 300,
            series: [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }, { fill: true, circle: false }],
            color: (i: number) => {
                let c: string[] = ['#eea29a', '#ffff56', 'olive', 'aqua', 'yellow', 'green', 'blue'];
                return c[i];
            }
        };
    }

    setDetails(variations: any[], maxVal: number, params: any): any {
        const maxIndex = variations.indexOf(maxVal);
        const maxParam = params[maxIndex]['paramName'];
        const max90Avg = params[maxIndex]['avgSpec'];
        const maxDailyAvg = params[maxIndex]['avgDaily'];
        let details = {
            maxVariation: this.sliceDecimal(maxVal, 4),
            maxParam: maxParam,
            max90Avg: this.sliceDecimal(max90Avg, 4),
            maxDailyAvg: this.sliceDecimal(maxDailyAvg, 4),
        };

        return details;
    }

    sliceDecimal(val: number, num: number): any {
        if (val) {
            let split = val.toString().split('.');
            let slice;
            if(split.length==2){
                slice= split[1].slice(0, num);
            }else{
                return val;
            }

            return `${split[0]}.${slice}`;
        } else {
            return;
        }
    }

    // Event
    // mouseEnter(item, event) {
    //     if (item.chartData) {
    //         this.selectedItem = this.objectUnion({}, item);
    //         this.selectedItem.options.ShowLabel = true;

    //         this.showInfo = true;

    //         this.setBoxLocation(event.x, event.y);
    //     } else {
    //         this.selectedItem = undefined;
    //     }
    // }

    mouseEnter(item: any, event: any, index: number): void | any {
        if (this.isShowInfo) {
            return;
        }

        if (item.chartData) {
            this.selectedItem = this.objectUnion({}, item);
            this.selectedItem['index'] = index;
        } else {
            this.selectedItem = undefined;
        }
    }

    mouseLeave(item: any): void {
        if (!this.isMouseEnterDetail) {
            this.showInfo = false;
        }
    }

    mouseMove(event: any): void {
        this.setBoxLocation(event.x, event.y);
        this.mouseY = event.y;
    }

    mouseEnterDetail(): void {
        this.isMouseEnterDetail = true;
        this.showInfo = true;
    }

    mouseLeaveDetail(): void {
        this.isMouseEnterDetail = false;
        this.showInfo = false;
    }

    showTrendChartAtContext(type: string, eqpName: string, eqpId: any, paramData: any, index: number, isInfo?: string): void {
        this.isParamContext = true;
        this.paramSelected = true;
        this.trendShow = true;
        this.colIndex = parseInt((index % 5).toString()); //Trend chart position
        this.chartType = type;
        this.isShowInfo = false;

        const backdropEl: any = $('#backdrop')[0];

        if (!backdropEl.hidden) {
            backdropEl.hidden = true;
        }

        setTimeout(() => {
            this.trendParamId = paramData.data.paramId;
            this.trendEqpName = eqpName;
            this.trendParamName = paramData.data.paramName;
            this.trendEqpId = eqpId;
            this.trendPlantId = this.fabId;
            this.trendFromDate = this.condition.timePeriod.from;
            this.trendToDate = this.condition.timePeriod.to;
            this.trendAreaId = null;
            this.trendValue = paramData.data.avgWithAW;
            this.trendSpecWarning = paramData.data.warn;
        });

        this.appendTrendChartEl(type, index);
    }

    onParamClick(type: string, eqpName: string, eqpId: any, paramData: any, index: number, isInfo?: string): void {
        this.isParamContext = true;
        this.trendShow = true;
        this.colIndex = parseInt((index % 5).toString()); //Trend chart position
        this.chartType = type;

        if (isInfo == null) {
            this.paramSelected = true;
        }


        // let obj = $('.alarm-warning-type')[0].getBoundingClientRect();
        // this.trendHeight = obj.height + "px";

        // if (type === 'alarm' || type === 'warning') {
        //     this.trendX = 0 + "px";
        //     if (this.fullScreen) {
        //         if (this.mouseY < obj.height / 3 * 2) {
        //             this.trendY = obj.height / 3 * 2 + "px";
        //         } else {
        //             this.trendY = "0px";
        //         }
        //         this.trendHeight = obj.height / 3 + "px";

        //     } else {
        //         this.trendY = obj.height + "px";
        //     }
        // } else if (type === "B5") {
        //     let obj1 = $('.Good5-type')[0].getBoundingClientRect();
        //     this.trendX = 0 + "px";
        //     this.trendY = obj1.y - obj.y + "px";

        // } else if (type === "G5") {
        //     let obj1 = $('.Bad5-type')[0].getBoundingClientRect();
        //     this.trendX = 0 + "px";
        //     this.trendY = obj1.y - obj.y + "px";
        // }

        // this.trendParamId = null;

        if (this.selectedItem) {
            this.showParamContext.emit({
                selectedItem: this.selectedItem,
                timePeriod: this.timePeriod,
                type: type,
                eqpName: eqpName,
                eqpId: eqpId,
                paramData: paramData,
                event: event,
                index: index,
                flag: isInfo
            });
        }

        if (isInfo !== 'isInfo') {
            setTimeout(() => {
                this.trendParamId = paramData.data.paramId;
                this.trendEqpName = eqpName;
                this.trendParamName = paramData.data.paramName;
                this.trendEqpId = eqpId;
                this.trendPlantId = this.fabId;
                this.trendFromDate = this.condition.timePeriod.from;
                this.trendToDate = this.condition.timePeriod.to;
                this.trendAreaId = null;
                this.trendValue = paramData.data.avgWithAW;
                this.trendSpecWarning = paramData.data.warn;
            });

            this.appendTrendChartEl(type, index);

        }
    }

    appendTrendChartEl(type: string, index: number): void {
        let dataLength: number;
        let selector: string;

        if (type === 'alarm' || type === 'warning') {
            dataLength = this.alarmWarningDatas.length;
            selector = '#alarmWarning';
        } else if (type === 'B5') {
            dataLength = this.B5Datas.length;
            selector = '#bad';
        } else if (type === 'G5') {
            dataLength = this.G5Datas.length;
            selector = '#good';
        }

        const row: number = parseInt((index / 5).toString()) + 1;
        let lastCol: number = row * 5 - 1;
        const lastRow: number = parseInt((dataLength / 5).toString()) + 1;

        if (dataLength - 1 === lastCol) {
            lastCol = dataLength - 1;
        } else if (row === lastRow) {
            lastCol = dataLength - 1;
        }

        const trendChartEl: any = $('#trendChart')[0];
        // trendChartEl.hidden = false;
        $(selector + lastCol).after(trendChartEl);
    }

    onEqpClick(event: any, item: any, isPopup): void {

        if (isPopup == null) {
            isPopup = false;
        }

        if (this.isParamContext) { // Open Context
            this.isParamContext = false;
            return;
        }
        if (!isPopup) {
            this.paramSelected = false;
        }

        const trendChartEl: any = $('#trendChart')[0];
        if (!trendChartEl.hidden) { // Close trend chart
            // trendChartEl.hidden = true;
        }


        if (event.target.tagName != 'circle' && !isPopup) {
            this.trendShow = false;

            // this.showInfo = false;

            setTimeout(() => {
                if (this.selectedItem) {
                    this.selectedItem = this.objectUnion({}, this.selectedItem);
                }
            })
        }

        if (this.selectedItem) {
            this.showContext.emit({
                selectedItem: this.selectedItem,
                event: event
            });
        }
    }

    onClickSection(type: string, index: number): void {
        this.activeByType(type, index);
    }

    activeByType(type: string, index: number): void {
        if (type === 'alarm' || type === 'warning') {
            this.selectedBadSection = null;
            this.selectedGoodSection = null;
            this.selectedAWSection = index;
        } else if (type === 'B5') {
            this.selectedAWSection = null;
            this.selectedGoodSection = null;
            this.selectedBadSection = index;
        } else if (type === 'G5') {
            this.selectedAWSection = null;
            this.selectedBadSection = null;
            this.selectedGoodSection = index;
        }
    }

    zoom(zoom: string, item: any, event?: any): void {
        if (zoom == "in") {
            item.options.zoom += 0.5;
        } else if (zoom == "out") {
            item.options.zoom -= 0.5;
        } else if (zoom == "refresh") {
            item.options.zoom = 1;
        }

        if (item.options.zoom < 1) {
            item.options.zoom = 1;
        }

        item.options = this.objectUnion({}, item.options);
    }

    showRadarInfo(item: any, event: any, index: number): void | any {
        if (item.chartData) {
            this.activeByType(item.type, index);
            this.selectedItem.options.ShowLabel = true;
            this.isShowInfo = true;
            this.showInfo = true;

            const backdropEl: any = $('#backdrop')[0];

            if (backdropEl.hidden) {
                backdropEl.hidden = false;
            }

            if (this.paramSelected) {
                this.paramSelected = false;
            }

            const trendChartEl: any = $('#trendChart')[0];
            // this.setBoxLocation(event.x, event.y);
            setTimeout(() => {
                $('.widget-pdm-radar .pdm-radar-info-hover').addClass('prih-on');
            }, 100);
        }
    }

    closeRadarInfo(): void {
        if (this.isShowInfo) {
            this.isShowInfo = false;
            this.showInfo = false;
            const backdropEl: any = $('#backdrop')[0];

            if (!backdropEl.hidden) { //Open backdrop
                backdropEl.hidden = true;
            }

            this.initActive();
        } 
    }

    closeTrendChart(): void {
        this.paramSelected = false;
        this.trendShow = false;
        this.trendParamId = null;
        this.chartType = null;
        this.initActive();

        // setTimeout(() => {
        //     // const trendChartEl: any = $('#trendChart')[0];
        //     $('#radar-layer-on .off').css({'display': 'block'});
        // }, 100);
    }

    initActive(): void {
        if (this.selectedAWSection || this.selectedAWSection === 0) {
            this.selectedAWSection = null;
        } else if (this.selectedBadSection || this.selectedBadSection === 0) {
            this.selectedBadSection = null;
        } else if (this.selectedGoodSection || this.selectedGoodSection === 0) {
            this.selectedGoodSection = null;
        }
    }

    setBoxLocation(mouseX: number, mouseY: number): void {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let boxWidth = 600;
        let boxHeight = 500;

        let newX, newY;
        let yGap = 50;
        let xGap = 300;
        let yCheckGap = 50;

        newY = height / 2 - boxHeight / 2 - yGap;

        if (width - boxWidth < mouseX) {
            newX = mouseX - boxWidth - xGap;
        }
        else if (mouseX < boxWidth) {
            newX = mouseX + xGap;
        }
        else {
            newX = mouseX + xGap;
            if (width - boxWidth < newX) {
                newX = mouseX - boxWidth - xGap;
                if (newX < 0) {
                    newX = 0;
                }
            }
        }
        this.showX = newX + 'px';
        this.showY = newY + 'px';
    }
    // Util
    objectUnion(obj1: any, obj2: any): any {
        let tempParent = [];
        let newObj = this.objectUnionSub(obj1, obj2);
        newObj = this.assignFunctions(newObj, obj2);
        return newObj;
    }

    objectUnionSub(obj1: any, obj2: any): any {
        let newObj = obj1;
        if (obj2 == undefined) {
            return newObj;
        }
        let keys = Object.keys(obj2);
        for (let i = 0; i < keys.length; i++) {
            if (obj1[keys[i]] == undefined) {
                if (typeof obj2[keys[i]] !== 'function') {
                    if (obj2[keys[i]] != undefined) {
                        newObj[keys[i]] = JSON.parse(JSON.stringify(obj2[keys[i]]));
                    } else {
                        newObj[keys[i]] = undefined;
                    }
                    //   newObj[keys[i]] = obj2[keys[i]];
                } else {
                    newObj[keys[i]] = obj2[keys[i]];
                }

            } else {
                if (typeof obj2[keys[i]] === 'object') {
                    newObj[keys[i]] = this.objectUnionSub(obj1[keys[i]], obj2[keys[i]]);
                } else {
                    newObj[keys[i]] = obj2[keys[i]];
                }
            }
        }
        return newObj;
    }

    assignFunctions(targetObj: any, obj: any): any {
        if (obj == undefined) {
            return targetObj;
        }
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            if (typeof obj[keys[i]] == 'function') {
                //parents.push({key:keys[i],value:obj[keys[i]]});
                targetObj[keys[i]] = obj[keys[i]];
            } else if (typeof obj[keys[i]] == 'object') {
                this.assignFunctions(targetObj[keys[i]], obj[keys[i]]);
            }
        }
        return targetObj;
    }

    private _initData(): void {
        if (this.trendParamId) {
            this.trendParamId = null;
        }

        this.alarmWarningDatas = null;
        this.alarmDatas = null;
        this.B5Datas = null;
        this.G5Datas = null;

        this.chartType = null;
        this.colIndex = null;
        this.selectedItem = null;

        this.isShowInfo = false;
        this.isParamContext = false;
        this.isMouseEnterDetail = null;

        this.paramSelected = false;
    }
}
