import { Component, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IReqDataFormat_chart_eqp } from '../../pdm-eqp-health-index.component';

@Component({
    moduleId: module.id,
    selector: 'eqp-chart',
    templateUrl: 'eqp-chart.html',
    styleUrls: ['./eqp-chart.css'],
    encapsulation: ViewEncapsulation.None                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
})
export class EqpChartComponent {
    //* 보여지고 있는 로직 차트명 (Equipment)
    private chartName: string = '';

    //* 차트 데이터
    public chartDatas: Array<Array< Array<number> >> = [[]];

    //* 차트 기본설정
    private chartConfig: any = {};

    //* 차트 기본 설정 값
    private defaultChartConfig: any = {
        legend: {
            renderer: $.jqplot.EnhancedLegendRenderer,
            show: true,
            showLabels: true,
            showSwatch: true,
            border: 0,
            rendererOptions: {
                numberColumns: 1,
                seriesToggle: 'fast',
                disableIEFading: false
            },
            placement: 'outsideGrid',
            shrinkGrid: true,
            location: 'e'    // w: 왼쪽, n: 오른쪽
        },
        seriesDefaults: {
            showLine: true,
            showMarker: true
        },
        seriesColors:['#fb6520', '#ed9622', '#1f77b4', '#9467bd', '#2ca02c', '#d62728'], // 알람, 워닝, 로직1 ~ 4
        series: [
            { show: true, yaxis: 'yaxis', label: 'Alarm', lineWidth: 2, showMarker:false, showLine:true},
            { show: true, yaxis: 'yaxis', label: 'Warning', lineWidth: 2, showMarker:false, showLine:true},
            { show: true, yaxis: 'yaxis', label: 'Standard', lineWidth: 1},
            { show: true, yaxis: 'yaxis', label: 'SPC', lineWidth: 1},
            { show: true, yaxis: 'yaxis', label: 'Variation', lineWidth: 1},
            { show: true, yaxis: 'yaxis', label: 'RUL', lineWidth: 1}
        ],
        axes: {
            xaxis: {
                // x축 랜더링 옵션 (date: DateAxisRenderer /string: CategoryAxisRenderer /number: LinearAxisRenderer)
                drawMajorGridlines: false,
                drawMinorTickMarks: true,
                showMinorTicks: true,
                autoscale: true,

                // x축 틱 랜더링 (tickOptions-angle 회전 용)
                tickOptions: {
                    formatString: '%Y-%m-%d %H:%M:%S',
                    fontSize: '10px',
                    angle: -90
                },
                tickInterval: (1000*60*60*24)
                // min: minX,
                // max: maxX
            },
            yaxis: {
                label: 'Health Score',
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,

                showMinorTicks: true,
                drawMajorGridlines: false,
                renderer: $.jqplot.LinearAxisRenderer,
                autoscale: true,
                rendererOptions: {
                    minorTicks: 3
                },
                padMin: 1,
                padMax: 1,
                tickOptions: {
                    markSize: 4,
                    renderer: $.jqplot.CanvasAxisTickRenderer,
                    fontSize: '10px',
                    formatString: '%.2f'
                },
                labelOptions: {
                    fontSize:'10pt',
                    fontFamily: 'arial, sans-serif'
                },
                useSeriesColor: false
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
            strokeStyle: '#acafaa'
        }
    };

    constructor(
        currentElem: ElementRef,
        private changeDetectorRef: ChangeDetectorRef
    ){
    }

    //* 그려질 차트 데이터 컨버팅
    private drawChartDataConvert( reqDrawData: Array<IReqDataFormat_chart_eqp> | any ): {
        from: number,
        to: number
        chartConfig: any,
        chartData: any
    }{
        // 차트 데이터 가공
        let chartData: Array<Array<any>> = [];
        let chartSeriesData: Array<Array<any>> = [];

        let row: IReqDataFormat_chart_eqp;
        let i: number, j:number, len: number = reqDrawData.length;
        let nowDate: number;
        let yMin: number, yMax: number, yMargin: number;

        let dateFrom: number;
        let dateTo: number;

        let datas: { [key: number]: Array< Array<number|string> >;} = {};
        let pointDatas: { [key: number]: Array<IReqDataFormat_chart_eqp>;} = {};
        let logicID: number;
        let timestamp: number;

        // 그려질 차트 데이터 가공
        for( i=0; i<len; i++){
            row = reqDrawData[i];

            logicID = row.health_logic_id;
            timestamp = parseInt( moment(row.sum_dtts).format('x'), 10 );

            // 키값에 해당하는 배열이 없으면 만들기
            if( !datas.hasOwnProperty(logicID) ){
                datas[logicID] = [];
                pointDatas[logicID] = [];
            }

            // 날짜, 스코어 기록
            datas[logicID].push([ timestamp, row.score ]);

            // 포인트 마우스 올릴 시 보여줄 정보 용
            pointDatas[logicID].push( row );

            // x축 최소, 최대 값
            if( dateFrom === undefined || dateFrom > timestamp ){
                dateFrom = timestamp;
            }
            if( dateTo === undefined || dateTo < timestamp ){
                dateTo = timestamp;
            }

            // y축 최대, 최소 값 얻어내기
            if( yMin === undefined || yMin > row.score ){
                yMin = row.score;
            }
            if( yMax === undefined || yMax < row.score ){
                yMax = row.score;
            }
        }


        // 실제 그려질 데이터, 툴팁용 알람/워닝 공간 확보
        chartData[0] = [];          // alaram
        chartData[1] = [];          // warning
        chartSeriesData[0] = [];    // alaram
        chartSeriesData[1] = [];    // warning

        // 가공된 데이터 정렬
        for( const key in datas ){
            chartData.push( datas[key] );            // 차트에 그려질 데이터
            chartSeriesData.push( pointDatas[key] );     // 툴팁에 사용될 데이터
        }

        // alram, warning 라인 기록
        i = 0;
        len = chartSeriesData[2].length;

        while( i < len ){
            row = chartSeriesData[2][i];
            timestamp = parseInt( moment(row.sum_dtts).format('x'), 10 );
 
            chartData[0].push([ timestamp, row.upperAlarmSpec ]);
            chartData[1].push([ timestamp, row.upperWarningSpec ]);

            // y축 최대, 최소 값 얻어내기 
            if( yMin > row.upperAlarmSpec ){
                yMin = row.upperAlarmSpec;
            }
            if( yMin > row.upperWarningSpec ){
                yMin = row.upperWarningSpec;
            }

            if( yMax < row.upperAlarmSpec ){
                yMax = row.upperAlarmSpec;
            }
            if( yMax < row.upperWarningSpec ){
                yMax = row.upperWarningSpec;
            }

            i++;
        }

        // config 데이터 설정
        let chartConfig: any = JSON.parse(JSON.stringify(this.defaultChartConfig));

        // 툴팁
        chartConfig.highlighter.tooltipContentEditor = (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: Function, ev: Event): void => {
            const name: string = this.defaultChartConfig.series[seriesIndex].label;
            const color: string = this.defaultChartConfig.seriesColors[seriesIndex];

            // 알람, 워닝 용
            if( name === 'Alarm' || name === 'Warning' ){
                const pointData: Array<number> = chartData[seriesIndex][pointIndex];

                tooltipContentProc(
                    `<div class='eqpTooltip'>`+
                        `<strong><i style='background:${color}'></i>${name}</strong>`+
                        `<dl>`+
                            `<dt>date</dt>`+
                            `<dd>${moment(pointData[0]).format('YYYY-MM-DD')}</dd>`+
                        `</dl>`+
                        `<dl>`+
                            `<dt>score</dt>`+
                            `<dd>${pointData[1]}</dd>`+
                        `</dl>`+
                    `</div>`
                );
            }
            // 로직 1 ~ 4용
            else {
                const pointData: IReqDataFormat_chart_eqp = chartSeriesData[seriesIndex][pointIndex];

                tooltipContentProc(
                    `<div class='eqpTooltip'>`+
                        `<strong><i style='background:${color}'></i>${name}</strong>`+
                        `<dl>`+
                            `<dt>date</dt>`+
                            `<dd>${pointData.sum_dtts}</dd>`+
                        `</dl>`+
                        `<dl>`+
                            `<dt>score</dt>`+
                            `<dd>${pointData.score}</dd>`+
                        `</dl>`+
                        `<dl>`+
                            `<dt>param name</dt>`+
                            `<dd>${pointData.param_name}</dd>`+
                        `</dl>`+
                    `</div>`
                );
            }
        }

        // 날짜출력 포맷 설정
        chartConfig.axes.xaxis.tickOptions.formatter = (pattern: any, val: number, plot: any) => {
            return moment( val ).format('YY-MM-DD HH:mm:ss');
        };

        // 차트 그려질 범위 (시간 from ~ to)
        // chartConfig.axes.xaxis['renderer'] = $.jqplot.DateAxisRenderer;
        chartConfig.axes.xaxis['tickRenderer'] = $.jqplot.CanvasAxisTickRenderer;
        chartConfig.axes.xaxis['min'] = dateFrom;
        chartConfig.axes.xaxis['max'] = dateTo;

        // 최소, 최대 값 대비 여백 10%
        yMargin = (yMax - yMin) * 0.1;

        // 최소 최대값이 같아 여백이 없으면 최대값 기준 10%
        if( yMargin === 0 ){
            yMargin = yMax * 0.1;
        }

        // 차트 그려질 범위 y축 (여백 추가)
        chartConfig.axes.yaxis['min'] = yMin - yMargin;
        chartConfig.axes.yaxis['max'] = yMax + yMargin;

        return {
            from: dateFrom,
            to: dateTo,
            chartConfig: chartConfig,
            chartData: chartData
        };
    }

    //* 차트 데이터 설정
    public setParam(chartData: any, from :number, to :number, cellValue: number ){        

        // 차트명 설정
        this.chartName = 'Equipment';

        let drawData = this.drawChartDataConvert( <Array<IReqDataFormat_chart_eqp>> chartData );

        this.changeDetectorRef.detectChanges();

        setTimeout(()=>{
            // config 값 재설정
            this.chartConfig = drawData.chartConfig;

            // // 차트 데이터 세팅
            this.chartDatas = drawData.chartData;
        }, 10);
    }
}