//Angular
import { Component, OnInit, OnChanges, Input, ViewEncapsulation, ViewChild } from '@angular/core';

//MI
import { PdmModelService } from './../../../../../common';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { PdmCommonService } from './../../../../../common/service/pdm-common.service';
import { Translater } from '../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'trend-chart',
    templateUrl: 'trend-chart.html',
    styleUrls: ['./trend-chart.css'],
    providers: [PdmModelService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class TrendChartComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() plantId;
    @Input() areaId;
    @Input() eqpId;
    @Input() paramId;
    @Input() fromDate;
    @Input() toDate;
    @Input() type;
    @Input() paramName;
    @Input() eqpName;
    @Input() value;
    @Input() warning;
    @ViewChild("trendChartPlot") trendChartPlot: any;

    //ruls=[{priod:30,day:5},{priod:7,day:10},{priod:3,day:20}];
    ruls = [];

    trendConfig = {};
    trendData = [];
    trendEventLines = [];
    isTrendChartLegend = false;
    xMin;
    xMax;

    alarmSpecLabel: string;
    warningSpecLabel: string;

    constructor(
        private _pdmModelService: PdmModelService,
        private _pdmCommonService: PdmCommonService,
        private translater: Translater
    ) {

    }

    ngOnInit() {
        this.setGlobalLabel();
        this.trendConfig = this.getTrendDataConfig({});
    }

    ngOnChanges(changes: any) {
        console.log('trend changes', changes);
        this.getData();

    }
    ngAfterViewInit() {
        this.getData();
    }
    getData() {
        if (this.paramId != undefined && this.paramId != "") {
            if (this.type == "warning" && this.value >= this.warning) {
                // if(this.type=="alarm"){ //temp
                this._pdmModelService.getTrendMultipleWithRUL(this.plantId, this.areaId, this.eqpId, this.paramId, this.fromDate, this.toDate).then(result => {
                    this.ruls = [{ priod: 3, day: result.day3 }, { priod: 7, day: result.day7 }, { priod: 14, day: result.day14 }]
                    this.trendData = [result.data];
                    for(let i=0;i<this.trendData[0].length;i++){
                        this.trendData[0][i][1] = this.trendData[0][i][1]/this.trendData[0][i][2];
                    }
                    this.getTrendSpec();
                })
            } else {
                this._pdmModelService.getTrendMultiple(this.plantId, this.areaId, this.eqpId, this.paramId, this.fromDate, this.toDate).then(result => {
                    this.trendData = [result];
                    for(let i=0;i<this.trendData[0].length;i++){
                        this.trendData[0][i][1] = this.trendData[0][i][1]/this.trendData[0][i][2];
                    }
                    this.getTrendSpec();
                })
            }
        }

    }
    getTrendSpec() {
        return this._pdmCommonService.getTrendMultipleSpecConfig(this.plantId, this.areaId, this.eqpId, this.paramId, this.fromDate, this.toDate).then((data) => {
            // let spec_alarm = data.alarm;
            let spec_alarm = 1;
            // let spec_warning = data.warning/data.alarm;
            let spec_warning = data.warning;
            this.trendEventLines = [];
            if (spec_alarm) {
                this.trendEventLines.push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255, 0, 0, .5)',
                    line: {
                        name: `${this.alarmSpecLabel} (${spec_alarm.toFixed(2)})`,
                        show: true, // default : false
                        value: spec_alarm,
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
                            show: false,
                            formatter: () => {
                                return `${this.alarmSpecLabel} (${spec_alarm.toFixed(2)})`;
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
                });
            }

            if (spec_warning) {
                this.trendEventLines.push({
                    show: true,
                    type: 'line',
                    axis: 'yaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(255, 255, 0, .5)',
                    line: {
                        name: `${this.warningSpecLabel} (${spec_warning.toFixed(2)})`,
                        show: true, // default : false
                        value: spec_warning,
                        color: '#FFA500',
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
                            show: false,
                            formatter: () => {
                                return `${this.warningSpecLabel} (${spec_warning.toFixed(2)})`;
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
                                left: 100
                            }
                        }
                    }
                });
            }
            if (this.type == "warning") {
                //if(this.type=="warning" || this.type=="alarm"){ //temp
                let lastDate = this.trendData[0][this.trendData[0].length - 1][0];
                let lastValue = this.trendData[0][this.trendData[0].length - 1][1];
                this.trendEventLines.push({
                    show: true,
                    type: 'line',
                    axis: 'xaxis',
                    //background: true,
                    fill: true,
                    fillStyle: 'rgba(0, 255, 0, 1)',
                    line: {
                        name: `Last data`,
                        show: true, // default : false
                        value: lastDate,
                        color: '#00ff00',
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
                                return `${this.warningSpecLabel} (${spec_warning.toFixed(2)})`;
                            }
                        },
                        draggable: {
                            show: false
                        },
                        label: {
                            show: false,         // default : false
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
                });
                this.trendData.splice(1, 3);
                for (let i = 0; i < this.ruls.length; i++) {
                    let data = [[lastDate, lastValue]];
                    let xValue = this.addDays(lastDate, this.ruls[i].day).getTime();
                    data.push([xValue, spec_alarm]);
                    this.trendData.push(data);

                    this.trendEventLines.push({
                        show: true,
                        type: 'line',
                        axis: 'xaxis',
                        //background: true,
                        fill: true,
                        fillStyle: 'rgba(0, 255, 0, 1)',
                        line: {
                            name: this.ruls[i].priod + ' Trend' + ' (' + this.ruls[i].day + 'd)',
                            show: true, // default : false
                            value: xValue,
                            color: '#00ff00',
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
                                    return `${this.warningSpecLabel} (${spec_warning.toFixed(2)})`;
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
                    });
                }
                this.trendData = this.trendData.concat([]);
            }


        });
    }

    getTrendDataConfig(config) {
        let curConfig = {
            legend: {
                show: this.isTrendChartLegend,
                labels: ['Trend', 'RUL1', 'RUL2', 'RUL3']
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
                    min: this.xMin,
                    max: this.xMax,
                    autoscale: true,
                    tickOptions: {
                        formatter: (pattern: any, val: number, plot: any) => {
                            // return val ? moment(val).format('YYYY-MM-DD H') : '';
                            return val ? moment(val).format('MM-DD H') : '';
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
                        formatString: '%.2f'
                    }
                }
            },
            series: [
                {
                    label: 'Trend'
                },
                {
                    label: 'RUL1'
                },
                {
                    label: 'RUL2'
                },
                {
                    label: 'RUL3'
                }
            ],
            highlighter: {
                isMultiTooltip: false,
                clearTooltipOnClickOutside: false,
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                },
                size: 2,
                sizeAdjust: 1,
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
                    `<div class='bisTooltip'>`+               
                        `<dl>`+
                            `<dt>date</dt>`+
                            `<dd>${date}</dd>`+
                        `</dl>`+
                        `<dl>`+
                            `<dt>score</dt>`+
                            `<dd>${score}</dd>`+
                        `</dl>`+
                    `</div>`
                    )
                }, 
            }
        };
        return Object.assign(curConfig, config);
    }

    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    private setGlobalLabel(): void {
        let translater = this.translater;
        this.alarmSpecLabel = translater.instant('PDM.SPEC.ALARM');
        this.warningSpecLabel = translater.instant('PDM.SPEC.WARNING');
    }
}