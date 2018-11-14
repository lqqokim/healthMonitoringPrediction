import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Input, SimpleChanges } from '@angular/core';
import { paramTrendData } from '../../model/mock-data';

@Component({
    moduleId: module.id,
    selector: 'param-trend',
    templateUrl: './param-trend.html',
    styleUrls: ['./param-trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class ParamTrendComponent implements OnChanges, OnDestroy {
    @Input() data;

    paramTrendDatas: any[];
    paramTrendConfig: any;

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data = changes['data']['currentValue'];
            this.drawParamTrend(data);
        }
    }

    drawParamTrend(data): void {
        console.log('paramTrend data => ', data);
        const paramTrendDatas = this.getParamTrendData(data);
        const paramTrendConfig = this.getDefaultConfig();

        this.paramTrendConfig = paramTrendConfig;
        this.paramTrendDatas = paramTrendData;
    }

    getParamTrendData(data): any {
        return this._setParamTrendData(data);
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

    private _setParamTrendData(data): any { //set mock data
        // let datas = [];

        // for (let i = 0; i < 3; i++) {
        //     datas.push(data);
        // }

        return [data];
    }

    ngOnDestroy() {

    }
} 