import { Injectable } from '@angular/core';
import { PdmModelService } from '../../../common';

@Injectable()
export class PdmAlarmClassSummaryService {
    constructor( private _pdmModel: PdmModelService ) {}
 
    // get alarm class summary
    getListData(params:{
        fabId: string;
        areaId?: number;
        fromDate: number;
        toDate: number;
    }): Promise<any> {
        if( params.areaId === undefined ){
            return this._pdmModel.getAlarmClassificationSummary(params.fabId, params.fromDate, params.toDate);
        } else {
            return this._pdmModel.getAlarmClassificationSummaryByAreaId(params.fabId, params.areaId, params.fromDate, params.toDate);
        }
    }
}
