import { Injectable } from '@angular/core';
import { PdmModelService } from '../../../common';

@Injectable()
export class PdmEqpHealthIndexService {
    constructor( private _pdmModel: PdmModelService ) {}
    
    // get Pdm eqp health index
    getListData(params:{
        fabId: string;
        areaId?: number;
        fromDate: number;
        toDate: number;
    }): Promise<any> {
        if( params.areaId === undefined ){
            return this._pdmModel.getPdmEqpHealthIndex(params.fabId, params.fromDate, params.toDate);
        } else {
            return this._pdmModel.getPdmEqpHealthIndexByAreaId(params.fabId, params.areaId, params.fromDate, params.toDate);
        }
    }

    getChartData(params:{
        fabId: string;
        areaId?: number;
        paramId?: number;
        fromDate: number;
        toDate: number;
    }): Promise<any> {
        return this._pdmModel.getEqpHealthTrendChart(params.fabId, params.paramId, params.fromDate, params.toDate);
    }
}