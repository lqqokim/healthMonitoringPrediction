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

// import { CODE_LIST } from './mock-data';

@Component({
    moduleId: module.id,
    selector: 'model-simulator',
    templateUrl: './model-simulator.html',
    styleUrls: ['./model-simulator.css'],
    providers: [PdmConfigService, PdmModelService],
})
export class ModelSimulatorComponent implements OnInit {
    @ViewChild('tree') tree: FabAreaEqpParamTreeComponent;
    @ViewChild('tree2') tree2: FabAreaEqpParamTreeComponent;
    @ViewChild('modelChart') modelChart:ModelingChartComponent;

    // params = [
    //     { name: 'param1', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param2', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param3', isEventParam: false, conditionValue: null, datas: [] ,eventConfig:[]}
    // ]

    searchTimePeriod={
        from:null,
        to:null
    }
    searchTimePeriod2={
        from:null,
        to:null
    }


    paramDatas = [];

    showProgress=false;
    percentage:any=0;
    total=0;
    current=0;

    eventType ="event";
    eventLines =[];

    aggregations=[
        {f:'Mean',checked:false},
        {f:'Max',checked:false},
        {f:'Min',checked:false},
        {f:'Median',checked:false},
        {f:'Sum',checked:false},
        {f:'Q1',checked:false},
        {f:'Q3',checked:false},
        {f:'Count',checked:false},
    ];
    aggregationTime=1;

    simulation_params =[];

    constructor(private pdmModelService: PdmModelService,private pdmConfigService: PdmConfigService) {
        this.searchTimePeriod.to = new Date().getTime();
        let fromDate = new Date();
        // fromDate.setDate(fromDate.getDate()-1);
        fromDate.setHours(fromDate.getHours()-3);
        this.searchTimePeriod.from = fromDate.getTime();

        this.searchTimePeriod2.from = fromDate.getTime();
        this.searchTimePeriod2.to = new Date().getTime();
    }

    ngOnInit() {
       
    }

    drawChart(){
        let fabId = this.tree.selectedFab.fabId;
        let node = this.tree.getSelectedNodes();
        let parameters = [];
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if(element.nodeType=='parameter'){
                parameters.push(element);
            }
            
        }
        this.paramDatas =[];
        this.total = parameters.length;
        this.percentage =0;
        this.current = 0;
        for(let i=0;i<parameters.length;i++){
            this.showProgress = true;
            try{
                this.pdmModelService.getTraceDataByParamId(fabId,parameters[i].paramId,this.searchTimePeriod.from,this.searchTimePeriod.to).then((datas)=>{
                    console.log(datas);
                    if(datas.length>0){
                        let paramInfo = {name:parameters[i].paramName,paramId:parameters[i].paramId,datas:[datas]};
                        this.paramDatas.push(paramInfo);
                    }

                    this.current++;
                    this.percentage = this.current/this.total*100;
                    this.percentage = this.percentage.toFixed(0);
                    if(this.percentage>=100){
                        this.showProgress = false;
                    }
    
                }).catch((err)=>{
                    this.current++;
                    this.percentage = this.current/this.total*100;
                    this.percentage= this.percentage.toFixed(0);
                    if(this.percentage>=100){
                        this.showProgress = false;
                    }
                    console.error(err);
                })
            }catch(e){
                console.log(e)
            }
            
        }
        
    }
    drawEvent(){
        let fabId = this.tree.selectedFab.fabId;
        let paramId = this.modelChart.getParamId();
        let conditionValue = this.modelChart.getConditionValue();
        this.pdmModelService.getTraceDataEventSimulation(fabId,paramId,this.searchTimePeriod.from,this.searchTimePeriod.to,conditionValue).then((datas)=>{
            this.eventLines = datas;
        })
        .catch((e)=>{
            console.log(e);
        })
    }
    fromToChange(data: any) {
        this.searchTimePeriod = data;
    }
    fromToChange2(data: any) {
        this.searchTimePeriod2 = data;
    }
  
    AdHocSummary(){
        let conditionValue = this.modelChart.getConditionValue();
        let fabId = this.tree2.selectedFab.fabId;
        let conditionParamId = this.modelChart.getConditionParamId();
        let node = this.tree2.getSelectedNodes();
        let parameters = [];
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if(element.nodeType=='parameter'){
                parameters.push(element);
            }
            
        }
        let adHocFunctions =[];
        for(let i=0;i<this.aggregations.length;i++){
            if(this.aggregations[i].checked){
                adHocFunctions.push(this.aggregations[i].f);
            }
        }

        for(let i=0;i<parameters.length;i++){
            this.pdmModelService.getTraceDataEventSimulationByConditionValue(fabId,this.paramDatas[i].paramId,
                this.searchTimePeriod2.from,this.searchTimePeriod2.to,conditionParamId, conditionValue,adHocFunctions,this.aggregationTime,this.eventType).subscribe((datas)=>{
                    let keys = Object.keys(datas);
                    for(let i=0;i<keys.length;i++){
                        this.simulation_params.push({name:parameters[i].name,adHoc:keys[i],datas:[datas[keys[i]]]});
                    }
                    
                    
                })
        }
        
    }
 
}