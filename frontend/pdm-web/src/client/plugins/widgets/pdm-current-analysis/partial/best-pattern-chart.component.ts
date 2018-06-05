import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, AfterViewInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: `best-pattern-chart`,
    templateUrl: 'best-pattern-chart.html'
})
export class BestPatternChartComponent implements OnInit, AfterViewInit {
    @ViewChild('bestPatternChart') bestPatternChart;
    @ViewChild('checkbox') checkboxSelector: ElementRef;
    @Output() clickChart: EventEmitter<any> = new EventEmitter();
    @Output() indexEmit: EventEmitter<any> = new EventEmitter();
    @Input() index: number;
    @Input() datas: any;

    countStr: string[] = ['st', 'nd', 'rd', 'th', 'th'];
    bestPatternChartConfig: any;
    isChecked: boolean = false;
    isChartClick: boolean = false;
    bestPatternData: any = [];
    positionDates: any;
    nearPositionDates: any;
    timeSeriesChartData: any;
    windowLength: number;
    currentDatas: any;
    nearData: any;
    near: any;

    constructor() {

    }

    ngOnInit() {
        this.bestPatternChartConfig = {
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
                    color: '#1d8bf1'
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
                },
                yaxis: {
                    autoscale: true,
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    drawMajorGridlines: true,
                    tickOptions: {
                        formatString: '%.2f'
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
                strokeStyle: '#ddd',
                tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                    tooltipContentProc("[Index] " + pointIndex + " [Value] " + str.split(',')[1]);
                }
            }
        }
    }

    ngAfterViewInit() {
        
    }

    ngOnChanges(changes: any) {
        let currentValue = changes.datas.currentValue;
        this.windowLength = currentValue.window;
        this.currentDatas = currentValue.currentDatas;
        this.timeSeriesChartData = currentValue.timeSeriesChartData;
        this.near = this.currentDatas.data.near[this.index];
        this.checkboxSelector.nativeElement.checked = false;
        this.isChecked = false;
        this._setBestPatternData();
    }

    neighborCheck(ev: any): void {
        this.isChecked = ev.target.checked;
        if (this.isChecked) {
            this._setNeighborhoodData();
        } else {
            this._setBestPatternData(true);
        }
    }

    _setBestPatternData(unselect?): void {
        let first = this.near.location[0];
        let second = this.near.location[1];
        let firsts = [];
        let seconds = [];
        this.positionDates = [];
        this.positionDates.push(this.timeSeriesChartData[0][first][0]);
        this.positionDates.push(this.timeSeriesChartData[0][second][0])

        for (let i = 0; i < this.windowLength; i++) {
            firsts.push([i, this.timeSeriesChartData[0][first + i][1]]);
            seconds.push([i, this.timeSeriesChartData[0][second + i][1]]);
        }

        this.bestPatternData = [firsts, seconds];
        this.nearData = this.bestPatternData;
        this.nearPositionDates = this.positionDates;

        if (unselect) { // When neighbor checkbox unselect
            this.drawEventLines();
        }
    }

    _setNeighborhoodData() {
        let datas = [];
        this.positionDates = [];

        for (let j = 0; j < this.near.neighborhood.length; j++) {
            datas.push([]);
            this.positionDates.push(this.timeSeriesChartData[0][this.near.neighborhood[j]][0]); // Set neighborhood's date
        }

        this.positionDates.unshift(this.nearPositionDates[0], this.nearPositionDates[1]);

        for (let i = 0; i < this.windowLength; i++) {
            for (let j = 0; j < this.near.neighborhood.length; j++) {
                datas[j].push([i, this.timeSeriesChartData[0][this.near.neighborhood[j] + i][1]]); // Set neighborhood's  data (index, values)
            }
        }

        datas.unshift(this.nearData[0], this.nearData[1]);
        this.bestPatternData = datas;

        setTimeout(() => {
            this.drawEventLines();
        }, 300)
    }

    chartClick() {
        this.drawEventLines();
    }

    drawEventLines() {
        let eventDatas = [];
        for (let i = 0; i < this.positionDates.length; i++) {
            eventDatas.push({
                position: this.positionDates[i],
                color: this.bestPatternChart.chart.series[i].color
            });
        }

        this.clickChart.emit(eventDatas); // Event lines draw
        this.indexEmit.emit(this.index); // Chart area highlight
    }
}