import { Component, ViewEncapsulation, OnInit, ViewChild, Input, OnDestroy, ElementRef, Renderer } from '@angular/core';

export interface Size {
    w: number,
    h: number
}

export interface DrawData {
    period: {
        min: number;
        max: number;
    },
    data: Array<{
        type: string;
        min: number;
        max: number;
    }>
    colors: any
}

//* 목업 데이터 interface
export interface IWorstEeqList {
    order: number;
    equipment: string;
    score: number;
    status: Array<{
        type: string;
        start: number;
        end: number;
    }>
};

export interface ITimePeriod {
    start: number;
    end: number;
};

export interface IInfoBoxStyle {
    [key: string]: string;
}

@Component({
    moduleId: module.id,
    selector: 'status-change',
    templateUrl: './status-change.html',
    styleUrls: ['./status-change.css'],
    encapsulation: ViewEncapsulation.None
})

export class StatusChangeComponent implements OnInit, OnDestroy {
    @ViewChild('status') canvasElem: ElementRef;
    @ViewChild('infoBox') infoElem: ElementRef;

    @Input() statusData: IWorstEeqList["status"];
    @Input() timePeriod: ITimePeriod;
    @Input() drawColors: any;

    // 리사이즈 용
    private parentElem: ElementRef['nativeElement'] = undefined;
    private widgetElem: ElementRef['nativeElement'] = undefined;
    private resizeListenerFunc: Function;
    private resizeCallback: Function = this.onResize.bind(this);

    // 마우스 효과 용
    private m_moveCallback: Function = this.onMouseMove.bind(this);
    private m_outCallback: Function = this.onMouseOut.bind(this);
    private m_downCallback: Function = this.onMouseDown.bind(this);
    private m_upCallback: Function = this.onMouseUp.bind(this);
    private is_mouse_down: boolean = false;
    private is_mouse_over: boolean = false;

    // canvas
    private cSize: Size = {w: 0, h: 0};
    private ctx: CanvasRenderingContext2D;
    private graphTop: number = 20;

    // 그려질 정보
    private drawData:DrawData = {
        period : undefined,
        data : [],
        colors: {}
    };

    // 마커 개수 표기용
    private markerCount: number = 10;
    private markerPosition: Array<number> = [];
    private markerInfo: Array<string> = [];
    private markerSize: Size = {w:1, h: 5};
    private markerTopPosition: number = 15;
    private markerColor: string = '#333';

    // infoBox style
    private infoBoxStyle: IInfoBoxStyle = {};
    private infoBoxcont: string = '';

    constructor(renderer: Renderer) {
        this.resizeListenerFunc = renderer.listen('window', 'resize', this.resizeCallback);
    }

    ngOnInit() {
        this.drawDataCreate();

        this.ctx = this.canvasElem.nativeElement.getContext('2d');
        this.parentElem = this.canvasElem.nativeElement.parentElement.parentElement;

        //* 위젯 컴포넌트가 transition으로 효과로 인해 캔버스 리사이즈 크기가 제대로 반영 시키기 위함
        this.widgetElem = $(this.parentElem).parents('li.a3-widget-container')[0];
        this.widgetElem.addEventListener('transitionend', this.resizeCallback, false);

        //* 캔버스 마우스 이벤트 등록
        this.canvasElem.nativeElement.addEventListener('mousemove', this.m_moveCallback, false);
        this.canvasElem.nativeElement.addEventListener('mouseout', this.m_outCallback, false);
        this.canvasElem.nativeElement.addEventListener('mousedown', this.m_downCallback, false);
        this.canvasElem.nativeElement.addEventListener('mouseup', this.m_upCallback, false);

        this.onResize();
    }

    ngOnDestroy(){
        // 등록된 이벤트 제거
        this.resizeListenerFunc();
        this.widgetElem.removeEventListener('transitionend', this.resizeCallback);
        this.canvasElem.nativeElement.removeEventListener('mousemove', this.m_moveCallback);
        this.canvasElem.nativeElement.removeEventListener('mouseout', this.m_outCallback);
        this.canvasElem.nativeElement.removeEventListener('mousedown', this.m_downCallback);
        this.canvasElem.nativeElement.removeEventListener('mouseup', this.m_upCallback);
    }

