import { Component, ViewEncapsulation, OnInit, OnChanges, Input, EventEmitter, Output, ViewChild, ElementRef ,OnDestroy} from '@angular/core';
import { PdmModelService } from '../../../../common';

import * as wjcInput from 'wijmo/wijmo.input';

import * as EqpTraceI from './../../pdm-realtime-param-trend/model/realtime-param-trend.interface';
import { BistelChartComponent, Translater } from '../../../../sdk';

import { StompService } from '../../../../sdk';
import { SessionStore } from "../../../../sdk/session/session-store.service";
import { FabAreaEqpParamTreeComponent } from '../../../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';


@Component({
    moduleId: module.id,
    selector: 'realtime-param-trend',
    templateUrl: './realtimeparamtrend.html',
    styleUrls: ['./realtimeparamtrend.css'],
    encapsulation: ViewEncapsulation.None
})
export class RealtimeParamTrendComponent implements OnInit, OnChanges,OnDestroy {
    @ViewChild('chartPopup') chartPopup: wjcInput.Popup;
    @ViewChild('popupBody') popupBody: ElementRef;
    @ViewChild('AWChart') AWChart: any;
    @ViewChild('tree') tree: FabAreaEqpParamTreeComponent;
    // @ViewChild('NWChart') NWChart: any;

    @Input() condition: any;
    @Output() progress: EventEmitter<any> = new EventEmitter();
    @Output() showContext: EventEmitter<any> = new EventEmitter();
    @Output() showParamContext: EventEmitter<any> = new EventEmitter();
    @Output() changeRefresh: EventEmitter<any> = new EventEmitter();

    normalizeType: string;

    timePeriod: any;
    fabId: number;
    worstTop: number;

    alarmWarningDatas: any[];
    badDatas: any[];

    eqpTrendChartConfig: any;
    eqpTrendChartData: any[];

    AWTrendChartConfig: any;
    NWTrendChartConfig: any;

    AWChartEvents: any = {};
    NWChartEvents: any = {};

    selectedChartSeries: any[];
    originAWDatas: any[];

    selectedItem: any;

    isParamContext: boolean = false;
    isRefreshToggle: boolean = true;
    isShowExpandBtn: boolean = false;

    alarmText: string;
    warningText: string;

    private _popupPanelElem: any;
    private _prevPanel: any;
    private _nextPanel: any;

    preMessageId=null;

    paramDatas:{eqpName:string,paramName:string,paramId:number,config:{},eventLines:any[],alarm_spec:number,warning_spec:number,chartEvent:{},datas:any[]}[]=[];
    windowSize = 60;//sec

    constructor(
        private pdmModelService: PdmModelService,
        private translater: Translater,
        private _stompService: StompService
    ) {
        this.alarmText = translater.instant('PDM.SPEC.ALARM');
        this.warningText = translater.instant('PDM.SPEC.WARNING');
    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if (changes['condition'] != null && changes['condition']['currentValue']) {
            let currentValue = changes['condition']['currentValue'];
            this.fabId = currentValue['fabId'];
            this.worstTop = currentValue['worstTop'];
            this.timePeriod = currentValue['timePeriod'];
            this.normalizeType = 'alarm';
            // this.timeValueDataGenerator();
            // this.getEqpTrend();
            // this.setChartPopup();
            this._getDatas();
        }
    }
    ngOnDestroy(){
        this.resetMonitoring();
    }

    getTrendChartConfig(curConfig: any): any {
        let chartConfig: any = {
            animate: true,
            // Will animate plot on calls to plot1.replot({resetAxes:true})
            animateReplot: true,
            legend: {
                width: 145,
                show: false,
                // placement: 'outsideGrid',
                // location: 'e',
                renderer: $.jqplot.EnhancedLegendRenderer,
                rendererOptions: {
                    // numberRows: 1
                    textColor: "#000000",
                    fontSize: "5pt",
                }
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
                rendererOptions: {
                    smooth: true,
                    animation: {
                        speed: 2000
                    }
                    
                }
                
            },
            series: [],            
            axes: {
                xaxis: {
                    // min: this.timePeriod.from,
                    // max: this.timePeriod.to,
                    autoscale: true,
                    drawMajorGridlines: false,
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('HH:mm:ss') : '';
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
                        formatString: '%.2f',
                    }
                }
            },
            // canvasOverlay: {
            //     show: true,
            //     objects: []
            // },
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

        return Object.assign(chartConfig, curConfig);
    }


