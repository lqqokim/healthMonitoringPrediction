/*
    chart-draw-area
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

export interface TableDrawDataInfo {
    x: number;
    y: number;
    itemCount: number;
};

@Component({
    moduleId: module.id,
    selector: 'chart-draw-area',
    templateUrl: './chart-draw-area.html',
    styleUrls: ['./chart-draw-area.css'],
    encapsulation: ViewEncapsulation.None
})

export class ChartDrawAreaComponent implements OnInit {

    // Draw Chart 버튼 클릭 시 세팅된 데이터 부모 컴포넌트 전달 용
    // @Output() onDrawChartData = new EventEmitter<DrawChartData>();

    private tableDrawData: TableDrawDataInfo = {
        x: 2,
        y: 3,
        itemCount: 4
    };

    private
        tableDrawDataX: Array<boolean> = []
        tableDrawDataY: Array<boolean> = []
        tableDrawDataITEM: Array<boolean> = []
    ;
    
    constructor(){
    }

    ngOnInit(){
        this.tableDrawDataX = this.emptyArray(this.tableDrawData.x);
        this.tableDrawDataY = this.emptyArray(this.tableDrawData.y);
        this.tableDrawDataITEM = this.emptyArray(this.tableDrawData.itemCount);
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
}