    //* 그려질 정보로 변환
    drawDataCreate(): void {
        let len:number, i:number;

        // 그려질 폭 설정
        this.drawData.period = {
            min: 0,
            max: this.timePeriod.end - this.timePeriod.start
        };

        // status 시간 기준 그려질 폭 퍼센트(%) 계산
        len = this.statusData.length;
        for( i=0; i<len; i++ ){
            this.drawData.data.push({
                type: this.statusData[i].type,
                min: (this.statusData[i].start - this.timePeriod.start) / this.drawData.period.max,
                max: (this.statusData[i].end - this.timePeriod.start) / this.drawData.period.max
            });
        }

        // 그러질 타입의 색상 설정
        len = this.drawColors.length;
        for( i=0; i<len; i++ ){
            this.drawData.colors[
                this.drawColors[i].name
            ] = this.drawColors[i].color;
        }
    }

    //* 마커 위치 설정
    marketset( customMakerCount: number = this.markerCount ): void {
        let
            i: number,
            max: number = customMakerCount,
            markerMargin: number = this.drawData.period.max / max,
            margin: number = 0
        ;

        // 마커 수가 변경되었으면 설정
        if( this.markerCount !== customMakerCount ){
            this.markerCount = customMakerCount;
        }        

        // 이미 등록된 마커관련 배열 제거
        if( this.markerPosition.length > 0 ){
            this.markerPosition.splice( 0, this.markerPosition.length );
            this.markerInfo.splice( 0, this.markerInfo.length );
        }

        for( i=0; i<=max; i++ ){
            margin = markerMargin*i;

            // 마커 위치 설정
            this.markerPosition.push( margin / this.drawData.period.max );

            // 마커 위치 표기될 내용 설정
            this.markerInfo.push(
                moment(this.timePeriod.start + Math.round(margin)).format('HH:mm')
            );
        }
    }

    //* 캔버스 리사이즈 (canvas는 style로 늘릴경우 내용물이 scale형태로 커지기 때문에 해당 엘리먼트 크기 만큼 키워 줌)
    onResize(e?:Event): void {
        if( (e != undefined && !e.isTrusted) || this.parentElem == undefined ){ return; }
        this.canvasElem.nativeElement.width = 1;
        this.canvasElem.nativeElement.height = 0;

        this.canvasElem.nativeElement.width = this.cSize.w = this.parentElem.offsetWidth;
        this.canvasElem.nativeElement.height = this.cSize.h = this.parentElem.offsetHeight;

        const markerCount = Math.floor(this.cSize.w/100);

        // 넓이에 따라 마커 개수 재설정
        this.marketset(
            (markerCount < 1 ? 1 : markerCount)
        );

        this.onDraw();
    }

    //* 그리기
    onDraw(): void {
        let x, y, w, h, i, len;

        this.ctx.clearRect(0, 0, this.cSize.w, this.cSize.h);

        // status 그리기
        len = this.drawData.data.length;
        for( i=0; i<len; i++){
            x = this.cSize.w * this.drawData.data[i].min;
            w = (this.cSize.w * this.drawData.data[i].max) - x;
            y = this.graphTop;
            h = this.cSize.h - y;

            this.ctx.fillStyle = this.drawData.colors.hasOwnProperty(this.drawData.data[i].type) ?
                this.drawData.colors[this.drawData.data[i].type] : '#ffffff'
            ;
            this.ctx.fillRect(x, y, w, h);
        }

        // marker 그리기
        len = this.markerCount;
        for( i=0; i<=len; i++ ){
            x = (this.cSize.w * this.markerPosition[i]) - (i==len ? this.markerSize.w : 0);
            y = this.markerTopPosition;
            w = this.markerSize.w;
            h = this.markerSize.h;
            this.ctx.fillStyle = this.markerColor;
            this.ctx.fillRect(x, y, w, h);

            // 마커 위치 시간 표기
            this.ctx.font = "12px sans-serif";
            this.ctx.fillStyle = "#333333";
            this.ctx.textAlign = (i == 0) ? 'left' : (i == len) ? 'right' : 'center';
            this.ctx.fillText(this.markerInfo[i], x, 12);
        }
    }

