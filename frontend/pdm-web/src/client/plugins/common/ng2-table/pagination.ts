export class PaginationHelper {

    //* 총 페이지 수
    public totalPages: number = undefined;
    public currPage: number = undefined;
    public totalItems: number = undefined;
    public pageSize: number = undefined;

    //* 시작/마지막 페이지(index)
    public startPage: number = undefined;
    public endPage: number = undefined;
    public startIdx: number = undefined;
    public endIdx: number = undefined;

    public pages: Array<number> = [];

    public changeCallback: Function;

    constructor(
        totalItems: number = 0,
        currentPage: number = 1,
        pageSize: number = 10,
        changeCallback: Function = undefined
    ){
        this.changeCallback = changeCallback;
        this.resetTotalPage( totalItems, currentPage, pageSize );
        this.change();
    }

    //* 전체 페이지 계산
    resetTotalPage(
        totalItems: number = 0,
        currentPage: number = 1,
        pageSize: number = 10
    ): void {
        this.totalPages = Math.ceil(totalItems / pageSize);
        this.totalItems = totalItems;
        this.currPage = currentPage;
        this.pageSize = pageSize;
    }

    change() {
        // 현 페이지가 처음과 끝에서 벗어났다면 되돌리기
        if( this.currPage < 1 ){ 
            this.currPage = 1; 
        } else if ( this.currPage > this.totalPages) { 
            this.currPage = this.totalPages; 
        }

        // 전체 페이지가 10개 이하는 전부 표기
        if( this.totalPages <= 10 ){
            this.startPage = 1;
            this.endPage = this.totalPages;
        }
        // 전체 페이지가 10개 넘어가면 끝페이지 계산
        else {
            if( this.currPage <= 6 ) {
                this.startPage = 1;
                this.endPage = 10;
            } else if ( this.currPage + 4 >= this.totalPages ) {
                this.startPage = this.totalPages - 9;
                this.endPage = this.totalPages;
            } else {
                this.startPage = this.currPage - 5;
                this.endPage = this.currPage + 4;
            }
        }

        // 시작/끝 index 계산
        this.startIdx = (this.currPage - 1) * this.pageSize;
        this.endIdx = Math.min(this.startIdx + this.pageSize - 1, this.totalItems - 1);

        // 페이지 보여줄 번호 배열값 설정
        this.pages = Array.from(
            Array((this.endPage + 1) - this.startPage).keys()
        ).map(i => this.startPage + i);

        // 변경시 호출될 콜백함수 호출
        if( this.changeCallback !== undefined ){
            this.changeCallback(this);
        }
    }

    //* 해당 페이지 설정
    setPage( page: number ) {
        this.currPage = page;
        this.change();
    }
}