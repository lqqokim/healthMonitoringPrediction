import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { PdmModelService } from '../../../common/model/app/pdm/pdm-model.service';

@Component({
    moduleId: module.id,
    selector: 'filter-conditon',
    templateUrl: 'filter-condition.component.html',
    styleUrls: ['filter-condition.component.css'],
    providers: [PdmModelService]
})

export class FilterConditionComponent implements OnInit {
    @Output() searchEmit: EventEmitter<any> = new EventEmitter();

    searchTimePeriod = {
        from: null,
        to: null
    }
    periods = [
        { name: '5 Minutes', value: 5 * 60 * 1000 },
        { name: '10 Minutes', value: 10 * 60 * 1000 },
        { name: '1 Hour', value: 60 * 60 * 1000 },
        { name: '1 Day', value: 24 * 60 * 60 * 1000 },
    ]
    selectedPeriod = 5 * 60 * 1000;

    fabs: any = [{ fabId: '', fabName: '' }];
    selectedFab = { fabId: '', fabName: '' };

    areas: Array<any> = [];
    selectedAreaIds: any;
    selectedAreaDatas: any = [];

    eqps: Array<any> = [];
    selectedEqpIds: any;
    selectedEqpDatas: any = [];

    parameters: Array<any> = [];
    selectedParameters: any;
    selectedParameterDatas: any = [];

    categoricalVals: Array<any> = [];
    selectedCategoricalDatas: any[] = [];

    continuousVals: Array<any> = [];
    selectedContinuousDatas: any[] = [];

    isEquipment: boolean = false;
    isBarcode: boolean = false;

    widgetType: string;

    constructor(private pdmModelService: PdmModelService) { }

    ngOnInit() {
        this.getFabs();
        this.searchTimePeriod.to = new Date().getTime();
        this.searchTimePeriod.from = this.searchTimePeriod.to - this.selectedPeriod;
    }

    dateSetting() {
        let tDate = new Date().getTime();
        this.searchTimePeriod.from = tDate;
        this.searchTimePeriod.to = tDate;
    }

    getFabs(): void {
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.fabs = plants;
                this.selectedFab = this.fabs[0];
                this.getAreas();
            }).catch((error: any) => {

            });
    }

    getAreas() {
        this.pdmModelService.getAllArea(this.selectedFab.fabId)
            .then((areas) => {
                this.areas = areas;
                // for(let i=0; i<this.areas.length; i++){
                //     this.selectedAreaDatas[i]['checked'] = false;
                // }                              
            }).catch((error: any) => {

            });
    }

    getEqps() {
        this.pdmModelService.getEqpsByAreaIds(this.selectedFab.fabId, this.selectedAreaIds)
            .then((eqps) => {
                this.eqps = eqps;
            }).catch((error: any) => {

            });
    }

    getParameters() {
        let paramDatas: any = [];
        this.pdmModelService.getParamNameByEqpIds(this.selectedFab.fabId, this.selectedEqpIds)
            .then((parameters) => {
                paramDatas = parameters;
                for (let i = 0; i < paramDatas.length; i++) {
                    this.parameters.push({ 'paramName': paramDatas[i] });
                }
            }).catch((error: any) => {

            });
    }

    getCategoricalVals() {

    }

    getContinuousVals() {

    }

    fromToChange(data: any) {
        this.searchTimePeriod = data;
    }

    changeSelectedPeriod(e: any) {
        this.searchTimePeriod.from = this.searchTimePeriod.to - this.selectedPeriod;
    }

    changeSelectedFab(e: any) {
        this.getAreas();
    }

    onChangeArea(e: any) {
        this.selectedAreaIds = [];
        for (let i = 0; i < e.length; i++) {
            this.selectedAreaIds.push(e[i].areaId);
        }
        if (this.selectedAreaIds.length > 0) {
            this.getEqps();
        } else {
            this.eqps = [];
        }
    }

    onChangeEqp(e: any) {
        this.selectedEqpIds = [];
        for (let i = 0; i < e.length; i++) {
            this.selectedEqpIds.push(e[i].eqpId);
        }
        if (this.selectedEqpIds.length > 0) {
            this.getParameters();
        } else {
            this.parameters = [];
        }
    }

    onChangeParameter(e: any) {
        this.selectedParameters = [];
        for (let i = 0; i < e.length; i++) {
            this.selectedParameters.push(e[i].paramName);
        }
    }

    onChangeCategoricalVal(e: any) {
        console.log('onChangeCategoricalVal', e);
    }

    onChangeContinuousVal(e: any) {
        console.log('onChangeContinuousVal', e);
    }

    onCheckEquipment() {
        console.log('isEquipment => ', this.isEquipment);
    }

    onCheckBarcode() {
        console.log('isBarcode => ', this.isBarcode);
    }

    search() {
        const data = {
            fabId: this.selectedFab.fabId,
            eqpIds: this.selectedEqpIds,
            parameters: this.selectedParameters,
            timePeriod: {
                from: this.searchTimePeriod.from,
                to: this.searchTimePeriod.to
            }
        };

        console.log('Search Data => ', data);
        this.searchEmit.emit(data);
    }

}