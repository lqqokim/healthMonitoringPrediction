import { Injectable } from '@angular/core';
import { PdmModelService } from '../../../common';

@Injectable()
export class PdmAlarmHistoryService {
    constructor( private _pdmModel: PdmModelService ) {}
    
    // get worst equipment list
    getListData(params:{
        fabId: string;
        areaId?: number;
        fromDate: number;
        toDate: number;
    }): Promise<any> {
        if( params.areaId === undefined ){
            return this._pdmModel.getAlaramHistory(params.fabId, params.fromDate, params.toDate);
        } else {
            return this._pdmModel.getAlaramHistoryByAreaId(params.fabId, params.areaId, params.fromDate, params.toDate);
        }
    }
}
