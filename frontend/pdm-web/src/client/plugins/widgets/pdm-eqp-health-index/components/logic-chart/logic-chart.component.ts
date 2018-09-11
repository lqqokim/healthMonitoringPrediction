import { Component, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IReqDataFormat_chart_logic1 } from '../../pdm-eqp-health-index.component';

@Component({
    moduleId: module.id,
    selector: 'logic-chart',
    templateUrl: `logic-chart.html`,
    styleUrls: [`logic-chart.css`],
    encapsulation: ViewEncapsulation.None
})

export class LogicChartComponent {

    //* logic-chart 엘리먼트
    private currElem: ElementRef['nativeElement'] = undefined;

    //* logic4(RUL) 메시지 오픈 용
    private rulMsgOpen: boolean = false;

    //* 보여지고 있는 로직 차트명 (logic1 ~ logic4)
    private chartName: string = '';

    //* 차트 데이터
    public chartDatas: Array<Array< Array<number> >> = [[ ]];
    public chartDatas_se: Array<Array< Array<number> >> = [[ ]];

    //* 이벤트 라인
    public eventLines: Array<any> = [];    
    public eventLines_se: Array<any> = [];    

    //* 차트 기본설정
    private trendConfig: any = {};
    private trendConfig_se: any = {};

    //* 분할 모드
    private mode_dual: boolean = false;

