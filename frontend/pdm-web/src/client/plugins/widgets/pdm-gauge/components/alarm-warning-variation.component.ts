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

    fabId: string;
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
        private _pdmRadarService: PdmRadarService,
        private pdmModelService: PdmModelService
    ) {

    }

    ngOnInit() {
        // (<HTMLElement>document.querySelector('.container')).bind('scroll', function(){

        // });
        this.alarmWarningDatas =[{},{},{},{},{}];
        this.B5Datas = [{},{},{},{},{}];

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
            this.getRadarDatas();
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

    getRadarDatas(): any {
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

        // this.alarmWarningDatas =null;

        this.pdmModelService.getWorstEqpsWithHealthIndex(radarEqpsParam.fabId,radarEqpsParam.params.fromDate,radarEqpsParam.params.toDate,radarEqpsParam.params.numberOfWorst)
            .then((datas: any) => {
                this.alarmWarningDatas =[];
                this.B5Datas = [];
                let alarmCount =0;
                let warningCount =0;
               for (let index = 0; index < datas.length; index++) {
                   const element = datas[index];
                   
                   let options: any = this.getChartOption();

                   if(element.status=="warning"){
                    options.color = (i: number) => {
                        // let c: string[] = ['red', 'yellow', 'olive', 'aqua', 'yellow', 'green', 'blue'];
                        // let c: string[] = ['#eea29a', '#ffff56', 'olive', 'aqua', 'orange', 'green', 'blue'];
                        let c: string[] = ['#eea29a', '#ffff56', 'olive', 'orange'];
                        return c[i];
                    }
    
                   }  else if(element.status=="alarm"){
                        options.color = (i: number) => {
                            // let c: string[] = ['#eea29a', '#ffff56', 'olive', 'aqua', 'red', 'green', 'blue'];
                            let c: string[] = ['#eea29a', '#ffff56', 'olive', 'red'];
                            return c[i];
                        }
                   }

                   let details = {
                    maxParamName: element.paramName,
                    // maxDailyAvg: this.sliceDecimal(params[i].avgDaily, 4),
                    // maxSpecAvg: this.sliceDecimal(params[i].avgSpec, 4),
                    // minMaxRatioVariation: minMaxRatioVariation
                    };
                   
                    let chartData = {
                        alarm: element.upperAlarmSpec,
                        warn: element.upperWarningSpec,
                        score: element.score,
                        paramName:element.paramName,
                        paramId:element.paramId,
                        eqpName:element.eqpName,
                        eqpId:element.eqpId
                    };


                   let data = {
                    type: element.status,
                    id: element.eqpId,
                    name: element.eqpName,
                    problemreason: '',
                    details: details,
                    chartData: chartData,
                    options: options,
                    areaId: element.areaId
                    };
                    if(element.status=="alarm" ){
                        this.alarmWarningDatas.push(data);
                        alarmCount++;

                    }else if(element.status=="warning"){
                        this.alarmWarningDatas.push(data);
                        warningCount++;
                    }else{
                        this.B5Datas.push(data);
                    }
                    
                   
               }
               let count = this.alarmWarningDatas.length;
               for(let i=0;i<5- count;i++){
                   this.alarmWarningDatas.push({});
               }
               count = this.B5Datas.length;
               for(let i=0;i<5-count;i++){
                this.B5Datas.push({});
            }

               this.endLoading.emit(true);
               this.countAlarmWarning.emit({alarmCount:alarmCount,warningCount:warningCount});
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

    onParamClick(item: any, index: number, event: MouseEvent): void {
        if (!item.chartData && this.paramSelected) { // Open Context
            this.paramSelected = false;
            return;
        }

        if (item.chartData && this.paramDatas) {
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
                paramId: item.chartData.paramId,
                index: index,
                event: event,
                paramName: item.chartData.paramName
                // flag: isInfo
            });

            setTimeout(() => {
                this.trendParamId = item.chartData.paramId;
                this.trendEqpName = item.chartData.eqpName;
                this.trendParamName = item.chartData.paramName;
                this.trendEqpId = item.chartData.eqpId;
                this.trendPlantId = this.fabId;
                this.trendFromDate = this.condition.timePeriod.from;
                this.trendToDate = this.condition.timePeriod.to;
                this.trendAreaId = null;
                this.trendValue = item.chartData.score;
                this.trendSpecWarning = item.chartData.warn;
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
        } else if (type === 'normal') {
            dataLength = this.B5Datas.length;
            selector = '#gauge_bad';
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
