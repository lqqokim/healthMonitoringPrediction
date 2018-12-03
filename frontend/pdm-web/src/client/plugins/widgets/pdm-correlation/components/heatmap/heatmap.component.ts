import { Component, Input, Output, OnInit, OnChanges, ViewEncapsulation, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import * as ICorrelation from './../../model/correlation-interface';

declare let Plotly: any;

export interface Heatmap {
    x: Array<string>;
    y: Array<string>;
    z: Array<Array<number>>;
    type: string;
}

export type HeatmapData = [Heatmap];


@Component({
    moduleId: module.id,
    selector: 'heatmap',
    templateUrl: './heatmap.html',
    styleUrls: ['./heatmap.css'],
    encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnChanges, OnDestroy {
    @Output() onClickHeatmap: EventEmitter<any> = new EventEmitter();
    @Output() spinnerControl: EventEmitter<any> = new EventEmitter();
    @Input() data: ICorrelation.Response;
    // @Input('heatmapData')
    // set heatmapData(data) {
    //     this._heatmapRes = data;
    // }

    // get heatmapData() {
    //     return this._heatmapRes;
    // }

    // private _heatmapRes: ICorrelation.HeatmapResponse;

    chartId: string = this._guid();
    private _chartEl: HTMLElement;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const currentValue = changes['data']['currentValue'] as ICorrelation.Response;
            this.drawHeatmap(currentValue);
        }

        // if(this._heatmapData) {

        // }
    }

    drawHeatmap(currentValue: ICorrelation.Response): void {
        const data: HeatmapData = this.getHeatmapData(currentValue);
        const config: any = this.getHeatmapConfig();
        const layout: any = this.getHeatmapLayout(data);

        Plotly.newPlot(this.chartId, data, layout, config);
        this.spinnerControl.emit(false);
        this._addHeatmapEventHandler();
    }

    getHeatmapData(data: ICorrelation.Response): HeatmapData {
        return this._setHeatmapData(data);
    }

    getHeatmapLayout(data: HeatmapData): any {
        return this._setHeatmapLayout(data);
    }

    getHeatmapConfig(): any {
        return this._setHeatmapConfig();
    }

    private _setHeatmapData(data: ICorrelation.Response): HeatmapData {
        const correlationOutput: ICorrelation.Response['correlationOutput'] // z 값 소수자리 변경
            = data.correlationOutput.map((row) => {
                return row.map((item) => {
                    if (!Number.isInteger(item)) {
                        return Number(item.toFixed(3));
                    } else {
                        return item;
                    }
                });
            })


        const heatmapData: HeatmapData = [
            {
                z: correlationOutput,
                x: data.paramNames,
                y: data.paramNames,
                type: 'heatmap'
            }
        ];

        console.log('heatmapData => ', heatmapData);
        return heatmapData;
    }

    private _setHeatmapLayout(data: HeatmapData): any {
        let layout = this.getHeatmapDefaultLayout();
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

        return layout;
    }

    getHeatmapDefaultLayout(): any {
        return {
            // title: 'Correlation Heatmap',
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                pad: 4
            },
            annotations: [],
            xaxis: {
                automargin: true,
                autosize: true,
                ticks: '',
                side: 'bottom',
            },
            yaxis: {
                automargin: true,
                autosize: true,
                ticks: '',
                ticksuffix: ' ',
                // width: 700,
                // height: 400,
            }
        };
    }

    private _setHeatmapConfig(): any {
        const config = {
            responsive: true,
            displayModeBar: false
        };

        return config;
    }


    public relayoutHeatmap(): void {
        // const parentWidth = $("#heatmap").parent().width();
        // const parentHeight = $("#heatmap").parent().height();

        // console.log('parentWidth, parentHeight => ', parentWidth, parentHeight);

        // const update = {
        //     width: parentWidth,  // or any new width
        //     height: parentHeight  // " "
        // };

        // Plotly.relayout('heatmap', update);
    }

    private _clickCellEmitter(cell: { x: string, y: string, z: number }): void {
        const data = this.data;
        const xIndex = data.paramNames.indexOf(cell.x);
        const yIndex = data.paramNames.indexOf(cell.y);
        const paramSeq: Array<number> = [
            data.paramSeq[xIndex],
            data.paramSeq[yIndex]
        ];

        this.onClickHeatmap.emit(paramSeq);
    }

    private _addHeatmapEventHandler(): void {
        this._chartEl = document.getElementById(this.chartId);
        const heatmapEl = this._chartEl;

        (heatmapEl as any).on('plotly_click', (data: any) => {

            data.points[0].x !== data.points[0].y // 동일 Parameter는 호출x
                && this._clickCellEmitter({
                    x: data.points[0].x,
                    y: data.points[0].y,
                    z: data.points[0].z
                });
        });

        (heatmapEl as any).on('plotly_relayout', (data: any) => {
            console.log('plotly_relayout => ', data);
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

    private _guid() {
        return 'xxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return "C" + v.toString(16);
        });
    }

    ngOnDestroy() {
        function removeElement(element) {
            element && element.parentNode && element.parentNode.removeChild(element);
        }

        removeElement(this._chartEl);
    }
}