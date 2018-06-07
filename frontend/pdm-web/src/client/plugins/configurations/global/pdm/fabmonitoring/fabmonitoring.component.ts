import { Component, OnInit, ViewChild } from '@angular/core';

import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';

import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater, SpinnerComponent } from '../../../../../sdk';

import { FabInfo } from './component/fab-editor/fabInfo';
import { FabEditorComponent } from './component/fab-editor/fab-editor.component';

// import { CODE_LIST } from './mock-data';

@Component({
    moduleId: module.id,
    selector: 'fabmonitoring',
    templateUrl: './fabmonitoring.html',
    styleUrls: ['./fabmonitoring.css'],
    providers: [PdmConfigService, PdmModelService],
})
export class FabMonitoringComponent implements OnInit {

    @ViewChild('fabMonitoring') fabMonitoring:FabEditorComponent;
    // fabInfo:FabInfo= new FabInfo();
    plants: any=[{fabId:'',fabName:''}];
    selectedFab={fabId:'',fabName:''};
    areas;

    monitorings=[];
    selectedMonitoring:FabInfo=new FabInfo();
    selectedAreaDatas=[];
    simulationStop = true
    // locationNames = ['a','b','c','d','e','f','g','h'];

    constructor(private pdmModelService: PdmModelService) {
       
    }

    ngOnInit() {
       this._getPlants();
    }

    simulationStart(){
        this.simulationStop = !this.fabMonitoring.simulationStart();
    }

    save(){
        const datas =this.fabMonitoring.getDatas();
        console.log(datas);
        if(datas.rawId==null){
            this.pdmModelService.createMonitoring(this.selectedFab.fabId,datas).subscribe(()=>{
                alert("Success!");
                this._getMonitoring();
            });
                
        }else{
            this.pdmModelService.updateMonitoring(this.selectedFab.fabId,datas).subscribe(()=>{
                alert("Success!");
                this._getMonitoring();
            });    
        }
        
    }
    saveas(){
        const datas =this.fabMonitoring.getDatas();
        console.log(datas);
        datas.rawId = null;
        this.pdmModelService.createMonitoring(this.selectedFab.fabId,datas).subscribe(()=>{
            alert("Success!");
            this._getMonitoring();
        });
            
        
    }
    newMonitoring(){
        this.selectedMonitoring = new FabInfo();
    }
    delete(){
        this.pdmModelService.updateMonitoring(this.selectedFab.fabId,this.selectedMonitoring.rawId).subscribe(()=>{
            alert("Success!");
            this._getMonitoring();
        })
    }

    _getPlants(): void {
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.plants = plants;
                this.selectedFab = this.plants[0];
                this._getMonitoring();
                // this._getAreas();
            }).catch((error: any) => {

            });
    }
    _getMonitoring(){
        this.pdmModelService.getMonitoring(this.selectedFab.fabId).subscribe((datas)=>{
            this.simulationStop = true;
            this.monitorings = datas;
        });
    }
    _getAreas(){
        this.pdmModelService.getAllArea(this.selectedFab.fabId)
            .then((areas)=>{
                this.areas = areas;
                        
            }).catch((error: any) => {

            });

    }

    changeSelectedMonitoring(event){

    }
    changeSelectedFab(){
        this._getMonitoring();
    }
    onChangeArea(event){
        console.log(event);
        this.selectedMonitoring.areas= [];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.selectedMonitoring.areas.push(element.areaId);
        }
        this.selectedAreaDatas = event;
    }

}