import { Component, OnInit, OnChanges, OnDestroy, Input, Output, SimpleChanges, EventEmitter, Renderer, ElementRef, ViewChild } from '@angular/core';

import * as pdmRadarI from './../../model/pdm-radar.interface';

@Component({
    moduleId: module.id,
    selector: 'bar-chart',
    templateUrl: './bar-chart.html',
    styleUrls: ['./bar-chart.css']
})
export class BarChartComponent implements OnInit, OnChanges, OnInit {
    @Input() item: pdmRadarI.ChartDataType;
    @Output() endExpandLoad: EventEmitter<any> = new EventEmitter();
    @Output() paramClick: EventEmitter<any> = new EventEmitter();
    @ViewChild('bar') canvasElem: ElementRef;

    chartConfig: any;
    chartData: any;
    chartOption: any;
    eventLines: any[];

    chartId: any;

    private readonly SIZE = {
        HEIGTH: 235,
        WIDTH: 320
    };

    private readonly EXPAND_SIZE = {
        HEIGTH: 700,
        WIDTH: 1175
    };

    private parentElem: ElementRef['nativeElement'] = undefined;
    private widgetElem: ElementRef['nativeElement'] = undefined;
    private resizeListenerFunc: Function;
    private resizeCallback: Function = this.onResize.bind(this);

    constructor(renderer: Renderer) {
        this.resizeListenerFunc = renderer.listen('window', 'resize', this.resizeCallback);
    }

    ngOnInit() {
        this.parentElem = this.canvasElem.nativeElement.parentElement;
        this.widgetElem = $(this.parentElem).parents('li.a3-widget-container')[0];
        this.widgetElem.addEventListener('transitionend', this.resizeCallback, false);
        // console.log('widgetElem', this.widgetElem);
    }

