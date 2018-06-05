import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { PdmConfigService } from './../../model/pdm-config.service';
import { PdmModelService } from '../../../../../../common';

@Component({
    moduleId: module.id,
    selector: 'auto-modeling',
    templateUrl: './auto-modeling.html',
    styleUrls: ['./auto-modeling.css'],
    providers: [PdmConfigService]
})
export class AutoModelingComponent implements OnInit, OnChanges {

    plants: any;
    isUnModelRange: boolean = true;
    selectedPlant: any;
    monthRange: number = 3;
    datePeriod: any = {};
    params: any;
    fabId: any;
    intervalObj: any;
    autoModelerStatusDatas: any = [];
    errorCount: number;
    startTime;
    estimationTime;

    constructor(
        private pdmModelService: PdmModelService,
        private pdmConfigService: PdmConfigService) {

    }

    ngOnInit() {
        this.getPlants();
        this.setDefaultDate();
    }

    ngOnChanges(changes: SimpleChanges) {

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
            fromDt: currentDt.setDate(currentDt.getDate() - 365),
            toDt: new Date().getTime()
        };

        console.log('setDefaultDate', this.datePeriod);
    }

    fromToChange(ev: any) {
        this.datePeriod.fromDt = ev.from;
        this.datePeriod.toDt = ev.to;
    }

    changeMonthRange(ev: any) {
        this.monthRange = ev;
    }

    sendData(ev: any) {
        this.startTime = new Date().getTime();
        this.getAutoModeler();
    }

    getAutoModeler() {
        const fabId = this.selectedPlant.fabId;
        const fromdate = moment(this.datePeriod.fromDt).format('YYYY-MM-DD');
        const todate = moment(this.datePeriod.toDt).format('YYYY-MM-DD');
        const UnModelOnly = this.isUnModelRange;
        const monthRange = this.monthRange;

        console.log(`request => fabId: ${fabId}, fromDate: ${fromdate}, toDate: ${todate}, UnModelOnly: ${UnModelOnly}, monthRange: ${monthRange}`);
        this.pdmConfigService.getAutoModeler(fabId, fromdate, todate, UnModelOnly, monthRange).then((res: any) => {
            console.log('getAutoModeler', res);
        });

        this.getStatus();
    }

    getStatus() {
        const fabId = this.selectedPlant.fabId;
        this.errorCount = 0;
        
        if (this.intervalObj !== null) {
            clearInterval(this.intervalObj);
        }

        this.intervalObj = setInterval(() => {
            this.pdmConfigService.getAutoModelerStatus(fabId).then((res: any) => {
                console.log('getAutoModelerStatus', res);
                this.autoModelerStatusDatas = [];

                for (let i = 0; i < res.data.length; i++) {
                    let data = JSON.parse(res.data[i]);
                    data.estimate = this.estimate(data.currentCount, data.totalCount);
                    this.autoModelerStatusDatas.push(data);
                }

                this.autoModelerStatusDatas.sort((a, b) => {
                    return a.startTime < b.startTime ? 1 : a.startTime > b.startTime ? -1 : 0;
                });

                console.log('autoModelerStatusDatas', this.autoModelerStatusDatas);

                let isAllFinish = true;

                for (let i = 0; i < this.autoModelerStatusDatas.length; i++) {
                    if (this.autoModelerStatusDatas[i].status !== 'finish') {
                        isAllFinish = false;
                        break;
                    }
                }

                if (isAllFinish) {
                    clearInterval(this.intervalObj);
                }
            }).catch((err) => {
                this.errorCount++;

                if (this.errorCount > 10) {
                    clearInterval(this.intervalObj);
                }
            });
        }, 1000);
    }

    estimate(current, total): string {
        if (current == total) return "";
        if (current == 0) return "";
        let nowTime = new Date().getTime();
        let gap = nowTime - this.startTime;
        let estimationMs = total / current * gap;
        let hour = parseInt((estimationMs / (60 * 60 * 1000)).toString());
        let remain = estimationMs % (60 * 60 * 1000);
        let minute = parseInt((remain / (60 * 1000)).toString());
        remain = remain % (60 * 1000);
        let second = parseInt((remain / 1000).toString());

        console.log('time', hour, minute, second);
        return this.leftPad(hour, 2) + ':' + this.leftPad(minute, 2) + ':' + this.leftPad(second, 2);
    }

    leftPad(number, targetLength): string {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }
}