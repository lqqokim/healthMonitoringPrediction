import { Injectable } from '@angular/core';
import { PdmModelService } from '../../../common';
import { AsyncAction } from '../../../../../node_modules/rxjs/scheduler/AsyncAction';

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
        logicType: string;          // Logic1 ~ 4 (1.Standard, 2.SPC, 3.Variation, 4.RUL)
        fabId: string;
        areaId?: number;
        logicParamId: number;
        fromDate: number;
        toDate: number;
        resultCallback: Function;
        errorCallback?: Function;
    }): void {
        params.errorCallback = ( typeof params.errorCallback !== 'function' ) ? ()=>{} : params.errorCallback;

        // 에러 관련 처리 함수
        const errorFunc = (err: any)=>{
            console.log( err );
            params.errorCallback( err );
        };

        // 1.Standard
        if( params.logicType === 'logic1' ){
            this._pdmModel.getEqpHealthTrendChart( params.fabId, params.logicParamId, params.fromDate, params.toDate ).then((res: any)=>{
                params.resultCallback(res);
            }, errorFunc);
        }

        // 2.SPC (api 변경 필요)
        else if( params.logicType === 'logic2' ){
            this._pdmModel.getEqpHealthTrendChartWithSPC( params.fabId, params.logicParamId, params.fromDate, params.toDate ).then((res: any)=>{
                params.resultCallback(res);
            }, errorFunc);
        }

        // 3.Variation
        else if( params.logicType === 'logic3' ){
            this._pdmModel.getEqpHealthTrendChartWithAVG( params.fabId, params.logicParamId, params.fromDate, params.toDate ).then((res: any)=>{
                params.resultCallback(res);
            }, errorFunc);
        }

        // 4.RUL (api 변경 필요)
        else if( params.logicType === 'logic4' ){
            this._pdmModel.getEqpHealthTrendChartWithRUL( params.fabId, params.logicParamId, params.fromDate, params.toDate ).then((res: any)=>{
                params.resultCallback(res);
            }, errorFunc);
        }
    }
}