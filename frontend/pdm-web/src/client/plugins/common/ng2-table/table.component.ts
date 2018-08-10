import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgTableComponent } from 'ng2-table/ng2-table';
// import { PaginationHelper } from './pagination';

//* 테이블 데이터 규격 (헤더)
export interface TableData {
    title: string;                  // 테이블 헤더에 보일 타이틀
    name: string;                   // 테이블 row값에 매칭될 key 이름
    sort?: string;                  // arc: 오름차순, desc: 내림차순
    filtering?: {                   // 필터 관련
        filterString?: string;      //   - 필터 검색 키워드
        placeholder?: string;       //   - input 검색 전 보여질 텍스트
        columnName?: string;
    }
    className?: Array<string>;      // 테이블 헤더에 적용될 class명
}

//* 테이블 환경설정
export interface TableConfig {
    paging: boolean;                // 페이징 표기 여부
    sorting: {                      // 정렬 플러그인
        columns: any
    };
    filtering: {                    // 필터링
        filterString: string;       // 필터 기본 값
        columnName?: string;        // 원시 데이터 속성 이름
    };
    className?: Array<string>;      // 클래스 명
}

//* 테이블 셀 클릭 데이터 정보
export interface TableCellInfo {
    column: string;
    row: {[key: string]: string | number };
}

@Component({
    moduleId: module.id,
    selector: 'ng2-Table',
    templateUrl: 'table.html',
    styleUrls: ['table.css'],
    encapsulation: ViewEncapsulation.None
})

export class TableComponent implements AfterViewInit, OnChanges, OnDestroy {

    @ViewChild('vscrollArea') vscrollArea: ElementRef;
    @ViewChild('ngTable') ngTable: NgTableComponent;

    //* 테이블 내용 출력용 헤더, 본문 내용 값
    @Input() columns: Array<TableData>;
    @Input() data: Array<any>;

    @Output() cellClick: EventEmitter<TableCellInfo> = new EventEmitter<TableCellInfo>();
    @Output() drawEnd: EventEmitter<{data:Array<any>, elements:any}> = new EventEmitter<{data:Array<any>, elements:any}>();
    
    //* 페이징 표기 여부 (ture:보임 / false: 숨김)
    // @Input() paging: boolean;

    //* 전체 필터 표기 여부 (ture:보임 / false: 숨김)
    @Input() totalFilter: boolean;

    //* 초기 시작과 동시에 Input 데이터 근거로 테이블 그리기
    @Input() initStart: boolean = true;

    //* 데이터 바인딩 스위치 (true: 스위치 On/ false: Off)
    @Input() dataBindSwitch: boolean = true;

    //* input() data 값에 의한 테이블 row 값
    public rows: Array<any> = [];

    //* 페이징 정보
    // public page: number = 1;
    // public itemsPerPage: number = 10;
    // public maxSize: number = 5;
    // public numPages: number = 1;
    public length: number = 0;

    public config: TableConfig = {
        paging: false,
        sorting: {columns: undefined},
        filtering: {filterString: ''}
    };

    //* 페이징 헬퍼
    // private pager: PaginationHelper;

    //* 가상 스크롤 높이, 전체 높이
    private vsAreaHeight: number = 0;  // 테이블 출력 높이 고정 (단위:px) , tip: 자동 높이 부모 엘리먼트가 relative에 고정 높이가 있어야 적용
    private vsFullHeight: number = 0;

    //* 가상 스크롤 가상 높이
    private vsTopPosition: number = 0;

    //* 각 셀의 높이
    private vsCellOnceHeight: number = 30;

    //* 보여질 cell Idx, 개수
    private vsCellIdx: number = -1;
    private vsCellCount: number = 30;

    //* 아래로 스크롤 시 유지될 셀 limit
    private vsLimitCount: number = 2;
    
    
    //* 임시 테이블 rows 데이터
    private tmpRowsData: Array<any> = [];

    constructor(){}

    //* pagination 부분이 변경될 시 호출될 콜백 함수 (first, prev, next, last, 페이지 번호등 클릭 후 구동)
    // pageChange( pager:PaginationHelper ): void {
    //     // 현 위치 페이지, 총 페이지 수 적용
    //     this.page = pager.currPage;
    //     this.numPages = pager.totalPages;

    //     // 해당 페이지로 테이블 표기
    //     this.onChangeTable( this.config );
    // }

    //* 초기 설정
    ngOnInit() {
        if( !this.initStart ){ return; }
    }

    ngAfterViewInit(){
        this.firstSet();

        //* 스크롤 영역 스크롤 이벤트
        this.vscrollArea.nativeElement.addEventListener('scroll', this.scroll.bind(this) );
    }

