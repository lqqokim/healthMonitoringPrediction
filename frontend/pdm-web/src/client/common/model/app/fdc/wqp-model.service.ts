import { Injectable } from '@angular/core';
import { ModelCommonService } from "../../model-common.service";


@Injectable()
export class WqpModelService extends ModelCommonService {

	constructor() { super() }

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

	getProducts() {
		return this.GET({
			uriPath: `wqp/products`
		})
	};

}   