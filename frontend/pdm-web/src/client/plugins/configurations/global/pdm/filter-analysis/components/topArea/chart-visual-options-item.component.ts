/*
    chart-visual-options-item
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ElementAst } from '@angular/compiler';

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

    @ViewChild('toolTip') toolTip: ElementRef; 

    //* 마우스 오버시 사용될 툴팁
    private outTooltip: boolean = false;

    //* 마우스 오버시 이동 전 엘리먼트
    private prevElement: Element = undefined;

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ){
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

         // 원래 있던 위치로 되롤리기
         const $toolTip: any = $(this.toolTip.nativeElement);
         const children: any = $toolTip.children();
 
         if( children.length > 0 ){
             $toolTip.empty();
         }
    }

    //* 아이템 리스트 마우스 오버
    onItemListOver(e: MouseEvent): void {

        // 툴팁 출력
        this.outTooltip = true;
        this.changeDetectorRef.detectChanges();

        // 엘리먼트, 오프셋 설정
        const $target: any = $(e.target);
        const $toolTip: any = $(this.toolTip.nativeElement);
        const offset: {top: number; left: number;} = $target.offset();
        const width: number = $target.width();
        const height: number = $target.height();

        // 임시 등록 용(마우스 아웃 시)
        this.prevElement = <Element>e.target;

        // 마우스 오버 시 현 위치 엘리먼트 넓이 높이 지정 (미 지정 시 리스트가 없는 곳으로 쏠림)
        $target.css({width: width, height:height});

        // 툴팁 영역으로 엘리먼트 옮기기
        $toolTip.append($target.children());

        // 툴팁 css 적용
        $toolTip.css({
            position:'absolute',
            left:offset.left,
            top:offset.top,
            width: width,
            zIndex:999,
            boxShadow:'rgba(0, 0, 0, 0.3) 0px 2px 5px',
            borderRadius:5
        });

        // body 위치로 이동
        $('body').append($toolTip);
    }

    //* 아이템 리스트 마우스 아웃
    onItemListLeave(e: MouseEvent): void {

        // 원래 있던 위치로 되롤리기
        const $prevElem: any = $(this.prevElement);
        const $toolTip: any = $(this.toolTip.nativeElement);
        const children: any = $toolTip.children();

        // 아이템 제거 되지 않았을 경우에만 하위 엘리먼트 원상 복귀
        if( children.length > 0 ){
            $prevElem.css({width:'auto', height:'auto'}).append( $toolTip.children() );   
        }

        // 툴팁 끄기
        this.outTooltip = false;
        this.changeDetectorRef.detectChanges();
    }
}