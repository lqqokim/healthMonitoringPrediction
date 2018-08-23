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

    private drawData: Array<TableDrawDataInfo> = [];
    
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
    public draw( data: DrawResponseData, xCategoryCount: number, yCategoryCount: number ): void {

        // 그려질 차트 타입 설정
        this.tableDrawStatus = this.getDrawChartType(xCategoryCount, yCategoryCount);

        // 그려질 차트 데이터가 없거나, 그려질 타입이 없다면 그리지 않음
        if( data === undefined || this.tableDrawStatus === this.tableDrawType.none ){ return; }

        // 그려질 데이터 가공
        // this.drawData = this.getDrawChartTypeData(data, this.tableDrawStatus, xCategoryCount, yCategoryCount);
        // this.drawData = data;

        // console.log('this.drawData', this.drawData);

        // 그려질 차트에 따라 돔 그리기
        switch( this.tableDrawStatus ){
            case this.tableDrawType.Xmore_Yzero: this.draw_table_xmore_yzero(data, xCategoryCount); break;
            case this.tableDrawType.Xzero_Ymore: this.draw_table_xzero_ymore(data, yCategoryCount); break;
            case this.tableDrawType.Xmore_Ymore: this.draw_table_xmore_ymore(data, xCategoryCount, yCategoryCount); break;
        }
    }

    //* x축만 그리기
    private draw_table_xmore_yzero(data: DrawResponseData, xCount: number): void {
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
                    result = `<div class='chartGroupName'>${d.name}</div>`;
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
                    `<div class='chartName'>${d.name}</div>`+
                    `<div class='chartView'>차트-${0}</div>`
                ;
            }

            return result;
        };

        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xmore_Yzero');

        console.log('data', data);

        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRender(data);

        // 실제 그려지는 차트 개수 파악 하기
        const chartViewCount: number = $target.find('.chartView').length;

        // 넓이 세팅 (최소 넓이 300px)
        $target.width( chartViewCount*300 );
    }

    //* y축만 그리기
    private draw_table_xzero_ymore(data: DrawResponseData, yCount: number): void {
        // const $target: any = $(this.table_xzero_ymore.nativeElement);

        const tableRender: Function = ( d: DrawResponseData, parentChildCount: number ): string =>{

            // 결과 값
            let result: string = '';

            // 하위 그려질 항목
            const childrenLen: number = d.children.length;
            
            // 하위 그려질 항목 이 있을 경우
            if( childrenLen ){
            
                let i: number = 0;
                let row: DrawResponseData;
                const cssHeight: string = (parentChildCount <= 0) ? '' : `style='height:${100 / parentChildCount}%'`;

                let chart: string = '';
               
                // 그룹 처리
                while( i < childrenLen ){
                    row = d.children[i];
                    chart += tableRender( row, childrenLen );
                    i++;
                }

                result += 
                    `<div class='chartGroup' ${cssHeight}>`+
                        (( d.type !== 'root' )
                            ? `<div class='chartGroupName'>${d.name}</div>`
                            : ''
                        ) +
                        chart +
                    `</div>`
                ;
            }
            // 마지막 위치 라면 (: 해당 항목)
            else if ( childrenLen === 0 ){
                result =
                    `<div class='chartName'>${d.name}</div>`+
                    `<div class='chartView'>차트-${0}</div>`
                ;
            }

            return result;
        };

        this.changeDetectorRef.detectChanges();
        const $target: any = $(this.currentElem.nativeElement).find('#table_Xzero_Ymore');

        console.log('data', data);

        // 해당 위치에 돔 렌더링
        $target[0].innerHTML = tableRender(data, 0);

        // 실제 그려지는 차트 개수 파악 하기
        const chartViewCount: number = $target.find('.chartView').length;

        // 높이 세팅 (최소 높이 300px)
        $target.height( chartViewCount*300 );
    }
    private draw_table_xmore_ymore(data: DrawResponseData, xCount: number, yCount: number): void {
        // const $target: any = $(this.table_xmore_ymore.nativeElement);
    }
}