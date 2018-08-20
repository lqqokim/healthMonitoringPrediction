/*
    chart-visual-options-item
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'chart-visual-options-item',
    templateUrl: './chart-visual-options-item.html',
    styleUrls: ['./chart-visual-options-item.css'],
    encapsulation: ViewEncapsulation.None
})

export class ChartVisualOptionsItemComponent implements OnInit {

    //* 아이템 타입 (single/select)
    @Input() itemType: string = 'single';
    
    //* 아이템 값
    @Input() value: string;

    //* 아이템 리스트 (타입이 select일 경우에만 사용)
    @Input() itemList: Array<string> = [];

    //* 아이템 리스트 중 선택된 값
    @Input() selectedItemValue: string = '';

    //* 닫기 버튼 클릭 시 작동 이벤트
    @Output() onClose = new EventEmitter<string>(); 

    //* 아이템 리스트 클릭 시 작동 이벤트
    @Output() onItemSelect = new EventEmitter<string>(); 

    constructor(){
    }

    ngOnInit() {
        if( this.itemType === 'select' ){ this.setSelectType(); }
    }

    //* 초기 select 타입 값 설정
    setSelectType(): void {
        if( this.selectedItemValue === '' ){
            this.selectedItemValue = this.itemList[0];
        }
    }

    //* select 타입 리스트 클릭 이벤트
    onItemListClick(e: MouseEvent, selectedValue: string): void {
        this.selectedItemValue = selectedValue;
        this.onItemSelect.emit(selectedValue);
    }

    //* 닫기버튼 클릭
    onCloseBtn(e: MouseEvent, selectedValue: string): void {
        console.log( 'selectedValue', selectedValue );
        this.onClose.emit( selectedValue );
    }
}