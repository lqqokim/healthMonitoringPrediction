import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';
import { FilterAnalysisConfig } from './components/sideArea/config-list.component';
import { DragItemListData } from './components/sideArea/dragItem-list.component';
import { DrawChartData } from './components/topArea/chart-visual-options.component';


@Component({
    moduleId: module.id,
    selector: 'filter-analysis',
    templateUrl: './filter-analysis.html',
    styleUrls: ['./filter-analysis.css'],
    providers: [PdmConfigService, PdmModelService],
    encapsulation: ViewEncapsulation.None
})

export class FilterAnalysisComponent implements OnInit {

    //* Dimensisons 값
    private dimensions: Array<DragItemListData> = [
        {name: 'Date'},
        {name: 'Artist'},
        {name: 'Title'},
        {name: 'Area'}
    ];

    //* Measuires 값
    private measuires: Array<DragItemListData> = [
        {name: 'CD Number'},
        {name: 'Track Number'},
        {name: 'Measure Values'}
    ];
    
    //* 설정 값
    private configData: Array<FilterAnalysisConfig> = [
        {dataType: 'select', name:'Chart Type', items: ['Bar Chart', 'Line Chart', 'Pie Chart', 'Candle Chart'], value: 'Bar Chart'},
        {dataType: 'boolean', name:'Scailing', value: true },
    ];

    constructor(){
    }

    ngOnInit() {
    }

    //* Draw Chart 버튼 클릭 시 넘어올 데이터
    onDrawChartData( res: DrawChartData ): void {
        console.log( res );
    }
}