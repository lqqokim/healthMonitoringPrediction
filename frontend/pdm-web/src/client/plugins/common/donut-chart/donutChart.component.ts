import { Component, ViewEncapsulation, OnInit, ViewChild, Input, OnDestroy, ElementRef, Renderer, OnChanges } from '@angular/core';
import { Timer } from './Timer';

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

//* 도넛 차트 데이터
export interface IDonutChartData {
    name: string;
    count: number;
}

//* 도넛 차트 그리기용 데이터 (svg로 그릴 시 가공될 데이터)
export interface IDonutDrawData {
    name: string;
    percent: number;
    start: number;
    end: number;
    color: string;
    count: number;
}

//* 차트 그릴때 사용될 컬러
export interface IColorSet {
    name: string;
    color: string;
}

@Component({
    moduleId: module.id,
    selector: 'donutChart',
    templateUrl: 'donutChart.html',
    styleUrls: ['donutChart.css'],
    encapsulation: ViewEncapsulation.None
})

export class DonutChartComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild('list') listElem: ElementRef;

    // 차트 데이터 (columns)
    @Input() chartData: Array<IDonutChartData>;
    @Input() chartColor: Array<IColorSet>;

    // 리사이즈 용    
    private currElem: ElementRef['nativeElement'] = undefined;
    private widgetElem: ElementRef['nativeElement'] = undefined;
    private widgetBodyElem: ElementRef['nativeElement'] = undefined;
    private infoElem: ElementRef['nativeElement'] = undefined;
    private resizeCallback: Function = this.onResize.bind(this);

    // 차트 SVG Element(D3)
    private svgElem: any;
    private svgBaseGroup: any;
    private svgPathGroup: any;
    private svgTextGroup: any;
    private svgArcPaths: Array<any> = [];
    private svgLabels: Array<any> = [];
    private donutWidth: number = 0.45;          // 도넛 두께 (0 ~ 1) 단위:%
    private donutMinWidth: number = 50;         // 최소 도넛 두께 (단위:px)
    private drawChartData: Array<IDonutDrawData> = [];

    private widgetSize: Size = {w: 0, h: 0};
    private centerPosition: Position = {x: 0, y: 0};


    // 차트 데이터 기준으로 다시그리기 (true: 다시그림 / false:기존데이터 기준으로 그림)
    private reDraw: boolean = true;

    // 라벨 위치 설정 (bottom:아래 / right:오른쪽) - 설정된 위치의 숫자값은 (bottom기준: 위 1/4, 아래 3/4 비율로 설정)
    private labelsPosition: string = 'bottom';
    private labelModes: any = {
        right: 70,
        bottom: 70
    };
    private labelModeMargin:number;

    constructor(
        currentElem: ElementRef
    ){
        this.currElem = currentElem.nativeElement;
    }

    ngOnInit() {
        this.drawDataCreate();

        //* 현 위치 svg 추가
        this.svgElem = d3.select(this.currElem).append('svg');
        this.svgBaseGroup = this.svgElem.append('g');
        this.svgPathGroup = this.svgBaseGroup.append('g');
        this.svgTextGroup = this.svgBaseGroup.append('g');

        //* 위젯 컴포넌트가 transition으로 효과로 인해 캔버스 리사이즈 크기가 제대로 반영 시키기 위함
        this.widgetElem = $(this.currElem).parents('li.a3-widget-container')[0];
        if( this.widgetElem !== undefined ){
            this.widgetElem.addEventListener('transitionend', this.resizeCallback, false);
        }

        //* 위젯 본문, 상단 높이 알기위한 엘리먼트 셀렉트
        this.widgetBodyElem = $(this.currElem).parents('div.a3-widget-body').eq(0);
        this.infoElem = $(this.currElem).parents('div[list]').siblings('div[info]').eq(0);

        this.onResize();
    }

    ngOnDestroy(){
        // 등록된 이벤트 제거
        if( this.widgetElem !== undefined ){
            this.widgetElem.removeEventListener('transitionend', this.resizeCallback);
        }
    }

    ngOnChanges(c: any){
        // 차트 데이터가 바뀌면 다시 그리기
        if( c.chartData.currentValue !== c.chartData.previousValue && !c.chartData.firstChange ){
            this.reDraw = true;
            this.drawDataCreate();
            this.arcPathClear();
            this.onResize();
        }
    }

    //* 그려질 정보로 변환
    drawDataCreate(): void {
        let
            i: number,
            max: number = this.chartData.length,
            sumCount: number = 0,           // 데이터 총 합
            sumPercent: number = 0,         // 각각 위치의 퍼센트 종합 용
            currPercent: number = 0,        // 각각 위치의 퍼센트
            row: IDonutChartData
        ;

        // 퍼센트 낼 데이터 종합
        for( i=0; i<max; i++ ){
            sumCount += this.chartData[i].count;
        }

        // 각각 위치의 퍼센트값 세팅
        for( i=0; i<max; i++ ){
            row = this.chartData[i];
            currPercent = (row.count / sumCount);

            this.drawChartData.push({
                name: row.name,
                percent: currPercent,
                start: sumPercent,
                end: sumPercent + currPercent,
                count: row.count,
                color: ((name: string): string => {
                    let r:IColorSet;
                    for( r of this.chartColor ){
                        if( r.name == name ){ return r.color; }
                    }
                    return undefined;
                })(row.name)
            });

            sumPercent += currPercent;
        }
    }

    //* 차트 리사이즈
    onResize(): void {
        const w = this.widgetBodyElem.width();
        const h = this.widgetBodyElem.height() - this.infoElem.outerHeight();
        const minSize: number = Math.min( w, h );
        const smallSizeClass = minSize < 600 ? 'small' : '';

        this.labelsPosition = ( w > h ?  'right' : 'bottom' );
        this.listElem.nativeElement.className = `list ${this.labelsPosition} ${smallSizeClass}`;
        this.labelModeMargin = this.labelModes[ this.labelsPosition ];
        
        // 크기 재설정
        this.widgetSize.w = w;
        this.widgetSize.h = h;

        this.svgElem
            .attr('width', this.widgetSize.w)
            .attr('height', this.widgetSize.h)
        ;

        this.centerPosition.x = (w*0.5) - (this.labelsPosition == 'right' ? (this.labelModeMargin) : 0);
        this.centerPosition.y = (h*0.5) - (this.labelsPosition == 'bottom' ? (this.labelModeMargin*0.25) : 0);

        this.onDraw();
    }

    //* 각도 → radian 변환
    degree2radian(n: number): number {
        return Math.PI / 180 * n;
    }

    //* svg arc 도형 제거
    arcPathClear(): void {
        if( this.svgArcPaths.length == 0 ){ return; }

        const max = this.svgArcPaths.length; 

        d3.select(this.currElem).selectAll('path').remove();
        d3.select(this.currElem).selectAll('text').remove();
        
        this.svgArcPaths.splice(0, max);
        this.svgLabels.splice(0, max);

        this.drawChartData.splice(0, max);
    }

    //* arc도형 트윈
    arcTween( arc: any, idx: number, startAngle: number, endAngle: number ): void {
        let _curr: number = startAngle;
        const _target: number = endAngle;
        const _speed: number = 0.125;
        const _max: number = _target - ((_target - _curr) * 0.001);

        let t = new Timer(()=>{
            _curr += _speed * (_target - _curr);

            arc.endAngle( _curr );
            this.svgArcPaths[idx].attr('d', arc);

            if( _curr >= _max ){
                arc.endAngle( _target );
                this.svgArcPaths[idx].attr('d', arc);
                t.stop();
                t.destory();
            }
        });
        t.play();
    }

    //* 그리기
    onDraw(): void {
        const minSize: number = Math.min( this.widgetSize.w, this.widgetSize.h );

        // 도넛 반지름
        const radius: number = (minSize * 0.5) - (this.labelModeMargin * 0.5);

        // 폰트 크기
        let fontSize: number = radius * 0.05;
        const fontSizeMin: number = 12;
        const fontSizeMax: number = 16;

        // 바깥쪽, 안쪽 반지름 설정
        const outerRadius: number = radius;
        let innerRadius: number = radius - (radius * this.donutWidth);
        let middleRadius: number = innerRadius + (outerRadius - innerRadius) * 0.5;

        // 도형 여백 각도
        const pathMarginAngle: number = 0.35;

        // 최소 도넛 두께 조절
        if( outerRadius-innerRadius < this.donutMinWidth ){
            innerRadius = radius - this.donutMinWidth;
            middleRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
        }

        // 폰트 최소 크기 보다 작으면 최소 지정된 크기로 돌림
        if( fontSize < fontSizeMin ){
            fontSize = fontSizeMin;
        } else if ( fontSize > fontSizeMax ){
            fontSize = fontSizeMax;
        }

        // 도넛이 왼쪽으로 나갈 경우
        if( this.centerPosition.x - radius < 0 ){
            this.centerPosition.x = radius;
        }

        // 도넛이 위로으로 나갈 경우
        if( this.centerPosition.y - radius < 0 ){
            this.centerPosition.y = radius;
        }

        // 원형 그릴 중심 축 설정
        this.svgBaseGroup.attr('transform', `translate(${this.centerPosition.x}, ${this.centerPosition.y})`);

        let
            i: number,
            max: number = this.drawChartData.length,
            row: IDonutDrawData,
            startAngle: number, 
            endAngle: number,
            arc: any = null,
            centerAngle: number,
            labelX: number,
            labelY: number
        ;

        // 다시 그려야 되면 arcPath 지우기
        if( this.reDraw ){
            this.arcPathClear();
        }

        // 도넛 차트 그리기
        for( i=0; i<max; i++ ){
            row = this.drawChartData[i];

            // 각 앵글별 시작~종료 시점 설정
            startAngle = this.degree2radian( (360*row.start)+pathMarginAngle );
            endAngle = this.degree2radian( (360*row.end)-pathMarginAngle );
            centerAngle = startAngle + ((endAngle - startAngle)*0.5);

            labelX = middleRadius * Math.sin(centerAngle);
            labelY = middleRadius * Math.cos(centerAngle) * -1;

            // arc 도형 함수 생성
            arc = d3.svg.arc()
                .innerRadius( innerRadius  )
                .outerRadius( outerRadius )
                .startAngle( startAngle )
            ;

            // 초기 등록 세팅
            if( this.reDraw ){

                arc.endAngle(startAngle);

                // 그래프
                this.svgArcPaths.push(
                    this.svgPathGroup.append('path')
                        .attr('fill', row.color)
                        .attr('d', arc)
                        // .transition()
                );

                // 그래프 트윈 효과
                this.arcTween( arc, i, startAngle, endAngle );

                // 라벨
                this.svgLabels.push(
                    this.svgTextGroup.append('text')
                        .attr('style', `font-size:${fontSize}px`)     // 폰트 크기
                        .attr('transform', `translate(${labelX}, ${labelY})`)
                );

                this.svgLabels[i].append('tspan')
                    .attr('x', `0`)
                    .attr('dy', `0`)
                    .text(row.name)
                ;
                this.svgLabels[i].append('tspan')
                    .attr('name', 'line2')
                    .attr('x', `0`)
                    .attr('dy', `${fontSize}`)
                    .text('('+ parseFloat( (row.percent*100).toFixed(2) )+'%)') 
                ;
            }
            // 다시 그려야할 경우
            else {
                // 그래프
                arc.endAngle(endAngle);
                this.svgArcPaths[i].attr('d', arc);

                // 라벨 좌표, 폰트 크기
                this.svgLabels[i]
                    .attr('transform', `translate(${labelX}, ${labelY})`)
                    .attr('style', `font-size:${fontSize}px`)
                ;

                // 2번째 라벨 line-height
                this.svgLabels[i].select('tspan[name=line2]')
                    .attr('dy', `${fontSize}`)
                ;
            }
        }

        if( this.reDraw ){
            this.reDraw = false;
        }
    }
}