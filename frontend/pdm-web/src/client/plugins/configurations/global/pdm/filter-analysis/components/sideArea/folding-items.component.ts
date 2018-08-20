/*
    folding-items
        - 제목 표기
        - 클릭 시 접힘, 펼침 효과 (본문)
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'folding-items',
    templateUrl: './folding-items.html',
    styleUrls: ['./folding-items.css'],
    encapsulation: ViewEncapsulation.None
})

export class FoldingItemsComponent implements OnInit {

    @Input() title: string;                 // 타이틀
    @Input() bgcolor: string;               // 타이틀 배경 색
    @Input() folding: boolean = false;      // 접힘여부 (true:접힘/false:펼침)

    constructor(){
    }

    ngOnInit() {
    }

    //* 타이틀 클릭
    public titleClick( e: MouseEvent ): void {

        // 타이틀 상위 엘리먼트 가져오기
        const parentElem: Element = <Element>e.target['parentElement'];

        // 상위 엘리먼트 클래스에 fold 부여/제거 처리
        this.folding = !this.folding;
    }
}