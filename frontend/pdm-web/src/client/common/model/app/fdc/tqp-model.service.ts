import { Injectable } from '@angular/core';
import { ModelCommonService } from "../../model-common.service";
import { Observable } from 'rxjs/Observable';


@Injectable()
export class TqpModelService extends ModelCommonService {

	constructor() { super() }

	getSampleChart(width,height,count): Observable<any> {
		return this.rxGET({
			uriPath:`tqp/image/width/${width}/height/${height}/count/${count}`,
			params:null
		})

	}
	getProducts(): Observable<any> {
		return this.rxGET({
			uriPath: `tqp/products`
		})
	};

	getOperations(param:Array<any>): Observable<any> {
		return this.rxPOST({
			uriPath: `tqp/operations`,
			params: param
		});
	}


	getWaferScore(param:any): Observable<any> {
		return this.rxPOST({
			uriPath: `tqp/waferscore`,
			params: param
		});
	}

	getSummaryTraceData(param:any): Observable<any> {
		return this.rxPOST({
			uriPath: `tqp/summarytrace` ,
			params: param
		});
	}







	getHitmapData(param:any) {
		return this.POST({
			uriPath: `wqp/heatmapdata`,
			params: param
		});
	}

	getTimeWafer(param:any) {
		return this.POST({
			uriPath: `wqp/timewafer`,
			params: param
		});
	}

	getStepWafer(param:any) {
		return this.POST({
			uriPath: `wqp/stepwafer`,
			params: param
		});
	}

	getProductsIncludeStep() {
		return this.GET({
			uriPath: `wqp/products?includeStep=true`
		});
	}

	setProducts(param:any) {
		return this.POST({
			uriPath: `wqp/products`,
			params: param
		});
	}

	setProductStatus(param:any) {
		return this.PUT({
			uriPath: `wqp/products/${param.productId}?useyn=${param.useYn}`,
			params: null
		});
	}



}
