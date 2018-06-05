import { Observable } from 'rxjs/Observable';
import {
	RestfulModelService,
	RestfulOptions,
	RestfulParamsOptions,
	InjectorUtil
} from '../../sdk';

export class ModelCommonService {
	RESTFUL: RestfulModelService;

	constructor() {
		this.RESTFUL = InjectorUtil.getService(RestfulModelService);
	}

	GET(options: RestfulOptions) {
		return this.RESTFUL.GET(options);
	}

	rxGET(options: RestfulOptions): Observable<any> {
		return this.RESTFUL.rxGET(options);
	}

	POST(options: RestfulParamsOptions) {
		return this.RESTFUL.POST(options);
	}

	binaryPOST(options: RestfulParamsOptions) {
		return this.RESTFUL.binaryPOST(options);
	}

	rxPOST(options: RestfulParamsOptions): Observable<any> {
		return this.RESTFUL.rxPOST(options);
	}

	PUT(options: RestfulParamsOptions) {
		return this.RESTFUL.PUT(options);
	}

	rxPUT(options: RestfulParamsOptions): Observable<any> {
		return this.RESTFUL.rxPUT(options);
	}

	DELETE(options: RestfulOptions) {
		return this.RESTFUL.DELETE(options);
	}

	rxDELETE(options: RestfulOptions): Observable<any> {
		return this.RESTFUL.rxDELETE(options);
	}
}
