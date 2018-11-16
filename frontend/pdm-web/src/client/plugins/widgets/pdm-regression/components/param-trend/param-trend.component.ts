import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, ViewChild, Input, SimpleChanges } from '@angular/core';
import { SpinnerComponent, StompService } from '../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'param-trend',
    templateUrl: './param-trend.html',
    styleUrls: ['./param-trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class ParamTrendComponent implements OnChanges, OnInit, OnDestroy {
    @Input() data;
    @ViewChild('Spinner') spinner:SpinnerComponent;

    chartFlag: string = "trand";   
    chartInfo:any = {};

    paramTrendDatas: any[];
    paramTrendConfig: any;



    constructor(private _stompService: StompService) {

    }

    ngOnInit() {
        this.chartInfo['image']='aaa';
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data = changes['data']['currentValue'];
            // this.drawParamTrend(data);
            this.send();
        }
    }

    drawParamTrend(data): void {
        const paramTrendDatas = data;
        //  [[1535774914790,-52],[1535774914791, -52],[1535774914899, -62],[1535774915008, -62]]
        const paramTrendConfig = this.getDefaultConfig();
        console.log('paramTrendDatas => ', paramTrendDatas);

        this.paramTrendConfig = paramTrendConfig;
        this.paramTrendDatas = data;

        

    }

    

    getDefaultConfig(): any {
        return {
            legend: {
                show: false,
            },
            // eventLine: {
            //     show: true,
            //     tooltip: {  // default line tooltip options
            //         show: false,         // default : true
            //         adjust: 5,          // right, top move - default : 5
            //         formatter: null,    // content formatting callback (must return content) - default : true
            //         style: '',          // tooltip container style (string or object) - default : empty string
            //         classes: ''         // tooltip container classes - default : empty string
            //     },
            //     events: [

            //     ]
            // },
            seriesDefaults: {
                showMarker: false
            },
            seriesColors: ['#2196f3', '#fb6520', '#ed9622'], // 기본, 알람, 워닝 순 컬러 지정
            series: [
                { lineWidth: 1 },
                { pointLabels: { show: true }, lineWidth: 1, lineCap: 'butt' },
                { pointLabels: { show: true }, lineWidth: 1, lineCap: 'butt' },
            ],
            axes: {
                xaxis: {
                    // min: this.searchTimePeriod[CD.FROM],
                    // max: this.searchTimePeriod[CD.TO],
                    autoscale: true,
                    tickOptions: {
                        showGridline: false,
                        formatter: (pattern: any, val: number, plot: any) => {
                            return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
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
                        showGridline: false,
                        formatString: '%.2f'
                    }
                }
            },
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
                // tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                //     tooltipContentProc(moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
                // },
                tooltipContentEditor: function (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any) {
                    let date: string = plot.data[seriesIndex][pointIndex][0];
                    let score: any = plot.data[seriesIndex][pointIndex][1];
                    date = moment(date).format('YYYY/MM/DD HH:mm:ss')
                    score = score.toFixed(2)
                    tooltipContentProc(
                        `<div class='bisTooltip'>` +
                        `<dl>` +
                        `<dt>date</dt>` +
                        `<dd>${date}</dd>` +
                        `</dl>` +
                        `<dl>` +
                        `<dt>score</dt>` +
                        `<dd>${score}</dd>` +
                        `</dl>` +
                        `</div>`
                    )
                },
            }
        };
    }
 
    zoomEvent(e:any){  
        let chartInfoDatas:any =
            {
                "type" : '',
                "height": 428,
                "width": 1615,
                "sessionId" :'' ,
                "series" :'' ,
                "fromdate":'',
                "todate":''
            };
            chartInfoDatas.type = e.type;       
            chartInfoDatas.sessionId = e.sessionId;
            chartInfoDatas.series = e.series
            chartInfoDatas.fromdate = e.datas[0];
            chartInfoDatas.todate = e.datas[1];
            this.changedSend(chartInfoDatas);
    }

    send(){    
        let mokConditon:any = {            
            'eqpIds': []
            ,'fabId': 'fab1'
            ,'paramId':1274
            ,'parameters': []
            // ,'timePeriod': {'from': 1542269327188, 'to': 1542269627188}   //26만건
            ,'timePeriod': {'from': 1542346341808, 'to': 1542346641808}   //26만건         
        }
        this.spinner.showSpinner();
        let message={};
        message['parameters']={};
        message['parameters']['type'] = 'default';   
        message['parameters']['fabId'] = this.data.fabId;
        message['parameters']['paramId'] = this.data.paramId;
        message['parameters']['fromdate'] = this.data.timePeriod.from;
        message['parameters']['todate'] = this.data.timePeriod.to;        

    let reply = this._stompService.send(null,'getRegressionTrend',message,payload => {    
                if(payload.chartFlag == 'image'){
                    this.chartFlag = 'image';
                    this.chartInfo = payload.imageChartData;    
                    this._stompService.finishSend(reply);
                    this.spinner.hideSpinner();
                }else{
                    console.warn('trend');
                    this.chartFlag = 'trend';
                    this.drawParamTrend(payload.trendData);
                    this._stompService.finishSend(reply);
                    this.spinner.hideSpinner();
                }
            });
    }  
    
    changedSend(e:any){
        this.spinner.showSpinner();
        let message={};
        message['parameters']={};
        message['parameters']['type'] = e.type;   
        message['parameters']['fabId'] = this.data.fabId;
        message['parameters']['paramId'] = this.data.paramId;
        message['parameters']['sessionId'] = e.sessionId;
        message['parameters']['series'] = e.series;
        message['parameters']['fromdate'] = e.fromdate;
        message['parameters']['todate'] = e.todate;        

    let reply = this._stompService.send(null,'getRegressionTrend',message,payload => {       
                if(payload.chartFlag == 'image'){
                    this.chartFlag = 'image';
                    this.chartInfo = payload.imageChartData;
                    this._stompService.finishSend(reply);
                    this.spinner.hideSpinner();
                }else{
                    console.warn('trend');
                    this.chartFlag = 'trend';         
                    this.drawParamTrend(payload.trendData);                          
                    this._stompService.finishSend(reply);
                    this.spinner.hideSpinner();
                }
            });

    }

    ngOnDestroy() {

    }
}