//Angular
import { Component, OnInit, Output, OnChanges, Input, ViewChild, ViewEncapsulation, SimpleChanges, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';

//MI
import { PdmModelService } from './../../../../common';
import { PdmRadarService } from './../model/pdm-radar.service';
import * as pdmRadarI from './../model/pdm-radar.interface';

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

    colIndex: number;

    selectedAWSection: number;
    selectedBadSection: number;
    selectedGoodSection: number;

    temp: number = 0;

    isShowExpandBtn: boolean = true;
    isParamContext: boolean = false;
    isShowInfo: boolean = false;
    expandLoad: boolean = false;
    paramSelected: boolean = false;

    paramDatas: any[] = [];
    worstTop: number;

    constructor(
        private _pdmRadarService: PdmRadarService
    ) {

    }

    ngOnInit() {
        // (<HTMLElement>document.querySelector('.container')).bind('scroll', function(){

        // });
    }

    // onscroll(ev: any) {
    //     console.log('onscroll', ev);
    //     this.onScroll.emit(ev);
    // }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['condition'] != null && changes['condition']['currentValue']) {
            let currentValue = changes['condition']['currentValue'];
            this.fabId = currentValue['fabId'];
            this.timePeriod = currentValue['timePeriod'];
            this.worstTop = currentValue['worstTop'];
            this._initData();

            this.getRadarDatas("AW");
            this.getRadarDatas("B5");
            // this.getRadarDatas("B5");
            // this.getRadarDatas("G5");
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

    getRadarDatas(type: string): any {
        let radarEqpsParam: pdmRadarI.RadarEqpsRequestParam = {
            fabId: undefined,
            params: {
                fromDate: undefined,
                toDate: undefined,
                radarType: undefined,
                numberOfWorst: undefined
            }
        };

        radarEqpsParam.fabId = this.fabId;
        radarEqpsParam.params.fromDate = this.timePeriod['from'];
        radarEqpsParam.params.toDate = this.timePeriod['to'];
        radarEqpsParam.params.numberOfWorst = this.worstTop;

        if (type === "AW") {
            radarEqpsParam.params.radarType = 'AW';
            this.getAWDatas(radarEqpsParam);
        } else if (type === "B5") {
            radarEqpsParam.params.radarType = 'NW';
            this.getNWDatas(radarEqpsParam);
        }
        // else if (type === "B5") {
        //     this.getB5Datas(radarEqpsParam);
        // } else if (type === "G5") {
        //     this.getG5Datas(radarEqpsParam);
        // }
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

                            this.alarmWarningDatas = alarmWarningDatas;

                            setTimeout(() => {
                                this.endLoading.emit(true);
                            }, 2500);
                        });
                } else if (!eqps.length) {
                    for (let i = 0; i < 5; i++) {
                        alarmWarningDatas.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
                    }

                    this.alarmWarningDatas = alarmWarningDatas;
                    setTimeout(() => {
                        this.endLoading.emit(true);
                    }, 2500);
                }
            });
    }

    _getAWRadars(eqp: any): Promise<any> {
        let alarmData: pdmRadarI.ChartDataType;
        let warningData: pdmRadarI.ChartDataType;
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
                let data: any = {};
                let alarms: any[] = [];
                let warns: any[] = [];
                let avgSpecs: any[] = [];
                let avgDailys: any[] = [];
                let avgWithAWs: any[] = [];
                let AWwithAvgs: any[] = [];
                let variations: any[] = [];
                let paramDatas: any = [];

                for (let i = 0; i < params.length; i++) {
                    let param: any = params[i];

                    alarms.push({ //경고
                        id: param.paramId,
                        axis: param.paramName,
                        value: param.alarm
                    });

                    warns.push({ //주의
                        id: param.paramId,
                        axis: param.paramName,
                        value: param.warn
                    });

                    avgSpecs.push({ //90일평균
                        id: param.paramId,
                        axis: param.paramName,
                        value: param.avgSpec
                    });

                    avgDailys.push({ //하루평균
                        id: param.paramId,
                        axis: param.paramName,
                        value: param.avgDaily
                    });

                    avgWithAWs.push({ //평균값(Warning, Alarm)
                        id: param.paramId,
                        axis: param.paramName,
                        value: param.avgWithAW,
                        data: param
                    });

                    paramDatas.push({
                        paramId: param.paramId,
                        paramName: param.paramName,
                        eqpId: eqp.eqpId,
                        eqpName: eqp.eqpName
                    });

                    AWwithAvgs.push(param.avgWithAW);//for max alarm or waring
                    variations.push(param.variation);
                }

                data = {
                    alarms: alarms,
                    warns: warns,
                    avgWithAWs: avgWithAWs,
                    avgDailys: avgDailys,
                    paramDatas: paramDatas
                };

                options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];

                const maxAWwithAvg = Math.max(...AWwithAvgs);
                let details: any = {};
                let maxParam;

                for (let i = 0; i < params.length; i++) {
                    try {
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
                    } catch (err) {
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

    getNWDatas(req): void {
        // console.log('NW req', req);
        this._pdmRadarService.getRadarEqps(req).then(
            (eqps: any) => {
                // console.log('NW eqps', eqps);
                if (eqps.length && eqps.length > 0) {
                    let promises = [];

                    for (let i = 0; i < eqps.length; i++) {
                        promises.push(this._getNWRadars(eqps[i]));
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
                            // console.log("B5Datas", results);
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

    _getNWRadars(eqp: any): Promise<any> {
        let NWData: any = {};
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
                // console.log('Params', params);
                // if (params && params.length) {
                    let options: any = this.getChartOption();
                    // let data = [];
                    let data: any = {};
                    let alarms = [];
                    let warns = [];
                    let avgSpecs = [];
                    let avgDailys = [];
                    let variations = [];
                    let ratioVariations = [];
                    let paramDatas = [];

                    for (let i = 0; i < params.length; i++) {
                        let param: any = params[i];

                        alarms.push({ // 경고
                            id: param.paramId,
                            axis: param.paramName,
                            value: param.alarm
                        });

                        warns.push({ // 주의
                            id: param.paramId,
                            axis: param.paramName,
                            value: param.warn
                        });

                        avgSpecs.push({ // 90일평균
                            id: param.paramId,
                            axis: param.paramName,
                            value: param.avgSpec
                        });

                        avgDailys.push({ // 하루평균
                            id: param.paramId,
                            axis: param.paramName,
                            value: param.avgDaily,
                            data: param
                        });

                        paramDatas.push({
                            paramId: param.paramId,
                            paramName: param.paramName,
                            eqpId: eqp.eqpId,
                            eqpName: eqp.eqpName
                        });

                        if (param.avgDaily != null && param.avgSpec != null) {
                            ratioVariations.push(param.avgDaily - param.avgSpec); // For max variation(daily-spec)
                        }

                        variations.push(param.variation);

                        // console.log(radarParamsParam.eqpId, param.paramName, param.avgDaily - param.avgSpec)
                    }

                    // data = [alarms, wanrs, avgSpecs, avgDailys];
                    data = {
                        alarms: alarms,
                        warns: warns,
                        avgSpecs: avgSpecs,
                        avgDailys: avgDailys,
                        paramDatas: paramDatas
                    };

                    // console.log('Data', data);

                    options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];
                    options.color = (i: number) => {
                        let c: string[] = ['#eea29a', '#ffff56', 'olive', '#ff009d', 'aqua', 'green', 'blue'];
                        return c[i];
                    }

                    const maxRatioVariation = Math.max(...ratioVariations);
                    let details: any = {};

                    for (let i = 0; i < params.length; i++) {
                        try {
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
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    NWData = {
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

                    // console.log('NW Data', NWData);

                    return Promise.resolve(NWData);
                // } else {
                //     return Promise.reject();
                // }
            });
    }

    // getB5Datas(req): void {
    //     this._pdmRadarService.getRadarEqps(req).then(
    //         (eqps: any) => {
    //             if (eqps.length && eqps.length > 0) {
    //                 let promises = [];

    //                 for (let i = 0; i < eqps.length; i++) {
    //                     promises.push(this._getB5Radars(eqps[i]));
    //                 }

    //                 Promise.all(promises)
    //                     .then((results) => {
    //                         const resultLength = results.length;

    //                         if (resultLength && resultLength < 5) {
    //                             for (let i = 0; i < 5 - resultLength; i++) {
    //                                 results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null, areaId: null });
    //                             }
    //                         }

    //                         this.B5Datas = results;
    //                         // console.log("B5Datas", results);
    //                     }).catch((e) => {

    //                     });
    //             } else if (!eqps.length) {
    //                 // this.endLoading.emit(true);
    //                 let results = [];

    //                 for (let i = 0; i < 5; i++) {
    //                     results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null, areaId: null });
    //                 }

    //                 this.B5Datas = results;
    //             }
    //         });
    // }

    // _getB5Radars(eqp: any): Promise<any> {
    //     let B5Data: any = {};
    //     let radarParamsParam: pdmRadarI.RadarParamsRequestParam = {
    //         fabId: undefined,
    //         eqpId: undefined,
    //         params: {
    //             fromDate: undefined,
    //             toDate: undefined
    //         }
    //     };

    //     radarParamsParam.fabId = this.fabId;
    //     radarParamsParam.eqpId = eqp.eqpId;
    //     radarParamsParam.params.fromDate = this.timePeriod['from'];
    //     radarParamsParam.params.toDate = this.timePeriod['to'];
    //     return this._pdmRadarService.getRadarParams(radarParamsParam).then(
    //         (params: any) => {
    //             let options: any = this.getChartOption();
    //             // let data = [];
    //             let data: any = {};
    //             let alarms = [];
    //             let warns = [];
    //             let avgSpecs = [];
    //             let avgDailys = [];
    //             let variations = [];
    //             let ratioVariations = [];
    //             let paramDatas = [];

    //             for (let i = 0; i < params.length; i++) {
    //                 let param: any = params[i];

    //                 alarms.push({ // 경고
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.alarm
    //                 });

    //                 warns.push({ // 주의
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.warn
    //                 });

    //                 avgSpecs.push({ // 90일평균
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.avgSpec
    //                 });

    //                 avgDailys.push({ // 하루평균
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.avgDaily,
    //                     data: param
    //                 });

    //                 paramDatas.push({
    //                     paramId: param.paramId,
    //                     paramName: param.paramName,
    //                     eqpId: eqp.eqpId,
    //                     eqpName: eqp.eqpName
    //                 });

    //                 if (param.avgDaily != null && param.avgSpec != null) {
    //                     ratioVariations.push(param.avgDaily - param.avgSpec); // For max variation(daily-spec)
    //                 }

    //                 variations.push(param.variation);

    //                 // console.log(radarParamsParam.eqpId, param.paramName, param.avgDaily - param.avgSpec)
    //             }

    //             // data = [alarms, wanrs, avgSpecs, avgDailys];
    //             data = {
    //                 alarms: alarms,
    //                 warns: warns,
    //                 avgSpecs: avgSpecs,
    //                 avgDailys: avgDailys,
    //                 paramDatas: paramDatas
    //             };

    //             options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];
    //             options.color = (i: number) => {
    //                 let c: string[] = ['#eea29a', '#ffff56', 'olive', '#ff009d', 'aqua', 'green', 'blue'];
    //                 return c[i];
    //             }

    //             const maxRatioVariation = Math.max(...ratioVariations);
    //             let details: any = {};

    //             for (let i = 0; i < params.length; i++) {
    //                 try {
    //                     if (maxRatioVariation === params[i].avgDaily - params[i].avgSpec) {
    //                         let minMaxRatioVariation = maxRatioVariation;
    //                         if (maxRatioVariation != 0) {
    //                             minMaxRatioVariation = this.sliceDecimal(maxRatioVariation, 4)
    //                         }

    //                         details = {
    //                             maxParamName: params[i].paramName,
    //                             maxDailyAvg: this.sliceDecimal(params[i].avgDaily, 4),
    //                             maxSpecAvg: this.sliceDecimal(params[i].avgSpec, 4),
    //                             minMaxRatioVariation: minMaxRatioVariation
    //                         };

    //                         options.SelectLabel = params[i].paramName;

    //                         break;
    //                     }
    //                 } catch (err) {
    //                     console.log(err);
    //                 }
    //             }

    //             B5Data = {
    //                 type: 'B5',
    //                 id: eqp.eqpId,
    //                 name: eqp.name,
    //                 duration: '',
    //                 problemreason: '',
    //                 details: details,
    //                 chartData: data,
    //                 options: options,
    //                 labelColor: '#ff009d',
    //                 areaId: eqp.area_id
    //             };

    //             return Promise.resolve(B5Data);
    //         });
    // }

    // getG5Datas(req): void {
    //     this._pdmRadarService.getRadarEqps(req)
    //         .then((eqps: any) => {
    //             if (eqps.length && eqps.length > 0) {
    //                 let promises = [];

    //                 for (let i = 0; i < eqps.length; i++) {
    //                     promises.push(this._getG5Radars(eqps[i]));
    //                 }

    //                 Promise.all(promises)
    //                     .then((results) => {
    //                         const resultLength = results.length;

    //                         if (resultLength && resultLength < 5) {
    //                             for (let i = 0; i < 5 - resultLength; i++) {
    //                                 results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
    //                             }
    //                         }

    //                         this.G5Datas = results;
    //                         console.log("G5Datas", results);
    //                         setTimeout(() => {
    //                             this.endLoading.emit(true);
    //                         }, 1000)
    //                     }).catch((e) => {

    //                     });
    //             } else if (!eqps.length) {
    //                 this.endLoading.emit(true);
    //                 let results = [];

    //                 for (let i = 0; i < 5; i++) {
    //                     results.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, options: null });
    //                 }

    //                 this.G5Datas = results;
    //             }
    //         });
    // }

    // _getG5Radars(eqp): Promise<any> {
    //     let G5Data: any = {};
    //     let radarParamsParam: pdmRadarI.RadarParamsRequestParam = {
    //         fabId: undefined,
    //         eqpId: undefined,
    //         params: {
    //             fromDate: undefined,
    //             toDate: undefined
    //         }
    //     };

    //     radarParamsParam.fabId = this.fabId;
    //     radarParamsParam.eqpId = eqp.eqpId;
    //     radarParamsParam.params.fromDate = this.timePeriod['from'];
    //     radarParamsParam.params.toDate = this.timePeriod['to'];
    //     return this._pdmRadarService.getRadarParams(radarParamsParam).then(
    //         (params: any) => {
    //             let options: any = this.getChartOption();
    //             // let data = [];
    //             let data: any = {};
    //             let alarms = []
    //             let warns = [];
    //             let avgSpecs = [];
    //             let avgDailys = [];
    //             let variations = [];
    //             let ratioVariations = [];
    //             let paramDatas = [];

    //             for (let i = 0; i < params.length; i++) {
    //                 let param: any = params[i];

    //                 alarms.push({ // 경고
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.alarm
    //                 });

    //                 warns.push({ // 주의
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.warn
    //                 });

    //                 avgSpecs.push({ // 90일평균
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.avgSpec
    //                 });

    //                 avgDailys.push({ // 하루평균
    //                     id: param.paramId,
    //                     axis: param.paramName,
    //                     value: param.avgDaily,
    //                     data: param
    //                 });

    //                 paramDatas.push({
    //                     paramId: param.paramId,
    //                     paramName: param.paramName,
    //                     eqpId: eqp.eqpId,
    //                     eqpName: eqp.eqpName
    //                 });

    //                 if (param.avgDaily != null && param.avgSpec != null) {
    //                     ratioVariations.push(param.avgDaily - param.avgSpec); // For max variation(daily-spec)
    //                 }

    //                 variations.push(param.variation);
    //             }

    //             // data = [alarms, wanrs, avgSpecs, avgDailys];
    //             data = {
    //                 alarms: alarms,
    //                 warns: warns,
    //                 avgSpecs: avgSpecs,
    //                 avgDailys: avgDailys,
    //                 paramDatas: paramDatas
    //             };

    //             options.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];
    //             options.color = (i: number) => {
    //                 let c: string[] = ['#eea29a', '#ffff56', 'olive', '#22b8cf', 'aqua', 'green', 'blue'];
    //                 return c[i];
    //             };

    //             const minRatioVariation = Math.min(...ratioVariations);
    //             let details: any = {};

    //             for (let i = 0; i < params.length; i++) {
    //                 try {
    //                     if (params[i].avgDaily != null && params[i].avgSpec != null && minRatioVariation === params[i].avgDaily - params[i].avgSpec) {
    //                         let minMaxRatioVariation = minRatioVariation;
    //                         if (minMaxRatioVariation != 0) {
    //                             minMaxRatioVariation = this.sliceDecimal(minRatioVariation, 4)
    //                         }
    //                         details = {
    //                             maxParamName: params[i].paramName,
    //                             maxDailyAvg: this.sliceDecimal(params[i].avgDaily, 4),
    //                             maxSpecAvg: this.sliceDecimal(params[i].avgSpec, 4),
    //                             minMaxRatioVariation: minMaxRatioVariation
    //                         };

    //                         options.SelectLabel = params[i].paramName;

    //                         break;
    //                     }
    //                 } catch (err) {
    //                     console.log(err);
    //                 }
    //             }

    //             G5Data = {
    //                 type: 'G5',
    //                 id: eqp.eqpId,
    //                 name: eqp.name,
    //                 duration: '',
    //                 problemreason: '',
    //                 details: details,
    //                 chartData: data,
    //                 options: options,
    //                 labelColor: '#6e79d2',
    //                 areaId: eqp.area_id
    //             };

    //             return Promise.resolve(G5Data);
    //         });
    // }

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
            if (split.length == 2) {
                slice = split[1].slice(0, num);
            } else {
                return val;
            }

            return `${split[0]}.${slice}`;
        } else {
            return;
        }
    }

    mouseEnter(item: any, index: number): void | any {
        if (item.chartData) {
            this.selectedItem = this.objectUnion({}, item);
            this.selectedItem['index'] = index;
        } else {
            this.selectedItem = undefined;
        }
    }

    emitData(ev: any): void {
        this.paramDatas.push(ev);
    }

    onParamClick(item: pdmRadarI.ChartDataType, index: number, event: MouseEvent): void {
        if (!item.chartData && this.paramSelected) { // Open Context
            this.paramSelected = false;
            return;
        }

        if (item.chartData && this.paramDatas) {
            let params: any[] = this.paramDatas;
            let param: any = {
                paramId: '',
                paramName: ''
            };

            const dataLength: number = params.length;
            for (let i: number = 0; i < dataLength; i++) {
                if (item.type === params[i].type && item.id === params[i].eqpId) {
                    param = {
                        paramId: params[i].paramId,
                        paramName: params[i].paramName,
                        avgWithAW: params[i].avgWithAW,
                        warn: params[i].warn,
                        eqpId: params[i].eqpId
                    };

                    break;
                }
            }

            // this.isParamContext = true;
            this.paramSelected = true;
            this.trendShow = true;
            this.colIndex = parseInt((index % 5).toString()); //Trend chart position
            this.chartType = item.type;
            this.showParamContext.emit({
                selectedItem: item,
                timePeriod: this.timePeriod,
                type: item.type,
                eqpName: item.name,
                eqpId: item.id,
                paramId: param.paramId,
                index: index,
                event: event,
                paramName: param.paramName
                // flag: isInfo
            });

            setTimeout(() => {
                this.trendParamId = param.paramId;
                this.trendEqpName = item.name;
                this.trendParamName = param.paramName;
                this.trendEqpId = param.eqpId;
                this.trendPlantId = this.fabId;
                this.trendFromDate = this.condition.timePeriod.from;
                this.trendToDate = this.condition.timePeriod.to;
                this.trendAreaId = null;
                this.trendValue = param.avgWithAW;
                this.trendSpecWarning = param.warn;
            });

            this.appendTrendChartEl(item.type, index);
        } else {
            return;
        }
    }

    appendTrendChartEl(type: string, index: number): void {
        let dataLength: number;
        let selector: string;

        if (type === 'alarm' || type === 'warning') {
            dataLength = this.alarmWarningDatas.length;
            selector = '#gauge_alarmWarning';
        } else if (type === 'B5') {
            dataLength = this.B5Datas.length;
            selector = '#gauge_bad';
        } else if (type === 'G5') {
            dataLength = this.G5Datas.length;
            selector = '#gauge_good';
        }

        const row: number = parseInt((index / 5).toString()) + 1;
        let lastCol: number = row * 5 - 1;
        const lastRow: number = parseInt((dataLength / 5).toString()) + 1;

        if (dataLength - 1 === lastCol) {
            lastCol = dataLength - 1;
        } else if (row === lastRow) {
            lastCol = dataLength - 1;
        }

        const trendChartEl: any = $('#gauge_trendChart')[0];
        // trendChartEl.hidden = false;
        $(selector + lastCol).after(trendChartEl);
    }

    closeTrendChart(): void {
        this.paramSelected = false;
        this.trendShow = false;
        this.trendParamId = null;
        this.chartType = null;
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
