import { Component, ViewEncapsulation, OnInit, Input, OnDestroy, ElementRef, OnChanges } from '@angular/core';

//* 크기
export interface Size {
    w: number;
    h: number;
}

//* 좌표
export interface Position {
    x: number;
    y: number;
}

//* 게이지 차트 데이터
export interface IGuageChartData {
    name: string;
    start: number;
    end: number;
}

//* 게이지 차트 그리기용 데이터 (svg로 그릴 시 가공될 데이터)
export interface IGuageDrawData {
    name: string;
    percent: number;
    start: number;
    end: number;
    color: string;
}

//* 차트 그릴때 사용될 컬러
export interface IColorSet {
    name: string;
    color: string;
}

@Component({
    moduleId: module.id,
    selector: 'guage-chart-d3',
    templateUrl: 'guageChart.html',
    styleUrls: ['guageChart.css'],
    encapsulation: ViewEncapsulation.None
})

export class GuageChartComponent implements OnInit, OnChanges, OnDestroy {

    // 차트 데이터 (columns)
    @Input() chartData: Array<IGuageChartData>;
    @Input() chartColor: Array<IColorSet>;
    @Input() dataRangeStart: number;            // 숫자 표기 시작
    @Input() dataRangeEnd: number;              // 숫자 표기 마지막
    @Input() markerCount: number;               // 숫자 마커 표기 개수
    @Input() guagePoinerPercent: number;        // 게이지 포인터 위치 (단위:% 0~1)

    // 리사이즈 용    
    private currElem: ElementRef['nativeElement'] = undefined;
    private parentElem: ElementRef['nativeElement'] = undefined;
    private widgetElem: ElementRef['nativeElement'] = undefined;
    private resizeCallback: Function = this.onResize.bind(this);

    // 차트 SVG Element(D3)
    private svgElem: any;
    private svgBaseGroup: any;
    private svgPathGroup: any;
    private svgTextGroup: any;

    private svgArcPaths: Array<any> = [];
    private svgLabels: Array<any> = [];

    private donutWidth: number = 0.40;          // 도넛 두께 (0 ~ 1) 단위:%
    private donutMinWidth: number = 100;         // 최소 도넛 두께 (단위:px)
    private drawChartData: Array<IGuageDrawData> = [];

    // 마커
    private markerMargin: Array<number> = [];
    private markerInfo: Array<number> = [];
    private markerDonutMargin: number = 25;     // 마커와 차트 사이 여백 (단위:px)

    // 게이지 포인터
    private gPoinerPath: any;

    private pointAngle: number = 180;           // 기준 각도 ()

    private widgetSize: Size = {w: 0, h: 0};
    private centerPosition: Position = {x: 0, y: 0};

    // 차트 데이터 기준으로 다시그리기 (true: 다시그림 / false:기존데이터 기준으로 그림)
    private reDraw: boolean = true;


    constructor(
        currentElem: ElementRef
    ){
        this.currElem = currentElem.nativeElement;
        this.parentElem = $(this.currElem.parentElement);
    }

    ngOnInit() {
        this.drawDataCreate();

        //* 현 위치 svg 추가
        this.svgElem = d3.select(this.currElem).append('svg');
        this.svgBaseGroup = this.svgElem.append('g');
        this.svgPathGroup = this.svgBaseGroup.append('g');
        this.svgTextGroup = this.svgBaseGroup.append('g');
        this.gPoinerPath = this.svgBaseGroup.append('path');

        //* 위젯 컴포넌트가 transition으로 효과로 인해 캔버스 리사이즈 크기가 제대로 반영 시키기 위함
        this.widgetElem = $(this.currElem).parents('li.a3-widget-container')[0];
        if( this.widgetElem !== undefined ){
            this.widgetElem.addEventListener('transitionend', this.resizeCallback, false);
        }

        this.onResize();
    }

    ngOnDestroy(){
        // 등록된 이벤트 제거
        if( this.widgetElem !== undefined ){
            this.widgetElem.removeEventListener('transitionend', this.resizeCallback);
        }

        // 도형 제거
        this.arcPathClear();
    }

    ngOnChanges(c: any){
    }

    //* 차트 다시 그리기 (외부 용)
    public reDrawChart(): void {
        this.reDraw = true;
        this.drawDataCreate();
        this.onResize();
    }

    //* 그려질 정보로 변환
    private drawDataCreate(): void {
        let
            i: number,
            max: number = this.chartData.length,
            row: IGuageChartData
        ;

        // 각각 위치의 퍼센트값 세팅
        for( i=0; i<max; i++ ){
            row = this.chartData[i];

            this.drawChartData.push({
                name: row.name,
                percent: (row.end - row.start),
                start: row.start,
                end: row.end,
                color: ((name: string): string => {
                    let r:IColorSet;
                    for( r of this.chartColor ){
                        if( r.name == name ){ return r.color; }
                    }
                    return undefined;
                })(row.name)
            });
        }

        this.markerset();
    }

