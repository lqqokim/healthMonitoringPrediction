import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';

import { heatmapData } from './../model/mock-data';

declare let Plotly: any;

export interface Heatmap {
    data: any;
    layout: any;
}

@Component({
    moduleId: module.id,
    selector: 'correlation',
    templateUrl: './correlation.html',
    styleUrls: ['./correlation.css'],
    encapsulation: ViewEncapsulation.None
})
export class CorrelationComponent implements OnInit, OnChanges, OnDestroy {
    heatmap: Heatmap;

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit() {

    }

    drawTrend() {
        Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", (err, rows) => {

            function unpack(rows, key) {
                return rows.map(function (row) { return row[key]; });
            }

            const trace1 = {
                type: "scatter",
                mode: "lines",
                name: 'AAPL High',
                x: unpack(rows, 'Date'),
                y: unpack(rows, 'AAPL.High'),
                line: { color: '#17BECF' }
            }

            const trace2 = {
                type: "scatter",
                mode: "lines",
                name: 'AAPL Low',
                x: unpack(rows, 'Date'),
                y: unpack(rows, 'AAPL.Low'),
                line: { color: '#7F7F7F' }
            }

            const data = [trace1, trace2];

            const layout = {
                margin: {
                    l: 50,
                    r: 50,
                    b: 50,
                    t: 50,
                    pad: 4
                }
            };

            const config = this.getHeatmapConfig();
            Plotly.newPlot('trend', data, layout, config);
        })
    }

    drawScatter(): void {
        const config: any = this.getHeatmapConfig();

        const trace1 = {
            x: [52698, 43117],
            y: [53, 31],
            mode: 'markers',
            name: 'North America',
            text: ['United States', 'Canada'],
            marker: {
                color: 'rgb(164, 194, 244)',
                size: 12,
                line: {
                    color: 'white',
                    width: 0.5
                }
            },
            type: 'scatter'
        };

        const trace2 = {
            x: [39317, 37236, 35650, 27037, 34106, 27478, 30066, 29570, 27159, 23557, 21046, 18007],
            y: [33, 20, 13, 19, 27, 19, 49, 44, 38, 44, 40, 41],
            mode: 'markers',
            name: 'Europe',
            text: ['Germany', 'Britain', 'France', 'Spain', 'Italy', 'Czech Rep.', 'Greece', 'Poland'],
            marker: {
                color: 'rgb(255, 217, 102)',
                size: 12
            },
            type: 'scatter'
        };

        const trace3 = {
            x: [42952, 37037, 33106, 17478, 34106, 27478, 30066, 29570, 27159, 23557, 9813, 5253, 4692, 3899],
            y: [23, 42, 54, 89, 14, 99, 93, 70, 27, 19, 49, 44],
            mode: 'markers',
            name: 'Asia/Pacific',
            text: ['Australia', 'Japan', 'South Korea', 'Malaysia', 'China', 'Indonesia', 'Philippines', 'India'],
            marker: {
                color: 'rgb(234, 153, 153)',
                size: 12
            },
            type: 'scatter'
        };

        const trace4 = {
            x: [19097, 18601, 15595, 13546, 12026, 17478, 34106, 27478, 30066, 29570, 27159, 23557, 7434, 5419],
            y: [43, 47, 56, 99, 93, 70, 27, 80, 86, 93, 80, 13, 19, 27],
            mode: 'markers',
            name: 'Latin America',
            text: ['Chile', 'Argentina', 'Mexico', 'Venezuela', 'Venezuela', 'El Salvador', 'Bolivia'],
            marker: {
                color: 'rgb(142, 124, 195)',
                size: 12
            },
            type: 'scatter'
        };

        const data = [trace1, trace2, trace3, trace4];

        const layout = {
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            },
            xaxis: {
                title: 'MOVING_SPEED',
                showgrid: false,
                zeroline: false
            },
            yaxis: {
                title: 'RMS2',
                showline: false
            }
        };

        Plotly.newPlot('scatter', data, layout, config);
    }

    drawHeatmap(): void {
        const myPlot: HTMLElement = document.getElementById('heatmap');
        const data: any = this.getHeatmapData();
        const config: any = this.getHeatmapConfig();
        let layout: any = this.getHeatmapLayout();

        const xValues: string[] = data[0].x;
        const yValues: string[] = data[0].y;
        const zValues: any[] = data[0].z;

        for (let i = 0; i < yValues.length; i++) {
            for (let j = 0; j < xValues.length; j++) {
                let result = {
                    xref: 'x1',
                    yref: 'y1',
                    x: xValues[j],
                    y: yValues[i],
                    text: zValues[i][j],
                    font: {
                        family: 'Arial',
                        size: 15,
                        color: 'white'
                    },
                    showarrow: false
                };

                layout.annotations.push(result);
            }
        }

        Plotly.newPlot('heatmap', data, layout, config);

        (myPlot as any).on('plotly_click', (data: any) => {
            console.log('heatmap click => ', data);
            this.drawScatter();
            this.drawTrend();
        });
        // (myPlot as any).on('plotly_selected', (data: any) => {
        //     console.log('plotly_selected => ', data);
        // });
        // (myPlot as any).on('plotly_selecting', (data: any) => {
        //     console.log('plotly_selecting => ', data);
        // });
        // (myPlot as any).on('plotly_sliderchange', (data: any) => {
        //     console.log('plotly_sliderchange => ', data);
        // });
        // (myPlot as any).on('plotly_sliderend', (data: any) => {
        //     console.log('plotly_sliderend => ', data);
        // });
        // (myPlot as any).on('plotly_sliderstart', (data: any) => {
        //     console.log('plotly_sliderstart => ', data);
        // });
        // (myPlot as any).on('plotly_afterexport', (data: any) => {
        //     console.log('plotly_afterexport=> ', data);
        // });
        // (myPlot as any).on('plotly_afterplot', (data: any) => {
        //     console.log('plotly_afterplot => ', data);
        // });
        // (myPlot as any).on('plotly_animated', (data: any) => {
        //     console.log('plotly_animated => ', data);
        // });
        // (myPlot as any).on('plotly_animatingframe', (data: any) => {
        //     console.log('plotly_animatingframe => ', data);
        // });
        // (myPlot as any).on('plotly_animationinterrupted', (data: any) => {
        //     console.log('plotly_animationinterrupted => ', data);
        // });
        // (myPlot as any).on('plotly_autosize', (data: any) => {
        //     console.log('plotly_autosize => ', data);
        // });
        // (myPlot as any).on('plotly_beforeexport', (data: any) => {
        //     console.log('plotly_beforeexport => ', data);
        // });
        // (myPlot as any).on('plotly_buttonclicked', (data: any) => {
        //     console.log('plotly_buttonclicked => ', data);
        // });
        // (myPlot as any).on('plotly_clickannotation', (data: any) => {
        //     console.log('plotly_clickannotation => ', data);
        // });
        // (myPlot as any).on('plotly_deselect', (data: any) => {
        //     console.log('plotly_deselect => ', data);
        // });
        // (myPlot as any).on('plotly_doubleclick', (data: any) => {
        //     console.log('plotly_doubleclick => ', data);
        // });
        // (myPlot as any).on('plotly_framework', (data: any) => {
        //     console.log('plotly_framework => ', data);
        // });
        // (myPlot as any).on('plotly_hover', (data: any) => {
        //     console.log('plotly_hover => ', data);
        // });
        // (myPlot as any).on('plotly_unhover', (data: any) => {
        //     console.log('plotly_unhover => ', data);
        // });
        // (myPlot as any).on('plotly_transitioning', (data: any) => {
        //     console.log('plotly_transitioning => ', data);
        // });
        // (myPlot as any).on('plotly_transitioninterrupted', (data: any) => {
        //     console.log('plotly_transitioninterrupted => ', data);
        // });
        // (myPlot as any).on('plotly_relayout', (data: any) => {
        //     console.log('plotly_relayout => ', data);
        // });
    }

    getHeatmapData(): any {
        return heatmapData;
    }

    getHeatmapLayout(): any {
        return {
            // title: 'Correlation Heatmap',
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            },
            annotations: [],
            xaxis: {
                ticks: '',
                side: 'bottom'
            },
            yaxis: {
                ticks: '',
                ticksuffix: ' ',
                // width: 700,
                height: 400,
                autosize: true
            }
        };
    }

    getHeatmapConfig(): any {
        return {
            responsive: true,
            displayModeBar: false
        }
    }

    search(ev) {
        console.log('search => ', ev);
        this.drawHeatmap();
    }

    ngOnDestroy() {

    }
}