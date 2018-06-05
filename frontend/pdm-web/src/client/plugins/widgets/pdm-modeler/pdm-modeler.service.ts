import { Injectable } from '@angular/core';
import { MapModelService } from '../../../common';
import * as pdmI from './pdm-modeler.interface';
import { Observable } from 'rxjs';
import { PdmModelService } from '../../../common/model/app/pdm/pdm-model.service';
import { ScaleConvert } from './scale-convert';


@Injectable()
export class PdmModelerService {

    constructor(
        private mapModel: MapModelService,
        private pdmModel: PdmModelService
    ) { }

    setSelectedEqp(selectPath: Array<any | string>): string {
        let eqp: string = '';
        for (let i = 0; i < selectPath.length; i++) {
            eqp += this._firstCharUpper(selectPath[i]);
            if (i !== selectPath.length - 1) {
                eqp += '/';
            }
        }
        return eqp;
    }

    eqpModelCheck(): boolean {
        return false;
    }

    _firstCharUpper(value) {
        if (value === undefined || value === '') {
            return value
        }
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    scaleConvert(data: Array<any>): Array<any> {
        const scale = new ScaleConvert();
        scale.setRange(0, 1);

        const displayDatas: Array<any> = data.slice(1, data.length);
        const scaledData: Array<any> = [];
        const timedata: any = data.slice(0, 1)[0];
        scaledData.push({
            name: timedata.name,
            values: timedata.values
        });

        displayDatas.map((displayData: any) => {
            const tempObj: any = {
                name: '',
                values: []
            };
            const temp: Array<any> = [];
            const tempName: string = displayData.name;
            tempObj.name = tempName;
            const tempData: Array<any> = displayData.values.map(Number);
            scale.setDomain(_.min(tempData), _.max(tempData));
            tempData.map((d: any) => {
                temp.push(scale.getScaledValue(+d));
            });
            tempObj.values = temp;
            scaledData.push(tempObj);
        });
        console.log(scaledData);
        return scaledData;
    }

    checkRequestParams(reqObj: any): boolean {
        for (let prop in reqObj) {
            if (reqObj.hasOwnProperty(prop)) {
                if (reqObj[prop] === undefined) {
                    return false;
                }
            }
        }
        return true;
    }

    findIdByNameInArray(original: Array<any>, names: Array<string>): Array<number> {
        const aIds: Array<number> = [];
        for (let i = 0; i < names.length; i++) {
            for (let j = 0; j < original.length; j++) {
                if (names[i] === original[j].name) {
                    aIds.push(original[j].mid);
                    break;
                }
            }
        }
        return aIds;
    }


    getAnalysisAandB(requestParams: pdmI.PcaDataRequestParam): Observable<any> {

        return this.pdmModel.getPdmAnalysis(requestParams);
    }

    getAnalysisData(requestParams: pdmI.AnalysisDataRequestParam): Observable<any> {
        return this.pdmModel.getPdmAnalysisData(requestParams);
    }

    getBuildAndHealthData(requestParams: pdmI.BuildAndHealthDataRequestParam): Observable<any> {
        return this.pdmModel.getBuildAndHealthData(requestParams);
    }

    saveEqp(requestParams: pdmI.SaveEqpRequestParam): Observable<any> {
        return this.pdmModel.saveEqp(requestParams);
    }

    deleteEqp(requestParams: pdmI.DeleteEqpRequestParam): Observable<any> {
        return this.pdmModel.deleteEqp(requestParams);
    }

    getPcaData(requestParams: pdmI.PcaDataRequestParam): Observable<any> {
        return this.pdmModel.getPcaData(requestParams);
    }

    getEqpInfo(plantId, eqpId) {
        return this.pdmModel.getEqpInfo(plantId, eqpId);
    }

    getHealthModel(requestParams: any): Observable<any> {
        return this.pdmModel.getHealthModel(requestParams);
    }

    saveModel(plantId, eqpId, dataId): Observable<any> {
        return this.pdmModel.saveModel(plantId, eqpId, dataId);
    }

    // server chart api start

    getChartAnalysis(requestParams: pdmI.ChartAnalysisRequestParam): Observable<any> {
        return this.pdmModel.getChartAnalysis(requestParams);
    }

    getOutLier(requestParams: pdmI.OutlierRequestParam): Observable<any> {
        return this.pdmModel.getOutLier(requestParams);
    }

    healthIndexChartZoom(requestParams: pdmI.HealthIndexZoomRequestParam): Observable<any> {
        return this.pdmModel.healthIndexZoom(requestParams);
    }

    healthIndexChartByModel(requestParams: pdmI.HealthByDataRequestParam): Observable<any> {
        return this.pdmModel.healthIndexChartByModel(requestParams);
    }
}
