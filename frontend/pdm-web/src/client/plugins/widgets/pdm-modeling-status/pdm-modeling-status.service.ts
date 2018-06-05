import { Injectable } from '@angular/core';

import { PdmCommonService } from '../../../common/service/pdm-common.service';

@Injectable()
export class PdmModelingStatusService {
    constructor( private _pdmService: PdmCommonService ) {}

    getModels(plantId) {
        return this._pdmService.getModels(plantId);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         let data = [{
        //             shopName: '도장>3층 ARP',
        //             eqpId: 15,
        //             eqpName: '1상도 No.1 급기',
        //             createUser: 'ROY',
        //             createDate: 1498522709431,
        //             exists: 'O'
        //         }, {
        //             shopName: '도장>3층 ARP',
        //             eqpId: 63,
        //             eqpName: '2상도 No.2 급기',
        //             createUser: null,
        //             createDate: null,
        //             exists: 'X'
        //         }];
        //         resolve(data);
        //     }, 200);
        // });
    }
    createFeature(from, toDay) {
        return this._pdmService.createFeature(from,toDay);
    }
}
