import { Translater } from './../../../sdk/i18n/translater';
import { Subscription } from 'rxjs/Subscription';
import { RequestOptions, Headers } from '@angular/http';
import { Component, OnDestroy, ViewEncapsulation, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewInit, ContentChildren } from '@angular/core';
import { ModalAction, ModalApplier, ModalRequester, WidgetApi, WidgetRefreshType, OnSetup, ContextMenuTemplateInfo } from '../../../common';
import { NotifyService, Util, ContextMenuType } from '../../../sdk';

import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { PdmModelService } from '../../../common/model/app/pdm/pdm-model.service';

import { Observable } from 'rxjs/Observable';

import * as EqpTraceI from './../pdm-realtime-trend/model/realtime-trend.interface';

import { TableData } from '../../common/ng2-table/table.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-realtime-main',
    templateUrl: './pdm-realtime-main.html',
    styleUrls: ['./pdm-realtime-main.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [ PdmCommonService,PdmModelService]
})
export class PdmRealTimeMainComponent extends WidgetApi implements OnSetup, OnDestroy {

    condition: EqpTraceI.RealTimeConfigType;

    isRefresh: boolean = true;

    detailsAnalysisLabel: string;
    analysisLabel: string;

    private _subscription: Subscription;
    private _props: any;
    private preMessageId = null;

    alarmHistories = [    ];
    spectrumData: any=[];
    spectrumConfig: any = {};

    selectParam;

    period = 10*60*1000;
    rootcause="none";
    alarmCount=0;
    type="normal";

    healthIndex=0;
    fabId;
    paramId;
    fromDate;
    toDate;

    columns: Array<TableData> = [
        // {title: '#', name: 'num' },
        {title: 'Time', name: 'alarm_dtts' },
        {title: 'EQP Name', name: 'eqp_name'},
        {title: 'Parameter Name', name: 'param_name'},
        {title: 'Category', name: 'category'},
        {title: 'Fault Classification', name: 'fault_class'}
    ];
    
    constructor(
        private notify: NotifyService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
        private applier: ModalApplier,
        private translater: Translater,
        private _pdmCommonService: PdmCommonService,
        private _pdmModelService:PdmModelService
       
    ) {
        super();
    }

    ngOnSetup() {
        // this.hideSpinner();
        // this.disableConfigurationBtn(true);
        this._init();

        let date = new Date().getTime();

        // for(let i=0;i<20;i++){
        //     this.alarmHistories.push({time:date-i*1000,eqpName:'eqp'+i,paramName:'param'+i,category:i%2==0?'Alarm':'Warning',faultClassification:i%3==0?'Unbalance':'N/A'});
        // }



        this.spectrumConfig = {
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
        
    }

    refresh({ type, data }: WidgetRefreshType): void {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo(this._props);
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) { //Auto refresh
            this.showSpinner();
            this._props = data;
            this._setConfigInfo(this._props);

            
        }
    }

    _setConfigInfo(props: any): void {
        const from = moment().subtract(0, 'days').startOf('day').unix();
        const to = Date.now();
        let condition: EqpTraceI.RealTimeConfigType = {
            fabId: props[CD.PLANT]['fabId'],
            worstTop: props[CD.WORST_TOP],
            timePeriod: {
                from: from * 1000,
                to: to
            }
        };

        this.condition = condition;
        console.log('realtime condition', this.condition);
    }

    progress(ev: any): void {
        if (ev === true) {
            this.showSpinner();
        } else if (ev === false) {
            this.hideSpinner();
        }
    }

    changeRefresh(ev: any): void {
        if (ev === true) {
            this.isRefresh = true;
        } else {
            this.isRefresh = false;
        }
    }

    showContext(items: any): void {
        let item: EqpTraceI.AWTraceDataType | EqpTraceI.NWTraceDataType = items.selectedItem;
        let dsCd: any = this.getViewData('displayContext');
        dsCd[LB.EQP_NAME] = item.eqp.name; //view config에서 설정필요

        let outCd: any = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.AREA_ID] = item.eqp.area_id;
        outCd[CD.EQP_ID] = item.eqp.eqpId;
        outCd[CD.EQP_NAME] = item.eqp.name;
        outCd[CD.CATEGORY] = 'realtime';

