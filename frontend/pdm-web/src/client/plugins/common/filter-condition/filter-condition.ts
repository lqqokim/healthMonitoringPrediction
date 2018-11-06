/*
    data-condition
*/
import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { PdmModelService } from '../../../common';
import { PdmConfigService } from '../../../plugins/configurations/global/pdm/model/pdm-config.service';

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

// output emit
export interface OnParameterData {
    timePeriod: TimePeriod;                 // 검색할 시간
    selectedParameters: Array<string>;      // 선택된 파라메터
};

@Component({
    moduleId: module.id,
    selector: 'filter-condition',
    templateUrl: './filter-condition.html',
})
export class FilterConditionComponent {

    private readonly oneMinute: number = (1000 * 60);

    //* period 셀렉트 항목, 선택 값 (기본 5분)
    readonly periods: Array<periodItem> = [
        { name: '5 Minutes', value: this.oneMinute * 5 },
        { name: '10 Minutes', value: this.oneMinute * 10 },
        { name: '1 Hour', value: this.oneMinute * 60 },
        { name: '1 Day', value: this.oneMinute * 24 * 60 },
    ]

    selectedTimePeriod: TimePeriod = {
        from: null,
        to: new Date().getTime()
    };

    selectedPeriod: number = this.oneMinute * 5

    constructor() {
        // this.selectedTimePeriod.to = new Date().getTime();
        this.changeSelectedPeriod( null );
        const period: (number | null) = this.getLocalStorage('period');
        if( period !== null ){
            this.selectedPeriod = period;
        }
    }

    ngOnInit() {

    }

    getLocalStorage(key: string, isJSON: boolean = true): (any | null) {
        const value: any = localStorage.getItem(`FilterAnalysis-DataConditions-${key}`);
        return ( value === null ) ? null : (isJSON ? JSON.parse( value ) : value); 
    }

    changeSelectedTimePeroid(timePeriod: TimePeriod): void {
        console.log('changeSelectedTimePeroid ', timePeriod);
        this.selectedTimePeriod = timePeriod;
    }

    changeSelectedPeriod(period): void {
        console.log('changeSelectedPeriod ', period);
        this.selectedTimePeriod.from = this.selectedTimePeriod.to - period;
    }
}