    resetMonitoring(){
        let message={};
        message['parameters']={};
        message['parameters']['parameterIds']=[];
        message['parameters']['fabId'] = this.tree.selectedFab.fabId;

        this.paramDatas=[];

        this.preMessageId = this._stompService.send(this.preMessageId,'realtime_param',message,payload => {
        });
    }

    requestMonitoring(){
        let node = this.tree.getSelectedNodes();
        let parameters = [];
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if(element.nodeType=='parameter'){
                parameters.push(element.paramId);
            }
            
        }
        let message={};
        message['parameters']={};
        message['parameters']['parameterIds']=parameters;
        message['parameters']['fabId'] = this.tree.selectedFab.fabId;

        this.paramDatas=[];

        this.preMessageId = this._stompService.send(this.preMessageId,'realtime_param',message,payload => {
            //this.serverResponse = payload.outputField;
            console.log(payload);
            let isFind = false; //기존 Chart에 있나 Find
            for(let i=0;i<this.paramDatas.length;i++){
                if(this.paramDatas[i].paramId==payload.reply.paramId){
                    isFind = true;
                    let seriesData = this.paramDatas[i].datas[0];
                    if(seriesData.length>0){
                        seriesData=seriesData.concat(payload.reply.datas);
                        
    
                        // let endTime = seriesData[seriesData.length-1][0];
                        // let startTime = endTime - this.windowSize*1000;
                        // for(let j=0;j<seriesData.length;j++){
                        //     let dataTime = seriesData[j][0];
                        //     if(dataTime>startTime){
                        //         if(j>0){
                        //             seriesData.splice(0,j);
                        //         }
    
                        //         break;
                        //     }
                        // }
                    }
                   
                    this.paramDatas[i].datas[0] = seriesData;


                    this.paramDatas[i].datas=this.paramDatas[i].datas.concat();
                    this.paramDatas[i].alarm_spec = payload.reply.alarm_spec;
                    this.paramDatas[i].warning_spec = payload.reply.warning_spec;
                    break;
                }
            }
            if(!isFind){
                let paramData = {eqpName:payload.reply.eqpName,paramName:payload.reply.paramName,paramId:payload.reply.paramId,config:this.getTrendChartConfig('AW'),eventLines:[],alarm_spec:payload.reply.alarm_spec,warning_spec:payload.reply.warning_spce,chartEvent:{},datas:[payload.reply.datas]};
                this.paramDatas.push(paramData);
            }

        // datas = [];
        // for(let i=0;i<100;i++){
        //     datas.push([startDate+i*1000,Math.random()]);
        // }
            
        });
    }

    _getDatas(): void {
       

        // this.paramDatas =[];
        // let datas = [];
        // let startDate = new Date().getTime();
        // for(let i=0;i<100;i++){
        //     datas.push([startDate+i*1000,Math.random()]);
        // }

        // let paramData = {eqpName:'Roots1 W',paramName:'AP8016989',paramId:1,config:this.getTrendChartConfig('AW'),eventLines:[],chartEvent:{},datas:datas};

        // this.paramDatas.push(paramData);

        // paramData = {eqpName:'Roots1 W',paramName:'AP8016989',paramId:1,config:this.getTrendChartConfig('AW'),eventLines:[],chartEvent:{},datas:datas};

        // datas = [];
        // for(let i=0;i<100;i++){
        //     datas.push([startDate+i*1000,Math.random()]);
        // }
        this.progress.emit(false);
    }















    setChartPopup() {
        this.chartPopup.onLostFocus = (ev) => {
            return false;
        };
        // this.chartPopup.onHidden = (ev) => {
        //     this._restoreChartPanel();
        // };
        this.chartPopup.modal = true;
        this.chartPopup.hideTrigger = wjcInput.PopupTrigger.None;
    }

    getEqpTrend(): void {
        this._getEqpTrend('AW');
        // this._getEqpTrend('NW');
        this.setChartEvnets();
    }

    changeNormalType(): void {
        this.progress.emit(true);
        this.getEqpTrend();
        // this.setAWSpecLine(this.normalizeType);
    }

    setChartEvnets(): void {
        this.AWChartEvents = {
            jqplotDataClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
                this.isParamContext = true;
                let selectedParam: any = this.selectedItem.paramDatas[seriesIndex];
                selectedParam['eqp'] = this.selectedItem.eqp;

                this.showParamContext.emit({
                    selectedItem: selectedParam,
                    event: ev
                });
            }
        };

        this.NWChartEvents = {
            jqplotDataClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
                this.isParamContext = true;
                let selectedParam: any = this.selectedItem.paramDatas[seriesIndex];
                selectedParam['eqp'] = this.selectedItem.eqp;

                this.showParamContext.emit({
                    selectedItem: selectedParam,
                    event: ev
                });
            }
        };
    }

    setAWSpecLine(type: any): void {
        if (type === 'alarm') {
            if (this.alarmWarningDatas) {
                for (let i = 0; i < this.alarmWarningDatas.length; i++) {
                    const alarmSpecLine: any = {
                        horizontalLine: {
                            name: 'Alarm',
                            y: 1,
                            color: 'red',
                            shadow: false
                        }
                    };

                    this.alarmWarningDatas[i].chartConfig['canvasOverlay']['objects'] = [alarmSpecLine];
                    this.alarmWarningDatas[i].chartConfig = Object.assign({}, this.alarmWarningDatas[i].chartConfig);
                }
            }

            if (this.badDatas) {
                for (let i = 0; i < this.badDatas.length; i++) {
                    const alarmSpecLine: any = {
                        horizontalLine: {
                            name: 'Alarm',
                            y: 1,
                            color: 'red',
                            shadow: false
                        }
                    };

                    this.badDatas[i].chartConfig['canvasOverlay']['objects'] = [alarmSpecLine];
                    this.badDatas[i].chartConfig = Object.assign({}, this.badDatas[i].chartConfig);
                }
            }
        } else if (type === 'warning') {
            let warningSpecLine: any = {
                horizontalLine: {
                    name: 'Warning',
                    y: 1,
                    color: 'yellow',
                    shadow: false
                }
            };

            if (this.alarmWarningDatas) {
                for (let i = 0; i < this.alarmWarningDatas.length; i++) {
                    this.alarmWarningDatas[i].chartConfig['canvasOverlay']['objects'] = [warningSpecLine];
                    this.alarmWarningDatas[i].chartConfig = Object.assign({}, this.alarmWarningDatas[i].chartConfig);
                }
            }

            if (this.badDatas) {
                for (let i = 0; i < this.badDatas.length; i++) {
                    this.badDatas[i].chartConfig['canvasOverlay']['objects'] = [warningSpecLine];
                    this.badDatas[i].chartConfig = Object.assign({}, this.badDatas[i].chartConfig);
                }
            }
        }
    }

    _getEqpTrend(type: string): void {
        if (type === 'AW') {
            let eqpTrendReqParam: EqpTraceI.EqpsRequestParam = {
                fabId: this.fabId,
                params: {
                    fromDate: this.timePeriod.from,
                    toDate: this.timePeriod.to,
                    radarType: type,
                }
            };

            this._getAWDatas(eqpTrendReqParam);
        } else if (type === 'NW') {
            let eqpTrendReqParam: EqpTraceI.EqpsRequestParam = {
                fabId: this.fabId,
                params: {
                    fromDate: this.timePeriod.from,
                    toDate: this.timePeriod.to,
                    radarType: type,
                    numberOfWorst: this.worstTop
                }
            };

            this._getNWDatas(eqpTrendReqParam);
        }
    }

    _getAWDatas(param: EqpTraceI.EqpsRequestParam): void {
        // this.pdmModelService.getRadarEqps(param)
        //     .then((eqps) => {
        //         if (eqps.length && eqps.length > 0) {
        //             let type: string;
        //             let promises: Promise<any>[] = [];
        //             let alarmWarningDatas: any[] = [];

        //             for (let i: number = 0; i < 1; i++) {
        //                 if (eqps[i].type === 'Alarm') {
        //                     type = 'alarm';
        //                 } else {
        //                     type = 'warning';
        //                 }

        //                 // promises.push(this._getAWTraceDatas(param, eqps[i], i, type));
        //                 this._getAWTraceDatas(param, eqps[i], i, type).then(datas=>{
        //                     for(let i=0;i<datas.length;i++){
        //                         let paramData = {eqpName:eqps[i],paramName:string,paramId:number,config:{},eventLines:any[],chartEvent:{},datas:any[]};
        //                         this.paramDatas.push(paramData);
        //                     }
                            
        //                 }).catch(err=>{
        //                     console.log(err);
        //                 });
                        
        //             }

        //             // Promise.all(promises)
        //             //     .then((results: any[]) => {
        //             //         let alarmDatas: any[] = [];
        //             //         let warningDatas: any[] = [];

        //             //         for (let i = 0; i < results.length; i++) {
        //             //             if (results[i].type === "alarm") {
        //             //                 alarmDatas.push(results[i]);
        //             //             } else {
        //             //                 warningDatas.push(results[i]);
        //             //             }
        //             //         }

        //             //         alarmWarningDatas = alarmDatas.concat(warningDatas);
        //             //         // this.originAWDatas = alarmWarningDatas.concat([]);

        //             //         // if (alarmWarningDatas.length > this.worstTop || alarmWarningDatas.length === this.worstTop) {
        //             //         //     this.alarmWarningDatas = alarmWarningDatas.splice(0, this.worstTop);
        //             //         // } else {
        //             //         //     this.alarmWarningDatas = alarmWarningDatas;
        //             //         // }

        //             //         // this.alarmWarningDatas = alarmWarningDatas;
                            
        //             //         console.log('[Realtime] alarmWarningDatas', this.alarmWarningDatas);

        //             //         setTimeout(() => {
        //             //             this.progress.emit(false);
        //             //         }, 1000);
        //             //     });
        //         } else if (eqps && !eqps.length) {
        //             this.progress.emit(false);
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //     });
    }

    _getAWTraceDatas(param: EqpTraceI.EqpsRequestParam, eqp: any, index: number, type: string): Promise<any> {
        let eqpTraceParam: EqpTraceI.EqpTraceRequestParam = {
            fabId: param.fabId,
            eqpId: eqp.eqpId,
            params: {
                fromDate: param.params.fromDate,
                toDate: param.params.toDate,
                normalizeType: this.normalizeType
            }
        };

        let AWTraceData: EqpTraceI.AWTraceDataType = {
            chartData: [],
            chartConfig: {},
            eventLines: [],
            eqp: {
                area_id: undefined,
                eqpId: undefined,
                name: undefined,
                startDtts: undefined,
                type: undefined
            },
            type: undefined,
            alarmSpecs: [],
            warningSpecs: [],
            paramNames: [],
            paramDatas: [],
            option: {}
        };

        return this.pdmModelService.getTraceData(eqpTraceParam)
            .then((traceDatas: any[]) => {
                // console.log(`AW tracedata${index}`, traceDatas);

                let chartData: any[] = [];
                let eventLines: any[] = [];
                let paramNames: string[] = [];
                let alarmSpecs: number[] = [];
                let warningSpecs: number[] = [];
                let paramDatas: EqpTraceI.paramDatasType[] = [];

                // if (this.normalizeType === 'alarm') {
                //     specText = this.alarmText;
                //     spec = 'alarm_spec';
                //     // AWTrendChartConfig['canvasOverlay']['objects'].push({
                //     //     horizontalLine: {
                //     //         name: 'Alarm',
                //     //         y: 1,
                //     //         color: 'red',
                //     //         shadow: false
                //     //     }
                //     // });
                // } else if (this.normalizeType === 'warning') {
                //     specText = this.warningText;
                //     spec = 'warning_spec';
                //     // AWTrendChartConfig['canvasOverlay']['objects'].push({
                //     //     horizontalLine: {
                //     //         name: 'Warning',
                //     //         y: 1,
                //     //         color: 'yellow',
                //     //         shadow: false
                //     //     }
                //     // });
                // }

                try {
                    for (let i: number = 0; i < traceDatas.length; i++) {
                        let traceData: EqpTraceI.TraceDataType = traceDatas[i];

                        chartData.push(traceData.datas);
                        paramNames.push(traceData.param_name);
                        // alarmSpecs.push(traceData.alarm_spec);
                        // warningSpecs.push(traceData.warning_spec);

                        paramDatas.push({
                            paramId: traceData.param_id,
                            paramName: traceData.param_name,
                            data: traceData.datas
                        });
                    };
                } catch (err) {
                    console.log(err);
                }

                //set legend
                let AWTrendChartConfig: any = this.getTrendChartConfig({});
                ;
                AWTrendChartConfig.legend['labels'] = paramNames;

                for (let i = 0; i < paramNames.length; i++) {
                    AWTrendChartConfig['series'].push({
                        label: paramNames[i]
                    });
                }

                AWTraceData = {
                    chartData: chartData,
                    chartConfig: AWTrendChartConfig,
                    eventLines: this.setEventLines(),
                    eqp: eqp,
                    type: type, //alarm, warning
                    paramNames: paramNames,
                    paramDatas: paramDatas,
                    alarmSpecs: alarmSpecs,
                    warningSpecs: warningSpecs,
                    option: {

                    }
                };

                return Promise.resolve(AWTraceData);
            }).catch((err) => {
                console.log(err);
            });
    }

    setEventLines(): any[] {
        let eventLines: any[];

        if (this.normalizeType === 'alarm') {
            eventLines = [{
                show: true,
                type: 'line',
                axis: 'yaxis',
                //background: true,
                fill: true,
                fillStyle: 'rgba(255, 0, 0, .5)',
                line: {
                    name: `${this.alarmText} (1)`,
                    show: true, // default : false
                    // value: traceData[spec.spec],
                    value: 1,
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
                            return `${this.alarmText} (1)`;
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
            }]
        } else if (this.normalizeType === 'warning') {
            eventLines = [{
                show: true,
                type: 'line',
                axis: 'yaxis',
                //background: true,
                fill: true,
                fillStyle: 'rgba(255, 255, 0, .5)',
                line: {
                    name: `${this.warningText} (1)`,
                    show: true, // default : false
                    // value: traceData[spec.spec],
                    value: 1,
                    color: '#ffff00',
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
                            return `${this.warningText} (1)`;
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
            }];
        }

        return eventLines;
    }

    _getNWDatas(param: EqpTraceI.EqpsRequestParam): void {
        this.pdmModelService.getRadarEqps(param)
            .then((eqps: any[]) => {
                if (eqps.length && eqps.length > 0) {
                    let promises: Promise<any>[] = [];

                    for (let i = 0; i < eqps.length; i++) {
                        promises.push(this._getNWTraceDatas(param, eqps[i], i));
                    }

                    Promise.all(promises)
                        .then((results: any[]) => {
                            let badDatas = [];
                            badDatas = results;

                            // this.badDatas = badDatas;
                            if (badDatas && badDatas.length > 0) {
                                this.badDatas = badDatas;
                                // setTimeout(() => {
                                //     this.sliceChartCount(badDatas);
                                // }, 1000)
                            } else {
                                this.badDatas = [];
                            }

                            console.log('[Realtime] badDatas', this.badDatas);
                        });
                } else if (eqps && !eqps.length) {
                    // this.progress.emit(false);
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    sliceChartCount(datas: any[]): void {
        if (this.originAWDatas) {
            if (this.originAWDatas.length < this.worstTop) {
                this.badDatas = datas.splice(0, this.worstTop - this.originAWDatas.length);
            } else if (this.originAWDatas.length > this.worstTop || this.originAWDatas.length === this.worstTop) {
                this.badDatas = [];
            }
        }
    }

    _getNWTraceDatas(param: EqpTraceI.EqpsRequestParam, eqp: EqpTraceI.EqpDataType, index: number): Promise<any> {
        let eqpTraceParam: EqpTraceI.EqpTraceRequestParam = {
            fabId: param.fabId,
            eqpId: eqp.eqpId,
            params: {
                fromDate: param.params.fromDate,
                toDate: param.params.toDate,
                normalizeType: this.normalizeType
            }
        };

        let BadTraceData: EqpTraceI.NWTraceDataType = {
            chartData: [],
            chartConfig: {},
            eventLines: [],
            eqp: {
                area_id: undefined,
                eqpId: undefined,
                name: undefined,
                startDtts: undefined,
                type: undefined
            },
            type: '',
            alarmSpecs: [],
            warningSpecs: [],
            paramNames: [],
            paramDatas: [],
            option: {}
        };

        return this.pdmModelService.getTraceData(eqpTraceParam)
            .then((traceDatas: any[]) => {
                // console.log(`NW tracedata${index}`, traceDatas);
                let chartData: any[] = [];
                let eventLines: any[] = [];
                let paramNames: string[] = [];
                let alarmSpecs: number[] = [];
                let warningSpecs: number[] = [];
                let paramDatas: EqpTraceI.paramDatasType[] = [];

                try {
                    for (let i: number = 0; i < traceDatas.length; i++) {
                        let traceData: EqpTraceI.TraceDataType = traceDatas[i];

                        chartData.push(traceData.datas);
                        paramNames.push(traceData.param_name);
                        alarmSpecs.push(traceData.alarm_spec);
                        warningSpecs.push(traceData.warning_spec);

                        paramDatas.push({
                            paramId: traceData.param_id,
                            paramName: traceData.param_name,
                            data: traceData.datas
                        });
                    };
                } catch (err) {
                    console.log(err);
                }

                let NWTrendChartConfig: any = this.getTrendChartConfig({});
                NWTrendChartConfig.legend['labels'] = paramNames;

                // if (this.normalizeType === 'alarm') {
                //     NWTrendChartConfig['canvasOverlay']['objects'].push({
                //         horizontalLine: {
                //             name: 'Alarm',
                //             y: 1,
                //             color: 'red',
                //             shadow: false
                //         }
                //     });
                // } else if (this.normalizeType === 'warning') {
                //     NWTrendChartConfig['canvasOverlay']['objects'].push({
                //         horizontalLine: {
                //             name: 'Warning',
                //             y: 1,
                //             color: 'yellow',
                //             shadow: false
                //         }
                //     });
                // }

                BadTraceData = {
                    chartData: chartData,
                    chartConfig: NWTrendChartConfig,
                    // chartEvents: chartEvents,
                    eqp: eqp,
                    type: 'bad',//NW
                    paramNames: paramNames,
                    paramDatas: paramDatas,
                    alarmSpecs: alarmSpecs,
                    warningSpecs: warningSpecs,
                    option: {

                    }
                };

                return Promise.resolve(BadTraceData);
            }).catch((err) => {
                console.log(err);
            });
    }

 
    onChartClick(event: any, item: EqpTraceI.AWTraceDataType | EqpTraceI.NWTraceDataType, index: number, chart: BistelChartComponent): void {
        if (this.isParamContext) { // Open Context
            this.isParamContext = false;
            return;
        }

        this.showContext.emit({
            selectedItem: item,
            event: event
        });
    }

    mouseover(event: any, item: EqpTraceI.AWTraceDataType | EqpTraceI.NWTraceDataType, index: number, chart: BistelChartComponent): void {
        this.selectedItem = item;
    }

    showLegend(item: any, index: number, isCheck: boolean): void {
        let currentConfig;
        let tempConfig;

        if (item.type === 'alarm') {
            currentConfig = this.alarmWarningDatas[index].chartConfig;
            tempConfig = Object.assign({}, this.alarmWarningDatas[index].chartConfig);

            if (!currentConfig.legend.show) {
                tempConfig.legend.show = true;
            } else {
                tempConfig.legend.show = false;
            }

            this.alarmWarningDatas[index].chartConfig = tempConfig;
        } else if (item.type === 'warning') {
            currentConfig = this.alarmWarningDatas[index].chartConfig;
            tempConfig = Object.assign({}, this.alarmWarningDatas[index].chartConfig);

            if (!currentConfig.legend.show) {
                tempConfig.legend.show = true;
            } else {
                tempConfig.legend.show = false;
            }

            this.alarmWarningDatas[index].chartConfig = tempConfig;
        } else if (item.type === 'bad') {
            currentConfig = this.badDatas[index].chartConfig;
            tempConfig = Object.assign({}, this.badDatas[index].chartConfig);

            if (!currentConfig.legend.show) {
                tempConfig.legend.show = true;
            } else {
                tempConfig.legend.show = false;
            }

            this.badDatas[index].chartConfig = tempConfig;
        }

        setTimeout(() => {
            if (tempConfig.legend.show) {
                let legendCheckbox = document.getElementsByClassName("jqplot-table-legend");
                // console.log('legendCheckbox', legendCheckbox);
                let callbackFn = function (ev) {
                    ev.stopPropagation();
                }

                for (let i = 0; i < legendCheckbox.length; i++) {
                    legendCheckbox[i].addEventListener('click', callbackFn, false);
                }
            } else {

            }
        }, 300)


        // let seriesDatas: any[] = item.chartConfig.plot.series;
        // let selectedChartSeries: any[] = [];

        // for (let i = 0; i < seriesDatas.length; i++) {
        //     let series: any = seriesDatas[i];

        //     selectedChartSeries.push({
        //         name: seriesDatas[i].label,
        //         color: seriesDatas[i].color
        //     });
        // }

        // this.selectedChartSeries = selectedChartSeries;
    }

    expandChart(ev, panel, index, type) {
        this.isShowExpandBtn = false;
        this.chartPopup.show();
        const popupElem = $(this.popupBody.nativeElement);
        this._popupPanelElem = $(panel);

        if (type === 'alarm' || type === 'warning') {
            this._prevPanel = $(this.AWChart.nativeElement);
            this._nextPanel = null;
        } else {
            // this._prevPanel = $(this.NWChart.nativeElement);
            // this._nextPanel = null;
        }

        popupElem.empty();
        this._popupPanelElem.appendTo(popupElem);
    }

    closePopup() {
        this.isShowExpandBtn = true;
        this._restoreChartPanel();
        this.chartPopup.hide();
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

    changeToggle(ev: any, isOn): void {
        if (isOn === true) {
            this.changeRefresh.emit(true);
        } else {
            this.changeRefresh.emit(false);
        }
    }

    timeValueDataGenerator(): void {
        let eqpTrendDatas: any[] = [];
        let alarmWarningDatas: any[] = [];
        let alarmDatas: any[] = [];
        let warningDatas: any[] = [];
        let badDatas: any[] = [];
        const chartDataSize = 60;
        const chartCtn = 30;
        const types = ['alarm', 'warning', 'bad'];

        this.AWTrendChartConfig = this.getTrendChartConfig({});
        this.NWTrendChartConfig = this.getTrendChartConfig({});

        // AW
        for (let i = 0; i < chartCtn; i++) {
            let awData: any = {
                chartData: [[]],
                name: '',
                type: '',
                color: ''
            };

            for (let j = 0; j < chartDataSize; j++) {
                const ranVal = Number((Math.random() * (0.000001 - 1) + 1).toFixed(6));
                const ranType = types[Math.floor(Math.random() * types.length)];

                awData.chartData[0].push([this.timePeriod.from + (1000 * 60 * j), ranVal]);
                awData.type = ranType;
            }

            awData.name = `EQP ${i}`;
            eqpTrendDatas.push(awData);
        }

        for (let i = 0; i < eqpTrendDatas.length; i++) {
            if (eqpTrendDatas[i].type === "alarm") {
                alarmDatas.push(eqpTrendDatas[i]);
            } else if (eqpTrendDatas[i].type === "warning") {
                warningDatas.push(eqpTrendDatas[i]);
            } else if (eqpTrendDatas[i].type === "bad") {
                badDatas.push(eqpTrendDatas[i]);
            }
        }

        alarmWarningDatas = alarmDatas.concat(warningDatas);

        if (alarmWarningDatas.length < this.worstTop) {
            this.alarmWarningDatas = alarmWarningDatas;
            this.badDatas = badDatas.splice(0, this.worstTop - this.alarmWarningDatas.length);
        } else if (alarmWarningDatas.length > this.worstTop || alarmWarningDatas.length === this.worstTop) {
            this.alarmWarningDatas = alarmWarningDatas.splice(0, this.worstTop);
            this.badDatas = [];
        }

        console.log('alarmWarningDatas', this.alarmWarningDatas)
        console.log('badDatas', this.badDatas);

        this.progress.emit(false);
    }

    private _initData(): void {
        this.alarmWarningDatas = null;
        this.badDatas = null;

        this.isParamContext = false;
    }
}