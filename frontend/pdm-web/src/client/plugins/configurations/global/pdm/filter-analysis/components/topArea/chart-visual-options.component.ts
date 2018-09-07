/*
    chart-visual-options
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

// 설정 인터페이스
// export interface FilterAnalysisConfig {
//     dataType: string;       // boolean, select
//     name: string;
//     items?: Array<string>;
//     value: string | boolean;
// };

//* 차트 아이템
export interface ChartDataItem {
    name: string;
    selected: string;
}

//* drawChart 데이터 emit용
export interface DrawChartData {
    category: {
        x: Array<string>,
        y: Array<string>
    },
    chartData: {
        x: Array<ChartDataItem>,
        y: Array<ChartDataItem>,
        y2: Array<ChartDataItem>
    }
}

@Component({
    moduleId: module.id,
    selector: 'chart-visual-options',
    templateUrl: './chart-visual-options.html',
    styleUrls: ['./chart-visual-options.css'],
    encapsulation: ViewEncapsulation.None
})

export class ChartVisualOptionsComponent implements OnInit {

    // Draw Chart 버튼 클릭 시 세팅된 데이터 부모 컴포넌트 전달 용
    @Output() onDrawChartData = new EventEmitter<DrawChartData>();

    //* category X, Y
    private categoryDataX: Array<string> = [];
    private categoryDataY: Array<string> = [];

    //* 차트 데이터 타입 (X 전용)
    private chartDataTypeX: Array<string> = ['NORMAL', 'GROUP'];
    private chartDataTypeXDATE_TIME: Array<string> = ['NORMAL', 'MINUTES', 'HOUR', 'MONTH', 'DAY'];
    private chartDataTypeXSelected: string = this.chartDataTypeX[0];

    //* 차트 데이터 타입
    private chartDataTypeY: {
        NORMAL: Array<string>, GROUP: Array<string>
        MINUTES: Array<string>, HOUR: Array<string>, MONTH: Array<string>, DAY: Array<string>,
    } = {
        NORMAL: ['NORMAL'],
        GROUP: ['MEAN', 'MIN', 'MAX', 'SUM', 'COUNT'],
        MINUTES: ['MEAN', 'MIN', 'MAX', 'SUM', 'COUNT'],
        HOUR: ['MEAN', 'MIN', 'MAX', 'SUM', 'COUNT'],
        MONTH: ['MEAN', 'MIN', 'MAX', 'SUM', 'COUNT'],
        DAY: ['MEAN', 'MIN', 'MAX', 'SUM', 'COUNT'],
    };

    //* chart X, Y, Y2
    private chartDataX: Array<ChartDataItem> = [];
    private chartDataY: Array<ChartDataItem> = [];
    private chartDataY2: Array<ChartDataItem> = [];

    constructor(){
    }

    ngOnInit(){
    }

    //* 카테고리(category X, Y) 타입 아이템 삭제
    onCategoryItemDelete( category: Array<string>, value: string ){
        // 닫기버튼 클릭한 아이템 명 idx 가져오기
        const selectedIdx: number = category.indexOf(value);

        // 해당 데이터가 존재하면 제거
        if( selectedIdx !== -1 ){
            category.splice(selectedIdx, 1);
        }
    }

    //* 차트 데이터 관련(X, Y, Y2) 타입 아이템 삭제
    onChartDataItemDelete( data: Array<ChartDataItem>, name: string, type: string ){
        // 닫기버튼 클릭한 아이템 명 idx 가져오기
        let selectedIdx: number = -1;
        let i: number, len: number = data.length;

        for( i=0; i<len; i++){
            if( data[i].name === name ){
                selectedIdx = i;
                break;
            }
        }
        
        // 해당 데이터가 존재하면 제거
        if( selectedIdx !== -1 ){
            data.splice(selectedIdx, 1);

            // x축 아이템이 지워졌다면 Normal로 초기화
            if( type === 'x' ){
                this.chartDataTypeXSelected = this.chartDataTypeX[0];

                // X축 값에 따른 Y타입 첫번째 값 가져오기
                const yData: string = this.chartDataTypeY[ this.chartDataTypeXSelected ][0];

                let i: number, len: number;

                // Y
                if( this.chartDataY.length > 0 ){
                    let tmp: Array<ChartDataItem> = [];
                    len = this.chartDataY.length;
                    for( i=0; i<len; i++ ){
                        tmp.push({
                            name: this.chartDataY[i].name,
                            selected: yData
                        });
                    }
                    this.chartDataY.splice(0);
                    this.chartDataY = tmp;
                }

                // Y2
                if( this.chartDataY2.length > 0 ){
                    let tmp: Array<ChartDataItem> = [];
                    len = this.chartDataY2.length;
                    for( i=0; i<len; i++ ){
                        tmp.push({
                            name: this.chartDataY2[i].name,
                            selected: yData
                        });
                    }

                    this.chartDataY2.splice(0);
                    this.chartDataY2 = tmp;
                }
            }
        }
    }

    //* chartDataX 해당하는 list 선택 이벤트
    onItemSelectChartDataX( idx: number, value: string ): void {
        // X
        this.chartDataTypeXSelected = value;

        // X축 선택 값 변경
        this.chartDataX[idx].selected = value;

        // X축 값에 따른 Y타입 첫번째 값 가져오기
        const yData: string = this.chartDataTypeY[ this.chartDataTypeXSelected ][0];

        let i: number, len: number;

        // Y
        if( this.chartDataY.length > 0 ){
            let tmp: Array<ChartDataItem> = [];
            len = this.chartDataY.length;
            for( i=0; i<len; i++ ){
                tmp.push({
                    name: this.chartDataY[i].name,
                    selected: yData
                });
            }
            this.chartDataY.splice(0);
            this.chartDataY = tmp;
        }

        // Y2
        if( this.chartDataY2.length > 0 ){
            let tmp: Array<ChartDataItem> = [];
            len = this.chartDataY2.length;
            for( i=0; i<len; i++ ){
                tmp.push({
                    name: this.chartDataY2[i].name,
                    selected: yData
                });
            }

            this.chartDataY2.splice(0);
            this.chartDataY2 = tmp;
        }

        console.log('this.chartDataX', this.chartDataX);
        console.log('this.chartDataY', this.chartDataY);
        console.log('this.chartDataY2', this.chartDataY2);
    }

    //* chartDataY, chartDataY2 해당하는 list 선택 이벤트
    onItemSelectChartDataY( chartDataY: Array<ChartDataItem>, idx: number, value: string): void {
        chartDataY[idx].selected = value;
        console.log( 'chartDataY', chartDataY );
    }

    //* 마우스 드래그 중일 때
    onDragover(e: DragEvent): void {
        // drop 이벤트를 처리 하기위함
        e.preventDefault();
    }

    //* 아이템 드롭
    onDrop( e: DragEvent, type: string, name: string, data:(Array<string>|Array<ChartDataItem>) ): void {
        // 드롭 시 가져올 데이터
        const itemName: string = e.dataTransfer.getData('itemName');

        // 카테고리 영역
        if( type === 'category'){
            let d: Array<string> = <Array<string>>data;
            
            // 중복된 데이터가 있다면 건너 뜀
            if( d.indexOf(itemName) !== -1 ){ return; }

            // 카테고리 x축에는 바코드(BARCODE)는 추가 불가능 처리
            if( name === 'x' && itemName === 'BARCODE' ){ return; }

            // 데이터 추가
            d.push(itemName);
        }
        // 차트 데이터 영역
        else if( type === 'chartData' ){
            let d: Array<ChartDataItem> = <Array<ChartDataItem>>data;
            let i: number;
            const len: number = d.length;

            // x축 데이터 일 경우 1개만 받기
            if( name === 'x' && len >= 1 ){ return; }

            // 중복된 데이터가 있다면 건너 뜀
            for( i=0; i<len; i++ ){
                if( d[i].name === itemName ){
                    return;
                }
            }

            // 데이터 추가 (x축)
            if( name === 'x' ){
                console.log('itemName', itemName);
                console.log('this.chartDataTypeXSelected', this.chartDataTypeXSelected);
                d.push({ name: itemName, selected: this.chartDataTypeXSelected});
                console.log('d', d);
            }
            // 데이터 추가 (y, y2축)
            else {
                d.push({ name: itemName, selected: this.chartDataTypeY[this.chartDataTypeXSelected][0] });
            }
        }
    }

    //* Draw Chart 버튼 클릭
    drawChart( e: MouseEvent ): void {
        e.preventDefault();

        const result: DrawChartData = {
            category: {
                x: this.categoryDataX,
                y: this.categoryDataY
            },
            chartData: {
                x: this.chartDataX,
                y: this.chartDataY,
                y2: this.chartDataY2
            }
        };

        console.log('result', result);

        // 상위 컴포넌트로 전달
        this.onDrawChartData.emit(result);
    }
}