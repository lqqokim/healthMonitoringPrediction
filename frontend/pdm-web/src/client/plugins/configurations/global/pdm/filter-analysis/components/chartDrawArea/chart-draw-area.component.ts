/*
    chart-draw-area
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

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

export class ChartDrawAreaComponent implements OnInit {

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

    //* getAnalysisToolData API 통해서 전달받은 데이터
    private responseData: DrawResponseData = {
        param_name: "root",
        name: null,
        type: "root",
        values: [],
        children: [
            {
                param_name: "AREA_NAME",
                name: "TOHS",
                type: "y_category",
                values: [],
                children: [
                    {
                        param_name: "EQP_NAME",
                        name: "TOHS01",
                        type: "y_category",
                        values: [
                            ["2018-08-01 00:00:00.225", null, "195.0"],
                            ["2018-08-01 00:00:00.335", "22.0", "195.0"]
                        ],
                        children: [],
                        childrendKey: {}
                    }, {
                        param_name: "EQP_NAME",
                        name: "TOHS02",
                        type: "y_category",
                        values: [
                            ["2018-08-01 00:00:00.226", null, "2207.0"],
                            ["2018-08-01 00:00:00.336", "22.0", "2207.0"]
                        ],
                        children: [],
                        childrendKey: {}
                    }
                ],
                childrendKey: {
                    "TOHS01": {
                        param_name: "EQP_NAME",
                        name: "TOHS01",
                        type: "y_category",
                        values: [
                            ["2018-08-01 00:00:00.225", null, "195.0"],
                            ["2018-08-01 00:00:00.335", "22.0", "195.0"]
                        ],
                        children: [],
                        childrendKey: {}
                    },
                    "TOHS02": {
                        param_name: "EQP_NAME",
                        name: "TOHS02",
                        type: "y_category",
                        values: [
                            ["2018-08-01 00:00:00.226", null, "2207.0"],
                            ["2018-08-01 00:00:00.336", "22.0", "2207.0"]
                        ],
                        children: [],
                        childrendKey: {}
                    }
                }
            }, {
                param_name: "AREA_NAME",
                name: "OHS",
                type: "y_category",
                values: [],
                children: [{
                    param_name: "EQP_NAME",
                    name: "OHS26",
                    type: "y_category",
                    values: [
                        ["2018-08-01 00:00:00.296", "22.0", "0.0"],
                        ["2018-08-01 00:00:00.406", "21.0", "0.0"]
                    ],
                    children: [],
                    childrendKey: {}
                }],
                childrendKey: {
                    "OHS26": {
                        param_name: "EQP_NAME",
                        name: "OHS26",
                        type: "y_category",
                        values: [
                            ["2018-08-01 00:00:00.296", "22.0", "0.0"],
                            ["2018-08-01 00:00:00.406", "21.0", "0.0"]
                        ],
                        children: [],
                        childrendKey: {}
                    }
                }
            }
        ]
    };                                                          

    //* 실제 그려질 c3Chart 객체 값 저장 및 컨트롤 용
    private drawChartObj: Array<any> = [];
    
    constructor(
        private currentElem: ElementRef,
        private changeDetectorRef: ChangeDetectorRef
    ){
    }

    ngOnInit(){
    }

    //* 임시 화면 렌더링 배열 용
    emptyArray( length: number ): Array<boolean> {
        let tmp: Array<boolean> = [];
        let i: number = 0;

        while( i < length ){
            tmp[i] = true;
            i++;
        }

        return tmp;
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

    //* 그려질 차트 타입 데이터 설정
    private getDrawChartTypeData( data: DrawResponseData, tableDrawStatus: number, xCount: number, yCount: number ): Array<TableDrawDataInfo> {

        console.log('getDrawChartTypeData - data', data );
        console.log('getDrawChartTypeData - tableDrawStatus', tableDrawStatus );
        console.log('getDrawChartTypeData - xCount', xCount );
        console.log('getDrawChartTypeData - yCount', yCount );

        // 그릴 타입이 없다면 데이터 설정 값 없음
        if( tableDrawStatus === this.tableDrawType.none ){ return undefined; }

        // 데이터 루트 설정
        const drawRoot: DrawResponseData = data;

        // 데이터 경량화 복제
        const deepCopy: Function = ( d: DrawResponseData ): Array<TableDrawDataInfo> =>{
            if( d.children.length === 0 ){
                return [<TableDrawDataInfo>{
                    name: d.name,
                    param_name: d.param_name,
                    values: d.values,
                    type: (
                        this.tableDrawDataInfo_type.hasOwnProperty(d.type) ? this.tableDrawDataInfo_type.root : this.tableDrawDataInfo_type[d.type]
                    ),
                    children: [],
                    mergeCount: 0
                }];
            } else {

                let result: Array<TableDrawDataInfo> = [];

                let i: number = 0;
                const len: number = d.children.length;
                let row: DrawResponseData;
                
                while( i < len ){
                    row = d.children[i];

                    result.push(<TableDrawDataInfo>{
                        name: row.name,
                        param_name: row.param_name,
                        values: row.values,
                        type: (
                            this.tableDrawDataInfo_type.hasOwnProperty(row.type) ? this.tableDrawDataInfo_type.root : this.tableDrawDataInfo_type[row.type]
                        ),
                        children: row.children.length > 0 ? deepCopy(row) : [],
                        mergeCount: row.children.length
                    });
                    
                    i++;
                }

                return result;
            }
        };

        // 경량화 데이터 전달
        return deepCopy(drawRoot);
    }

    //* 차트 그리기
    public draw( data: DrawResponseData, xCategoryCount: number, yCategoryCount: number, chartType: string ): void {

        console.log('draw-data', data)

        // 그려질 차트 타입 설정
        this.tableDrawStatus = this.getDrawChartType(xCategoryCount, yCategoryCount);

        // 그려질 차트 데이터가 없거나, 그려질 타입이 없다면 그리지 않음
        if( data === undefined || this.tableDrawStatus === this.tableDrawType.none ){ return; }

        // 그려질 차트에 따라 돔 그리기
        switch( this.tableDrawStatus ){
            case this.tableDrawType.Xzero_Yzero: this.draw_table_xzero_yzero(data, chartType); break;
            case this.tableDrawType.Xmore_Yzero: this.draw_table_xmore_yzero(data, chartType); break;
            case this.tableDrawType.Xzero_Ymore: this.draw_table_xzero_ymore(data, chartType); break;
            case this.tableDrawType.Xmore_Ymore: this.draw_table_xmore_ymore(data, chartType, yCategoryCount); break;
        }
    }

    //* c3 차트 그리기
    private draw_c3Chart( $drawElems: any, chartValues: Array<string[][]>, chartType: string ): void {

        // drawChartObj 내용 삭제 (내용이 있을 경우에만)
        if( this.drawChartObj.length > 0 ){
            let i: number = 0;
            const len: number = this.drawChartObj.length;

            // 그려진 차트 제거
            while( i < len ){
                this.drawChartObj[i].destroy();
                i++;
            }

            // 배열에 등록된 내용도 제거
            this.drawChartObj.splice(0);

            console.log('this.drawChartObj', this.drawChartObj);
        }

        // 엘리먼트 영역에 c3 차트 그리기
        $drawElems.each((index: number, elem: any): void =>{

            // 차트 영역 엘리먼트 (jquery)
            const selector: any = $(elem);

            // 엘리먼트에 chartValues Index 값 가져오기
            const currIdx: number = parseInt( selector.attr('chartIdx'), 10);

            // 해당 차트 데이터만
            const currValues: (string|number)[][] = chartValues[currIdx];

            // 가공 데이터 임시 변수
            let i: number, j: number;
            let iLen: number, jLen: number;
            let tmp: string = '';

            // 각 축마다 데이터 타입 
            let dataTypes: any = {
                x: undefined,
                y: undefined,
                y2: undefined
            };
            let dataTypeName: string = '';

            // 가공 시작 currValues[i][]
            iLen = currValues.length;
            for( i=0; i<iLen; i++ ){
                jLen = currValues[i].length;

                // currValues[i][j]: [x, y, y2]
                for( j=0; j<jLen; j++ ){

                    // 해당 데이터 초기에는 x, y, y2가 string으로 들어 있음
                    tmp = <string>currValues[i][j];

                    // 날짜 타입인지 확인
                    if( RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}.[0-9]{2}:[0-9]{2}:[0-9]{2}').test(tmp) ){
                        currValues[i][j] = <number> new Date( tmp ).getTime();
                        dataTypeName = 'date';
                    } else {
                        currValues[i][j] = <number> parseFloat(tmp);
                        dataTypeName = 'number';
                    }

                    // x축 데이터
                    if( j === 0 ){
                        if( dataTypes.x === undefined ){
                            dataTypes.x = dataTypeName;
                        }
                        // xData.push( currValues[i][j] );
                    }
                    // y축 데이터
                    else if( j === 1 ){
                        if( dataTypes.y === undefined ){
                            dataTypes.y = dataTypeName;
                        }
                        // yData.push( currValues[i][j] );
                    }
                    // y2축 데이터
                    else if( j === 2 ){
                        if( dataTypes.y2 === undefined ){
                            dataTypes.y2 = dataTypeName;
                        }
                        // y2Data.push( currValues[i][j] );
                    }
                }
            }

            // 차트 그리기
            const chart:any = c3Chart.generate({
                bindto: elem,
                size: {
                    width: $(elem).width(),
                    height: $(elem).height()
                },
                data: {
                    type: chartType,        // 타입별 차트
                    x: 'x',
                    rows: [
                        (   // 차트 x, y / x, y, y2 d형태
                            (chartValues[currIdx][0].length === 2)
                                ? ['x', 'y']
                                : ['x', 'y', 'y2']
                        ),
                        ... chartValues[currIdx]
                    ],

                    // y2가 있다면
                    axes: (
                        (chartValues[currIdx][0].length === 3) ? {
                            y: 'y',
                            y2: 'y2'
                        } : {}
                    )
                },
                point: {
                    show: false
                },
                axis: {
                    x: ( dataTypes.x === 'date' ? {
                        tick: {
                            rotate: 75,
                            multiline: false,
                            format:( timestamp: number )=>{
                                return moment(timestamp).format('YYYY-MM-DD hh:mm:ss');
                            }
                        }
                    } : {
                        tick : {
                            count: 5
                        }
                    }),
                    y: ( dataTypes.y === 'date' ? {
                        tick: {
                            format:( timestamp: number )=>{
                                return moment(timestamp).format('YYYY-MM-DD hh:mm:ss');
                            }
                        },
                        show: true
                    } : {
                        show: true
                    }),
                    y2: ( dataTypes.y2 === 'date' ? {
                        tick: {
                            format:( timestamp: number )=>{
                                return moment(timestamp).format('YYYY-MM-DD hh:mm:ss');
                            }
                        },
                        show: true
                    } : {
                        show: true
                    })
                }
            });

            // 차트 데이터 저장
            this.drawChartObj.push(chart);
        });
    }

    //* c3로 그려진 타입 변경
    public draw_c3ChartTypeChange( chartType: string ): void {

        // 그려진 차트가 없으면 건너 뜀
        if( this.drawChartObj.length === 0 ){ return; }

        // 차트 총 개수
        const len: number = this.drawChartObj.length;
        let i: number = 0;
        
        // 차트 타입 변경
        while( i < len ){
            const chart: any = this.drawChartObj[i];
            chart.transform( chartType );
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
            return `<div class='chartView' chartIdx='${0}'>차트</div>`;
        };

        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xzero_Yzero');

        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRender(data);

        // 차트 그리기
        this.draw_c3Chart( $target.find('.chartView'), chartValues, chartType );
    }

    //* x축만 그리기
    private draw_table_xmore_yzero(data: DrawResponseData, chartType: string): void {
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
                    `<div class='chartView' chartIdx='${chartIdx}'>차트</div>`
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
        const $chatViewElems: any = $target.find('.chartView');

        // 실제 그려지는 차트 개수 파악 하기
        const chartViewCount: number = $chatViewElems.length;

        // 넓이 세팅 (최소 넓이 500px, 2개까지는 넓이 100% )
        if( chartViewCount <= 2 ){
            $target.width( '100%' );
        } else {
            $target.width( chartViewCount*500 );
        }

        // 차트 그리기
        this.draw_c3Chart( $chatViewElems, chartValues, chartType );
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
                    `<div class='chartView' chartIdx='${chartIdx}'></div>`
                ;

                chartValues[chartIdx] = d.values;
                chartIdx++
            }

            return result;
        };

        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xzero_Ymore');

        console.log('data', data);

        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRender(data, 0);

        // 차트가 그려질 엘리먼트 셀렉트
        const $chatViewElems: any = $target.find('.chartView');

        // 실제 그려지는 차트 개수 파악 하기
        const chartViewCount: number = $chatViewElems.length;      

        // 높이 세팅 (최소 높이 500px, 1개까지는 높이 100% )
        $target.height( chartViewCount*500 );

        // 차트 그리기
        this.draw_c3Chart( $chatViewElems, chartValues, chartType );
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
                    `<div class='chartView' chartIdx='${chartIdx}'>-</div>`
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
                    `<div class='chartView' chartIdx='${chartIdx}'>-</div>`
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
        this.draw_c3Chart( $target.find('.chartView'), chartValues, chartType );
    }
}