    //* 마커 위치 설정
    markerset( customMakerCount: number = this.markerCount ): void {
        let
            i: number,
            max: number = customMakerCount,
            markerMargin: number = this.pointAngle / max,
            margin: number = 0
        ;

        // 마커 수가 변경되었으면 설정
        if( this.markerCount !== customMakerCount ){
            this.markerCount = customMakerCount;
        }        

        // 이미 등록된 마커관련 배열 제거
        if( this.markerMargin.length > 0 ){
            this.markerMargin.splice( 0, this.markerMargin.length );
            this.markerInfo.splice( 0, this.markerInfo.length );
        }

        // 마커 위치 세팅
        for( i=0; i<=max; i++ ){
            margin = markerMargin*i;

            // 마커 위치 설정
            this.markerMargin.push( margin );

            // 마커 위치 표기될 내용 설정 (소수점 2자리까지 표기)
            this.markerInfo.push( 
                Math.floor(this.dataRangeStart+(i/max*(this.dataRangeEnd-this.dataRangeStart))*100)/100
            );
        }

        // 게이지 포인터 % 값 구하기
        // this.guagePoinerPercent = this.guagePoinerNumber / (this.dataRangeEnd-this.dataRangeStart)
    }

    //* 차트 리사이즈
    private onResize(): void {
        const w: number = this.parentElem.width();
        const h: number = this.parentElem.height();
        const minSize: number = Math.min( w, h );

        // 도넛 반지름
        let radius: number = (w*0.5);

        if( h === minSize ){
            radius = (minSize*2 > w) ? h*0.5 : h;
        }
        else if( w === minSize ){
            radius = (minSize*2 > h) ? w*0.5 : w*0.5;
        }
        
        // 크기 재설정
        this.widgetSize.w = w;
        this.widgetSize.h = radius;

        // svg 엘리먼트 크기 조절
        this.svgElem
            .attr('width', this.widgetSize.w)
            .attr('height', radius)
        ;

        // svg 중심 좌표 설정
        this.centerPosition.x = w*0.5;
        this.centerPosition.y = radius;

        // 차트 그리기
        this.onDraw();
    }

    //* 각도 → radian 변환
    private degree2radian(n: number): number {
        return Math.PI / 180 * n;
    }

    //* svg arc 도형 제거
    private arcPathClear(): void {
        if( this.svgArcPaths.length == 0 ){ return; }

        const max = this.svgArcPaths.length; 

        d3.select(this.currElem).selectAll('path').remove();
        d3.select(this.currElem).selectAll('text').remove();
        
        this.svgArcPaths.splice(0, max);
        this.svgLabels.splice(0, max);

        this.drawChartData.splice(0, max);
    }

