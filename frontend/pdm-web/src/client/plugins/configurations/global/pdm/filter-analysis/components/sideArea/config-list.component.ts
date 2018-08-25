/*
    config-list
        - 리스트 출력
        + 리스트 항목 중 - select
            - 해당 항목 클릭 시 서브메뉴 출력 (FilterAnalysisConfig.items에 해당)
            - 서브메뉴 항목 클릭 시 값 변경 (FilterAnalysisConfig.value)
        + 리스트 항목 중 - boolean
            - switch ON/OFF (checkbox)
            - on: true, off: false (FilterAnalysisConfig.value)
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

// 설정 인터페이스
export interface FilterAnalysisConfig {
    dataType: string;       // boolean, select
    name: string;
    items?: Array<string>;
    value: string | boolean;
};

@Component({
    moduleId: module.id,
    selector: 'config-list',
    templateUrl: './config-list.html',
    styleUrls: ['./config-list.css'],
    encapsulation: ViewEncapsulation.None
})

export class ConfigListComponent implements OnInit {

    // 설정 데이터
    @Input() data: Array<FilterAnalysisConfig>;

    // Draw Chart 버튼 클릭 시 세팅된 데이터 부모 컴포넌트 전달 용
    @Output() onConfigChange = new EventEmitter<{configName:string; value:any;}>();

    constructor(){
    }

    ngOnInit() {
        // console.log('data', this.data);
    }

    //* 체크박스 클릭
    onCheckboxClick( e: MouseEvent, idx: number ): void {
        // 체크박스 엘리먼트의 체크값 얻어오기
        const checkboxElem: Element = e.target['previousSibling']['previousSibling'];
        const checked: boolean = <boolean>checkboxElem['checked'];

        // 해당 체크박스 설정 데이터
        const row: FilterAnalysisConfig = this.data[idx];

        // 클릭 당시의 값은 변경 전 값이라 변경 후 값으로 적용
        row.value = !checked;

        // 체크박스 클릭 값 변경 전달
        this.onConfigChange.emit({
            configName: row.name,
            value: !checked
        });
    }

    //* 셀렉트 박스 영역 클릭
    onSelectAreaClick( e: MouseEvent ): void {
        const clickElem: Element = <Element>e.target;
        const tagName: string = clickElem.tagName.toUpperCase();

        // 서브메뉴 해당하는 태그 면 건너 뜀
        if( tagName === 'OL' || tagName === 'LI' ){ return; }

        // 클릭된 영역이 셀렉트 박스 영역이 아닌 하위 엘리먼트 일 경우 부모 엘리먼트 셀렉트
        const selectAreaElem: Element = (tagName === 'STRONG') ?
            clickElem.parentElement : clickElem
        ;

        // 서브메뉴 on/off
        selectAreaElem.className = (
            selectAreaElem.className === 'i_select' ? 'i_select menuON' : 'i_select'
        );
    }

    //* 셀렉트 항목 클릭
    onSelectListClick( e: MouseEvent, row: FilterAnalysisConfig, value: string ): void {
        const clickElem: Element = <Element>e.target;
        const selectAreaElem: Element = <Element>clickElem.parentElement.parentElement;

        // 선택영역 클래스 변경 (i_select menuON -> i_select)
        selectAreaElem.className = 'i_select';

        // 클릭 항목으로 값 변경
        row.value = value;

        // 셀렉트 항목 클릭 값 변경 전달
        this.onConfigChange.emit({
            configName: row.name,
            value: value
        });
    }
}