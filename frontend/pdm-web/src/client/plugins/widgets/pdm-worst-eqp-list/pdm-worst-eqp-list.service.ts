import { Injectable } from '@angular/core';
import { PdmModelService } from '../../../common';

@Injectable()
export class PdmWostEqpListService {
    constructor( private _pdmModel: PdmModelService ) {}
    
    // get worst equipment list
    getListData(params:{
        fabId: string;
        areaId: string;
        fromDate: number;
        toDate: number;
    }): Promise<any> {
        return this._pdmModel.getAlarmClassificationSummary(params.fabId, params.areaId, {
            fromDate: params.fromDate,
            toDate: params.toDate
        });
    }
}