    //* status 해당영역(x축:%) index 알아오기 
    getCurrentIdx(percentX:number): number {
        let
            i: number,
            len: number = this.statusData.length,
            data = this.drawData.data
        ;

        for( i=0; i<len; i++ ){
            if( data[i].min <= percentX && data[i].max >= percentX ){
                return i;
            }
        }

        return undefined;
    }

    //* 마우스 move Event
    onMouseMove(e:MouseEvent): void {
        let
            mouseX: number = e.offsetX,
            mouseY: number = e.offsetY,
            percentX: number = mouseX / this.cSize.w,
            x: number = 0,
            txt1: string = '',
            txt2: string = '',
            lean: string = ( percentX < 0.20 ) ? 'l' : ( percentX < 0.80 ) ? 'c' : 'r',   // left, center, right
            currIdx: number = this.getCurrentIdx(percentX),
            currType: string = this.statusData[currIdx].type
        ;

        this.is_mouse_over = true;

        // 마우스 클릭상태 여부에 따른 내용 출력 변경
        // (클릭 중) 현 status 시작~끝 위치 날짜표기
        if( this.is_mouse_down ){
            let
                currTimeStart: string = moment(this.statusData[currIdx].start).add(-1, 'months').format('YY.MM.DD HH:mm:ss'),
                currTimeEnd: string = moment(this.statusData[currIdx].end).add(-1, 'months').format('YY.MM.DD HH:mm:ss')
            ;

            txt1 = currTimeStart;
            txt2 = currTimeEnd;
        }
        // (오버) 해당좌표 날짜, status명 표기
        else {
            let
                currTimestamp: number = this.timePeriod.start + Math.round(this.drawData.period.max * percentX),
                currTime: string = moment(currTimestamp).add(-1, 'months').format('YY.MM.DD HH:mm:ss')
            ;

            txt1 = currType;
            txt2 = currTime;
        }

        // 원래 보여질 내용 그리기
        this.onDraw();
        
        // 영역 투명설정
        // let grd: CanvasGradient = this.ctx.createLinearGradient( x, 0, x+150, 0 );
        let mainColor = this.drawData.colors.hasOwnProperty(currType) ?
            this.drawData.colors[currType] : '#ffffff'
        ;

        // 구분 선 T
        this.ctx.fillStyle = '#333333';
        // this.ctx.fillRect( mouseX-2, this.graphTop-5, 5, 1 );
        this.ctx.fillRect( mouseX, this.graphTop-5, 1, 5 );

        // 구분 선 
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect( mouseX, this.graphTop, 1, 5 );
        this.ctx.fillRect( mouseX, this.cSize.h-5, 1, 5 );


        // 마우스 위치 내용 표기
        if( this.is_mouse_over ){
            this.infoBoxStyle = {
                left: `${mouseX}px`,
                top: `${this.graphTop}px`,
                backgroundColor: mainColor,
                transform: `translateX(${((lean == 'l') ? '0%' : (lean == 'r') ? '-100%' : '-50%')})`
            };
            this.infoBoxcont = `${txt1}<br>${txt2}`;
        }
    }

    //* 마우스 down Event
    onMouseDown(e:MouseEvent): void {
        this.is_mouse_down = true;
        this.onMouseMove(e);
    }

    //* 마우스 up Event
    onMouseUp(e:MouseEvent): void {
        this.is_mouse_down = false;
        this.onMouseMove(e);
    }

    //* 마우스 out Event
    onMouseOut(e:MouseEvent): void {
        this.is_mouse_down = false;
        this.is_mouse_over = false;
        this.onDraw();
    }
}