    onResize(e?: Event) {
        // console.log('onResize', e);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let change = changes[propName];
            const curVal = change.currentValue;
            let item: any;

            if (propName === 'item') {
                item = curVal;

                if (!item['isExpand']) {
                    this.chartId = `${item.id}${item.type}`;
                } else {
                    this.chartId = `${item.id}${item.type}_expand`;
                }

                // console.log('item', item);
            }

            this.drawBarChart(item);
        }
    }

    drawBarChart(item): void {
        // this.chartConfig = BarChartComponent.getDefaultChartConfig();
        // this.eventLines = BarChartComponent.getDefaultEventLines();
        if (item.type === 'alarm' || item.type === 'warning') {
            this.setAWChartData(item);
        } else {
            this.setBGChartData(item);
        }
    }

    setAWChartData(item: pdmRadarI.ChartDataType): void {
        let avgWithAWs: any[] = item.chartData.avgWithAWs.map((d: any) => d.value);
        let avgDailys: any[] = item.chartData.avgDailys.map((d: any) => d.value);
        let axisCategoryies: any[] = item.chartData.alarms.map((d: any) => d.axis);
        let warns: any[] = item.chartData.warns.map((d: any) => d.value);

        if (item.type === 'alarm') {
            this.setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item);
        } else if (item.type === 'warning') {
            this.setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item);
        }
    }

    setAlarmData(avgWithAWs, avgDailys, axisCategoryies, item): void {
        let overAlarms: any[] = [];
        let datas: any[] = [];
        let sumAvgAlarmAndOvers: any[] = [];
        const alarmSpec: number = 1;

        for (let i = 0; i < avgWithAWs.length; i++) {
            let avgWithAW: number;
            let overAlarm: number;
            let sumAvgAlarmAndOver: number;

            if (avgWithAWs[i] > alarmSpec) {
                overAlarm = avgWithAWs[i] - alarmSpec;
                avgWithAW = alarmSpec;
                sumAvgAlarmAndOver = avgWithAW;
            } else {
                overAlarm = null;
                avgWithAW = avgWithAWs[i];
                sumAvgAlarmAndOver = avgWithAW;
            }

            datas.push({
                axis: axisCategoryies[i],
                avgWithAW: avgWithAW,
                avgDaily: avgDailys[i],
                overAlarm: overAlarm,
                sumAvgAlarmAndOver: sumAvgAlarmAndOver
            });
        }

        avgWithAWs = [];
        avgDailys = [];
        overAlarms = [];
        axisCategoryies = [];
        // datas = _.sortBy(datas, 'avgWithAW');

        setTimeout(() => {
            const barLength: number = item['isExpand'] ? datas.length : 6;
            _.sortBy(datas, 'sumAvgAlarmAndOver').reverse().map((d: any, i: number) => {
                if (i < barLength) {
                    avgWithAWs.push(d.avgWithAW);
                    avgDailys.push(d.avgDaily);
                    axisCategoryies.push(d.axis);
                    overAlarms.push(d.overAlarm);
                    sumAvgAlarmAndOvers.push({
                        axis: d.axis,
                        value: d.sumAvgAlarmAndOver
                    });
                }
            });

            avgWithAWs.unshift('avgWithAW');
            avgDailys.unshift('avgDaily');
            overAlarms.unshift('overAlarm');
            // axisCategoryies.unshift('x');
            const chartData: any[] = [overAlarms, avgWithAWs, avgDailys];

            this.AWChartGenerator(item, chartData, axisCategoryies, sumAvgAlarmAndOvers);
        }, 500);
    }

    setWarningData(avgWithAWs, avgDailys, axisCategoryies, warns, item: pdmRadarI.ChartDataType): void {
        let overWarnings: any[] = [];
        let datas: any[] = [];

        for (let i = 0; i < avgWithAWs.length; i++) {
            let avgWithAW: number;
            let overWarning: number;
            let sumAvgWarningAndOver: number;

            if (avgWithAWs[i] > warns[i]) {
                overWarning = avgWithAWs[i] - warns[i];
                avgWithAW = warns[i];
                sumAvgWarningAndOver = avgWithAW + overWarning;
            } else {
                overWarning = null;
                avgWithAW = avgWithAWs[i];
                sumAvgWarningAndOver = avgWithAW;
            }

            datas.push({
                axis: axisCategoryies[i],
                avgWithAW: avgWithAW,
                avgDaily: avgDailys[i],
                overWarning: overWarning,
                sumAvgWarningAndOver: sumAvgWarningAndOver
            });
        }

        avgWithAWs = [];
        avgDailys = [];
        overWarnings = [];
        axisCategoryies = [];
        // datas = _.sortBy(datas, 'avgWithAW');

        setTimeout(() => {
            const barLength: number = item['isExpand'] ? datas.length : 6;
            _.sortBy(datas, 'sumAvgWarningAndOver').reverse().map((d: any, i: number) => {
                if (i < barLength) {
                    avgWithAWs.push(d.avgWithAW);
                    avgDailys.push(d.avgDaily);
                    axisCategoryies.push(d.axis);
                    overWarnings.push(d.overWarning);
                }
            });

            avgWithAWs.unshift('avgWithAW');
            avgDailys.unshift('avgDaily');
            overWarnings.unshift('overWarning');
            // axisCategoryies.unshift('x');
            const chartData: any[] = [overWarnings, avgWithAWs, avgDailys];

            this.AWChartGenerator(item, chartData, axisCategoryies);
        }, 500);
    }

    AWChartGenerator(item: pdmRadarI.ChartDataType, chartData, axisCategoryies, sumAvgAlarmAndOvers?): void {
        // console.log('chartData', chartData);
        let names: any = {};
        let colors: any = {};
        let groups: any = {};
        let grid: any = {};

        if (item.type === 'alarm') {
            names = {
                overAlarm: 'Alarm over',
                avgWithAW: 'Alarm avg',
                avgDaily: 'Target days avg'
            };

            colors = {
                overAlarm: 'red',
                avgWithAW: '#ff8080',
                avgDaily: 'olive'
            };

            groups = [['overAlarm', 'avgWithAW'], ['avgDaily']];
        } else if (item.type === 'warning') {
            names = {
                overWarning: 'Warning over',
                avgWithAW: 'Warning avg',
                avgDaily: 'Target days avg'
            };

            colors = {
                overWarning: 'orange',
                avgWithAW: '#ffc14d',
                avgDaily: 'olive'
            };

            groups = [['overWarning', 'avgWithAW'], ['avgDaily']];
        }

        if (!item['isExpand']) {
            const chart: any = c3Chart.generate({
                bindto: `#barChart${item.id}${item.type}`,
                size: {
                    height: this.SIZE.HEIGTH,
                    width: this.SIZE.WIDTH
                },
                data: {
                    type: 'bar',
                    columns: chartData,
                    names: names,
                    colors: colors,
                    groups: groups,
                    order: 'asc',
                    onclick: (data, path) => {
                        let paramData: any = item.chartData.avgWithAWs.find((d: any) => {
                            return d.axis === axisCategoryies[data.index];
                        });

                        this.paramClick.emit(paramData);
                    }
                },
                legend: {
                    item: {
                        onclick: (d) => {
                            // console.log('onclick', d);
                            // if (d === 'overAlarm') {
                            //     // chart.focus('avgWithAW');
                            //     // chart.focus('overAlarm');
                            //     // show(d); //when I click legend show some data
                            //     chart.hide(d);
                            //     chart.show();
                            // }
                        },
                        // onmouseout: (d) => {
                        //     // if (d === 'overAlarm' || d === 'avgWithAW') {
                        //     //     chart.focus('avgWithAW');
                        //     //     chart.focus('overAlarm');
                        //     //     // chart.select('avgWithAW');
                        //     // }
                        // },
                        // onmouseover: (d) => {
                        //     if (d === 'overAlarm' || d === 'avgWithAW') {
                        //         chart.select('overAlarm');
                        //         chart.select('avgWithAW');
                        //     }
                        // }
                    }
                },
                zoom: {
                    enabled: false
                },
                axis: {
                    x: {
                        type: 'category',
                        // categories: axisCategoryies
                    }
                },
                grid: {
                    y: {
                        lines: [
                            { value: 1, text: 'Alarm', class: 'color-grid', position: 'middle' }
                        ]
                    }
                },
                tooltip: {
                    format: {
                        title: (d) => {
                            return axisCategoryies[d];
                        },
                        value: (value: number, ratio, id: string) => {
                            let resultVal: number;

                            if (id === 'avgWithAW') {
                                for (let i = 0; i < chartData[1].length; i++) {
                                    if(value === chartData[1][i]) {
                                        resultVal = chartData[0][i] + value;
                                        break;
                                    }
                                }
                            } else {
                                resultVal = value;
                            }
                            return Number(resultVal).toFixed(6);
                        }
                    },
                    // contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
                    //     console.log(d, defaultTitleFormat, defaultValueFormat, color);
                    // }
                }
            });
        } else {
            // chartData.unshift(axisCategoryies);
            const chart: any = c3Chart.generate({
                bindto: `#barChart${item.id}${item.type}_expand`,
                size: {
                    height: this.EXPAND_SIZE.HEIGTH,
                    width: this.EXPAND_SIZE.WIDTH
                },
                data: {
                    type: 'bar',
                    // x: 'x',
                    columns: chartData,
                    names: names,
                    colors: colors,
                    groups: groups,
                    order: 'asc',
                    onclick: (data, path) => {
                        let paramData: any = item.chartData.avgWithAWs.find((d: any) => {
                            return d.axis === axisCategoryies[data.index];
                        });

                        this.paramClick.emit(paramData);
                    }
                },
                legend: {
                    position: 'inset',
                    inset: {
                        anchor: 'top-right',
                        x: undefined,
                        y: undefined,
                        step: undefined
                    }
                    // padding: 15,
                    // // define custom height and width for the legend item tile
                    // item: {
                    //     tile: {
                    //         width: 150,
                    //         height: 20
                    //     }
                    // }
                    // item: {
                    //     onclick: (d) => {
                    //         if (d === 'overAlarm') {
                    //             // chart.focus('avgWithAW');
                    //             // chart.focus('overAlarm');
                    //             // show(d); //when I click legend show some data
                    //             chart.hide(d);
                    //             chart.show();
                    //         }
                    //     },
                    //     onmouseout: (d) => {
                    //         // if (d === 'overAlarm' || d === 'avgWithAW') {
                    //         //     chart.focus('avgWithAW');
                    //         //     chart.focus('overAlarm');
                    //         //     // chart.select('avgWithAW');
                    //         // }
                    //     },
                    //     onmouseover: (d) => {
                    //         if (d === 'overAlarm' || d === 'avgWithAW') {
                    //             chart.select('overAlarm');
                    //             chart.select('avgWithAW');
                    //         }
                    //     }
                    // }
                },
                zoom: {
                    enabled: true
                },
                axis: {
                    x: {
                        type: 'category',
                        // categories: axisCategoryies
                    }
                },
                grid: {
                    y: {
                        lines: [
                            { value: 1, text: 'Alarm', class: 'color-grid', position: 'middle' }
                        ]
                    }
                },
                tooltip: {
                    format: {
                        title: (d) => {
                            return axisCategoryies[d];
                        },
                        value: (value: number, ratio, id: string) => {
                            let resultVal: number;

                            if (id === 'avgWithAW') {
                                for (let i = 0; i < chartData[1].length; i++) {
                                    if(value === chartData[1][i]) {
                                        resultVal = chartData[0][i] + value;
                                        break;
                                    }
                                }
                            } else {
                                resultVal = value;
                            }
                            return Number(resultVal).toFixed(6);
                        }
                    },
                    // contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
                    //     console.log(d, defaultTitleFormat, defaultValueFormat, color);
                    // }
                }
            });

            this.endExpandLoad.emit(true);
        }

        // console.log('selector', $('g.c3-legend-item').parent());
    }

    setBGChartData(item: pdmRadarI.ChartDataType): void {
        let avgSpecs: any[] = item.chartData.avgSpecs.map((d: any) => d.value);
        let avgDailys: any[] = item.chartData.avgDailys.map((d: any) => d.value);
        let axisCategoryies: any[] = item.chartData.alarms.map((d: any) => d.axis);
        let datas: any[] = [];

        for (let i = 0; i < avgSpecs.length; i++) {
            let gap: number;

            datas.push({
                axis: axisCategoryies[i],
                avgSpec: avgSpecs[i],
                avgDaily: avgDailys[i],
                gap: avgDailys[i] - avgSpecs[i]
            });
        }

        avgSpecs = [];
        avgDailys = [];
        axisCategoryies = [];

        setTimeout(() => {
            const barLength: number = item['isExpand'] ? datas.length : 6;
            _.sortBy(datas, 'gap').reverse().map((d: any, i: number) => {
                if (i < barLength) {
                    avgSpecs.push(d.avgSpec);
                    avgDailys.push(d.avgDaily);
                    axisCategoryies.push(d.axis);
                }
            });

            avgSpecs.unshift('avgSpec');
            avgDailys.unshift('avgDaily');
            // axisCategoryies.unshift('x');
            const chartData: any[] = [avgDailys, avgSpecs];
            this.BGChartGenerator(item, chartData, axisCategoryies);
        }, 500);
    }

    BGChartGenerator(item: pdmRadarI.ChartDataType, chartData, axisCategoryies): void {
        const dailyColor: string = item.type === 'G5' ? '#22b8cf' : '#ff009d';

        if (!item['isExpand']) {
            const chart: any = c3Chart.generate({
                bindto: `#barChart${item.id}${item.type}`,
                size: {
                    height: this.SIZE.HEIGTH,
                    width: this.SIZE.WIDTH
                },
                data: {
                    type: 'bar',
                    columns: chartData,
                    names: {
                        avgSpec: '90Days avg',
                        avgDaily: 'Target days avg'
                    },
                    colors: {
                        avgSpec: 'olive',
                        avgDaily: dailyColor
                    },
                    onclick: (data, path) => {
                        let paramData: any = item.chartData.avgDailys.find((d: any) => {
                            return d.axis === axisCategoryies[data.index];
                        });

                        this.paramClick.emit(paramData);
                    }
                    // groups: [['avgWithAW', 'overAlarm']]
                },
                zoom: {
                    enabled: false
                },
                axis: {
                    x: {
                        type: 'category',
                        // categories: axisCategoryies
                    }
                },
                grid: {
                    y: {
                        lines: [
                            { value: 1, text: 'Alarm', class: 'color-grid', position: 'middle' }
                        ]
                    }
                },
                tooltip: {
                    format: {
                        title: (d) => {
                            return axisCategoryies[d];
                        },
                        value: (value, ratio, id) => {
                            // console.log(value, ratio, id);
                            return Number(value).toFixed(6);
                        }
                    }
                }
            });
        } else {
            // chartData.unshift(axisCategoryies);
            const chart: any = c3Chart.generate({
                bindto: `#barChart${item.id}${item.type}_expand`,
                size: {
                    height: this.EXPAND_SIZE.HEIGTH,
                    width: this.EXPAND_SIZE.WIDTH
                },
                data: {
                    type: 'bar',
                    // x: 'x',
                    columns: chartData,
                    names: {
                        avgSpec: '90Days avg',
                        avgDaily: 'Target days avg'
                    },
                    colors: {
                        avgSpec: 'olive',
                        avgDaily: dailyColor
                    },
                    onclick: (data, path) => {
                        let paramData: any = item.chartData.avgDailys.find((d: any) => {
                            return d.axis === axisCategoryies[data.index];
                        });

                        this.paramClick.emit(paramData);
                    }
                    // groups: [['avgWithAW', 'overAlarm']]
                },
                legend: {
                    position: 'inset',
                    inset: {
                        anchor: 'top-right',
                        x: undefined,
                        y: undefined,
                        step: undefined
                    }
                },
                zoom: {
                    enabled: true
                },
                axis: {
                    x: {
                        type: 'category',
                        // categories: axisCategoryies
                    }
                },
                grid: {
                    y: {
                        lines: [
                            { value: 1, text: 'Alarm', class: 'color-grid', position: 'middle' }
                        ]
                    }
                },
                tooltip: {
                    format: {
                        title: (d) => {
                            return axisCategoryies[d];
                        },
                        value: (value, ratio, id) => {
                            return Number(value).toFixed(6);
                        }
                    }
                }
            });

            this.endExpandLoad.emit(true);
        }
    }

    static getDefaultChartConfig(): any {
        return {
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
                renderer: $.jqplot.BarRenderer,
                pointLabels: { show: false }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: []
                }
            }
        };
    }

    static getDefaultEventLines(): any {
        return [{
            show: true,
            type: 'line',
            axis: 'yaxis',
            //background: true,
            fill: true,
            fillStyle: 'rgba(255, 0, 0, .5)',
            line: {
                name: null,
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
                        return `Alarm`;
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

    ngOnDetroy() {

    }
}