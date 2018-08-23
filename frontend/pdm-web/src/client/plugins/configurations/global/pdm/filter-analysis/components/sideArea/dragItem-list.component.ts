/*
    dragItem-list
        - 리스트 출력
        - 리스트 중 아이템 드래그 가능
*/
import { Component, ViewEncapsulation, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

// 설정 인터페이스
export interface DragItemListData {
    name: string;
};

@Component({
    moduleId: module.id,
    selector: 'dragItem-list',
    templateUrl: './dragItem-list.html',
    styleUrls: ['./dragItem-list.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DragItemListComponent {

    // 드래그 드롭 시 넘겨줄 해당 데이터 변수명
    @Input() itemDataKeyName: string;

    // 설정 데이터
    private data: Array<DragItemListData> = [];

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ){
    }

    //* 데이터 설정
    public setData( data: Array<DragItemListData> ): void {
        this.data.splice(0);
        this.data = data.concat();

        // 변경된 값으로 화면 랜더링이 제대로 반영 안될 때 대비 처리
        this.changeDetectorRef.detectChanges();
    }

    //* 드래그 시작 (e:드래그 이벤트, row:드래그 시작 아이템, idx: 드래그 index)
    onDragStart( e: DragEvent, row: DragItemListData, idx: number ): void {
        const clickElem: Element = <Element>e.target;
        clickElem.className = 'dragActive';

        // 드래그 데이터 설정
        e.dataTransfer.setData( 'itemName', row.name );
        e.dataTransfer.setData( 'itemIndex', `${idx}` );
        e.dataTransfer.setData( 'itemDataKeyName', this.itemDataKeyName );
    }

    //* 드래그 끝
    onDragEnd( e: DragEvent ): void {
        const clickElem: Element = <Element>e.target;
        clickElem.className = '';
    }
}