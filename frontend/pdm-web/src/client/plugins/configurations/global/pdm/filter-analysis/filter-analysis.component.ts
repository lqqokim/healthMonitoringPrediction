import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';
import { FilterAnalysisConfig } from './components/sideArea/config-list.component';
import { DragItemListData, DragItemListComponent } from './components/sideArea/dragItem-list.component';
import { DrawChartData, ChartDataItem } from './components/topArea/chart-visual-options.component';
import { OnParameterData, TimePeriod, plantsItem } from './components/sideArea/data-condition.component';
import { DrawResponseData, ChartDrawAreaComponent } from './components/chartDrawArea/chart-draw-area.component';

//* 접힘 처리 용
export interface foldingAreas {
    dataConditions: boolean;
    dimensions: boolean;
    measures: boolean;
};

//* getAnalysisToolData param 데이터 타입
export interface SendItemType {
    param_name: string;
    group_name: string;
};

@Component({
    moduleId: module.id,
    selector: 'filter-analysis',
    templateUrl: './filter-analysis.html',
    styleUrls: ['./filter-analysis.css'],
    providers: [PdmConfigService, PdmModelService],
    encapsulation: ViewEncapsulation.None
})

export class FilterAnalysisComponent implements OnInit {

    //* Dimensisons, Measuires 컴포넌트
    @ViewChild('dragItemDimensions') dragItemDimensions: DragItemListComponent;
    @ViewChild('dragItemMeasures') dragItemMeasures: DragItemListComponent;

    //* 차트 그려질 영역 
    @ViewChild('chartDrawArea') chartDrawArea: ChartDrawAreaComponent;

    //* Dimensisons 값
    private defaultDimenstions: Array<DragItemListData> = [
        {name: 'DATE_TIME'},
        {name: 'AREA_NAME'},
        {name: 'EQP_NAME'}
    ];
    private dimensions: Array<DragItemListData> = [];

    //* Measuires 값
    private measures: Array<DragItemListData> = [];
    
    //* 설정 값
    private configData: Array<FilterAnalysisConfig> = [
        {dataType: 'select', name:'Chart Type', items: ['Bar Chart', 'Line Chart', 'Pie Chart', 'Candle Chart'], value: 'Bar Chart'},
        {dataType: 'boolean', name:'Scailing', value: true },
    ];

    //* DataConditions에서 넘어올 TimePeriod
    private timePeriod: TimePeriod = {
        from: undefined,
        to: undefined
    };

    //* 접힘 처리 용
    private folding: foldingAreas = {
        dataConditions: false,
        dimensions: false,
        measures: false
    };

    //* fabId
    private fabId: string = undefined;

    constructor(
        private _pdmModel: PdmModelService
    ){
        // fabId 가져오기 (Draw Chart 버튼 이벤트 처리 때 사용)
        this.getFabId();
    }

    ngOnInit() {
    }

    //* fabId 가져오기
    private getFabId(): void {
        this._pdmModel
            .getPlants()
            .then((plants: Array<plantsItem>) => {
                this.fabId = plants[0].fabId;
            })
            .catch((err: any) => {
                console.log( 'getFabId', err );
                this.fabId = undefined;
            })
        ;
    }

    //* (onDrawChartData) x_category, y_category 해당 배열 세팅 용
    private getCategoryDataType( target: Array<string> ): Array<SendItemType> {

        let result: Array<SendItemType> = [];

        // 데이터가 없으면 공백
        if( target.length === 0 ){ return result; }

        let i: number, len: number;
        len = target.length;
        i = 0;

        // 데이터 설정
        while( i < len ){
            result.push({
                param_name: target[i],
                group_name: ''          // 카테고리는 그룹에 해당하는 값이 없으므로 EMPTY 처리
            });

            i++;
        }

        return result;
    }

    //* (onDrawChartData) x, y, y2 해당 배열 세팅 용
    private getChartDataType( target: Array<ChartDataItem>): Array<SendItemType> {

        let result: Array<SendItemType> = [];

        // 데이터가 없으면 공백
        if( target.length === 0 ){ return result; }

        let i: number, len: number;
        len = target.length;
        i = 0;

        // 데이터 설정
        while( i < len ){
            result.push({
                param_name: target[i].name,
                group_name: (
                    // 그룹이 선택된 값이 Normal일 경우 EMPTY 처리
                    target[i].selected === 'NORMAL' ? '' : target[i].selected
                )
            });

            i++;
        }

        return result;
    }

