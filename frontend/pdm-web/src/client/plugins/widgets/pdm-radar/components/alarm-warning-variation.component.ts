import { ElementRef } from '@angular/core';
//Angular
import { Component, OnInit, Output, OnChanges, OnDestroy, Input, ViewChild, ViewEncapsulation, SimpleChanges, EventEmitter, ChangeDetectorRef } from '@angular/core';

//MI
import { PdmModelService } from './../../../../common';
import { PdmRadarService } from './../model/pdm-radar.service';
import * as IRadar from './../model/pdm-radar.interface';

@Component({
    moduleId: module.id,
    selector: 'alarm-warning-variation',
    templateUrl: './alarm-warning-variation.html',
    styleUrls: ['./alarm-warning-variation.css'],
    providers: [PdmModelService, PdmRadarService],
    encapsulation: ViewEncapsulation.None
})
export class AlarmWarningVariationComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('TrendChart') TrendChart: ElementRef;
    @ViewChild('Backdrop') Backdrop: ElementRef;

    @Input() condition: IRadar.Condition;
    @Input() fullScreen: any;
    @Output() showEqpContext: EventEmitter<IRadar.EqpContext> = new EventEmitter();
    @Output() showParamContext: EventEmitter<IRadar.ParamContext> = new EventEmitter();
    @Output() endLoading: EventEmitter<{ isLoad: boolean }> = new EventEmitter();
    @Output() countAlarmWarning: EventEmitter<{ alarmCount: number, warningCount: number }> = new EventEmitter();

    selectedItem: IRadar.AWRadarData | IRadar.BGRadarData;
    trendData: IRadar.TrendData;

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
    paramClickEvent: MouseEvent;

    maxParamCount: number;

    readonly TYPE: IRadar.Type = {
        ALARM: 'alarm',
        WARNING: 'warning',
        B5: 'B5',
        G5: 'G5',
        AW: 'AW'
    };

    constructor(
        private _pdmRadarService: PdmRadarService
    ) { }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['condition'] != null && changes['condition']['currentValue']) {
            let currentValue = changes['condition']['currentValue'];
            this.fabId = currentValue['fabId'];
            this.timePeriod = currentValue['timePeriod'];
            this.maxParamCount = currentValue['maxParamCount'];
            // this._initData();

            this.getRadarDatas(this.TYPE.AW);
            this.getRadarDatas(this.TYPE.B5);
            this.getRadarDatas(this.TYPE.G5);
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

                let option = {
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
                        option.color = (i) => {
                            let c = ['red', 'yellow', 'olive', 'aqua', 'yellow', 'green', 'blue'];
                            return c[i];
                        }
                        datas.push({ type: 'warning', name: 'W-eqp' + i, duration: '2h 30m', problemreason: '', chartData: data, option: option });
                    } else { // alarm
                        option.color = (i) => {
                            let c = ['red', 'yellow', 'olive', 'aqua', 'red', 'green', 'blue'];
                            return c[i];

                        }
                        datas.push({ type: 'alarm', name: 'A-eqp' + i, duration: '2h 30m', problemreason: 'alarm problem', chartData: data, option: option });
                    }
                } else if (type == "B5") {
                    option.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }, { fill: true, circle: false }]


                    option.color = (i) => {
                        let c = ['red', 'yellow', 'olive', 'aqua', 'blue', 'green', 'blue'];
                        return c[i];

                    }
                    datas.push({ type: 'B5', name: 'B5-eqp' + i, duration: '', problemreason: '', chartData: data, option: option });
                } else if (type == "G5") {
                    option.color = (i) => {
                        let c = ['red', 'yellow', 'olive', 'aqua', 'green', 'green', 'blue'];
                        return c[i];
                    }
                    datas.push({ type: 'G5', name: 'G5-eqp' + i, duration: '', problemreason: '', chartData: data, option: option });
                }
            }
        }

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

        if (type == this.TYPE.ALARM) {
            min = 0.7;
            max = 1.0;
        } else if (type == this.TYPE.WARNING) {
            min = 0.5;
            max = 0.8;
        }

        return Math.random() * (max - min) + min;
    }

    getRadarDatas(type: string): void {
        let radarEqpParams: IRadar.RadarEqpReqParams = {
            fabId: this.fabId,
            params: {
                fromDate: this.timePeriod['from'],
                toDate: this.timePeriod['to'],
                radarType: type
            }
        };

        if (type === this.TYPE.AW) {
            this.getAWDatas(radarEqpParams);
        } else if (type === this.TYPE.B5) {
            this.getB5Datas(radarEqpParams);
        } else if (type === this.TYPE.G5) {
            this.getG5Datas(radarEqpParams);
        }
    }

    getAWDatas(req: IRadar.RadarEqpReqParams): void {
        this._pdmRadarService.getRadarEqps(req)
            .then((eqps: IRadar.RadarEqpRes[]) => {
                let alarmWarningDatas = [];

                if (eqps.length && eqps.length > 0) {
                    let promises: Promise<IRadar.AWRadarData | null>[] = [];

                    const eqpsLength: number = eqps.length;
                    for (let i = 0; i < eqpsLength; i++) {
                        promises.push(this._getAWRadars(eqps[i]));
                    }

                    Promise.all(promises)
                        .then((results: IRadar.AWRadarData[]) => {
                            let radarDatas: IRadar.AWRadarData[] = [];
                            let tempRadarDatas: IRadar.AWRadarData[] = [];
                            let sortedByAWs: IRadar.AWRadarData;
                            let sortedByNames: IRadar.AWRadarData;

                            //avgWithAW를 기준으로 sort
                            for (let i = 0; i < results.length; i++) {
                                let radarData: IRadar.AWRadarData = results[i];

                                const originAvgWithAWs: IRadar.AvgWithAW[] = results[i].chartData[3];
                                const originAvgWithAWsSize: number = originAvgWithAWs.length;

                                for (let j = 0; j < originAvgWithAWsSize; j++) {
                                    originAvgWithAWs[j]['index'] = j;
                                }

                                sortedByAWs = this.sortByAWData(radarData, 'value');
                                tempRadarDatas.push(sortedByAWs);
                            }

                            const tempRadarDatasSize: number = tempRadarDatas.length;
                            const maxParamCount: number = Number(this.maxParamCount);

                            //Max Param Count만큼 Splice
                            for (let i = 0; i < tempRadarDatasSize; i++) {
                                const chartDataLength: number = tempRadarDatas[i].chartData.length;
                                for (let j = 0; j < chartDataLength; j++) {
                                    const chartData: IRadar.AWRadarData['chartData'] = tempRadarDatas[i].chartData;
                                    if (chartData[j].length > maxParamCount) {
                                        chartData[j].splice(maxParamCount);
                                    }
                                }
                            }

                            //axis(name)을 기준으로 sort
                            for (let i = 0; i < tempRadarDatas.length; i++) {
                                let radarData: IRadar.AWRadarData = tempRadarDatas[i];

                                const originAvgWithAWs: IRadar.AvgWithAW[] = tempRadarDatas[i].chartData[3];
                                const originAvgWithAWsSize: number = originAvgWithAWs.length;

                                for (let j = 0; j < originAvgWithAWsSize; j++) {
                                    originAvgWithAWs[j]['index'] = j;
                                }

                                sortedByNames = this.sortByAWData(radarData, 'axis');
                                radarDatas.push(sortedByNames);
                            }

                            let alarmDatas: IRadar.AWRadarData[] = [];
                            let warningDatas: IRadar.AWRadarData[] = [];
                            const radarDatasSize: number = radarDatas.length;

                            for (let i = 0; i < radarDatasSize; i++) {
                                const radarData: IRadar.AWRadarData = radarDatas[i];

                                if (radarData) {
                                    if (radarData.type === this.TYPE.ALARM) {
                                        alarmDatas.push(radarData);
                                    } else if (radarData.type === this.TYPE.WARNING) {
                                        warningDatas.push(radarData);
                                    }
                                } else {
                                    break;
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
                                    alarmWarningDatas.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, option: null, detail: null });
                                }

                            } else if (alarmWarningDatas.length % 5 === 0 && alarmWarningDatas.length > 5) {

                            } else if (alarmWarningDatas.length % 5 !== 0 && alarmWarningDatas.length > 5) { // 한라인이 5개로 차있지 않은 경우 빈공간에 대한 Data를 채운다.
                                const dataLength = alarmWarningDatas.length % 5;

                                for (let i = 0; i < 5 - dataLength; i++) {
                                    alarmWarningDatas.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, option: null, detail: null });
                                }
                            }

                            this.alarmWarningDatas = alarmWarningDatas;
                            console.log('AWDatas', this.alarmWarningDatas);
                        });
                } else if (!eqps.length) {
                    for (let i = 0; i < 5; i++) {
                        alarmWarningDatas.push({ type: '', name: '', duration: '', problemreason: '', chartData: null, option: null, detail: null });
                    }

                    this.countAlarmWarning.emit({
                        alarmCount: 0,
                        warningCount: 0
                    });

                    this.alarmWarningDatas = alarmWarningDatas;
                }
            });
    }

    private sortByAWData(radarData: IRadar.AWRadarData, key: string): IRadar.AWRadarData {
        let awIndexs: number[] = [];
        let avgWithAWs: IRadar.AvgWithAW[] = [];

        radarData.chartData[3].sort((data1: IRadar.AvgWithAW, data2: IRadar.AvgWithAW) => {
            return data1[key] < data2[key] ? 1 : data1[key] > data2[key] ? -1 : 0;
        });

        avgWithAWs = radarData.chartData[3];
        const avgWithAWsSize: number = avgWithAWs.length;
        for (let i = 0; i < avgWithAWsSize; i++) {
            awIndexs.push(avgWithAWs[i].index);
        }

        const alarms: IRadar.Alarm[] = [];
        const warns: IRadar.Warn[] = [];
        const avgDailys: IRadar.AvgSpec[] = [];

        for (let i = 0; i < awIndexs.length; i++) {
            const awIndex: number = awIndexs[i];
            const chartData: IRadar.AWRadarData['chartData'] = radarData.chartData;

            alarms.push(chartData[0][awIndex]);
            warns.push(chartData[1][awIndex]);
            avgDailys.push(chartData[2][awIndex]);
        }

        radarData.chartData = [[], [], [], []];
        radarData.chartData[0] = alarms;
        radarData.chartData[1] = warns;
        radarData.chartData[2] = avgDailys;
        radarData.chartData[3] = avgWithAWs;

        return radarData;
    }

    _getAWRadars(eqp: IRadar.RadarEqpRes): Promise<IRadar.AWRadarData> {
        let alarmData: IRadar.AWRadarData;
        let warningData: IRadar.AWRadarData;
        let alarmWarningData: IRadar.AWRadarData;
        let radarParamReqParams: IRadar.RadarParamReqParams = {
            fabId: this.fabId,
            eqpId: eqp.eqpId,
            params: {
                fromDate: this.timePeriod['from'],
                toDate: this.timePeriod['to']
            }
        };

        return this._pdmRadarService.getRadarParams(radarParamReqParams)
            .then((params: IRadar.RadarParamRes[]) => {
                if (!params.length) return null;

                let option: IRadar.RadarOption = this.getChartOption();
                let alarms: IRadar.Alarm[] = [];
                let wanrs: IRadar.Warn[] = [];
                let avgSpecs: IRadar.AvgSpec[] = [];
                let avgDailys: IRadar.AvgDaily[] = [];
                let avgWithAWs: IRadar.AvgWithAW[] = [];
                let AWwithAvgs: number[] = [];
                let variations: number[] = [];
                let data: [IRadar.Alarm[], IRadar.Warn[], IRadar.AvgDaily[], IRadar.AvgWithAW[]] = [[], [], [], []];

                const paramsLength: number = params.length;
                for (let i: number = 0; i < paramsLength; i++) {
                    let param: IRadar.RadarParamRes = params[i];

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

                    // let avgDaily: number;
                    // if (param.avgDaily > 1) { //Spec 넘어갈 경우 1로 고정
                    //     avgDaily = 1;
                    // } else {
                    //     avgDaily = param.avgDaily;
                    // }

                    avgDailys.push({ //하루평균
                        axis: param.paramName,
                        value: param.avgDaily
                    });

                    // let avgWithAW: number;
                    // if (param.avgWithAW > 1) {
                    //     avgWithAW = 1;
                    // } else {
                    //     avgWithAW = param.avgWithAW;
                    // }

                    avgWithAWs.push({ //평균값(Warning, Alarm)
                        axis: param.paramName,
                        value: param.avgWithAW,
                        data: param
                    })

                    AWwithAvgs.push(param.avgWithAW);//for max alarm or waring
                    variations.push(param.variation);
                }

                data = [alarms, wanrs, avgDailys, avgWithAWs];
                option.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];

                const maxAWwithAvg: number = Math.max(...AWwithAvgs);
                let detail: IRadar.RadarDetail;
                let maxParam: IRadar.RadarParamRes;

                for (let i = 0; i < paramsLength; i++) {
                    try {
                        if (maxAWwithAvg === params[i].avgWithAW) {
                            maxParam = params[i];
                            detail = {
                                maxParamName: params[i].paramName,
                                maxDailyAvg: this.sliceDecimal(params[i].avgDaily, 4),
                                maxSpecAvg: this.sliceDecimal(params[i].avgSpec, 4),
                                maxAvgWithAW: this.sliceDecimal(params[i].avgWithAW, 4),
                                maxAWwithAvg: this.sliceDecimal(maxAWwithAvg, 4)
                            };

                            option.SelectLabel = params[i].paramName;

                            break;
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }

                this.temp++;

                // if (eqp.type === "Alarm" && parseInt((this.temp % 2).toString()) === 0) {
                if (eqp.type.toUpperCase() === "WARNING") {
                    option.color = (i: number) => {
                        let c: string[] = ['#eea29a', '#ffff56', 'olive', 'orange'];
                        return c[i];
                    }

                    warningData = {
                        type: 'warning',
                        id: eqp.eqpId,
                        name: eqp.name,
                        problemreason: '',
                        detail: detail,
                        chartData: data,
                        option: option
                    };

                    alarmWarningData = warningData;
                    // } else if (eqp.type === 'Alarm' && parseInt((this.temp % 2).toString()) !== 0) {
                } else if (eqp.type.toUpperCase() === 'ALARM') {
                    option.color = (i: number) => {
                        let c: string[] = ['#eea29a', '#ffff56', 'olive', 'red'];
                        return c[i];
                    };

                    alarmData = {
                        type: 'alarm',
                        id: eqp.eqpId,
                        name: eqp.name,
                        problemreason: maxParam.classifications,
                        detail: detail,
                        chartData: data,
                        option: option,
                        areaId: eqp.area_id
                    };

                    alarmWarningData = alarmData;
                }

                return Promise.resolve(alarmWarningData);
            });
    }

    getB5Datas(req: IRadar.RadarEqpReqParams): void {
        this._pdmRadarService.getRadarEqps(req)
            .then((eqps: IRadar.RadarEqpRes[]) => {
                if (eqps.length && eqps.length > 0) {
                    let promises: Promise<IRadar.BGRadarData>[] = [];

                    const eqpsLength: number = eqps.length;
                    for (let i = 0; i < eqpsLength; i++) {
                        promises.push(this._getB5Radars(eqps[i]));
                    }

                    Promise.all(promises)
                        .then((results: IRadar.BGRadarData[]) => {
                            let radarDatas: IRadar.BGRadarData[] = [];
                            let tempRadarDatas: IRadar.BGRadarData[] = [];
                            let sortedByDailys: IRadar.BGRadarData;
                            let sortedByNames: IRadar.BGRadarData;

                            //avgDaily를 기준으로 sort
                            for (let i = 0; i < results.length; i++) {
                                let radarData: IRadar.BGRadarData = results[i];

                                const originAvgDailys: IRadar.AvgDaily[] = results[i].chartData[3];
                                const originAvgDailysSize: number = originAvgDailys.length;

                                for (let j = 0; j < originAvgDailysSize; j++) {
                                    originAvgDailys[j]['index'] = j;
                                }

                                sortedByDailys = this.sortByBGData(radarData, 'value');
                                tempRadarDatas.push(sortedByDailys);
                            }

                            const tempRadarDatasSize: number = tempRadarDatas.length;
                            const maxParamCount: number = Number(this.maxParamCount);

                            //Max Param Count만큼 Splice
                            for (let i = 0; i < tempRadarDatasSize; i++) {
                                const chartDataLength: number = tempRadarDatas[i].chartData.length;
                                for (let j = 0; j < chartDataLength; j++) {
                                    const chartData: IRadar.BGRadarData['chartData'] = tempRadarDatas[i].chartData;
                                    if (chartData[j].length > maxParamCount) {
                                        chartData[j].splice(maxParamCount);
                                    }
                                }
                            }

                            //axis(name)을 기준으로 sort
                            for (let i = 0; i < tempRadarDatas.length; i++) {
                                let radarData: IRadar.BGRadarData = tempRadarDatas[i];

                                const originAvgDailys: IRadar.AvgDaily[] = tempRadarDatas[i].chartData[3];
                                const originAvgDailysSize: number = originAvgDailys.length;

                                for (let j = 0; j < originAvgDailysSize; j++) {
                                    originAvgDailys[j]['index'] = j;
                                }

                                sortedByNames = this.sortByBGData(radarData, 'axis');
                                radarDatas.push(sortedByNames);
                            }

                            const radarDatasSize: number = radarDatas.length;
                            if (radarDatasSize && radarDatasSize < 5) {
                                for (let i = 0; i < 5 - radarDatasSize; i++) {
                                    radarDatas.push({ type: '', name: '', duration: '', chartData: null, option: null, detail: null });
                                }
                            }

                            this.B5Datas = radarDatas;
                            console.log("B5Datas", this.B5Datas);
                        }).catch((e) => {
                            console.log(e);
                        });
                } else if (!eqps.length) {
                    let emptyResults: IRadar.BGRadarData[] = [];

                    for (let i = 0; i < 5; i++) {
                        emptyResults.push({ type: '', name: '', duration: '', chartData: null, option: null, detail: null });
                    }

                    this.B5Datas = emptyResults;
                }
            });
    }

    _getB5Radars(eqp: IRadar.RadarEqpRes): Promise<IRadar.BGRadarData> {
        let B5Data: IRadar.BGRadarData;
        let radarParamReqParams: IRadar.RadarParamReqParams = {
            fabId: this.fabId,
            eqpId: eqp.eqpId,
            params: {
                fromDate: this.timePeriod['from'],
                toDate: this.timePeriod['to']
            }
        };

        return this._pdmRadarService.getRadarParams(radarParamReqParams)
            .then((params: IRadar.RadarParamRes[]) => {
                if (!params.length) return null;

                let option: any = this.getChartOption();
                let data: IRadar.BGRadarData['chartData'] = [[], [], [], []];
                let alarms: IRadar.Alarm[] = [];
                let wanrs: IRadar.Warn[] = [];
                let avgSpecs: IRadar.AvgSpec[] = [];
                let avgDailys: IRadar.AvgDaily[] = [];
                let variations: number[] = [];
                let ratioVariations: number[] = [];

                const paramsLength: number = params.length;
                for (let i = 0; i < paramsLength; i++) {
                    let param: IRadar.RadarParamRes = params[i];

                    alarms.push({ // 경고
                        axis: param.paramName,
                        value: param.alarm
                    });

                    wanrs.push({ // 주의
                        axis: param.paramName,
                        value: param.warn
                    });

                    // let avgSpec: number;
                    // if (param.avgSpec > 1) {
                    //     avgSpec = 1
                    // } else {
                    //     avgSpec = param.avgSpec;
                    // }

                    avgSpecs.push({ // 90일평균
                        axis: param.paramName,
                        value: param.avgSpec
                    });

                    // let avgDaily: number;
                    // if (param.avgDaily > 1) {
                    //     avgDaily = 1
                    // } else {
                    //     avgDaily = param.avgDaily;
                    // }

                    avgDailys.push({ // 하루평균
                        axis: param.paramName,
                        value: param.avgDaily,
                        data: param,
                        index: i
                    });

                    if (param.avgDaily !== null && param.avgSpec !== null) {
                        // ratioVariations.push(Math.abs(param.avgDaily) - Math.abs(param.avgSpec)); // For max variation(daily-spec)
                        ratioVariations.push(param.avgDaily - param.avgSpec);
                    }

                    variations.push(param.variation);
                }

                data = [alarms, wanrs, avgSpecs, avgDailys];
                option.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];
                option.color = (i: number) => {
                    let c: string[] = ['#eea29a', '#ffff56', 'olive', '#ff009d', 'aqua', 'green', 'blue'];
                    return c[i];
                }

                const maxRatioVariation: number = Math.max(...ratioVariations);
                let detail: IRadar.RadarDetail;

                for (let i = 0; i < paramsLength; i++) {
                    try {
                        const param = params[i];

                        // if (maxRatioVariation === Math.abs(param.avgDaily) - Math.abs(param.avgSpec)) {
                        if (maxRatioVariation === param.avgDaily - param.avgSpec) {
                            let minMaxRatioVariation: number = maxRatioVariation;
                            if (maxRatioVariation !== 0) {
                                minMaxRatioVariation = this.sliceDecimal(maxRatioVariation, 4)
                            }

                            detail = {
                                maxParamName: param.paramName,
                                maxDailyAvg: this.sliceDecimal(param.avgDaily, 4),
                                maxSpecAvg: this.sliceDecimal(param.avgSpec, 4),
                                minMaxRatioVariation: minMaxRatioVariation
                            };

                            option.SelectLabel = param.paramName;

                            break;
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }

                B5Data = {
                    type: 'B5',
                    id: eqp.eqpId,
                    name: eqp.name,
                    duration: '',
                    detail: detail,
                    chartData: data,
                    option: option,
                    labelColor: '#ff009d',
                    areaId: eqp.area_id
                };

                return Promise.resolve(B5Data);
            });
    }

    getG5Datas(req: IRadar.RadarEqpReqParams): void {
        this._pdmRadarService.getRadarEqps(req)
            .then((eqps: IRadar.RadarEqpRes[]) => {
                if (eqps.length && eqps.length > 0) {
                    let promises = [];

                    const eqpsLength: number = eqps.length;
                    for (let i: number = 0; i < eqpsLength; i++) {
                        promises.push(this._getG5Radars(eqps[i]));
                    }

                    Promise.all(promises)
                        .then((results: IRadar.BGRadarData[]) => {
                            let radarDatas: IRadar.BGRadarData[] = [];
                            let tempRadarDatas: IRadar.BGRadarData[] = [];
                            let sortedByDailys: IRadar.BGRadarData;
                            let sortedByNames: IRadar.BGRadarData;

                            //avgDaily를 기준으로 sort
                            for (let i = 0; i < results.length; i++) {
                                let radarData: IRadar.BGRadarData = results[i];

                                const originAvgDailys: IRadar.AvgDaily[] = results[i].chartData[3];
                                const originAvgDailysSize: number = originAvgDailys.length;

                                for (let j = 0; j < originAvgDailysSize; j++) {
                                    originAvgDailys[j]['index'] = j;
                                }

                                sortedByDailys = this.sortByBGData(radarData, 'value');
                                tempRadarDatas.push(sortedByDailys);
                            }

                            const tempRadarDatasSize: number = tempRadarDatas.length;
                            const maxParamCount: number = Number(this.maxParamCount);

                            //Max Param Count만큼 Slice
                            for (let i = 0; i < tempRadarDatasSize; i++) {
                                const chartDataLength: number = tempRadarDatas[i].chartData.length;
                                for (let j = 0; j < chartDataLength; j++) {
                                    const chartData: IRadar.BGRadarData['chartData'] = tempRadarDatas[i].chartData;
                                    if (chartData[j].length > maxParamCount) {
                                        chartData[j].splice(maxParamCount);
                                    }
                                }
                            }
                            // for (let i = 0; i < tempRadarDatasSize; i++) {
                            //     const chartDataLength: number = tempRadarDatas[i].chartData.length;
                            //     for (let j = 0; j < chartDataLength; j++) {
                            //         const chartData: any = tempRadarDatas[i];
                            //         if (chartData.length > maxParamCount) {
                            //             chartData.splice(maxParamCount);
                            //         }
                            //     }
                            // }

                            //axis(name)을 기준으로 sort
                            for (let i = 0; i < tempRadarDatas.length; i++) {
                                let radarData: IRadar.BGRadarData = tempRadarDatas[i];

                                const originAvgDailys: IRadar.AvgDaily[] = tempRadarDatas[i].chartData[3];
                                const originAvgDailysSize: number = originAvgDailys.length;

                                for (let j = 0; j < originAvgDailysSize; j++) {
                                    originAvgDailys[j]['index'] = j;
                                }

                                sortedByNames = this.sortByBGData(radarData, 'axis');
                                radarDatas.push(sortedByNames);
                                // console.log('radarDatas', radarDatas);
                            }

                            const radarDatasSize: number = radarDatas.length;
                            if (radarDatasSize && radarDatasSize < 5) {
                                for (let i = 0; i < 5 - radarDatasSize; i++) {
                                    radarDatas.push({ type: '', name: '', duration: '', chartData: null, option: null, detail: null });
                                }
                            }


                            this.G5Datas = radarDatas;
                            console.log("G5Datas", this.G5Datas);

                            setTimeout(() => {
                                this.endLoading.emit({
                                    isLoad: true
                                });
                            }, 1000)
                        }).catch((e) => {
                            console.log(e);
                        });
                } else if (!eqps.length) {
                    this.endLoading.emit({
                        isLoad: false
                    });

                    let results = [];

                    for (let i = 0; i < 5; i++) {
                        results.push({ type: '', name: '', duration: '', chartData: null, option: null });
                    }

                    this.G5Datas = results;
                }
            });
    }

    _getG5Radars(eqp: IRadar.RadarEqpRes): Promise<IRadar.BGRadarData> {
        let G5Data: IRadar.BGRadarData;
        let radarParamReqParams: IRadar.RadarParamReqParams = {
            fabId: this.fabId,
            eqpId: eqp.eqpId,
            params: {
                fromDate: this.timePeriod['from'],
                toDate: this.timePeriod['to']
            }
        };

        return this._pdmRadarService.getRadarParams(radarParamReqParams)
            .then((params: IRadar.RadarParamRes[]) => {
                if (!params.length) return null;

                let option: IRadar.RadarOption = this.getChartOption();
                let data: IRadar.BGRadarData['chartData'] = [[], [], [], []];
                let alarms: Array<IRadar.Alarm> = [];
                let wanrs: Array<IRadar.Warn> = [];
                let avgSpecs: Array<IRadar.AvgSpec> = [];
                let avgDailys: Array<IRadar.AvgDaily> = [];
                let variations: Array<number> = [];
                let ratioVariations: Array<number> = [];

                const paramsLength: number = params.length;
                for (let i = 0; i < paramsLength; i++) {
                    let param: IRadar.RadarParamRes = params[i];

                    alarms.push({ // 경고
                        axis: param.paramName,
                        value: param.alarm
                    });

                    wanrs.push({ // 주의
                        axis: param.paramName,
                        value: param.warn
                    });

                    // let avgSpec: number;
                    // if (param.avgSpec > 1) {
                    //     avgSpec = 1
                    // } else {
                    //     avgSpec = param.avgSpec;
                    // }

                    avgSpecs.push({ // 90일평균
                        axis: param.paramName,
                        value: param.avgSpec
                    });

                    // let avgDaily: number;
                    // if (param.avgDaily > 1) {
                    //     avgDaily = 1
                    // } else {
                    //     avgDaily = param.avgDaily;
                    // }

                    avgDailys.push({ // 하루평균
                        axis: param.paramName,
                        value: param.avgDaily,
                        data: param
                    });

                    if (param.avgDaily !== null && param.avgSpec !== null) {
                        // ratioVariations.push(Math.min(param.avgDaily) - Math.min(param.avgSpec)); // For max variation(daily-spec)
                        ratioVariations.push(param.avgDaily - param.avgSpec);
                    }

                    variations.push(param.variation);
                }

                data = [alarms, wanrs, avgSpecs, avgDailys];
                option.series = [{ fill: false, circle: false }, { fill: false, circle: false }, { fill: true, circle: false }];
                option.color = (i: number) => {
                    let c: string[] = ['#eea29a', '#ffff56', 'olive', '#22b8cf', 'aqua', 'green', 'blue'];
                    return c[i];
                };

                const minRatioVariation: number = Math.min(...ratioVariations);
                let detail: IRadar.RadarDetail;

                for (let i = 0; i < paramsLength; i++) {
                    try {
                        const param = params[i];
                        // if (minRatioVariation === Math.abs(param.avgDaily) - Math.abs(param.avgSpec)) {
                        if (minRatioVariation === param.avgDaily - param.avgSpec) {
                            let minMaxRatioVariation: number = minRatioVariation;
                            if (minMaxRatioVariation !== 0) {
                                minMaxRatioVariation = this.sliceDecimal(minRatioVariation, 4)
                            }
                            detail = {
                                maxParamName: param.paramName,
                                maxDailyAvg: this.sliceDecimal(param.avgDaily, 4),
                                maxSpecAvg: this.sliceDecimal(param.avgSpec, 4),
                                minMaxRatioVariation: minMaxRatioVariation
                            };

                            option.SelectLabel = param.paramName;

                            break;
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }

                G5Data = {
                    type: 'G5',
                    id: eqp.eqpId,
                    name: eqp.name,
                    duration: '',
                    detail: detail,
                    chartData: data,
                    option: option,
                    labelColor: '#6e79d2',
                    areaId: eqp.area_id
                };

                return Promise.resolve(G5Data);
            });
    }

    private sortByBGData(radarData: IRadar.BGRadarData, key: string): IRadar.BGRadarData {
        let bIndexs: number[] = [];
        let avgDailys: IRadar.AvgDaily[] = [];

        radarData.chartData[3].sort((data1: IRadar.AvgDaily, data2: IRadar.AvgDaily) => {
            return data1[key] < data2[key] ? 1 : data1[key] > data2[key] ? -1 : 0;
        });

        avgDailys = radarData.chartData[3];
        const avgDailysSize: number = avgDailys.length;
        for (let i = 0; i < avgDailysSize; i++) {
            bIndexs.push(avgDailys[i].index);
        }

        const alarms: IRadar.Alarm[] = [];
        const warns: IRadar.Warn[] = [];
        const avgSpecs: IRadar.AvgSpec[] = [];

        for (let idx of bIndexs) {
            const chartData: IRadar.BGRadarData['chartData'] = radarData.chartData;
            alarms.push(chartData[0][idx]);
            warns.push(chartData[1][idx]);
            avgSpecs.push(chartData[2][idx]);
        }

        radarData.chartData = [[], [], [], []];
        radarData.chartData[0] = alarms;
        radarData.chartData[1] = warns;
        radarData.chartData[2] = avgSpecs;
        radarData.chartData[3] = avgDailys;

        return radarData;
    }

    private getChartOption(): IRadar.RadarOption {
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

    private sliceDecimal(val: number, num: number): any {
        if (val) {
            let split: string[] = val.toString().split('.');
            let slice: string;
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

    // Event
    // mouseEnter(item, event) {
    //     if (item.chartData) {
    //         this.selectedItem = this.objectUnion({}, item);
    //         this.selectedItem.option.ShowLabel = true;

    //         this.showInfo = true;

    //         this.setBoxLocation(event.x, event.y);
    //     } else {
    //         this.selectedItem = undefined;
    //     }
    // }

    mouseEnter(item: IRadar.AWRadarData | IRadar.BGRadarData, index: number): void {
        if (this.isShowInfo) {
            return;
        }

        if (item.chartData) {
            this.selectedItem = this.objectUnion({}, item);
            this.selectedItem.index = index;
        } else {
            this.selectedItem = undefined;
        }
    }

    mouseLeave(item: any): void {
        if (!this.isMouseEnterDetail) {
            this.showInfo = false;
        }
    }

    mouseMove(event: MouseEvent): void {
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

    showTrendChartAtContext(item: IRadar.ParamContext): void {
        // console.log('showTrendChartAtContext', item);
        this.isParamContext = true;
        this.paramSelected = true;
        this.trendShow = true;
        this.colIndex = parseInt((item.index % 5).toString()); //Trend chart position
        this.isShowInfo = false;

        const backdropEl: any = $('#backdrop')[0];
        if (!backdropEl.hidden) {
            backdropEl.hidden = true;
        }

        setTimeout(() => {
            this.setTrendChartData(item.selectedItem, item.paramData.data);
        });

        this.appendTrendChartEl(item.type, item.index);
    }

    clickRadarChart(event: MouseEvent): void {
        this.paramClickEvent = event;
    }

    onParamClick(item: IRadar.AWRadarData | IRadar.BGRadarData, paramData: IRadar.AvgWithAW, index: number, isInfo?: string): void {
        // console.log('onParamClick', index);
        this.isParamContext = true;
        this.trendShow = true;
        this.colIndex = parseInt((index % 5).toString()); //Trend chart position

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

        setTimeout(() => {
            if (this.selectedItem) {
                this.showParamContext.emit({
                    selectedItem: this.selectedItem,
                    timePeriod: this.timePeriod,
                    type: item.type,
                    eqpName: item.name,
                    eqpId: item.id,
                    paramData: paramData,
                    event: this.paramClickEvent,
                    index: index,
                    flag: isInfo
                });
            }

            if (isInfo !== 'isInfo') {
                setTimeout(() => {
                    this.setTrendChartData(item, paramData.data);
                });

                this.appendTrendChartEl(item.type, index);
            }
        }, 300);
    }

    setTrendChartData(item: IRadar.AWRadarData | IRadar.BGRadarData, data: IRadar.AvgWithAW['data']): void {
        const condition: IRadar.Condition = this.condition;

        this.trendData = {
            trendParamId: data.paramId,
            trendEqpName: item.name,
            trendParamName: data.paramName,
            trendEqpId: item.id,
            trendPlantId: this.fabId,
            trendFromDate: condition.timePeriod.from,
            trendToDate: condition.timePeriod.to,
            trendAreaId: null,
            trendValue: data.avgWithAW,
            trendSpecWarning: data.warn,
            trendChartType: item.type
        };
    }

    appendTrendChartEl(type: string, index: number): void {
        // console.log('appendTrendChartEl', index);
        let dataLength: number;
        let selector: string;

        if (type === this.TYPE.ALARM || type === this.TYPE.WARNING) {
            dataLength = this.alarmWarningDatas.length;
            selector = '#alarmWarning';
        } else if (type === this.TYPE.B5) {
            dataLength = this.B5Datas.length;
            selector = '#bad';
        } else if (type === this.TYPE.G5) {
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
        $(selector + lastCol).after(trendChartEl);
    }

    onEqpClick(event: any, item: IRadar.AWRadarData | IRadar.BGRadarData, isPopup?: boolean): void {
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

        if (event.target.tagName != 'circle' && !isPopup) {
            this.trendShow = false;

            setTimeout(() => {
                if (item) {
                    item = this.objectUnion({}, item);
                }
            });
        }

        if (this.selectedItem) {
            this.showEqpContext.emit({
                selectedItem: item,
                event: event
            });
        }
    }

    onClickSection(type: string, index: number): void {
        this.activeByType(type, index);
    }

    activeByType(type: string, index: number): void {
        if (type === this.TYPE.ALARM || type === this.TYPE.WARNING) {
            this.selectedBadSection = null;
            this.selectedGoodSection = null;
            this.selectedAWSection = index;
        } else if (type === this.TYPE.B5) {
            this.selectedAWSection = null;
            this.selectedGoodSection = null;
            this.selectedBadSection = index;
        } else if (type === this.TYPE.G5) {
            this.selectedAWSection = null;
            this.selectedBadSection = null;
            this.selectedGoodSection = index;
        }
    }

    // zoom(zoom: string, item: IRadar.RadarData, event?: any): void {
    //     if (zoom == "in") {
    //         item.option.zoom += 0.5;
    //     } else if (zoom == "out") {
    //         item.option.zoom -= 0.5;
    //     } else if (zoom == "refresh") {
    //         item.option.zoom = 1;
    //     }

    //     if (item.option.zoom < 1) {
    //         item.option.zoom = 1;
    //     }

    //     item.option = this.objectUnion({}, item.option);
    // }

    showRadarInfo(item: IRadar.AWRadarData | IRadar.BGRadarData, event: MouseEvent, index: number): void | any {
        if (item.chartData) {
            this.activeByType(item.type, index);
            this.selectedItem.option.ShowLabel = true;
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
        // this.trendParamId = null;
        this.trendData = null;
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
    objectUnion(obj1 = {}, obj2: IRadar.AWRadarData | IRadar.BGRadarData): any {
        let newObj = this.objectUnionSub(obj1, obj2);
        newObj = this.assignFunctions(newObj, obj2);
        return newObj;
    }

    objectUnionSub(obj1: {}, obj2: IRadar.AWRadarData | IRadar.BGRadarData): IRadar.AWRadarData | IRadar.BGRadarData | {} {
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

    //Radar Chart의 Data 타입 체크
    isAWRadarData(data: IRadar.AWRadarData | IRadar.BGRadarData): data is IRadar.AWRadarData {
        return (<IRadar.AWRadarData>data).type === this.TYPE.ALARM || (<IRadar.AWRadarData>data).type === this.TYPE.WARNING;
    }

    _initData(): void {
        if (this.trendData) {
            this.trendData = null;
        }

        this.closeTrendChart();
        this.closeRadarInfo();

        this.alarmWarningDatas = null;
        this.alarmDatas = null;
        this.B5Datas = null;
        this.G5Datas = null;

        this.colIndex = null;
        this.selectedItem = null;

        this.isShowInfo = false;
        this.isParamContext = false;
        this.isMouseEnterDetail = null;

        this.paramSelected = false;
    }

    ngOnDestroy() {
        this._initData();
    }
}