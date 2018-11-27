import { Component, Input, Output, OnInit, OnChanges, ViewEncapsulation, SimpleChanges } from '@angular/core';

declare let Plotly: any;

// export enum Type {
//     line = 'lines',
//     maker = 'markers'
// }

export interface Trend {
    datas: any;
    // type: Type
    type: string;
}

@Component({
    moduleId: module.id,
    selector: 'trend',
    templateUrl: './trend.html',
    styleUrls: ['./trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class TrendComponent implements OnInit, OnChanges {
    @Input() data;

    private _chartEl: HTMLElement;
    chartId: string = this.guid();
    trendData;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('trend changfes = > ', changes);
        if (changes && changes['data']['currentValue']) {
            const data: Trend = changes['data']['currentValue'];

            console.log('[trend] changes => ', changes);
            this.drawTrend(data);
        }
    }

    drawTrend(data: Trend): void {
        this.getTrendData(data);
        const config = this.getTrendConfig();
        const layout = this.getTrendLayout();

        setTimeout(() => {
            const trendData = this.trendData;

            Plotly.newPlot(this.chartId, {
                data: trendData,
                layout: layout,
                config: config
            });

            this._addTrendEventHandler();
        }, 1000);
    }

    private _addTrendEventHandler(): void {
        d3.select('#trend')
            .call(d3.behavior.drag()
                .on('dragstart', () => {
                    console.log(d3.event)
                })
                .on('dragend', () => {
                    console.log(d3.event)
                })
            )

        this._chartEl = document.getElementById(this.chartId);
        const trendEl = this._chartEl;

        // (trendEl as any).on('plotly_zoomin', (data: any) => {
        //     console.log('plotly_zoomin => ', data);
        // });
        // (trendEl as any).on('plotly_zoomout', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });
        // (trendEl as any).on('plotly_pan', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });

        // (trendEl as any).on('plotly_scale_x', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });
        // (trendEl as any).on('plotly_scale_y', (data: any) => {
        //     console.log('plotly_zoomout => ', data);
        // });

        (trendEl as any).on('plotly_click', (data: any, ev) => {
            console.log('plotly_click => ', data, ev);
        });
        (trendEl as any).on('plotly_relayout', function (data: any, ev) {
            console.log('plotly_relayout => ', data, ev);
        });
    }

    getTrendData(data: Trend): any {
        return this._setTrendData(data);
    }

    getTrendLayout(): any {
        return this._setTrendLayout();
    }

    getTrendConfig(): any {
        return this._setTrendConfig();
    }

    private _setTrendData(data: Trend): void {
        const chartData = data.datas;
        const type = data.type;

        // function shuffle(input) {
        //     for (let i = input.length - 1; i >= 0; i--) {

        //         let randomIndex = Math.floor(Math.random() * (i + 1));
        //         let itemAtIndex = input[randomIndex];

        //         input[randomIndex] = input[i];
        //         input[i] = itemAtIndex;
        //     }
        //     return input;
        // }

        //parse data
        Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", (err, rows) => {
            // rows = shuffle(rows);

            function unpack(rows, key) {
                // console.log('rows => ', rows);
                return rows.map(function (row) { return row[key]; });
            }

            const trace1 = {
                // type: "scatter",
                // mode: "lines",
                mode: type,
                name: chartData.x,
                x: unpack(rows, 'Date'),
                y: unpack(rows, 'AAPL.High'),
                line: { color: '#17BECF' }
            }

            const trace2 = {
                // type: "scatter",
                // mode: "lines",
                mode: type,
                name: chartData.y,
                x: unpack(rows, 'Date'),
                y: unpack(rows, 'AAPL.Low'),
                line: { color: '#7F7F7F' }
            }

            this.trendData = [trace1, trace2];
        });
    }

    private _setTrendLayout() {
        let layout = this.getTrendDefaultLayout();

        return layout;
    }

    getTrendDefaultLayout(): any {
        const layout = {
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                pad: 4
            },
            xaxis: {
                // fixedrange: true,
                automargin: true,
                // autosize: true   
            },
            yaxis: {
                fixedrange: true,
                automargin: true,
                // autosize: true,
                autorange: 'visible'
            }
        };

        return layout;
    }

    private _setTrendConfig() {
        const config = {
            responsive: true,
            displayModeBar: false,
            // scrollZoom: true,
            // staticPlot: true
        }

        return config;
    }

    private guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }
}