    //* x축 area 기본 설정 값
    public xArea_DefaultConfig = {
        show: true,
        type: 'area',
        axis: 'xaxis',
        fill: true,
        fillStyle: 'rgba(0, 255, 0, .5)',
        start: {
            name: `event area`,
            show: true, // default : false
            value: 0,
            color: 'transparent',
            width: 0,       // default : 1
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
                    return '';
                }
            },
            draggable: {
                show: false
            }
        },
        end: {
            name: `event area`,
            show: true, // default : false
            value: 0,
            color: 'transparent',
            width: 0,       // default : 1
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
                    return '';
                }
            },
            draggable: {
                show: false
            }
        }
    };

    //* x축 line 기본 설정 값
    public xLine_DefaultConfig = {
        show: true,
        type: 'line',
        axis: 'xaxis',
        fill: true,
        fillStyle: 'rgba(0, 0, 0, .5)',
        line: {
            name: `Now`,
            show: true, // default : false
            value: 0,
            color: '#000000',
            width: 1,       // default : 1
            adjust: 0,      // default : 0
            pattern: null,  // default : null 점선 [16, 12]
            shadow: false,  // default : false
            eventDistance: 3,   // default : 3
            offset: {       // default : 0, 0
                top: 0,
                left: 0,
            },
            tooltip: {
                show: true,
                formatter: () => { return ''; }
            },
            draggable: {
                show: false,
                dragStop: (ev, newValue, neighbor, plot) => {}
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
    };

    //* y축 line 기본 설정 값
    public yLine_DefaultConfig = {
        show: true,
        type: 'line',
        axis: 'yaxis',
        line: {
            name: `condition value`,
            show: true, // default : false
            value: 0,
            color: '#ff0000',
            width: 1,       // default : 1
            adjust: 0,      // default : 0
            pattern: null,  // default : null 점선 [16, 12]
            shadow: false,  // default : false
            eventDistance: 3,   // default : 3
            offset: {       // default : 0, 0
                top: 0,
                left: 0,
            },
            tooltip: {
                show: true,
                formatter: () => { return ''; }
            },
            draggable: {
                show: false,
                dragStop: (ev, newValue, neighbor, plot) => {}
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
    };
    
    //* 차트 기본 설정 값
    private defaultChartConfig: any = {
        legend: {
            show: false,
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
            showMarker: false,
            animation: {
                show: true
            }
        },
        seriesColors:['#2196f3', '#fb6520', '#ed9622'], // 기본, 알람, 워닝 순 컬러 지정
        series: [
            { lineWidth:1 },
            { lineWidth:1 },
            { lineWidth:1 },
        ],
        axes: {
            xaxis: {
                autoscale: true,
                tickOptions: {
                    showGridline: false,
                    formatter: (pattern: any, val: number, plot: any) => {
                        return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
                    },
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
                },
                numberTicks: 6,
                // min: 0,
                // max: 10
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
            tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                tooltipContentProc( moment(parseInt(str.split(',')[0])).format('MM/DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
            },
        }
    };

    constructor(
        currentElem: ElementRef,
        private changeDetectorRef: ChangeDetectorRef
    ){
        this.currElem = currentElem.nativeElement;
    }

    //* 화면 분할 (true:차트 2개/false:차트1개)
    private dualMode( is_dual:boolean ): void {
        this.mode_dual = is_dual;
        this.currElem.className = ( is_dual ) ? 'dual' : '';
    }

    //* 그려질 차트 데이터 컨버팅
    private drawChartDataConvert( reqDrawData: Array<IReqDataFormat_chart_logic1> | any, eventLine?: Array<any> ): {
        from: number,
        to: number
        chartConfig: any,
        chartData: any
    }{
        // 차트 데이터 가공
        let tmpChartData: Array<Array<any>> = [[],[],[]];
        let row: IReqDataFormat_chart_logic1;
        let i: number, j:number, len: number = reqDrawData.length;
        let nowDate: number;
        let yMin: number, yMax: number, yMargin: number;

        let dateFrom: number;
        let dateTo: number;

        // 그려질 차트 데이터 가공
        for( i=0; i<len; i++){
            row = reqDrawData[i];
            
            tmpChartData[0].push([ row[0], row[1] ]);   // 기본 차트 데이터 
            tmpChartData[1].push([ row[0], row[2] ]);   // alarm
            tmpChartData[2].push([ row[0], row[3] ]);   // warning

            // x축 최소, 최대 값
            if( dateFrom === undefined || dateFrom > row[0] ){
                dateFrom = row[0];
            }
            if( dateTo === undefined || dateTo < row[0] ){
                dateTo = row[0];
            }

            // y축 최대, 최소 값 얻어내기
            for( j=1; j<4; j++ ){
                if( yMin === undefined || yMin > row[j] ){
                    yMin = row[j];
                }
                if( yMax === undefined || yMax < row[j] ){
                    yMax = row[j];
                }
            }
        }

        // config 데이터 설정
        let chartConfig: any = JSON.parse(JSON.stringify(this.defaultChartConfig));

        chartConfig.highlighter.tooltipContentEditor = (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
            tooltipContentProc( moment(parseInt(str.split(',')[0])).format('YY-MM-DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
        }

        // 날짜출력 포맷 설정
        chartConfig.axes.xaxis.tickOptions.formatter = (pattern: any, val: number, plot: any) => {
            return val ? moment(val).format('MM-DD HH:mm:ss') : '';
        };

        // 차트 그려질 범위 (시간 from ~ to)
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

        // 등록된 마지막 시간
        nowDate = reqDrawData[ i-1 ][0];

        // 이벤트 라인 x축 기준 세로 그리기 (마지막 시간 기준)
        if( eventLine !== undefined ){
            this.add_eventDraw_xLine({
                value: nowDate,
                name: 'Now'
            }, eventLine);
        }

        return {
            from: dateFrom,
            to: dateTo,
            chartConfig: chartConfig,
            chartData: tmpChartData
        };
    }

    //* 그려질 차트 데이터 컨버팅
    private drawChartDataConvert_RUL( reqDrawData: Array<IReqDataFormat_chart_logic1> | any ): {
        chartConfig: any,
        chartData: any
    }{
        // 차트 데이터 가공
        let tmpChartData: Array<Array<any>> = [[],[]];
        let row: IReqDataFormat_chart_logic1;
        let len: number = reqDrawData.length;

        // 그려질 차트 데이터 가공 용
        row = reqDrawData[len-1];
        tmpChartData[0].push([ row[0], row[2] ]);   // alarm
        tmpChartData[1].push([ row[0], row[3] ]);   // warning

        // config 데이터 설정
        let chartConfig: any = JSON.parse(JSON.stringify(this.defaultChartConfig));

        // 날짜출력 포맷 설정
        chartConfig.axes.xaxis.tickOptions.formatter = (pattern: any, val: number, plot: any) => {
            return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
        };

        return {
            chartConfig: chartConfig,
            chartData: tmpChartData
        };
    }

    //* RUL - 두점간의 중간 y축 길이 알아오기
    private getSplitPostionY( x1: number, y1: number, x2: number, y2: number, new_x: number ): number {
        const y: number = y2 - y1;      // y축 길이
        const x: number = x2 - x1;      // x축 길이

        const angle: number = y / x;    // Math.tan(angle) 구하기

        const newX: number = new_x - x1;    // 새로운 x축 길이
        const newY: number = angle * newX;  // 새로운 y축 길이

        return y1 + newY;   // y축 보정 값 전달
    }

    //* 차트 데이터 설정
    public setParam(logicType: string, chartData: any, from :number, to :number, cellValue: number ){

        // rul 메시지 숨김
        this.rulMsgOpen = false;

        // 차트명 설정
        this.chartName = logicType;

        let drawData: any;

        // 화면분할모드 x
        this.dualMode( false );

        // 등록된 이벤트 라인 지우기
        this.rm_eventDraw_all();
        
        // Logic1 - Standard
        if( logicType === 'logic1'){
            drawData = this.drawChartDataConvert( <Array<IReqDataFormat_chart_logic1>> chartData, this.eventLines );

            // line 속성 지정 (알람, 워닝)
            drawData.chartConfig.series[1] = { lineWidth:2, lineCap:'butt' };
            drawData.chartConfig.series[2] = { lineWidth:2, lineCap:'butt' };
        }
        // Logic2 - SPC
        else if ( logicType === 'logic2'){
            drawData = this.drawChartDataConvert( <Array<IReqDataFormat_chart_logic1>> chartData.eqpHealthTrendData, this.eventLines );
            
            // spc 영역 추가하기
            if( chartData.hasOwnProperty('scpPeriod') && chartData.scpPeriod !== null && chartData.scpPeriod.length > 0 ){
                const target = chartData.scpPeriod;
                const len: number = target.length;
                let i: number;

                for( i=0; i<len; i++ ){
                    // SPC 영역 색상 칠하기
                    this.add_eventDraw_xArea({
                        startName: `SPC ${i+1}`,
                        endName: `SPC ${i+1}`,
                        startValue: target[i][0],
                        endValue: target[i][1],
                        color: 'rgba(255, 232, 232, 0.28)'
                    }, this.eventLines);
                }
            }
        }
        // Logic3 - Variation
        else if (logicType === 'logic3'){
            drawData = this.drawChartDataConvert( <Array<IReqDataFormat_chart_logic1>> chartData.eqpHealthTrendData, this.eventLines );

            // x축 min 설정
            drawData.chartConfig.axes.xaxis['min'] = chartData.previous_date;

            // line 색상 지정 (previous_avg, period_avg, sigma)
            drawData.chartConfig.seriesColors.push('#ff0000');
            drawData.chartConfig.seriesColors.push('#30adec');
            drawData.chartConfig.seriesColors.push('#8d9aa8');

            // line 속성 지정
            drawData.chartConfig.series.push({lineWidth:2, linePattern: [2, 1], lineCap:'butt' });
            drawData.chartConfig.series.push({lineWidth:2, linePattern: [2, 1], lineCap:'butt' });
            drawData.chartConfig.series.push({lineWidth:2, lineCap:'butt' });
            
            // 평균값 line 그리기 (previous_avg)
            drawData.chartData[3] = [
                [chartData.previous_date, chartData.previous_avg],
                [from, chartData.previous_avg]
            ];

            // 평균값 line 그리기 (period_avg)
            drawData.chartData[4] = [
                [from, chartData.period_avg],
                [drawData.to, chartData.period_avg]
            ];
            
            // sigma line 그리기
            drawData.chartData[5] = [
                [chartData.previous_date, chartData.sigma],
                [drawData.to, chartData.sigma]
            ];

            // previous_avg 영역 색상
            this.add_eventDraw_xArea({
                startName: 'Previous avg',
                endName: 'Previous avg',
                startValue: chartData.previous_date,
                endValue: from,
                color: 'rgba(255, 229, 229, 0.28)'
            }, this.eventLines);

            // period_avg 영역 색상
            this.add_eventDraw_xArea({
                startName: 'Period avg',
                endName: 'Period avg',
                startValue: from,
                endValue: drawData.to,
                color: 'rgba(221, 244, 255, 0.35)'
            }, this.eventLines);

        }
        // Logic4 - RUL
        else if ( logicType === 'logic4'){
            this.dualMode( true );

            console.log( chartData );

            // 선택 된 셀의 값이 0일 경우, rul 종료지점이 표 그려주는 todate 보다 작으면(or 데이터가 null인경우도 포함) RUL 메시지 오픈 (RUL NO DATA)
            if( cellValue === 0 ||  chartData.rulEndTime === null || to > chartData.rulEndTime ){
                this.rulMsgOpen = true;
            }

            // (우측) 차트 그리기 RUL
            const drawData_se = this.drawChartDataConvert_RUL( <Array<IReqDataFormat_chart_logic1>> chartData.eqpHealthTrendData );

            // (좌측) 기본 차트 그리기
            drawData = this.drawChartDataConvert( <Array<IReqDataFormat_chart_logic1>> chartData.eqpHealthTrendData, this.eventLines );

            // (좌) 날짜출력 포맷 재설정
            drawData.chartConfig.axes.xaxis.tickOptions.formatter = (pattern: any, val: number, plot: any) => {
                return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
            };

            // RUL 그릴 데이터가 있을 경우만 그리기
            if( !this.rulMsgOpen ){
                
                // 좌, 우 중간 Y축 구하기
                const centerY: number = this.getSplitPostionY(
                    chartData.rulStartTime, chartData.rulStartValue,
                    chartData.rulEndTime, chartData.rulEndValue,
                    drawData.to
                );
    
                // (좌) RUL line 색상 지정
                drawData.chartConfig.seriesColors.push('#6eba3a');
    
                // (좌) RUL line 그리기
                drawData.chartData[3] = [
                    [chartData.rulStartTime, chartData.rulStartValue],
                    [drawData.to, centerY]
                ];
    
                // (좌) RUL line 선
                drawData.chartConfig.series.push({lineWidth:2, lineCap:'butt' });

                // (우) 알람, 워닝 데이터 끝까지 그리기
                const chartDataLastIdx: number = drawData_se.chartData[0].length-1;
                const alarmY: number = drawData_se.chartData[0][chartDataLastIdx][1];
                const warningY: number = drawData_se.chartData[1][chartDataLastIdx][1];

                // (우) 데이터 차트, 알람, 워닝 색상 제거
                drawData_se.chartConfig.seriesColors.splice(0, 3);

                // (우) (뒤로 그러질 차트 알람, 워닝 색상 추가)
                drawData_se.chartConfig.seriesColors.push( this.defaultChartConfig.seriesColors[1] );
                drawData_se.chartConfig.seriesColors.push( this.defaultChartConfig.seriesColors[2] );

                // (우) RUL line 색상 지정
                drawData_se.chartConfig.seriesColors.push('#6eba3a');              

                // (우) 뒤로 그려질 알람, 워닝 선 모양 설정
                drawData_se.chartConfig.series.splice(0, 3);
                drawData_se.chartConfig.series.push({lineWidth:1, linePattern:'dashed', lineCap:'butt' });
                drawData_se.chartConfig.series.push({lineWidth:1, linePattern:'dashed', lineCap:'butt' });

                // (우) RUL line 선
                drawData_se.chartConfig.series.push({lineWidth:2, linePattern: [2, 1], lineCap:'butt' });

                // (우) dashed 라인으로 그려질 임시 데이터 알람, 워닝 제거
                drawData_se.chartData.splice(0, 2);

                // (우) 알람 dashed 그리기
                drawData_se.chartData.push([
                    [drawData.to, alarmY],
                    [chartData.rulEndTime, alarmY]
                ]);
                // (우) 워닝 dashed 그리기
                drawData_se.chartData.push([
                    [drawData.to, warningY],
                    [chartData.rulEndTime, warningY]
                ]);

                // (우) RUL line 그리기
                drawData_se.chartData.push([
                    [drawData.to, centerY],
                    [chartData.rulEndTime, chartData.rulEndValue]
                ]);

                // 이벤트 라인 x축 기준 세로 그리기 (현재 시간 기준)
                this.add_eventDraw_xLine({
                    value: drawData.to,
                    name: 'Now'
                }, this.eventLines_se);

                // 차트 그려질 범위 (시간 from ~ to)
                drawData_se.chartConfig.axes.xaxis['min'] = drawData.to;
                drawData_se.chartConfig.axes.xaxis['max'] = chartData.rulEndTime;

                // (우) y축 좌측 차트와 동일하게 설정
                drawData_se.chartConfig.axes.yaxis['min'] = drawData.chartConfig.axes.yaxis['min'];
                drawData_se.chartConfig.axes.yaxis['max'] = drawData.chartConfig.axes.yaxis['max'];

                // (우) y축 tick 숨기기
                drawData_se.chartConfig.axes.yaxis['tickOptions']['show'] = false;

                // 우측 차트 그리기 처리
                this.trendConfig_se = drawData_se.chartConfig;
                this.chartDatas_se = drawData_se.chartData;
            }
        }

        this.changeDetectorRef.detectChanges();

        setTimeout(()=>{
            // config 값 재설정
            this.trendConfig = drawData.chartConfig;

            // 차트 데이터 세팅
            this.chartDatas = drawData.chartData;
        }, 10);
    }

    //* 이벤트 차트 지우기 (전부)
    public rm_eventDraw_all(): void {
        if( this.eventLines.length === 0 ){ return; }
        this.eventLines.splice(0, this.eventLines.length);

        if( this.eventLines_se.length === 0 ){ return; }
        this.eventLines_se.splice(0, this.eventLines_se.length);
    }

    //* 이벤트 차트 지우기 (관련 index)
    public rm_eventDraw_once( eventLines: Array<any>, index: number ): void {
        if( eventLines.length === 0 ){ return; }
        eventLines.splice(index, 1);
    }

    //* 이벤트 차트 그리기 내용 추가 (x축 area)
    public add_eventDraw_xArea( data:{
        startValue: number,
        endValue: number,
        startName: string,
        endName: string,
        color?: string
    }, eventLine:Array<any> ): void {
        const idx = eventLine.length;

        // 영역 내용 기본값 설정
        eventLine[idx] = JSON.parse(JSON.stringify(this.xArea_DefaultConfig));

        // 영역 시작/종료 값 설정
        eventLine[idx].start.value = data.startValue;
        eventLine[idx].end.value = data.endValue;

        // 색상 지정
        eventLine[idx].fillStyle = ( data.color === undefined ) ? 'rgba(0, 255, 0, 0.5)' : data.color;

        // 영역 시작/종료 라인 이름 설정
        eventLine[idx].start.tooltip.formatter = ()=>{ return data.startName; };
        eventLine[idx].end.tooltip.formatter = ()=>{ return data.endName; };
    }

    //* 이벤트 차트 그리기 내용 추가 (x축 line)
    public add_eventDraw_xLine(data:{
        value: number,
        name: string,
        color?: string
    }, eventLine:Array<any>): void {
        const idx = eventLine.length;
        let _value: number = data.value;

        // x축 line 내용 기본값 설정
        eventLine[idx] = JSON.parse(JSON.stringify(this.xLine_DefaultConfig));

        // x축 값 설정
        eventLine[idx].line.value = _value;        

        // x축 라인 색상 설정
        eventLine[idx].line.color = (data.color === undefined) ? '#000000' : data.color;

        // x축 이름 설정
        eventLine[idx].line.tooltip.formatter = ()=>{ return data.name; };

        // x축 드래그 이벤트
        eventLine[idx].line.draggable.dragStop = (ev, newValue, neighbor, plot)=>{
            _value = newValue;
        };
    }

    //* 이벤트 차트 그리기 내용 추가 (y축 line)
    public add_eventDraw_yLine(data:{
        value: number,
        name: string,
        color?: string
    }, eventLine:Array<any>): void {
        const idx = eventLine.length;
        let _value: number = data.value;

        // y축 line 내용 기본값 설정
        eventLine[idx] = JSON.parse(JSON.stringify(this.yLine_DefaultConfig));

        // y축 값 설정
        eventLine[idx].line.value = _value;

        // y축 라인 색상 설정
        eventLine[idx].line.color = (data.color === undefined) ? '#000000' : data.color;

        // y축 이름 설정
        eventLine[idx].line.tooltip.formatter = ()=>{ return data.name; };

        // y축 드래그 이벤트
        eventLine[idx].line.draggable.dragStop = (ev, newValue, neighbor, plot)=>{
            _value = newValue;
        };
    }
}
