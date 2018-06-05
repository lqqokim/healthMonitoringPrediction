import { Component, OnInit } from '@angular/core';
import { PdmModelService } from './../../../../../../common/model/app/pdm/pdm-model.service';
import { PdmConfigService } from "../../../pdm/model/pdm-config.service";

@Component({
    moduleId: module.id,
    selector: 'job-history',
    templateUrl: './job-history.html',
    styleUrls: ['./job-history.css'],
    providers: [PdmConfigService]
})
export class JobHistoryComponent implements OnInit {
    plants: any;
    jobTypes: any;
    selectedPlant: any;
    selectedType: any;
    jobHistoryDatas: Array<any>;
    datePeriod: any = {};
    isRerunHide: boolean = true;

    DAY = 1;

    constructor(
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService) {
    }

    ngOnInit() {
        this.getPlants();
        this.setDefaultDate();
        this.getJobType();
    }

    getPlants() {
        this.pdmModelService.getPlants().then((res: any) => {
            this.plants = res;
            this.selectedPlant = this.plants[0];
        });
    }

    setDefaultDate() {
        let currentDt = new Date();
        this.datePeriod = {
            fromDt: currentDt.setDate(currentDt.getDate() - 1),
            toDt: new Date().getTime()
        };

        console.log('setDefaultDate', this.datePeriod);
    }

    getJobType() {
        this.pdmConfigService.getCategory('JOB_TYPE').then((res: any) => {
            this.jobTypes = res.reverse();
            this.jobTypes.unshift('');
            this.selectedType = this.jobTypes[0];

            console.log('jobTypes', this.jobTypes);
        });
    }

    fromToChange(ev: any) {
        this.datePeriod.fromDt = ev.from;
        this.datePeriod.toDt = ev.to;
    }

    clickRerun(ev, row: any) {
        const job_cd = row.dataItem.job;
        console.log('job_cd', job_cd);

        switch(job_cd){
            case 'datapumpbase':
            this.getBaseData();
                break;
            case 'datapump':
            this.getData();
                break;
            case 'createdata':
            this.createData();
                break;
        }
    }

    selectedRow(ev: any) {
    }

    getBaseData() {
        this.pdmConfigService.getDataPumpBase(this.selectedPlant.fabId).then((res: any) => {
            if(res !== undefined && res !== null) {
                console.log('getBaseData', res);
                // alert("Pumpbase data call");
            }
        });
    }

    getData() {
        const date = moment(this.datePeriod.fromDt).format('YYYY-MM-DD');

        this.pdmConfigService.getDataPump(this.selectedPlant.fabId, date, this.DAY).then((res: any) => {
            console.log('getData', res);            
            if(res !== undefined && res !== null) {
                // alert("Pump data call");
            }
        });
    }

    createData() {
        const date = moment(this.datePeriod.fromDt).format('YYYY-MM-DD');

        this.pdmConfigService.createManualData(this.selectedPlant.fabId, date, this.DAY).then((res: any) => {
            console.log('createData', res);            
            if(res !== undefined && res !== null) {
                // alert("Success create manual data");
            }
        });
    }

    search(ev: any) {
        const fromDt = this.datePeriod.fromDt; // Convert timestamp
        const toDt = this.datePeriod.toDt;

        let type;
        if (!this.selectedType) {
            type = ' ';
        } else {
            type = this.selectedType.code;
        }

        console.log(`Search req => fabId: ${this.selectedPlant.fabId}, from: ${fromDt}, toDt: ${toDt}, type: ${type}`);
        this.pdmConfigService.getJobHistory(this.selectedPlant.fabId, fromDt, toDt, type).then((datas: any) => {
            console.log('getJobHistory', datas);
            this.jobHistoryDatas = datas;
            let jobHistoryDatas = [];

            for (let i = 0; i < datas.length; i++) {
                const data = datas[i];
                jobHistoryDatas.push({
                    date: moment(data['job_dtts']).format('YYYY/MM/DD hh'),
                    type: data['job_type_name'],
                    job: data['job_name'],
                    eqpName: data['eqp_name'],
                    status: data['job_status_name'],
                    rerun: data['job_type_name'] === 'Manual'
                });
            }

            this.jobHistoryDatas = jobHistoryDatas;
            console.log('jobHistoryDatas', this.jobHistoryDatas)
        });
    }
}