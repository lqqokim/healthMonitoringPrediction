import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'outlier-pattern-chart',
    templateUrl: 'outlier-pattern-chart.html'
})
export class OutlierPatternChartComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('outlierPatternChart') outlierPatternChart;
    @Output() clickChart: EventEmitter<any> = new EventEmitter();
    @Output() indexEmit: EventEmitter<any> = new EventEmitter();
    @Input() index: number;
    @Input() datas: any;

    far: any;
    outlierPatternData: any;
    patternChartConfig: any;
    outlierPatternChartConfig: any;
    countStr: string[] = ['st', 'nd', 'rd', 'th', 'th'];
    positionDates: any;

    constructor() {

    }

    ngOnInit() {
        this.outlierPatternChartConfig = {
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
                    color: '#0000ff'
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
                    tickOptions: { // label hide
                        show: false
                    },
                    rendererOptions: {
                        drawBaseline: false
                    }
                    // rendererOptions: {
                    //     dataType: 'date'
                    // },
                    // tickOptions: {
                    //     formatter: (pattern: any, val: number, plot: any) => {
                    //         return val ? moment(val).format('YYYY-MM-DD h') : '';
                    //     }
                    // },
                    // rendererOptions: {
                    //     dataType: 'date'
                    // }
                },
                yaxis: {
                    autoscale: true,
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    drawMajorGridlines: true,
                    tickOptions: {
                        formatString: '%.2f'
                        // ,
                        // formatter: (pattern: any, val: number, plot: any) => {
                        //     return val;
                        //     // return _.string.sprintf(pattern, val);
                        // }
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
                // tslint:disable-next-line:max-line-length
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    tooltipContentProc("[Index] " + pointIndex + " [Value] " + str.split(',')[1]);
                }
            }
        };
    }

    ngAfterViewInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this._getOutlierPatternData();
    }

    _getOutlierPatternData() {
        let windowLength = this.datas.window;
        let currentDatas = this.datas.currentDatas;
        let timeSeriesChartData = this.datas.timeSeriesChartData;
        this.far = currentDatas.data.far[this.index];
        
        let fars = [];
        this.positionDates = [];
        this.positionDates.push(timeSeriesChartData[0][this.far][0])
        
        for (let i = 0; i < windowLength; i++) {
            fars.push([i, timeSeriesChartData[0][this.far + i][1]]);
        }

        this.outlierPatternData = [fars];
    }

    chartClick() {
        this.drawEventLines();
    }

    drawEventLines() {
        let eventDatas = [];
        for (let i = 0; i < this.positionDates.length; i++) {
            eventDatas.push({
                position: this.positionDates[i],
                color: this.outlierPatternChart.chart.series[i].color
            });
        }

        this.clickChart.emit(eventDatas); // Event lines draw
        this.indexEmit.emit(this.index); // Chart area highlight
    }

    outlierCompleteChart(ev: any) {

    }
}
