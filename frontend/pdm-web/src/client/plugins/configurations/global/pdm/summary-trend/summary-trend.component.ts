import { Component, OnInit, ViewChild } from '@angular/core';

import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from '../../../../../common/model/app/pdm/pdm-model.service';

import { FabAreaEqpParamTreeComponent } from '../../../../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater, SpinnerComponent } from '../../../../../sdk';
import { SummaryTrendChartComponent } from './component/summary-trend-chart/summary-trend-chart.component';
import { EqpEventType } from '../../../../../common/types/eqpEvent.type';

// import { CODE_LIST } from './mock-data';

@Component({
    moduleId: module.id,
    selector: 'summary-trend',
    templateUrl: 'summary-trend.html',
    styleUrls: ['summary-trend.css'],
    providers: [PdmConfigService, PdmModelService],
})
export class SummaryTrendComponent implements OnInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('tree') tree: FabAreaEqpParamTreeComponent;
    @ViewChild('tree2') tree2: FabAreaEqpParamTreeComponent;
    @ViewChild('summaryTrendChart') summaryTrendChart :SummaryTrendChartComponent;

    // params = [
    //     { name: 'param1', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param2', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param3', isEventParam: false, conditionValue: null, datas: [] ,eventConfig:[]}
    // ]


    fabId;
    eqpId;

    searchTimePeriod = {
        from: null,
        to: null
    }
    searchTimePeriod2 = {
        from: null,
        to: null
    }

    xMin;
    xMax;

    paramDatas = [];

    showProgress = false;
    percentage: any = 0;
    total = 0;
    current = 0;

    eventType = "event";
    eventLines = [];

    aggregations = [
        { f: 'Mean', checked: false },
        { f: 'STD DEV', checked: false },
        { f: 'Max', checked: false },
        { f: 'Q3', checked: false },
        { f: 'Median', checked: false},
        { f: 'Q1', checked: false },
        { f: 'Min', checked: false },
        { f: 'Count', checked: false },
        // { f: 'Sum', checked: false },
    ];
    aggregationChecked = false;
    aggregationTime = 1;

    simulation_params = [];

    canDrawEvent = false;
    canDrawAdHoc = true;

    selectedParam = false;

    treeParamSelect = false;
    tree2ParamSelect = false;

    eqpEvents = [];
    _eventTypeEvents = {};

    constructor(private pdmModelService: PdmModelService, private pdmConfigService: PdmConfigService) {
        this.searchTimePeriod.to = new Date().getTime();
        let fromDate = new Date();
        // fromDate.setDate(fromDate.getDate()-1);
        fromDate.setHours(fromDate.getHours() - 3);
        this.searchTimePeriod.from = fromDate.getTime();

        this.searchTimePeriod2.from = fromDate.getTime();
        this.searchTimePeriod2.to = new Date().getTime();
    }

    ngOnInit() {

    }
    selectParam(event){
        this.selectedParam = true;
        this.eventLines=[];
    }
    
 
    adHocSummary_init(){
        this.simulation_params = [];
        this.summaryTrendChart.init();
    }

    fromToChange(data: any) {
        this.searchTimePeriod = data;
    }
    fromToChange2(data: any) {
        this.searchTimePeriod2 = data;
    }
    
    clickCheck(){
        this.aggregationChecked = false;
        for(let i=0;i<this.aggregations.length;i++){
            if(this.aggregations[i].checked){
                this.aggregationChecked = true;
                break;
            }
        }
    }
    nodeClick(event){
        let node = this.tree.getSelectedNodes();
        let parameters = [];
        let eqpId = "";
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                parameters.push(element);
                eqpId = element.eqpId;
            }

        }
        if(parameters.length>0){
            this.treeParamSelect = true;
        }else{
            this.treeParamSelect = false;
        }
        if(this.eqpId!= eqpId){
            this.canDrawEvent = false;
        }
    }
    nodeClick2(event){
        let node = this.tree2.getSelectedNodes();
        let parameters = [];
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                parameters.push(element);
            }

        }
        if(parameters.length>0){
            this.tree2ParamSelect = true;
        }else{
            this.tree2ParamSelect = false;
        }
    }

    adHocSummary() {
        this.adHocSummary_init();

        // let conditionValue = this.modelChart.getConditionValue();
        let fabId = this.tree2.selectedFab.fabId;
        // let conditionParamId = this.modelChart.getConditionParamId();
        let node = this.tree2.getSelectedNodes();
        let parameters = [];
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                parameters.push(element);
            }

        }
        let adHocFunctions = [];
        for (let i = 0; i < this.aggregations.length; i++) {
            if (this.aggregations[i].checked) {
                adHocFunctions.push(this.aggregations[i].f);
            }
        }

        this.total = parameters.length;
        this.percentage = 0;
        this.current = 0;


        for (let i = 0; i < parameters.length; i++) {
            this.showProgress = true;
            try {
                this.pdmModelService.getSummaryData(fabId, parameters[i].paramId,
                    this.searchTimePeriod2.from, this.searchTimePeriod2.to, adHocFunctions).subscribe((datas) => {

                        let keys = Object.keys(datas);
                        for (let j = 0; j < keys.length; j++) {
                            this.simulation_params.push({ name: parameters[i].name, adHoc: keys[j], datas: [datas[keys[j]]],from:this.searchTimePeriod2.from,to: this.searchTimePeriod2.to });
                        }

                        this.current++;
                        this.percentage = this.current / this.total * 100;
                        this.percentage = this.percentage.toFixed(0);
                        if (this.percentage >= 100) {
                            this.showProgress = false;
                            this.sortByKey(this.simulation_params,"name","asc");
                            
                        }
                    })
            } catch (e) {
                this.current++;
                this.percentage = this.current / this.total * 100;
                this.percentage = this.percentage.toFixed(0);
                if (this.percentage >= 100) {
                    this.showProgress = false;
                    this.sortByKey(this.simulation_params,"name","asc");
                    
                }
                console.log(e);
            }

        }

    }
    sortByKey(array, key,sortType) {
       
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            if(sortType=="asc"){
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }else{
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
            
        });
    }
   

}