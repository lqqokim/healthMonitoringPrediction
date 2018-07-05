import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, Input } from '@angular/core';
import { PaginationHelper } from './pagination';

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

@Component({
    moduleId: module.id,
    selector: 'ng2-Table',
    templateUrl: 'table.html',
    styleUrls: ['table.css'],
    encapsulation: ViewEncapsulation.None
})

export class TableComponent implements OnInit, OnChanges, OnDestroy {

    //* 테이블 내용 출력용 헤더, 본문 내용 값
    @Input() columns: Array<TableData>;
    @Input() data: Array<any>;
    
    //* 페이징 표기 여부 (ture:보임 / false: 숨김)
    @Input() paging: boolean;

    //* 전체 필터 표기 여부 (ture:보임 / false: 숨김)
    @Input() totalFilter: boolean;

    //* input() data 값에 의한 테이블 row 값
    public rows: Array<any> = [];

    //* 페이징 정보
    public page: number = 1;
    public itemsPerPage: number = 10;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;

    public config: TableConfig = {
        paging: false,
        sorting: {columns: undefined},
        filtering: {filterString: ''}
    };

    //* 페이징 헬퍼
    private pager: PaginationHelper;
    
    constructor(){}

    //* pagination 부분이 변경될 시 호출될 콜백 함수 (first, prev, next, last, 페이지 번호등 클릭 후 구동)
    pageChange( pager:PaginationHelper ): void {
        // 현 위치 페이지, 총 페이지 수 적용
        this.page = pager.currPage;
        this.numPages = pager.totalPages;

        // 해당 페이지로 테이블 표기
        this.onChangeTable( this.config );
    }

    //* 초기 설정
    ngOnInit() {
       this.firstSet();
    }

    firstSet(): void {
        // if( this.data === undefined || this.data === null ){ return; }
        
        this.length = this.data.length;
        this.pager = new PaginationHelper( this.length, this.page, this.itemsPerPage, this.pageChange.bind(this) );

        this.config.paging = this.paging;
        this.config.sorting.columns = this.columns;

        this.onChangeTable(this.config);
    }

    ngOnDestroy(){
        delete this.pager;
    }

    ngOnChanges(c: any){
        setTimeout(()=>{
            this.pager = null;
            this.onChangeTable(this.config);
        }, 100);
    }

    //* 테이블 페이지 변경
    public changePage(page:any, data:Array<any> = this.data): Array<any> {
        const start = (page.page - 1) * page.itemsPerPage;
        const end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;

        return data.slice(start, end);
    }
    
    //* 테이블 정렬
    public changeSort(data:any, config:any): any {
        if( !config.sorting ){ return data; }
    
        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;
    
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }
    
        if (!columnName) {
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
                if (item[column.name].toString().match(this.config.filtering.filterString)) {
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
    public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
    
        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }
    
        let filteredData = this.changeFilter(this.data, this.config);
        let sortedData = this.changeSort(filteredData, this.config);
        this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.length = sortedData.length;
    }
    
    //* 테이블 셀 클릭 이벤트
    public onCellClick(data: any): any {
        // console.log(data);
    }
}