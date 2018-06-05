import { Injectable } from '@angular/core';
import { FdcModelService } from "../model/app/fdc/fdc-model.service";
import { WqpModelService } from "../model/app/fdc/wqp-model.service";

@Injectable()
export class FdcCommonService {

	constructor(
				private _fdcModel:FdcModelService,
				private _wqpModel:WqpModelService
			) {}

	getColorCodeFDTAItems(itemCode: string){
		let color: string = undefined;
		// TODO
		// let CONDITION: any;
		switch(itemCode) {
			case CD.FAULT :
				color = '#ffc107';
				break;
			case CD.OOC:
				color = '#ff6a9c';
				break;
			case CD.OCAP:
				color = '#4caf50';
				break;
			case CD.FDTA_LOT:
				color = '#98d734';
				break;
			case CD.FDTA_WAFER:
				color = '#66aaff';
				break;
			case CD.FDTA_WAFER_RELIABLE:
				color = '#3f51b5';
				break;
			case CD.FDTA_WAFER_UNRELIABLE:
				color = '#66aaff';
				break;
			case CD.FDTA_LOT_SCORE:
				color = '#ff538d';
				break;
			case CD.FDTA_WAFER_SCORE:
				color = '#795548';
				break;
			case CD.FDTA_WAFER_COUNT:
				color = 'rgba(128,128,128,0.4)';
				break;
		};
		return color;
	};
	
	getAvaliableProducts(products: any[]) {
		let _products: any[] = products;
        return this._wqpModel.getProducts().then( (response: any[]) => {
            let _productKeys: any[] = _.pluck(response, 'productId');
            if (!_.every(_products, (p) => { return _productKeys.indexOf(p.productId) > -1 })) {
                _products = [];
            }
            return Promise.resolve(_products);
        });
	};

	getAvaliableDFDCategories() {
        return _.filter(A3_CODE.DFD.CATEGORY, (item)=> {
			//return true;
			
			if ((A3_CONFIG.DFD.FDC === 'N' && item.code === CD.FAULT)
					|| (A3_CONFIG.DFD.SPC === 'N' && item.code === CD.OOC)) {
				return false;
			} else {
				return true;
			}
			
		});
	};	

    getDfdApiIdentifierMapper(code: string) {
        let apiIdentifier :string;
        switch (code) {
            case CD.FAULT:
                apiIdentifier = 'fdc_oos';
                break;
            case CD.OOC:
                apiIdentifier = 'spc_ooc';
                break;
            case CD.OCAP:
                apiIdentifier = 'spc_ocap';
                break;
            case CD.FDTA_LOT:
                apiIdentifier = 'fdta_l_oos';
                break;
            case CD.FDTA_WAFER:
                apiIdentifier = 'fdta_w_oos';
                break;
            case CD.FDTA_WAFER_RELIABLE:
                apiIdentifier = 'fdta_l_oos_reliable';
                break;
            case CD.FDTA_WAFER_UNRELIABLE:
                apiIdentifier = 'fdta_w_oos_unreliable';
                break;
        }     
        return apiIdentifier;      
    }
}