        let context: ContextMenuType = {
            tooltip: {
                event: items.event
            },
            template: {
                title: this.detailsAnalysisLabel,
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action: [
                    // {
                    //     labelI18n: 'Contour 차트',
                    //     data: { eqpId: row.eqpId, event: ev },
                    //     callback: (data:any) => {
                    //         this.showContourChart(data.eqpId, data.event);
                    //     }
                    // },
                    {
                        labelI18n: this.analysisLabel,
                        data: { areaId: item.eqp.area_id, eqpId: item.eqp.eqpId, event: items.event, type: "eqp" },
                        callback: (data: any) => {
                            this._syncMultiVariant(data.areaId, data.eqpId, null, data.type);
                        }
                    }]
            },
            contextMenuAction: {
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };
        // show context menu
        console.log('context', context);
        this.showContextMenu(context);
    }

    showParamContext(items: any) {
        console.log('showParamContext', items);
        let item: EqpTraceI.paramDatasType = items.selectedItem;
        let dsCd: any = this.getViewData('paramDisplayContext');
        dsCd[LB.PARAM_NAME] = item.paramName; //view config에서 설정필요

        let outCd: any = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.AREA_ID] = item.eqp.area_id;
        outCd[CD.EQP_ID] = item.eqp.eqpId;
        outCd[CD.EQP_NAME] = item.eqp.name;
        outCd[CD.CATEGORY] = 'realtime';

