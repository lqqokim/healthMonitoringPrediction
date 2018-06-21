import { Component, OnInit, ViewChild } from '@angular/core';

import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';

import { FabAreaEqpParamTreeComponent } from '../../../../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater, SpinnerComponent } from '../../../../../sdk';
import { ModelingChartComponent } from './component/modeling-chart/modeling-chart.component';
import { ModelingSimulatorChartComponent } from './component/modeling-simulator-chart/modeling-simulator-chart.component';

// import { CODE_LIST } from './mock-data';

@Component({
    moduleId: module.id,
    selector: 'model-simulator',
    templateUrl: './model-simulator.html',
    styleUrls: ['./model-simulator.css'],
    providers: [PdmConfigService, PdmModelService],
})
export class ModelSimulatorComponent implements OnInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('tree') tree: FabAreaEqpParamTreeComponent;
    @ViewChild('tree2') tree2: FabAreaEqpParamTreeComponent;
    @ViewChild('modelChart') modelChart: ModelingChartComponent;
    @ViewChild('simulationChart') simulationChart :ModelingSimulatorChartComponent;

    // params = [
    //     { name: 'param1', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param2', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param3', isEventParam: false, conditionValue: null, datas: [] ,eventConfig:[]}
    // ]

    searchTimePeriod = {
        from: null,
        to: null
    }
    searchTimePeriod2 = {
        from: null,
        to: null
    }


    paramDatas = [];

    showProgress = false;
    percentage: any = 0;
    total = 0;
    current = 0;

    eventType = "event";
    eventLines = [];

    aggregations = [
        { f: 'Mean', checked: false },
        { f: 'Max', checked: false },
        { f: 'Min', checked: false },
        { f: 'Median', checked: false},
        { f: 'Sum', checked: false },
        { f: 'Q1', checked: false },
        { f: 'Q3', checked: false },
        { f: 'Count', checked: false },
    ];
    aggregationChecked = false;
    aggregationTime = 1;

    simulation_params = [];

    canDrawEvent = false;
    canDrawAdHoc = false;

    selectedParam = false;

    treeParamSelect = false;
    tree2ParamSelect = false;

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
    drawChart() {
        this.drawChart_init();

        let fabId = this.tree.selectedFab.fabId;
        let node = this.tree.getSelectedNodes();
        let parameters = [];
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                parameters.push(element);
            }

        }
        this.paramDatas = [];
        this.total = parameters.length;
        this.percentage = 0;
        this.current = 0;
        for (let i = 0; i < parameters.length; i++) {
            this.showProgress = true;
            try {
                this.pdmModelService.getTraceDataByParamId(fabId, parameters[i].paramId, this.searchTimePeriod.from, this.searchTimePeriod.to).then((datas) => {
                    console.log(datas);
                    if (datas.length > 0) {
                        let paramInfo = { name: parameters[i].paramName, paramId: parameters[i].paramId, datas: [datas] };
                        this.paramDatas.push(paramInfo);
                    }

                    this.current++;
                    this.percentage = this.current / this.total * 100;
                    this.percentage = this.percentage.toFixed(0);
                    if (this.percentage >= 100) {
                        this.showProgress = false;
                        if(this.paramDatas.length>0){
                            this.canDrawEvent = true;
                        }
                    }

                }).catch((err) => {
                    this.current++;
                    this.percentage = this.current / this.total * 100;
                    this.percentage = this.percentage.toFixed(0);
                    if (this.percentage >= 100) {
                        this.showProgress = false;
                        if(this.paramDatas.length>0){
                            this.canDrawEvent = true;
                        }
                    }
                    console.error(err);
                })
            } catch (e) {
                console.log(e)
            }

        }

    }
    drawEvent() {

        this.drawEvent_init();

        this.componentSpinner.showSpinner();
        let fabId = this.tree.selectedFab.fabId;
        let paramId = this.modelChart.getParamId();
        let conditionValue = this.modelChart.getConditionValue();
        this.pdmModelService.getTraceDataEventSimulation(fabId, paramId, this.searchTimePeriod.from, this.searchTimePeriod.to, conditionValue).then((datas) => {
            this.eventLines = datas;
            this.canDrawAdHoc = true;
            this.componentSpinner.hideSpinner();

        })
            .catch((e) => {
                console.log(e);
                this.componentSpinner.hideSpinner();
            })
    }
    drawChart_init(){
        this.canDrawAdHoc = false;
        this.selectedParam = false;
        this.eventLines = [];

        this.modelChart.init();

        this.adHocSummary_init();
    }
    drawEvent_init(){
        this.modelChart.initEvent();
        this.adHocSummary_init();
    }
    adHocSummary_init(){
        this.simulation_params = [];
        this.simulationChart.init();
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
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                parameters.push(element);
            }

        }
        if(parameters.length>0){
            this.treeParamSelect = true;
        }else{
            this.treeParamSelect = false;
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

        let conditionValue = this.modelChart.getConditionValue();
        let fabId = this.tree2.selectedFab.fabId;
        let conditionParamId = this.modelChart.getConditionParamId();
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
                this.pdmModelService.getTraceDataEventSimulationByConditionValue(fabId, this.paramDatas[i].paramId,
                    this.searchTimePeriod2.from, this.searchTimePeriod2.to, conditionParamId, conditionValue, adHocFunctions, this.aggregationTime, this.eventType).subscribe((datas) => {

                        let keys = Object.keys(datas);
                        for (let i = 0; i < keys.length; i++) {
                            this.simulation_params.push({ name: parameters[i].name, adHoc: keys[i], datas: [datas[keys[i]]] });
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