    //* 테이블 리사이징 ** 상위 컴포넌트에서 리사이징 시 호출해야 정상 구동**
    public setResizeHeight(height?:number): void {

        // 임시 스크롤 영역 높이
        let tmpAreaHeight: number = 0;

        // 자동 리사이징 모드
        if( height === undefined ){
            this.vscrollArea.nativeElement.className = 'vscrollArea heightAuto';

            // 리사이징 된 높이 값 가져오기
            tmpAreaHeight = $(this.vscrollArea.nativeElement).outerHeight();
        }
        // 수동 리사이징 모드
        else {
            this.vscrollArea.nativeElement.className = 'vscrollArea';

            // 고정 높이 설정
            this.vsAreaHeight = height;
            tmpAreaHeight = height;
        }

        // 보여질 셀 개수 스크롤 높이 값에 따른 재설정
        this.vsCellCount = Math.ceil(tmpAreaHeight/this.vsCellOnceHeight)+this.vsLimitCount;

        // 스크롤 위치 재설정
        this.scroll(undefined, $(this.vscrollArea.nativeElement).scrollTop());
        
    }

    //* 스크롤 처리 (e: 스크롤 이벤트 값, customY: 강제 호출 시 설정될 높이 값)
    public scroll(e?: any, customY?: number): void {

        // 셀 전체 높이 계산 (헤더 +1)
        this.vsFullHeight = this.vsCellOnceHeight * this.length;

        // 스크롤 된 높이
        const y: number = (e === undefined) ? ((customY === undefined) ? 0 : customY) : e.target.scrollTop;

        // 스크롤 시 안보이는 곳에서도 유지될 위치
        const limitTopPx: number = this.vsCellOnceHeight * this.vsLimitCount;

        // 스크롤 - 유지 높이
        const topPt: number = y - limitTopPx;
        this.vsTopPosition = topPt < 0 ? 0 : topPt - (topPt % (this.vsCellOnceHeight*this.vsLimitCount));

        // idx
        const idx = Math.round(this.vsTopPosition / this.vsCellOnceHeight) - this.vsLimitCount;
        const nextIdx = ( idx < 0 ) ? 0 : (this.data.length > idx) ? idx : (this.data.length - this.vsCellCount);

        // 스크롤 가능 높이
        const limitScroll: number = this.vsFullHeight - (this.vsCellOnceHeight * this.vsLimitCount);
        if( limitScroll < this.vsTopPosition ){
            this.vsTopPosition = limitScroll;
        }

        // 스크롤 만큼 높이 보정
        this.vsFullHeight -= this.vsTopPosition;

        // console.log(`
        //     y: ${y}
        //     limitTopPx: (${this.vsCellOnceHeight} * ${this.vsLimitCount}) = ${limitTopPx}
        //     topPt: ${topPt}
        //     this.vsLimitCount: ${this.vsLimitCount} / ${this.data.length - (this.vsLimitCount*this.vsCellCount)}
        //     idx: ${idx} / ${nextIdx} /  ${this.data.length}
        //     nextIdx(${nextIdx}) != this.vsCellIdx(${this.vsCellIdx}) : ${nextIdx != this.vsCellIdx}
        //     -----------------------------------------
        //     this.vsTopPosition: ${this.vsTopPosition}
        //     this.vsFullHeight: ${this.vsFullHeight}  
        //     limitScroll: ${limitScroll}
        // `);

        // 필요한 부분만 컷
        if( nextIdx != this.vsCellIdx || customY !== undefined ){
            this.vsCellIdx = nextIdx;

            // 데이터 row 설정
            this.rows = this.tmpRowsData.slice( this.vsCellIdx, this.vsCellIdx+this.vsCellCount );

            // 헤더 강제 설정
            const cols = this.columns.concat();

            if( this.columns !== undefined ){
                this.columns.splice(0);
            }
            if( this.config.sorting.columns !== undefined ){
                this.config.sorting.columns.splice(0);
            }

            this.columns = cols;
            this.config.sorting.columns = cols;

            this.ngTable.columns = cols;
            this.ngTable['_columns'] = cols;

            this.setResizeHeight();

            // 다 출력 됬다고 emit
            this.drawEndEmit( this.rows );
        }
    }