        let context: ContextMenuType = {
            tooltip: {
                event: items.event
            },
            template: {
                title: this.detailsAnalysisLabel,
                type: ContextMenuTemplateInfo.WIDGET_BOTTOM_ACTION,
                data: dsCd,
                action: [
                    // {
                    //     labelI18n: 'Contour 차트',
                    //     data: { eqpId: row.eqpId, event: ev },
                    //     callback: (data:any) => {
                    //         this.showContourChart(data.eqpId, data.event);
                    //     }
                    // },
                    {
                        labelI18n: this.analysisLabel,
                        data: { areaId: item.eqp.area_id, eqpId: item.eqp.eqpId, paramId: item.paramId, event: items.event, type: "param" },
                        callback: (data: any) => {
                            this._syncMultiVariant(data.areaId, data.eqpId, data.paramId, data.type);
                        }
                    }]
            },
            contextMenuAction: {
                invisible: true
            },
            outCondition: {
                data: outCd
            }
        };
        // show context menu
        console.log('context', context);
        this.showContextMenu(context);
    }

    private _syncMultiVariant(areaId: number, eqpId: number, paramId?: number, type?: string): void {
        let outCd: any = this.getOutCondition('config');
        outCd[CD.PLANT] = this._props[CD.PLANT];
        outCd[CD.TIME_PERIOD] = this.condition.timePeriod;
        outCd[CD.AREA_ID] = areaId;
        outCd[CD.EQP_ID] = eqpId;
        outCd[CD.CATEGORY] = 'realtime';

        if (type === "param") {
            outCd[CD.PARAM_ID] = paramId;
        }

        this.syncOutCondition(outCd);
    }

    private _init(): void {
        this.showSpinner();
        this.setGlobalLabel();
        this._props = this.getProperties();
        this._setConfigInfo(this._props);
        // this._stompService.connect('http://localhost:8080/portal/service/socket/portal-endpoint');
    }
    
    private setGlobalLabel(): void {
        let translater = this.translater;
        this.detailsAnalysisLabel = translater.instant('PDM.LABEL.DETAILS_ANALYSIS');
        this.analysisLabel = translater.instant('PDM.LABEL.ANALYSIS');
    }

    ngOnDestroy(): void {
        this.destroy();
    }
    dateFormat(date){
        return moment( date).format('YYYY/MM/DD HH:mm:ss');
    }

    getMeasurement() {
        if(this.selectParam==null) return;
        let toDate = new Date().getTime();
        let fromDate =toDate - this.period;
        
        this._pdmCommonService.getMeasurements(this.selectParam.fabId,
            1,
            1,
            this.selectParam.parameters[0],
            fromDate,
            toDate).then(data => {
                // this.measureDatas = data;
                // // console.log('getMeasurements : ', data);
                // let measurement = [];
                // for (let i = 0; i < data.length; i++) {
                //     measurement.push([data[i].measureDtts, this.mesaurementValue]);
                // }
                // this.trendConfig = this.getTrendDataConfig(this.trendConfig);
                // this.trendConfig.axes.yaxis.label = this._paramEuType;

                // this.trendConfig['series'].push({
                //     showLine: false,
                //     showMarker: true,
                //     markerOptions: {
                //         size: 7,
                //         lineWidth: 2,
                //         stroke: true,
                //         color: '#ff00ff',
                //         style: 'circle'
                //     },
                //     renderer: $.jqplot.LineRenderer,
                //     rendererOptions: {
                //         pointLabels: {
                //             show: true
                //         }
                //     }
                // });

                // // let trendData = [];
                // this.trendData.push(measurement);
                // // this.trendData = trendData.concat([]);

                // if (data.length > 0) this.getTimeWaveNSpectrum(data.length - 1);
                if (data.length > 0) {
                    this.getSpectrum(data[data.length-1].measurementId);
                }
            });
    }
    getSpectrum(measurementId) {
        // this.showSpinner();
        let calls = [];

        // this.spectrumData = [];

        this.spectrumConfig['series'] = [];


        calls.push(this._pdmCommonService.getSpectra(this.selectParam.fabId,1,1, measurementId).then(data => {
            this.spectrumData = [data];
            this.spectrumConfig['series'].push({ label: 'Current', color: 'rgb(51, 88, 255 )' });
            this.spectrumConfig = Object.assign({}, this.spectrumConfig);

        }));
       
        calls.push(this._pdmCommonService.getAnalysis(this.selectParam.fabId,1,1,  measurementId).then(data => {
            //this.spectrumData = [data];
            // this.rootcause = 'none';
            this.rootcause ="Unbalance";
            if (data.causes.length > 0) {
                for (let i = 0; i < data.causes.length; i++) {
                    this.rootcause += ', [ ' + data.causes[i] + ' ]';
                    // this.set1X(data.causes[i]);
                }
                if (this.rootcause.length > 0) {
                    this.rootcause = this.rootcause.substring(2);
                }
                // this.multiComboCheckedItemsChanged(null);
                if(this.rootcause.indexOf('Misalignment')>=0){
                    this.rootcause = "Misalignment";
                }else if(this.rootcause.indexOf('Unbalance')>=0){
                    this.rootcause = "Unbalance";
                }else if(this.rootcause.indexOf('Lubrication')>=0){
                    this.rootcause ="Lubrication";
                }
            }
            this.rootcause ="Unbalance";
        }));

        Promise.all(calls).then((values) => {
            // this._chRef.detectChanges();
            // this.hideSpinner();
        });
    }
    getAlarmHistory(){
        // alarmHistories
        let fromDate = new Date(moment( new Date().getTime()).format('YYYY/MM/DD 00:00:00')).getTime();
        let toDate = new Date().getTime();
        this._pdmModelService.getAlaramHistoryByEqpId(this.selectParam.fabId,1,this.selectParam.eqpIds[0],fromDate,toDate).then((data)=>{
            this.alarmHistories = data;

            this.alarmHistories.sort(function(a,b) {return (a.alarm_dtts > b.alarm_dtts) ? -1 : ((b.alarm_dtts > a.alarm_dtts) ? 1 : 0);} ); 

            let alarmList = this.alarmHistories.filter((d)=>{
                return d.category=='Alarm'? true:false
            })
            // this.alarmHistories.map((d,i)=>{d.num = i});
            this.alarmCount = alarmList.length;
            if(this.alarmHistories.length>50){
                this.alarmHistories = this.alarmHistories.slice(0,50);
            }
            

        })
    }
    onSelectParam(event){
        this.selectParam = event;
    }
    onReceiveData(event){
        console.log(event);
        this.healthIndex =0;
        let value =0;
        this.type="normal";
        for(let i =0;i<event.datas.length;i++){
            value = event.datas[i][1]/event.alarm_spec*100;
            if(value>this.healthIndex){
                this.healthIndex = value;
                this.healthIndex = Math.round(this.healthIndex);
                if(event.datas[i][1]>=event.alarm_spec){
                    this.type="alarm";
                    this.rootcause="Unbalance";
                    break;
                }else if(event.datas[i][1]>=event.warning_spec){
                    this.type="warning";
                }
            }
        }
        this.getMeasurement();


        this.fabId = this.selectParam.fabId;
        this.paramId = this.selectParam.parameters[0];
        this.toDate = new Date().getTime();
        // this.fromDate = new Date(moment( new Date().getTime()).format('YYYY/MM/DD 00:00:00')).getTime();
        this.fromDate = this.toDate - 7*24*60*60*1000;
        this.getAlarmHistory();
    }
}