    //* 그리기
    private onDraw(): void {
        const minSize: number = Math.min( this.widgetSize.w, this.widgetSize.h );

        // 도넛 반지름
        let radius: number = minSize*0.5;
        
        if( this.widgetSize.h === minSize ){
            radius = (minSize*2 > this.widgetSize.w) ? this.widgetSize.h*0.5 : this.widgetSize.h;
        }
        else if( this.widgetSize.w === minSize ){
            radius = (minSize*2 > this.widgetSize.h) ? this.widgetSize.w*0.5 : this.widgetSize.w*0.5;
        }

        // 폰트 크기
        let fontSize: number = radius * 0.05;
        const fontSizeMin: number = 12;
        const fontSizeMax: number = 16;

        // 바깥쪽, 안쪽 반지름 설정
        const outerRadius: number = radius - this.markerDonutMargin;
        let innerRadius: number = outerRadius - (outerRadius * this.donutWidth);

        // 도형 여백 각도
        const pathMarginAngle: number = 0;

        // 최소 도넛 두께 조절
        if( outerRadius-innerRadius < this.donutMinWidth ){
            innerRadius = radius - this.donutMinWidth;
        }

        // 폰트 최소 크기 보다 작으면 최소 지정된 크기로 돌림
        if( fontSize < fontSizeMin ){
            fontSize = fontSizeMin;
        } else if ( fontSize > fontSizeMax ){
            fontSize = fontSizeMax;
        }
        let markerRadius: number = radius - fontSize;

        // 원형 그릴 중심 축 설정
        this.svgBaseGroup.attr('transform', `translate(${this.centerPosition.x}, ${this.centerPosition.y})`);

        // 다시 그려야 되면 arcPath 지우기
        if( this.reDraw ){
            this.arcPathClear();
        }

        let
            i: number,
            max: number = this.drawChartData.length,
            row: IGuageDrawData,
            startAngle: number, 
            endAngle: number,
            arc: any = null,
            markerAngle: number,
            labelX: number,
            labelY: number
        ;

        // 도넛 차트 그리기
        for( i=0; i<max; i++ ){
            row = this.drawChartData[i];

            // 각 앵글별 시작~종료 시점 설정 1개일 경우 arc 여백 제외
            if( max == 1 ){
                startAngle = this.degree2radian( (180*row.start)-90 );
                endAngle = this.degree2radian( (180*row.end)-90 );
            } else {
                startAngle = this.degree2radian( ((180*row.start)+pathMarginAngle)-90 );
                endAngle = this.degree2radian( ((180*row.end)-pathMarginAngle)-90 );
            }

            // arc 도형 함수 생성
            arc = d3.svg.arc()
                .innerRadius( innerRadius  )
                .outerRadius( outerRadius )
                .startAngle( startAngle )
                .endAngle( endAngle )
            ;

            // 초기 등록 세팅
            if( this.reDraw ){
                // 그래프
                this.svgArcPaths.push(
                    this.svgPathGroup.append('path')
                        .attr('fill', row.color)
                        .attr('d', arc)
                );
            }
            // 다시 그려야할 경우
            else {
                // 그래프
                arc.endAngle(endAngle);
                this.svgArcPaths[i].attr('d', arc);
            }
        }

        // 마커 그리기
        max = this.markerCount;
        for( i=0; i<=max; i++ ){
            markerAngle = this.degree2radian( this.markerMargin[i]-90 );
            
            labelX = markerRadius * Math.sin(markerAngle);
            labelY = markerRadius * Math.cos(markerAngle) * -1;

            // 라벨
            if( this.reDraw ){
                this.svgLabels.push(
                    this.svgTextGroup.append('text')
                        .attr('style', 
                            `font-size:${fontSize}px;`+  // 폰트 크기
                            `text-anchor:${(i==0) ? 'start' : (i==max) ? 'end' : 'middle'};`
                        )
                        .attr('transform', `translate(${labelX}, ${labelY}) rotate(${this.markerMargin[i]-90}, 0, 0)`)
                );
    
                this.svgLabels[i].append('tspan')
                    .attr('x', `0`)
                    .attr('dy', `0`)
                    .text(this.markerInfo[i])
                ;
            } else {
                // 라벨 좌표, 폰트 크기
                this.svgLabels[i]
                    .attr('style',
                        `font-size:${fontSize}px;`+  // 폰트 크기
                        `text-anchor:${(i==0) ? 'start' : (i==max) ? 'end' : 'middle'};`
                    )
                    .attr('transform', `translate(${labelX}, ${labelY}) rotate(${this.markerMargin[i]-90}, 0, 0)`)
                ;
            }
        }

        // 게이지 포인터 그리기
        this.gPoinerDraw(radius);

        if( this.reDraw ){
            this.reDraw = false;
        }
    }

    //* 게이지 포인터 그리기
    private gPoinerDraw( radius: number ): void {
        const rotateNum: number = this.pointAngle * this.guagePoinerPercent;
        const baseLine: number = radius-this.markerDonutMargin;    // 게이지 포인터 그릴 기준 길이
        const baseY: number = -baseLine*0.025;                // 중심 y축 이동 범위

        interface pathInfo {
            type: string;       // M, L, Z
            x?: number;         // x축
            y?: number;         // y축
        }
        
        // path 데이터
        let paths: Array<pathInfo> = [
            {type:'M', x:0, y:-baseLine},                       // 시작! 꼭지
            {type:'L', x:-baseLine*0.035, y:-baseLine*0.025},    // 꼭지 왼쪽 아래
            {type:'L', x:0, y:0},                               // 중심 아래
            {type:'L', x:baseLine*0.035, y:-baseLine*0.025},      // 꼭지 오른쪽 아래
            {type:'Z'}                                          // 선그리기 끝
        ],
            i: number,
            max: number = paths.length,
            pathD: string = '',
            row: pathInfo
        ;

        // svg path 그림 데이터 조합 (string)
        for( i=0; i<max; i++ ){
            row = paths[i];
            pathD += row.type;
            if( row.hasOwnProperty('x') || row.hasOwnProperty('y') ){
                pathD += `${row.x} ${baseY+row.y} `;
            }
        }

        // 게이지 포인터 그리기
        this.gPoinerPath
            .attr('d', pathD)                                       // 게이지 포인터 모양
            .attr('transform', `rotate(${rotateNum-90}, 0, 0)`)     // 회전
        ;
    }
}