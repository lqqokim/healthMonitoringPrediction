/*
    chart-draw-area
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DrawChartData, ChartDataItem } from '../topArea/chart-visual-options.component';

//* 테이블 그려질 타입
interface TableDrawType_enum {
    none: number,               // 아무것도 없음
    Xzero_Yzero: number,        // X축 0개      , Y축 0개
    Xmore_Yzero: number,        // X축 1개 이상 , Y축 0개
    Xzero_Ymore: number,        // X축 0개      , Y축 1개 이상
    Xmore_Ymore: number         // X축 1개 이상 , Y축 1개 이상
};

//* 실제 그려질 테이블 정보의 타입
interface TableDrawDataInfo_type_enum  {
    root: number,            // 제일 상위
    x_category: number,      // x축
    y_category: number       // y축
};

//* 차트 오브젝트 관리 저장 용 
interface ChartDatas {
    chart: any;
    xticks: Array<string|number>;
    yticks: Array<Array< Array<string|number> >>;
};

//* 실제 그려질 테이블 정보
export interface TableDrawDataInfo {
    name: string;
    param_name: (string | null);
    values: Array<
        Array<string | null>    // index Info (0:x축/ 1:y축/ 2:y2축) index 2배열은 y2가 있을때 만 존재
    >;
    children: Array<TableDrawDataInfo>;
    type: number;               // TableDrawDataInfo_type (0: root, 1: x_category, 2: y_category)
    mergeCount: number;         // 합칠 셀 갯수
};

//* 서버 요청 데이터 타입
export interface DrawResponseData {
    param_name: string;
    name: (string | null);
    type: string;
    values: Array<
        Array<string | null>    // index Info (0:x축/ 1:y축/ 2:y2축) index 2배열은 y2가 있을때 만 존재
    >;
    children: Array<DrawResponseData>;
    childrendKey?: {
        [key: string]: DrawResponseData;
    };
};

@Component({
    moduleId: module.id,
    selector: 'chart-draw-area',
    templateUrl: './chart-draw-area.html',
    styleUrls: ['./chart-draw-area.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChartDrawAreaComponent implements OnInit, OnDestroy {

    // Draw Chart 버튼 클릭 시 세팅된 데이터 부모 컴포넌트 전달 용
    // @Output() onDrawChartData = new EventEmitter<DrawChartData>();

    //* 테이블 그려질 타입
    private tableDrawType: TableDrawType_enum = {
        none: 0,               // 아무것도 없음
        Xzero_Yzero: 1,        // X축 0개      , Y축 0개
        Xmore_Yzero: 2,        // X축 1개 이상 , Y축 0개
        Xzero_Ymore: 3,        // X축 0개      , Y축 1개 이상
        Xmore_Ymore: 4         // X축 1개 이상 , Y축 1개 이상
    };

    //* 실제 그려질 테이블 정보의 타입
    private tableDrawDataInfo_type: TableDrawDataInfo_type_enum = {
        root: 0,            // 제일 상위
        x_category: 1,      // x축
        y_category: 2       // y축
    };

    // 그려질 테이블 타입
    private tableDrawStatus: number = this.tableDrawType.none;

    //* 실제 그려질 c3Chart 객체 값 저장 및 컨트롤 용
    private drawChartObj: Array<ChartDatas> = [];

    //* 리사이즈 이벤트 콜백함수
    private resizeListener: any = this.resize.bind(this);

    //* 로딩
    private loadingElem: Element;

    //* 차트 데이터
    private drawChartData: DrawChartData;

    //* 각 축마다 데이터 타입 
    private dataTypes: {
        x: string;       // x축
        y: string;       // y축
    } = {
        x: '',
        y: ''
    };

    private spaceMargin: number = 0.05;   // 간격 여백 5%

    // 차트 시리즈 옵션 설정 용
    private chartSeriesOpts: Array<any> = [];
    
    constructor(
        private currentElem: ElementRef,
        private changeDetectorRef: ChangeDetectorRef
    ){
    }

    ngOnInit(){
    }

    //* 끝
    ngOnDestroy(){

        // 그려준 차트가 하나라도 있다면 데이터 제거
        if( this.drawChartObj.length > 0 ){
            const len: number = this.drawChartObj.length;
            let i: number = 0;
            while( i < len ){
                // 차트 자체 제거 함수 구동
                this.drawChartObj[i].chart.rm();
                i++;
            }
            this.drawChartObj.splice(0);
            this.drawChartObj = null;
        }

        // 리사이즈 이벤트 제거
        window.removeEventListener('resize', this.resizeListener, false);
    }

    //* domReady
    ngAfterViewInit(): void {

        // 창 리사이즈 이벤트
        window.addEventListener('resize', this.resizeListener, false);

        // 로딩 엘리먼트 세팅
        this.loadingElem = $(this.currentElem.nativeElement).find('.loading_spinner');
    }

    //* 로딩 ON/OFF (true:보이기 / false:감추기)
    public loadingSwitch( onoff: Boolean ): void {

        // 에러 클래스 제거
        $(this.loadingElem)
            .removeAttr('error')
            .removeAttr('error-msg')
        ;

        // 로딩 스위치
        if( onoff === true ){
            $(this.loadingElem).addClass('on');
        } else {
            $(this.loadingElem).removeClass('on');
        }
    }

    //* 에러 메시지 출력 (type:basic, nodata)
    public errorMsg( msg: string, type: string = 'basic' ): void {
        // 로딩 제거
        this.loadingSwitch( false );

        // 에러 출력
        $(this.loadingElem)
            .attr('error', type)
            .attr('error-msg', msg)
        ;
    }

    //* 창 리사이즈 이벤트
    public resize(): void {
        if( this.drawChartObj.length === 0 ){ return; }

        let i: number = 0;
        const len: number = this.drawChartObj.length;

        while( i < len ){
            const target: any = this.drawChartObj[i].chart;
            // console.log( target );
            target.replot();
            i++;
        }

        // console.log( this.drawChartObj );
    }

    //* 그려질 차트 타입 설정
    private getDrawChartType( xCategoryCount: number, yCategoryCount: number ): number {
        if( xCategoryCount === 0 && yCategoryCount === 0 ){
            return this.tableDrawType.Xzero_Yzero;
        } else if( xCategoryCount > 0 && yCategoryCount === 0 ){
            return this.tableDrawType.Xmore_Yzero;
        } else if( xCategoryCount === 0 && yCategoryCount > 0 ){
            return this.tableDrawType.Xzero_Ymore;
        } else if( xCategoryCount > 0 && yCategoryCount > 0 ){
            return this.tableDrawType.Xmore_Ymore;
        } else {
            return this.tableDrawType.none;
        }
    }

    //* 차트 그리기
    public draw( data: DrawResponseData, xCategoryCount: number, yCategoryCount: number, chartType: string, drawChartData: DrawChartData ): void {

        // 그려질 차트 타입 설정
        this.tableDrawStatus = this.getDrawChartType(xCategoryCount, yCategoryCount);

        // 그려질 차트 데이터가 없거나, 그려질 타입이 없다면 그리지 않음
        if( this.tableDrawStatus === this.tableDrawType.none ){
            const $target: any = $(this.currentElem.nativeElement).find('#table_chartNone');
            $target.html('No Chart Data');
            return;
        }

        // 차트 데이터 설정
        this.drawChartData = drawChartData;

        // 그려질 차트에 따라 돔 그리기
        switch( this.tableDrawStatus ){
            case this.tableDrawType.Xzero_Yzero: this.draw_table_xzero_yzero(data, chartType); break;
            case this.tableDrawType.Xmore_Yzero: this.draw_table_xmore_yzero(data, chartType, xCategoryCount); break;
            case this.tableDrawType.Xzero_Ymore: this.draw_table_xzero_ymore(data, chartType); break;
            case this.tableDrawType.Xmore_Ymore: this.draw_table_xmore_ymore(data, chartType, yCategoryCount); break;
        }
    }

    //* jqplot 차트 그리기
    private draw_jqplotChart( $drawElems: any, chartValues: Array<string[][]>, chartType: string ): void {

        // 그릴 차트 데이터가 없을 때 에러문구 출력
        if( chartValues.length === 0 ){
            this.errorMsg('No Chart Datas');
            return;
        }

        // drawChartObj 내용 삭제 (내용이 있을 경우에만)
        if( this.drawChartObj.length > 0 ){
            let i: number = 0;
            const len: number = this.drawChartObj.length;

            // 그려진 차트 제거
            while( i < len ){
                this.drawChartObj[i].chart.destroy();
                i++;
            }

            // 배열에 등록된 내용도 제거
            this.drawChartObj.splice(0);

            // console.log('this.drawChartObj', this.drawChartObj);
        }

        // 차트 시리즈 옵션 설정
        let i: number = 0;
        let len: number = this.drawChartData.chartData.y.length;
        let yData: ChartDataItem = undefined;

        // 데이터가 있으면 날림
        if( len > 0 ){
            this.chartSeriesOpts.splice(0);
        }

        // y축 설정
        while( i < len ){
            yData = this.drawChartData.chartData.y[i];

            this.chartSeriesOpts.push({
                show: true,
                label: yData.name+'(Y)',
                yaxis: 'yaxis'
            });
            i++;
        }

        // y2축 설정
        i = 0;
        len = this.drawChartData.chartData.y2.length;
        while( i < len ){
            yData = this.drawChartData.chartData.y2[i];
            
            this.chartSeriesOpts.push({
                show: true,
                label: yData.name+'(Y2)',
                yaxis: 'y2axis'
            });
            i++;
        }

        // 엘리먼트 영역에 jqplot 차트 그리기
        const drawElemsLength: number = $drawElems.length-1;
        $drawElems.each((index: number, elem: any): void => {

            // 차트 영역 엘리먼트 (jquery)
            const selector: any = $(elem);

            // 엘리먼트에 chartValues Index 값 가져오기
            const currIdx: number = parseInt( selector.attr('chartIdx'), 10);
            const currId: string = `analysisChart_${currIdx}`;
            selector.attr('id', currId);

            // 해당 차트 데이터만
            const currValues: (string|number)[][] = chartValues[currIdx];

            // 가공 데이터 임시 변수
            let i: number, j: number;
            let iLen: number, jLen: number;
            let currValue: string = '';
            let changeValue: number | string = undefined;

            //
            this.dataTypes.x = undefined;
            this.dataTypes.y = undefined;

            // 각 축에 따른 차트 데이터 값
            let datas: {
                x: ChartDatas['xticks'],   // x축
                y: ChartDatas['yticks'],   // y축
            } = {
                x: [],
                y: []
            };
            let dataTypeName: string = '';
            let tmpXData: number | string = undefined;

            // min max
            let min_X = undefined;
            let min_Y = undefined;
            let max_X = undefined;
            let max_Y = undefined;

            // 가공 시작 currValues[i][]
            iLen = currValues.length;
            for( i=0; i<iLen; i++ ){
                jLen = currValues[i].length;

                // x축 이름이 null일 경우 건너 뜀
                if( currValues[i][0] === null ){ continue; }

                // currValues[i][j]: [x, y, y2]
                for( j=0; j<jLen; j++ ){

                    // 해당 데이터 초기에는 x, y, y2가 string으로 들어 있음
                    currValue = <string>currValues[i][j];

                    // x축 데이터
                    if( j === 0 ){                        
                        // null 일경우
                        if( currValue === null){
                            changeValue = 0;
                            dataTypeName = 'null';
                        }
                        // 날짜 타입인지 확인
                        else if( RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}.[0-9]{2}:[0-9]{2}:[0-9]{2}').test(currValue) ){
                            changeValue = <number> new Date(currValue).getTime();
                            dataTypeName = 'date';
                        }
                        else {
                            changeValue = parseFloat(currValue);

                            // 이름(문자)
                            if( isNaN(changeValue) || this.drawChartData.chartData.x[0].name === 'BARCODE' ){
                                dataTypeName = 'string';
                                changeValue = currValue;
                            }
                            // 숫자
                            else {
                                dataTypeName = 'number';
                            }
                        }

                        // x축 데이터 타입 설정
                        this.dataTypes.x = dataTypeName;

                        // x축 데이터 값 저장(tick 출력 용), 중복되는 값이 없을 경우만 추가
                        if( datas.x.indexOf( changeValue ) < 0 ){
                            datas.x.push( changeValue );
                        }

                        // y축에 x축 값 저장 용
                        tmpXData = changeValue;
                        
                        // 숫자 타입의 x축이라면
                        if( dataTypeName === 'number' ){
                            // x축 최소 값
                            if( min_X === undefined ){
                                min_X = <number>changeValue;
                            } else {
                                min_X = (min_X < changeValue) ? min_X : <number>changeValue;
                            }

                            // x축 최대 값
                            if( max_X === undefined ){
                                max_X = <number>changeValue;
                            } else {
                                max_X = (max_X < changeValue) ? <number>changeValue : max_X;
                            }
                        }
                    }
                    // y, y2축 데이터
                    else if( j > 0 ){
                        // 값 설정
                        changeValue = parseFloat(currValue);

                        // console.log( typeof datas.y[j-1] );
                        if( typeof datas.y[j-1] === 'undefined' ){
                            datas.y[j-1] = [];
                        }
                        datas.y[j-1].push([ tmpXData, changeValue ]);

                        // y축 최소 값
                        if( min_Y === undefined ){
                            min_Y = <number>changeValue;
                        } else {
                            min_Y = (min_Y > changeValue) ? <number>changeValue : min_Y;
                        }

                        // y축 최대 값
                        if( max_Y === undefined ){
                            max_Y = <number>changeValue;
                        } else {
                            max_Y = (max_Y < changeValue) ? <number>changeValue : max_Y;
                        }
                    }
                }
            }

            // x, y축 여백
            const spaceX: number = Math.abs(max_X - min_X) * this.spaceMargin;
            const spaceY: number = Math.abs(max_Y - min_Y) * this.spaceMargin;
            min_X -= spaceX;
            max_X += spaceX;
            min_Y = Math.round(min_Y - spaceY);
            max_Y = Math.round(max_Y + spaceY);

            // 차트 기본 타입 설정 값
            const rendererOpts: any = this.chartTypeOpts(chartType, min_X, max_X, min_Y, max_Y);

            // 차트 그리기
            const chart:any = $.jqplot( currId, JSON.parse(JSON.stringify(datas.y)), rendererOpts );

            // (함수 생성) y축 Tick 데이터 가져오기
            chart.getTicksData = (seriesIdx: number, pointIdx: number): {x: (number|string), y: number} =>{
                const data: Array<number|string> = datas.y[seriesIdx][pointIdx];
                return {
                    x: data[0],
                    y: <number> data[1]
                };
            };

            // (함수 생성) min, max 값 가져오기
            chart.getMinMax = (): { min_X: number; max_X: number; min_Y: number; max_Y: number; } => {
                return {
                    min_X: min_X,
                    max_X: max_X,
                    min_Y: min_Y,
                    max_Y: max_Y
                };
            };

            // (함수 생성) 차트 자기 자신 제거
            chart.rm = (): void => {
                var curr = chart;
                curr.destroy();
                for( var key in curr ){
                    delete curr[key];
                }
            }

            // 차트 데이터 저장
            this.drawChartObj.push({
                chart: chart,
                xticks: datas.x,
                yticks: datas.y
            });

            // 로딩 애니 끝
            if( drawElemsLength === index ){
                this.loadingSwitch( false );
            }
        });
    }

    //* jqplot 차트 시리즈 옵션 타입별 기본 값 가져오기
    private chartTypeOpts( chartType: string, minX: number, maxX: number, minY: number, maxY: number ): any {
        let rendererType: any = {};

        switch( chartType ){
            case 'bar': rendererType = {
                renderer: $.jqplot.BarRenderer,
                rendererOptions: {
                    highlightMouseOver: false,
                    highlightMouseDown: false
                },
                shadow: false,
                showLine: true,
                showMarker: true,
                lineWidth: 1,
                isDragable: false,
                stackSeries: false,
                showHighlight: true,
                xaxis: 'xaxis',
                yaxis: 'yaxis',
                strokeStyle: 'rgba(100,100,100,1)',
                breakOnNull: true,
                highlightMouseOver: false,
                markerOptions: {
                    shadow: false,
                    style: 'filledCircle',
                    fillRect: false,
                    strokeRect: false,
                    lineWidth: 1,
                    stroke: true,
                    size: 7,
                    allowZero: true,
                    printSize: false
                },
                dragable: {
                    constrainTo: 'x'
                },
                trendline: {
                    show: false
                },
                pointLabels: {
                    show: false
                }
            }; break;
            case 'line': rendererType = {
                renderer: $.jqplot.LineRenderer,
                rendererOptions: {
                    highlightMouseOver: true,
                    highlightMouseDown: false
                },
                shadow: false,
                showLine: true,
                showMarker: true,
                lineWidth: 1,
                isDragable: false,
                stackSeries: false,
                showHighlight: true,
                xaxis: 'xaxis',
                yaxis: 'yaxis',
                strokeStyle: 'rgba(100,100,100,1)',
                breakOnNull: true,
                highlightMouseOver: true,
                markerOptions: {
                    shadow: false,
                    style: 'filledCircle',
                    fillRect: false,
                    strokeRect: false,
                    lineWidth: 1,
                    stroke: true,
                    size: 7,
                    allowZero: true,
                    printSize: false
                },
                dragable: {
                    constrainTo: 'x'
                },
                trendline: {
                    show: false
                },
                pointLabels: {
                    show: false
                }
            }; break;
            case 'pie': rendererType = {
                renderer: $.jqplot.PieRenderer,
                rendererOptions: {
                    highlightMouseOver: false,
                    highlightMouseDown: false
                },
                shadow: false,
                showLine: true,
                showMarker: true,
                lineWidth: 1,
                isDragable: false,
                stackSeries: false,
                showHighlight: true,
                xaxis: 'xaxis',
                yaxis: 'yaxis',
                strokeStyle: 'rgba(100,100,100,1)',
                breakOnNull: true,
                highlightMouseOver: false,
                markerOptions: {
                    shadow: false,
                    style: 'filledCircle',
                    fillRect: false,
                    strokeRect: false,
                    lineWidth: 1,
                    stroke: true,
                    size: 7,
                    allowZero: true,
                    printSize: false
                },
                dragable: {
                    constrainTo: 'x'
                },
                trendline: {
                    show: false
                },
                pointLabels: {
                    show: false
                }
            }; break;
            case 'scatter': rendererType = {
                renderer: $.jqplot.LineRenderer,
                rendererOptions: {
                    highlightMouseOver: false,
                    highlightMouseDown: false
                },
                shadow: false,
                showLine: false,
                showMarker: true,
                lineWidth: 0,
                isDragable: false,
                stackSeries: false,
                showHighlight: true,
                xaxis: 'xaxis',
                yaxis: 'yaxis',
                strokeStyle: 'rgba(100,100,100,1)',
                breakOnNull: true,
                highlightMouseOver: false,
                markerOptions: {
                    shadow: false,
                    style: 'filledCircle',
                    fillRect: false,
                    strokeRect: false,
                    lineWidth: 1,
                    stroke: true,
                    size: 7,
                    allowZero: true,
                    printSize: false
                },
                dragable: {
                    constrainTo: 'x'
                },
                trendline: {
                    show: false
                },
                pointLabels: {
                    show: false
                }
            }; break;
        }

        return {
            defaultGridPadding: { top: 10, right: 10, bottom: 23, left: 10 },
            title: '',
            captureRightClick: true,
            multiCanvas: false,
            copyData: false,
            stackSeries: false,
            showLoader: true,
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
                location: 'e'
            },
            seriesDefaults: rendererType,
            series: this.chartSeriesOpts,
            sortData: false,
            canvasOverlay: {
                show: true,
                objects: []
            },
            grid: {
                borderWidth: 1,
                marginLeft: '0',
                gridLineWidth: 1,
                background: '#fff',
                borderAntiAliasing: false,
                drawBorder: true,
                drawGridlines: true,
                shadow: false
            },
            axes: {
                xaxis: {
                    // x축 랜더링 옵션 (date: DateAxisRenderer /string: CategoryAxisRenderer /number: LinearAxisRenderer)
                    renderer: (
                        this.dataTypes.x === 'date' ? $.jqplot.DateAxisRenderer : (
                            this.dataTypes.x === 'string' ? $.jqplot.CategoryAxisRenderer : $.jqplot.LinearAxisRenderer
                        )
                    ),
                    rendererOptions: {
                        tickInset: 0.2,
                        minorTicks: 3
                    },
                    drawMajorGridlines: false,
                    drawMinorTickMarks: true,
                    showMinorTicks: true,
                    autoscale: true,

                    // x축 틱 데이터
                    // ticks: xTicks,

                    // x축 틱 랜더링 (tickOptions-angle 회전 용)
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: (
                        this.dataTypes.x === 'date' 
                            // 날짜
                            ? {
                                formatString: '%Y-%m-%d %H:%M:%S',
                                fontSize: '10px',
                                angle: -90
                            }
                            : (this.dataTypes.x === 'string'
                                // 문자
                                ? {
                                    // formatString: '%s',
                                    markSize: 6,
                                    fontSize: '10px',
                                    angle: -90
                                }
                                // 숫자
                                : {
                                    formatString: '%d',
                                    markSize: 6,
                                    fontSize: '10px',
                                    angle: -90
                                }
                            )
                    ),
                    // min: minX,
                    // max: maxX
                },
                yaxis: {
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
                        formatString: '%.0f'
                    },
                    labelOptions: {
                        fontSize:'10pt',
                        fontFamily: 'arial, sans-serif'
                    },
                    useSeriesColor: false,
                    min: minY,
                    max: maxY
                },
                y2axis: {
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
                        formatString: '%.0f'
                    },
                    labelOptions: {
                        fontSize:'10pt',
                        fontFamily: 'arial, sans-serif'
                    },
                    useSeriesColor: false,
                    min: minY,
                    max: maxY
                }
            },
            noDataIndicator: {
                show: true,
                indicator: '',
                axes: {
                    xaxis: {
                        showTicks: false
                    },
                    yaxis: {
                        showTicks: false
                    }
                }
            },
            cursor: {
                zoom: true,
                style: 'auto',
                showTooltip: false,
                draggable: false,
                dblClickReset: false
            },
            highlighter: {
                // show: true,
                tooltipLocation: 'ne',
                fadeTooltip: false,
                tooltipContentEditor: (str: string, seriesIdx: number, pointIdx: number, jqplot: any, tooltipContent: any ): void => {
                    const tickData: {x: (number|string), y: number} = jqplot.getTicksData(seriesIdx, pointIdx);
                    tooltipContent( `${tickData.x}, ${tickData.y}` );
                },
                showTooltip: true,
                sizeAdjust: 1,
                size: 2,
                stroke: true,
                strokeStyle: '#cccccc',
                clearTooltipOnClickOutside: false,
                isMultiTooltop: false,
                // 마우스 오버 효과
                overTooltip: true,
                overTooltipOptions: {
                    showMarker: true,
                    showTooltip: true,
                    lineOver: false
                }
            },
            groupplot: {
                show: false
            },
            pointLabels: {
                show: false
            },
            canvasWindow: {
                show: false
            },
            eventLine: {
                show: false
            },
            multiSelect: {
                show: true
            }
        }
    }

    //* jqplot으로 그려진 타입 변경
    public draw_c3ChartTypeChange( chartType: string ): void {

        // 그려진 차트가 없으면 건너 뜀
        if( this.drawChartObj.length === 0 ){ return; }

        // 차트 기본 타입 설정 값
        let rendererOpts: any;
        let chart: any;
        let yTicks: ChartDatas['yticks'];
        let minMax: { min_X: number; max_X: number; min_Y: number; max_Y: number; };

        // 차트 총 개수
        const len: number = this.drawChartObj.length;
        let i: number = 0;        
        
        // 차트 타입 변경
        while( i < len ){
            chart = this.drawChartObj[i].chart;
            yTicks = JSON.parse(JSON.stringify(this.drawChartObj[i].yticks));
            minMax = chart.getMinMax();

            console.log( 'minMax', minMax );

            rendererOpts = this.chartTypeOpts(chartType, minMax.min_X, minMax.max_X, minMax.min_Y, minMax.max_Y);

            // 차트 다시 그리기 (y축에 들어있는 x축 데이터를 1로 변환하는 문제 때문에 데이터 다시 전달)
            chart.destroy();
            chart.reInitialize(yTicks, rendererOpts);
            chart.replot();
            i++;
        }
    }

    //* 테이블 없이 차트 한개만 그리기
    private draw_table_xzero_yzero(data: DrawResponseData, chartType: string): void {
        let chartValues: Array< string[][] > = [];

        const tableRender: Function = ( d: DrawResponseData ): string =>{

            // 차트 데이터
            chartValues[0] = d.values;

            // 차트 그려질 영역
            return `<div class='chartView' chartIdx='${0}'></div>`;
        };

        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xzero_Yzero');

        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRender(data);

        // 차트 그리기
        this.draw_jqplotChart( $target.find('.chartView'), chartValues, chartType );
    }

    //* x축만 그리기
    private draw_table_xmore_yzero(data: DrawResponseData, chartType: string, xCateCount: number ): void {
        let chartIdx: number = 0;
        let chartValues: Array< string[][] > = [];

        const tableRender: Function = ( d: DrawResponseData ): string =>{

            // 결과 값
            let result: string = '';

            // 하위 그려질 항목
            const childrenLen: number = d.children.length;
            
            // 하위 그려질 항목 이 있을 경우
            if( childrenLen ){
            
                let i: number = 0;
                let row: DrawResponseData;
                const width: number = 100 / childrenLen;

                // 루트를 제외한 그룹명
                if( d.type !== 'root' ){
                    result = `<div class='chartGroupName' title='${d.name}'>${d.name}</div>`;
                }
                
                // 그룹 처리
                while( i < childrenLen ){
                    row = d.children[i];

                    result += 
                        `<div class='chartGroup' style='width:${width}%'>`+
                            tableRender( row )+
                        `</div>`
                    ;

                    i++;
                }
            }
            // 마지막 위치 라면 (: 해당 항목)
            else if ( childrenLen === 0 ){
                result =
                    `<div class='chartName' title='${d.name}'>${d.name}</div>`+
                    `<div class='chartView'><div chartIdx='${chartIdx}'></div></div>`
                ;

                chartValues[chartIdx] = d.values;
                chartIdx++
            }

            return result;
        };

        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xmore_Yzero');


        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRender(data);

        // 차트가 그려질 엘리먼트 셀렉트
        const $chatViewElems: any = $target.find('.chartView > div');

        // 실제 그려지는 차트 개수 파악 하기
        const chartViewCount: number = $chatViewElems.length;

        // 넓이 세팅 (최소 넓이 500px, 2개까지는 넓이 100% )
        if( chartViewCount <= 2 ){
            $target.width( '100%' );
        } else {
            $target.width( chartViewCount*500 );
        }

        $target.height( 500 + (xCateCount*30) );

        // 차트 그리기
        this.draw_jqplotChart( $chatViewElems, chartValues, chartType );
    }

    //* y축만 그리기
    private draw_table_xzero_ymore(data: DrawResponseData, chartType: string): void {
        let chartIdx: number = 0;
        let chartValues: Array< string[][] > = [];

        const tableRender: Function = ( d: DrawResponseData ): string =>{

            // 결과 값
            let result: string = '';

            // 하위 그려질 항목
            const childrenLen: number = d.children.length;
            
            // 하위 그려질 항목 이 있을 경우
            if( childrenLen ){
            
                let i: number = 0;
                let row: DrawResponseData;
                const cssHeight: string = (childrenLen <= 0) ? '' : `style='height:${100 / childrenLen}%'`;
                let lastChartViewAreaGroup: string = '';

                 // 루트를 제외한 그룹명
                if( d.type !== 'root' ){
                    result = `<div class='chartGroupName' title='${d.name}'>${d.name}</div>`;
                }

                // 그룹 처리
                while( i < childrenLen ){
                    row = d.children[i];

                    if( row.children.length === 0 ){
                        lastChartViewAreaGroup += 
                            `<div class='chartViewArea' ${cssHeight}>`+
                                tableRender( row )+
                            `</div>`
                        ;
                    } else {
                        result += 
                            `<div class='chartGroup' ${cssHeight}>`+
                                tableRender( row )+
                            `</div>`
                        ;
                    }

                    i++;
                }
                
                if( lastChartViewAreaGroup !== '' ){
                    result +=
                        `<div class='chartViewAreaGroup'>`+
                            lastChartViewAreaGroup+
                        `</div>`
                    ;
                }
            }
            // 마지막 위치 라면 (: 해당 항목)
            else if ( childrenLen === 0 ){
                result =
                    `<div class='chartName' title='${d.name}'>${d.name}</div>`+
                    `<div class='chartView'><div chartIdx='${chartIdx}'></div></div>`
                ;

                chartValues[chartIdx] = d.values;
                chartIdx++
            }

            return result;
        };

        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xzero_Ymore');

        // console.log('data', data);

        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRender(data, 0);

        // 차트가 그려질 엘리먼트 셀렉트
        const $chatViewElems: any = $target.find('.chartView > div');

        // 실제 그려지는 차트 개수 파악 하기
        const chartViewCount: number = $chatViewElems.length;      

        // 높이 세팅 (최소 높이 500px, 1개까지는 높이 100% )
        $target.height( chartViewCount*500 );

        // 차트 그리기
        this.draw_jqplotChart( $chatViewElems, chartValues, chartType );
    }

    //* x, y축 그리기
    private draw_table_xmore_ymore(data: DrawResponseData, chartType: string, yCateCount: number ): void {
        let chartIdx: number = 0;
        let chartValues: Array< string[][] > = [];

        const tableRenderX: Function = ( d: DrawResponseData ): string =>{

            // 결과 값
            let result: string = '';

            // 하위 그려질 항목
            const childrenLen: number = d.children.length;
            
            // 하위 그려질 항목 이 있을 경우
            if( childrenLen ){
            
                let i: number = 0;
                let row: DrawResponseData;
                const width: number = 100 / childrenLen;

                // 루트를 제외한 그룹명
                if( d.type !== 'root' ){
                    result = `<div class='chartGroupName_x' title='${d.name}'>${d.name}</div>`;
                }
                
                // 그룹 처리
                while( i < childrenLen ){
                    row = d.children[i];

                    result += 
                        `<div class='chartGroup_x' style='width:${width}%'>`+
                            tableRenderX( row )+
                        `</div>`
                    ;

                    i++;
                }
            }
            // 마지막 위치 라면 (: 해당 항목)
            else if ( childrenLen === 0 ){
                result =
                    `<div class='chartName' title='${d.name}'>${d.name}</div>`+
                    `<div class='chartView'><div chartIdx='${chartIdx}'></div></div>`
                ;

                chartValues[chartIdx] = d.values;
                chartIdx++
            }

            return result;
        };

        const tableRenderY: Function = ( d: DrawResponseData ): string =>{

            // 결과 값
            let result: string = '';

            // 하위 그려질 항목
            const childrenLen: number = d.children.length;
            
            // 하위 그려질 항목 이 있을 경우
            if( childrenLen ){
            
                let i: number = 0;
                let row: DrawResponseData;
                const cssHeight: string = (childrenLen <= 0) ? '' : `style='height:${100 / childrenLen}%'`;
                let lastChartViewAreaGroup: string = '';

                 // 루트를 제외한 그룹명
                if( d.type !== 'root' ){
                    result = `<div class='chartGroupName_y' title='${d.name}'>${d.name}</div>`;
                }

                // 그룹 처리
                while( i < childrenLen ){
                    row = d.children[i];

                    if( row.children.length === 0 ){
                        if(row.type === 'x_category'){
                            lastChartViewAreaGroup += 
                                `<div class='chartViewArea_x' ${cssHeight}>`+
                                    tableRenderX( row )+
                                `</div>`
                            ;
                        } else {
                            lastChartViewAreaGroup += 
                                `<div class='chartViewArea_y' ${cssHeight}>`+
                                    tableRenderY( row )+
                                `</div>`
                            ;
                        }
                    } else {
                        if(row.type === 'x_category'){
                            result += 
                                `<div class='chartGroup_x' ${cssHeight}>`+
                                    tableRenderX( row )+
                                `</div>`
                            ;
                        } else {
                            result += 
                                `<div class='chartGroup_y' ${cssHeight}>`+
                                    tableRenderY( row )+
                                `</div>`
                            ;
                        }
                    }

                    i++;
                }
                
                if( lastChartViewAreaGroup !== '' ){
                    result +=
                        `<div class='chartViewAreaGroup_y'>`+
                            lastChartViewAreaGroup+
                        `</div>`
                    ;
                }
            }
            // 마지막 위치 라면 (: 해당 항목)
            else if ( childrenLen === 0 ){
                result =
                    `<div class='chartName' title='${d.name}'>${d.name}</div>`+
                    `<div class='chartView'><div chartIdx='${chartIdx}'></div></div>`
                ;

                chartValues[chartIdx] = d.values;
                chartIdx++
            }

            return result;
        };
        
        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xmore_Ymore');

        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRenderY(data);

        const $targetY: any = (
            $target.find('.chartGroupName_y + .chartGroup_x').length === 0
                ? $target.find('.chartGroupName_y + .chartViewAreaGroup_y')
                : $target.find('.chartGroupName_y + .chartGroup_x')
        );

        // 실제 그려지는 차트 개수 파악 하기
        let xLen: number = 1;
        let yLen: number = $targetY.length;

        // x축 최대 개수 가져오기
        $targetY.each((i: number, elem: any): void => {
            const x: number = <number>$(elem).find('.chartView').length;
            if( x > xLen ){ xLen = x; }
        });

        // 넓이 세팅 (최소 넓이 300px)
        $target
            .width( (xLen*700) + (yCateCount*100) )     // (차트 개수 * 500[넓이]) + (y카테고리 개수 * 100[y카테고리 넓이])
            .height( yLen*500 )
        ;

        // 차트 그리기
        this.draw_jqplotChart( $target.find('.chartView > div'), chartValues, chartType );
    }
}