    //* Draw Chart 버튼 클릭 시 넘어올 데이터
    onDrawChartData( res: DrawChartData ): void {
        console.log( res );

        // fabId값을 가져오지 못한 상태라면 건너뜀
        if( this.fabId === undefined ){
            console.log( '[error] fabId - undefined' );
            return;
        }

        // 테스트 용 (실 구동시 제거 코드)
        // res.category.x = ["EQP_NAME"];
        res.category.x = [];
        // res.category.y = ["AREA_NAME"];
        res.category.y = ['AREA_NAME', 'DATE_TIME', 'EQP_NAME'];
        res.chartData.x = [{name:"DATE_TIME", selected:'NORMAL'}];
        res.chartData.y = [{name:"Z_RMS", selected:'NORMAL'}];
        res.chartData.y2 = [{name:"HOIST_AXIS_SPEED", selected:'NORMAL'}];

        this.timePeriod.from = 1532410240000;
        this.timePeriod.to = 1532413840000;
        
        // 차트 관련 데이터 가져오기
        this._pdmModel
            .getAnalysisToolData(
                this.fabId,
                this.timePeriod.from,
                this.timePeriod.to, {
                    x_category: this.getCategoryDataType( res.category.x ),
                    y_category: this.getCategoryDataType( res.category.y ),
                    x: this.getChartDataType( res.chartData.x ),
                    y: this.getChartDataType( res.chartData.y ),
                    y2: this.getChartDataType( res.chartData.y2 )
                }
            )
            .then((drawResData: DrawResponseData)=>{
                console.log( 'getAnalysisToolData-res', res );
                const xCategoryCount: number = res.category.x.length;
                const yCategoryCount: number = res.category.y.length;

                this.chartDrawArea.draw(drawResData, xCategoryCount, yCategoryCount);
            })
            .catch((err: any)=>{
                console.log( '[error] getAnalysisToolData', err );
            })
        ;
    }

    //* 선택된 Parameter 값 리스트 넘어올 데이터
    onParameter( res: OnParameterData ): void {
        console.log('onParameter - res', res );
        this.parameterFilter( res );
    }

    //* 넘어온 Parameter 값 Dimensions, Measures 필터링
    parameterFilter( datas: OnParameterData ): void {
        const len: number = datas.selectedParameters.length;

        // 기존 데이터와 새로 넘어온 데이터가 없으면 처리 안함
        if( len === 0 && this.dimensions.length === 0 && this.measures.length === 0 ){ return; }

        // 지정된 날짜 기록
        this.timePeriod = datas.timePeriod;

        // 선택된 파라메터
        const items: Array<string> = datas.selectedParameters;

        // 기존 데이터 제거
        this.dimensions.splice(0);
        this.measures.splice(0);

        // 처리
        let i: number = 0;
        while( i < len ){
            // (Dimensions) STATUS, BARCODE 키워드가 존재하면
            if( RegExp('STATUS|BARCODE', 'i').test(items[i]) ){
                this.dimensions.push({name: items[i]});
            }
            // (Measures) 그 외 
            else {
                this.measures.push({name: items[i]});
            }
            i++;
        }

        // 리스트 업데이트 (Demenstions는 기본 디폴트값 뒤에 변경될 값 적용)
        this.dragItemDimensions.setData( [...this.defaultDimenstions, ...this.dimensions]);
        this.dragItemMeasures.setData( this.measures );
        
        // Data Conditions 접기
        this.folding.dataConditions = true;

        // Dimensions, Mmeasures 펼치기
        this.folding.dimensions = false;
        this.folding.measures = false;
    }

    //* (Dimensions, Measures) 위치 마우스 드래그 중일 때
    onDragover(e: DragEvent): void {
        // drop 이벤트를 처리 하기위함
        e.preventDefault();
    }

    //* (Dimensions, Measures) 위치 아이템 드롭
    onDrop( e: DragEvent, keyName: string ): void {
        
        // 드롭 시 가져올 데이터
        const dragItemName: string = e.dataTransfer.getData('itemName');
        const dragItemIndex: number = parseInt(e.dataTransfer.getData('itemIndex'), 10);
        const dragItemDataKeyName: string = e.dataTransfer.getData('itemDataKeyName');

        // 같은 영역에 아이템 드롭 시 건너 뜀
        if( keyName === dragItemDataKeyName ){ return; }

        // 드래그 한 위치의 Dimensisons 혹은 Measures 리스트 가져오기
        const dragAreaList: Array<DragItemListData> = (
            this.hasOwnProperty(dragItemDataKeyName) ? <Array<DragItemListData>>this[dragItemDataKeyName] : undefined
        );

        // 드롭 할 위치의 Dimensisons 혹은 Measures 리스트 가져오기
        const dropAreaList: Array<DragItemListData> = (
            this.hasOwnProperty(keyName) ? <Array<DragItemListData>>this[keyName] : undefined
        );

        // 가져온 드롭영역 아이템 제거
        if( dragAreaList !== undefined && dragAreaList[dragItemIndex].name === dragItemName ){
            dragAreaList.splice( dragItemIndex, 1 );
        }

        // 현 위치 드롭 아이템 추가
        if( dropAreaList !== undefined ){

            const elem: Element = <Element>e.target;

            // li 태그가 아니라면 제일 아래에 항목 추가
            if( elem.tagName.toUpperCase() !== 'LI' ){
                dropAreaList.push({name: dragItemName});
            }
            // li 태그라면 해당 위치에 항목 추가
            else {
                const pushIdx: number = $(elem).index()+1;
                dropAreaList.splice(pushIdx, 0, {name: dragItemName});
            }
        }
    }
}