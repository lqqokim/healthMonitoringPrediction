import { Component, OnInit } from '@angular/core';
import { PdmModelService } from './../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from "../../../pdm/model/pdm-config.service";

@Component({
    moduleId: module.id,
    selector: 'job-execute',
    templateUrl: './job-execute.html',
    styleUrls: ['./job-execute.css'],
    providers: [PdmConfigService]
})
export class JobExecuteComponent implements OnInit {

    plants: any;
    startDt: any;
    day: number = 1;
    selectedPlant = null;

    constructor(
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService) {
    }

    ngOnInit() {
        this.getPlants();
        this.setDate();
    }

    getPlants() {
        this.pdmModelService.getPlants().then((plants: any) => {
            this.plants = plants;
            this.selectedPlant = this.plants[0];
            this.plants.push({ fabId: "All", fabName: "All" });
        });
    }

    setDate() {
        let currentDt = new Date();
        this.startDt = currentDt.setDate(currentDt.getDate() - 1);
    }

    fromChangeDate(ev: any) {
        this.startDt = ev.datetime;
    }

    changeDay(ev: any) {
        console.log('changeDay', ev);
        this.day = ev;
    }

    getBaseData() {
        this.pdmConfigService.getDataPumpBase(this.selectedPlant.fabId).then((res: any) => {
            if (res !== undefined && res !== null) {
                console.log('getBaseData', res);
                // alert("Pumpbase data call");
            }
        });
    }

    getData() {
        const startDt = moment(this.startDt).format('YYYY-MM-DD');
        let fabIds = [this.selectedPlant.fabId];

        if (this.selectedPlant.fabId == "All") {
            fabIds = [];
            for (let i = 0; i < this.plants.length - 1; i++) {
                fabIds.push(this.plants[i].fabId);
            }
        }

        this.pdmConfigService.getDataPump(fabIds, startDt, this.day).then((res: any) => {
            console.log('getData', res);
            if (res !== undefined && res !== null) {
                // alert("Pump data call");
            }

        });

    }

    createData() {
        const startDt = moment(this.startDt).format('YYYY-MM-DD');
        let fabIds = [this.selectedPlant.fabId];

        if (this.selectedPlant.fabId == "All") {
            fabIds = [];
            for (let i = 0; i < this.plants.length - 1; i++) {
                fabIds.push(this.plants[i].fabId);
            }
        }

        this.pdmConfigService.createManualData(fabIds, startDt, this.day).then((res: any) => {
            console.log('createData', res);
            if (res !== undefined && res !== null) {
                // alert("Success create manual data");
            }
        });
    }

    // changeBtnStatus() {
    //     console.log('changeBtnStatus', this.btnType);
    //     if(this.btnType === 'basepump') {
    //          this.isbasePump = true;
    //          this.isPump = false;
    //          this.isCreate = false;
    //     } else if(this.btnType === 'pump') {
    //         this.isbasePump = false;
    //         this.isPump = true;
    //         this.isCreate = false;
    //     } else if(this.btnType === 'create'){
    //         this.isbasePump = false;
    //         this.isPump = false;
    //         this.isCreate = true;
    //     }
    // }
}