    //* 렌더링 끝 output Emit
    private drawEndEmit(data: Array<any>): void {
        // 그려줄 표가 없으면 끝
        if( data.length === 0 ){ return; }
        
        // 실제 그려주고 있는 표 데이터
        const datas: Array<any> = data;

        // 관련 cell 엘리먼트만 가져오기
        const tableRow: any = $(this.vscrollArea.nativeElement).find(`ng-table > table > tbody > tr`);

        // 관련 셀이 개수 가져오기
        const len: number = tableRow.length;

        // 그려주고 있는 표 데이터가 있고, 테이블 셀이 그려지지 않았다면 0.01초 후에 다시 호출
        if( datas.length > 0 && len === 0 ){
            setTimeout(()=>{ this.drawEndEmit(data); }, 10);
            return;
        }

        // 데이터와 렌더링이 끝나면, 부모 컴포넌트로 화면에 보여주는 렌더링 값과 element 전달
        this.drawEnd.emit( {data:this.rows, elements:tableRow} );
    }

    //* 초기 설정
    firstSet(): void {       
        this.length = this.data.length;
        // this.pager = new PaginationHelper( this.length, this.page, this.itemsPerPage, this.pageChange.bind(this) );

        // this.config.paging = this.paging;
        // this.config.sorting.columns = this.columns.concat();

        this.setResizeHeight();
        this.onChangeTable(this.config);
    }

    ngOnDestroy(){
        //* 페이징 제거
        // delete this.pager;

        //* 스크롤 영역 스크롤 이벤트 제거
        this.vscrollArea.nativeElement.removeEventListener('scroll', this.scroll.bind(this) );
    }

    ngOnChanges(c: any){        
        if( !this.dataBindSwitch ){ return; }
        this.dataBindSwitchOn();
    }

    //* 테이블 내용 그리기
    public dataBindSwitchOn(): void {
        if( !this.initStart ){
            this.initStart = true;
            this.firstSet();
        } else {
            setTimeout(()=>{
                const target: any = $(this.vscrollArea.nativeElement).find('table > tbody > tr');
                const len: number = target.length;
                
                // 이미 그려지고 있는 엘리먼트가 있다면 제거
                if( len > 0 ){
                    target.remove();
                }
                this.onChangeTable(this.config);
            }, 100);
        }
    }

    //* 테이블 페이지 변경
    // public changePage(page:any, data:Array<any> = this.data): Array<any> {
    //     const start = (page.page - 1) * page.itemsPerPage;
    //     const end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;

    //     return data.slice(start, end);
    // }
    
    //* 테이블 정렬
    public changeSort( data: any ): any {
        // 정렬 옵션이 없다면 원래 데이터 전달
        if( !this.config.hasOwnProperty('sorting') ){ return data; }
    
        const columns = this.config.sorting.columns || [];
        let columnName: string = undefined;
        let sort: string = undefined;
    
        let i: number;
        const len: number = columns.length;
        for( i=0; i<len; i++ ){
            if( columns[i].hasOwnProperty('sort') && columns[i].sort !== '' && columns[i].sort !== false ){
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }
    
        // 테이블 정렬이 있다면
        if( columnName === undefined ){
            return data;
        }
    
        // 기본 정렬
        return data.sort((previous:any, current:any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    
    //* 테이블 필터 (대소문자 구분없이 필터 적용)
    public changeFilter(data:any, config:any):any {
        let filteredData:Array<any> = data;

        this.columns.forEach((column:any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item:any) => {
                    return RegExp(column.filtering.filterString, 'i').test(item[column.name]);
                });
            }
        });

        if (!config.filtering) {
            return filteredData;
        }

        if (config.filtering.columnName) {
            return filteredData.filter((item:any) => item[config.filtering.columnName].match(this.config.filtering.filterString));
        }

        let tempArray:Array<any> = [];
        filteredData.forEach((item:any) => {
            let flag = false;
            this.columns.forEach((column:any) => {
                if( typeof(item[column.name]) !== 'string' || item[column.name] === null ){
                    flag = false;
                } else if (item[column.name].toString().match(this.config.filtering.filterString)) {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });

        filteredData = tempArray;

        return filteredData;
    }
    
    //* 테이블 페이지/정렬/필터 적용 후 변경 구동함수
    public onChangeTable(config:any):any {

        console.log('onChangeTable', this.ngTable);
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
    
        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }
    
        // let filteredData = this.changeFilter(this.data, this.config);
        // let sortedData = this.changeSort(filteredData, this.config);

        // console.log('this.data', this.data);

        let sortedData = this.changeSort(this.data);
        // this.tmpRowsData = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.tmpRowsData = sortedData;
        this.length = sortedData.length;

        // 데이터가 있다면
        if( this.length > 0 ){
            this.vsCellIdx = -1;
            this.scroll();
        }
    }
    
    //* 테이블 셀 클릭 이벤트
    public onCellClick(data: TableCellInfo): void {
        if( this.cellClick ){
            this.cellClick.emit(data);
        }
    }
}