import { Injectable } from '@angular/core';
import { ModelCommonService } from '../../../common/model/model-common.service';

@Injectable()
export class #NAME#Service extends ModelCommonService {
    constructor() { super(); }

    // test data
    private _chamberTypes: Array<any> = [
        {id: 'chambertype1', name: 'chamber type 1'},
        {id: 'chambertype2', name: 'chamber type 2'},
        {id: 'chambertype3', name: 'chamber type 3'}
    ];

    getChamberTypes() {
        return new Promise((resolve, reject) => {
            resolve({result: this._chamberTypes});
        });
        //For REST API
        // return this.GET({
		// 	uriPath: `chambertypes`
		// });
    }

}
