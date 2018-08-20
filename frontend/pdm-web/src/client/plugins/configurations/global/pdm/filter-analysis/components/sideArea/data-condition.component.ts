/*
    data-condition
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { PdmModelService } from '../../../../../../../common';
import { PdmConfigService } from '../../../model/pdm-config.service';

// 설정 인터페이스
// export interface DragItemListData {
//     name: string;
// };

// 시간
export interface TimePeriod {
    from: number;
    to: number;
};

// period
export interface periodItem {
    name: string;
    value: number;
};

// plants
export interface plantsItem {
    fabId: string;
    fabName: string;
};

// area
export interface areaItem {
    areaId: number;
    areaName: string;
    description: string | null;
    parentId: number;
    sortOrder: string | null;
    userName: string | null;
};

// eqp
export interface eqpItem {
    areaId: number;
    checked: boolean;
    dataType: string | null;
    dataTypeCd: string;
    description: string | null
    eqpId: number;
    eqpName: string;
    offline_yn: string | null;
    shopName: string | null;
    sortOrder: string | null;
    userName: string | null;
};

// parameter
export interface parameterItem {
    paramName: string;
    checked: boolean;
};

@Component({
    moduleId: module.id,
    selector: 'data-condition',
    templateUrl: './data-condition.html',
    styleUrls: ['./data-condition.css'],
    encapsulation: ViewEncapsulation.None
})

export class DataConditionComponent implements OnInit {

    // 설정 데이터
    // @Input() data: Array<DragItemListData>;

    //* 1분 미리 계산
    private readonly oneMinute: number = (1000 * 60); 

    private
        //* 시간
        searchTimePeriod: TimePeriod = {
            from: null,
            to: null
        }

        //* period 셀렉트 항목, 선택 값 (기본 5분)
        periods: Array<periodItem> = [
            {name: '5 Minutes', value: this.oneMinute * 5},
            {name: '10 Minutes', value: this.oneMinute * 10},
            {name: '1 Hour', value: this.oneMinute * 60},
            {name: '1 Day', value: this.oneMinute * 24*60},
        ]
        selectedPeriod: number = this.oneMinute * 5

        //* Fab 리스트, 선택 값
        plants: Array<plantsItem> = [
            { fabId: '', fabName: '' }
        ]
        selectedFab: plantsItem = { fabId: '', fabName: '' }

        //* Area 리스트, 선택 값
        areas: Array<areaItem> = []
        selectedArea: Array<number> = []
        selectedAreaDatas: Array<areaItem> = []

        //* Eqp 리스트, 선택 값
        eqps: Array<eqpItem> = []
        selectedEqpIds: Array<number> = []
        selectedEqpDatas: Array<eqpItem> = []

        //* Parameter 리스트, 선택 값
        parameters: Array<parameterItem> = []
        selectedParameters: Array<string> = []
        selectedParameterDatas: Array<parameterItem> = []
    ;

    //* 생성자
    constructor(
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService
    ){
        const period: (number | null) = this.getLocalStorage('period');

        if( period !== null ){
            this.selectedPeriod = period;
        }
    }

    ngOnInit() {
        // console.log('DragItemListComponent - data', this.data);

        // Fab 리스트 가져오기
        this._getPlants();
    }

    //* LocalStorage 데이터 가져오기
    getLocalStorage(key: string, isJSON: boolean = true): (any | null) {
        const value: any = localStorage.getItem(`FilterAnalysis-DataConditions-${key}`);
        return ( value === null ) ? null : (isJSON ? JSON.parse( value ) : value); 
    }

    //* LocalStorage 데이터 저장하기
    setLocalStorage(key: string, value: any, isJSON: boolean = true): void {
        localStorage.setItem(`FilterAnalysis-DataConditions-${key}`, (
            isJSON ? JSON.stringify(value) : value
        ));
    }

    //* Fab 가져오기
    _getPlants(): void {
        this.pdmModelService
            .getPlants()
            .then((plants: Array<plantsItem>) => {
                this.plants = plants;
                this.selectedFab = this.plants[0];
                this._getAreas();
            })
            .catch((error: any) => {})
        ;
    }

    //* Area 가져오기
    _getAreas(): void {
        this.pdmModelService
            .getAllArea( this.selectedFab.fabId )
            .then(( areas: Array<areaItem> ) => {
                this.areas = areas;

                const areaDatas: (Array<areaItem> | null) = this.getLocalStorage('areaDatas');
                if( areaDatas != null ){
                    this.selectedAreaDatas = areaDatas;
                }
            })
            .catch((error: any) => {})
        ;
    }

    //* Eqp 가져오기
    _getEqps(): void {
        this.pdmModelService
            .getEqpsByAreaIds(this.selectedFab.fabId, this.selectedArea)
            .then(( eqps: Array<eqpItem> ) => {
                this.eqps = eqps;

                const eqpDatas: (Array<eqpItem>) = this.getLocalStorage('eqpDatas');
                if( eqpDatas != null ){
                    this.selectedEqpDatas = eqpDatas;
                }
            })
            .catch((error: any) => {})
        ;
    }

    //* Parameter 가져오기
    _getParameters(): void {
        this.pdmModelService
            .getParamNameByEqpIds(this.selectedFab.fabId, this.selectedEqpIds)
            .then((params: Array<string>) => {
                // console.log('params', params);

                this.parameters.splice(0);
                
                let i: number;
                const len: number = params.length;

                for( i=0; i<len; i++ ){
                    this.parameters.push({ 'paramName': params[i], checked: false });
                }

                const paramDatas: (Array<parameterItem>) = this.getLocalStorage('paramDatas');
                if( paramDatas != null ){
                    this.selectedParameterDatas = paramDatas;
                }
            }).catch((error: any) => {})
        ;
    }

    //* [searchTimePeriod] From ~ To 값 변경 시 사용 값
    fromToChange(time: TimePeriod): void {
        this.searchTimePeriod = time;
    }

    //* [selectedPeriod] Period 값 선택
    changeSelectedPeriod(event: any): void {
        this.searchTimePeriod.from = this.searchTimePeriod.to - this.selectedPeriod ;
    }    

    //* Area 멀티 셀렉트 갑 변경 이벤트
    onChangeArea(e: Array<areaItem>): void {
        this.selectedArea.splice(0);

        let i: number;
        const len: number = e.length;

        for( i=0; i<len; i++ ){
            this.selectedArea.push( e[i].areaId );
        }

        // 선택 된 멀티 Area 데이터 값 설정
        this.selectedAreaDatas = e;

        // 선택된 멀티 Area에 따른 처리
        this.selectedArea.length > 0 ? this._getEqps() : this.eqps.splice(0);
    }

    //* Eqp 멀티 셀렉트 값 변경 이벤트
    onChangeEqp(e: Array<eqpItem>): void {
        // console.log(e);

        this.selectedEqpIds.splice(0);

        let i: number;
        const len: number = e.length;

        for( i=0; i<len; i++ ){
            this.selectedEqpIds.push( e[i].eqpId );
        }

        // 선택 된 멀티 Eqp 데이터 값 설정
        this.selectedEqpDatas = e;

        // 선택된 멀티 Eqp에 따른 처리
        this.selectedEqpIds.length > 0 ? this._getParameters() : this.parameters.splice(0);
    }

    //* Parameter 멀티 셀렉트 값 변경 이벤트
    onChangeParameter(e: Array<parameterItem>): void {
        // console.log(e);

        this.selectedParameters.splice(0);

        let i: number;
        const len: number = e.length;
        for( i=0; i<len; i++ ){
            this.selectedParameters.push( e[i].paramName );
        }

        // 선택 된 멀티 Eqp 데이터 값 설정
        this.selectedParameterDatas = e;
    }

    //* Get Data Info 버튼 클릭 이벤트
    clickGetDataInfo(e?: MouseEvent | undefined): void {

        // 선택된 period 값 local저장소에 저장
        this.setLocalStorage('period', this.selectedPeriod, false);
        this.setLocalStorage('areaDatas', this.selectedAreaDatas);
        this.setLocalStorage('eqpDatas', this.selectedEqpDatas);
        this.setLocalStorage('paramDatas', this.selectedParameterDatas);
    }
    
}