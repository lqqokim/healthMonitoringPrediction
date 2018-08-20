/*
    dragItem-list
        - 리스트 출력
        - 리스트 중 아이템 드래그 가능
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';

// 설정 인터페이스
export interface DragItemListData {
    name: string;
};

@Component({
    moduleId: module.id,
    selector: 'dragItem-list',
    templateUrl: './dragItem-list.html',
    styleUrls: ['./dragItem-list.css'],
    encapsulation: ViewEncapsulation.None
})

export class DragItemListComponent implements OnInit {

    // 설정 데이터
    @Input() data: Array<DragItemListData>;

    constructor(){
    }

    ngOnInit() {
        console.log('DragItemListComponent - data', this.data);
    }

    //* 드래그 시작
    onDragStart( e: DragEvent, row: DragItemListData ): void {
        const clickElem: Element = <Element>e.target;
        clickElem.className = 'dragActive';

        // 드래그 데이터 설정
        e.dataTransfer.setData( 'itemName', row.name );
    }

    //* 드래그 끝
    onDragEnd( e: DragEvent ): void {
        const clickElem: Element = <Element>e.target;
        clickElem.className = '';
    }
}