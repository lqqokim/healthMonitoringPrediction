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
import { EqpEventType } from '../../../../../common/types/eqpEvent.type';

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
        { f: 'Sum', checked: false },
    ];
    aggregationChecked = false;
    aggregationTime = 1;

    simulation_params = [];

    canDrawEvent = false;
    canDrawAdHoc = false;

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
    drawChart() {
        this.drawChart_init();

        this.fabId = this.tree.selectedFab.fabId;
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
                this.pdmModelService.getTraceDataByParamId(this.fabId, parameters[i].paramId, this.searchTimePeriod.from, this.searchTimePeriod.to).then((datas) => {
                    console.log(datas);
                    if (datas.length > 0) {

                        // C3
                        // for(let i=0;i<datas.length;i++){
                        //     datas[i] = datas[i].slice(0,2);
                        // }
                        // datas.unshift(['time',parameters[i].paramName]);
                        // let paramInfo = { name: parameters[i].paramName, paramId: parameters[i].paramId, datas:{x:'time',rows: datas},from:this.searchTimePeriod.from, to:this.searchTimePeriod.to };

                        //bistelchart
                        let paramInfo = { name: parameters[i].paramName, paramId: parameters[i].paramId, datas:[ datas],from:this.searchTimePeriod.from, to:this.searchTimePeriod.to };
                        this.paramDatas.push(paramInfo);
                        // this.paramDatas = this.paramDatas.concat();
                    }

                    this.current++;
                    this.percentage = this.current / this.total * 100;
                    this.percentage = this.percentage.toFixed(0);
                    if (this.percentage >= 100) {
                        this.showProgress = false;
                        if(this.paramDatas.length>0){
                            this.canDrawEvent = true;
                            this.paramDatas = this.paramDatas.concat([]);
                            this.xMin = this.paramDatas[0].datas[0].from;
                            this.xMax = this.paramDatas[0].datas[this.paramDatas[0].datas.length-1].to;
                        }
                        this.setEqpEvent();
                    }

                }).catch((err) => {
                    this.current++;
                    this.percentage = this.current / this.total * 100;
                    this.percentage = this.percentage.toFixed(0);
                    if (this.percentage >= 100) {
                        this.showProgress = false;
                        if(this.paramDatas.length>0){
                            this.canDrawEvent = true;
                            this.paramDatas = this.paramDatas.concat([]);
                            this.xMin = this.paramDatas[0].datas[0].from;
                            this.xMax = this.paramDatas[0].datas[this.paramDatas[0].datas.length-1].to;
                        }
                        this.setEqpEvent();
                    }
                    console.error(err);
                })
            } catch (e) {
                console.log(e)
            }

        }

    }
    
    setEqpEvent(){
        // let fabId = this.tree.selectedFab.fabId;
        let node = this.tree.getSelectedNodes();
        // let eqpId = "";
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                this.eqpId = element.eqpId;
                break;
            }

        }
        this._eventTypeEvents ={};
        this.pdmModelService.getEqpEventByEqpId(this.fabId,this.eqpId).then((datas)=>{
            if(datas.length>0){
                this.eqpEvents = datas;
                for(let i=0;i<this.eqpEvents.length;i++){
                    this._eventTypeEvents[ this.eqpEvents[i].eventTypeCd]=Object.assign({}, this.eqpEvents[i]);
                }

                this.selectParam(null);
            }

        });
    }
    drawEvent() {

        this.drawEvent_init();

        this.componentSpinner.showSpinner();
        // let fabId = this.tree.selectedFab.fabId;
        let paramId = this.modelChart.getParamId();
        let conditionValue = this.modelChart.getConditionValue();
        this.pdmModelService.getTraceDataEventSimulation(this.fabId, paramId, this.searchTimePeriod.from, this.searchTimePeriod.to, this.getStartCondition(),this.getEndCondition()).then((datas) => {
            this.eventLines = datas;
            this.canDrawAdHoc = true;
            this.componentSpinner.hideSpinner();

        })
            .catch((e) => {
                console.log(e);
                this.componentSpinner.hideSpinner();
            })
    }
    getStartCondition(){
        return "value"+ this.modelChart.getConditionStartOperator() +this.modelChart.getConditionValue();
    }
    getEndCondition(){
        return "value"+ this.modelChart.getConditionEndOperator() +this.modelChart.getConditionValue();
    }
    save(){
        // let fabId = this.tree.selectedFab.fabId;
        let eqpEvents :EqpEventType[] =[] ;
        
        let eqpStartEvent :EqpEventType ;
        let eqpEndEvent :EqpEventType ;

        if(this._eventTypeEvents['S']!=null){
            eqpStartEvent = this._eventTypeEvents['S'];
            eqpStartEvent.condition = this.getStartCondition();
            eqpStartEvent.paramId = this.modelChart.getParamId();
            eqpStartEvent.processYn = this.eventType == "event"?"Y":"N";
        }else{
            eqpStartEvent.eqpId = this.eqpId;
            eqpStartEvent.condition = this.getEndCondition();
            eqpStartEvent.eventName = "process start";
            eqpStartEvent.eventTypeCd="S";
            eqpStartEvent.paramId = this.modelChart.getParamId();
            eqpStartEvent.processYn = this.eventType == "event"?"Y":"N";
        }
        eqpEvents.push(eqpStartEvent);
        
        if(this._eventTypeEvents['E']!=null){
            eqpEndEvent = this._eventTypeEvents['E'];
            eqpEndEvent.condition = "value"+ this.modelChart.getConditionStartOperator() +this.modelChart.getConditionValue();
            eqpEndEvent.paramId = this.modelChart.getParamId();
            eqpEndEvent.processYn = this.eventType == "event"?"Y":"N";
        }else{
            eqpEndEvent.eqpId = this.eqpId;
            eqpEndEvent.condition = "value"+ this.modelChart.getConditionStartOperator() +this.modelChart.getConditionValue();
            eqpEndEvent.eventName = "process end";
            eqpEndEvent.eventTypeCd="E";
            eqpEndEvent.paramId = this.modelChart.getParamId();
            eqpEndEvent.processYn = this.eventType == "event"?"Y":"N";
        }
        eqpEvents.push(eqpEndEvent);
        

        this.pdmModelService.setEqpEvent(this.fabId,eqpEvents).subscribe((result)=>{
            alert("save success!");
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

        // let conditionValue = this.modelChart.getConditionValue();
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
                this.pdmModelService.getTraceDataEventSimulationByConditionValue(fabId, parameters[i].paramId,
                    this.searchTimePeriod2.from, this.searchTimePeriod2.to, conditionParamId, this.getStartCondition(),this.getEndCondition(), adHocFunctions, this.aggregationTime, this.eventType).subscribe((datas) => {

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