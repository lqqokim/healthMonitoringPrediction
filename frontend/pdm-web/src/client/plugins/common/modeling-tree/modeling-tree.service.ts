import { analysis_spec } from './../../../common/form/configs/pdm/analysis-spec.cfg';
//Angular
import { Injectable } from '@angular/core';

//MIP
import { ModelCommonService } from '../../../common';

@Injectable()
export class ModelingTreeService extends ModelCommonService {

    constructor() {
        super();
    }

    //Area
    getAreas(fabId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/areas`,
            params: { parentId: 0 }
        });
    }

    getArea(fabId, areaId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/areas/${areaId}`
        });
    }

    updateArea(fabId, area): Promise<any> {
        return this.PUT({
            uriPath: `pdm/fabs/${fabId}/areas`,
            params: area
        });
    }

    deleteArea(fabId, areaId): Promise<any> {
        return this.DELETE({
            uriPath: `pdm/fabs/${fabId}/areas/${areaId}`
        });
    }

    //EQP
    getEqps(fabId, areaId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/areas/${areaId}/eqps`
        });
    }

    getEqp(fabId, areaId, eqpId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/areas/${areaId}/eqps/${eqpId}`
        });
    }

    updateEqp(fabId, areaId, eqp): Promise<any> {
        return this.PUT({
            uriPath: `pdm/fabs/${fabId}/areas/${areaId}/eqps`,
            params: eqp
        });
    }

    deleteEqp(fabId, areaId, eqpId): Promise<any> {
        return this.DELETE({
            uriPath: `pdm/fabs/${fabId}/areas/${areaId}/eqps/${eqpId}`
        });
    }

    //Parameter
    getParams(fabId, eqpId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/params`
        });
    }

    getParam(fabId, eqpId, paramId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/params/${paramId}`
        });
    }

    updateParam(fabId, eqpId, param): Promise<any> {
        return this.PUT({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/params`,
            params: param
        });
    }

    deleteParam(fabId, eqpId, paramId): Promise<any> {
        return this.DELETE({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/params/${paramId}`
        });
    }

    //Bearing
    getBearings(fabId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/bearings`
        });
    }

    updateBearing(fabId, bearing): Promise<any> {
        return this.PUT({
            uriPath: `pdm/fabs/${fabId}/bearings`,
            params: bearing
        });
    }

    deleteBearing(fabId, modelNumber, manufacture): Promise<any> {
        return this.DELETE({
            uriPath: `pdm/fabs/${fabId}/bearings/${modelNumber}/${manufacture}`
        });
    }

    //Part
    getParts(fabId, eqpId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/parts`
        });
    }

    updatePart(fabId, eqpId, part): Promise<any> {
        return this.PUT({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/parts`,
            params: part
        });
    }

    deletePart(fabId, eqpId, partId): Promise<any> {
        return this.DELETE({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/parts/${partId}`
        });
    }

    getPartTypes(fabId, eqpId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/parttypes`
        });
    }

    getSpeedParam(fabId, eqpId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/speedparam`
        });
    }

    //Auto modeling
    // createAutoModeler(fabId, params): Promise<any> {
    //     return this.POST({
    //         uriPath: `pdm/fabs/${fabId}/eqps/${eqpId}/parts/${partId}`,
    //         params: params;            
    //     });
    // }

    getAutoModeler(fabId, fromdate, todate, UnModelOnly, monthRange): Promise<any> {
        return this.POST({
            uriPath: `pdm/fabs/${fabId}/automodeler?fromdate=${fromdate}&todate=${todate}&UnModelOnly=${UnModelOnly}&monthRange=${monthRange}`,
            params: []
        });
    }

    getAutoModelerStatus(fabId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/automodelerstatus`
        });
    }

    //Manual
    getDataPumpBase(fabId): Promise<any> {
        return this.GET({
            uriPath: `pdm/manual/datapumpbase?fabs=${fabId}`
        });
    }

    getDataPump(fabId, startDt, day): Promise<any> {
        return this.GET({
            uriPath: `pdm/manual/datapump?fabs=${fabId}&date=${startDt}&day=${day}`
        });
    }

    createManualData(fabId, startDt, day): Promise<any> {
        return this.POST({
            uriPath: `pdm/manual/summarydata?fabs=${fabId}&date=${startDt}&day=${day}`,
            params: {}
        });
    }

    getCategory(param): Promise<any> {
        return this.GET({
            uriPath: `pdm/category/${param}`
        });
    }

    getJobHistory(fabId, fromDt, toDt, type): Promise<any> {
        return this.GET({
            uriPath: `pdm/manual/jobhst?fab=${fabId}&start=${fromDt}&end=${toDt}&type=${type}`
        });
    }

    //Master
    getTypes() {
        return { FAB: 'fab', AREA: 'area', EQP: 'eqp', PARAMETER: 'parameter', PART: 'part' };
    }

    eqpCopy(fabId, areaId, eqpId, params): Promise<any> {
        return this.POST({
            uriPath: `pdm/fabs/${fabId}/areas/${areaId}/eqps/${eqpId}/eqpCopy`,
            params: params
        });
    }

    //Category
    getAllCategory(fabId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/std/categories`
        });
    }

    createCategory(params): Promise<any> {
        return this.POST({
            uriPath: ``,
            params: []
        });
    }

    updateCategory(params): Promise<any> {
        return this.PUT({
            uriPath: ``,
            params: []
        });
    }

    deleteCategory() {
        return this.DELETE({
            uriPath: ``,
            params: []
        });
    }

    //Code
    getCodes(fabId): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/std/codes`
        });
    }

    createCode(fabId ,params): Promise<any> {
        return this.POST({
            uriPath: `pdm/fabs/${fabId}/std/codes`,
            params: params
        });
    }

    updateCode(fabId, rawId ,params): Promise<any> {
        return this.PUT({
            uriPath: `pdm/fabs/${fabId}/std/codes/rawId/${rawId}`,
            params: params
        });
    }

    deleteCode(fabId, rawId): Promise<any> {
        return this.DELETE({
            uriPath: `pdm/fabs/${fabId}/std/codes/rawId/${rawId}`
        });
    }


    getCodesByCategory(fabId, category): Promise<any> {
        return this.GET({
            uriPath: `pdm/fabs/${fabId}/std/categories/${category}`
        });
    }

    updateCodeOrder(fabId, params): Promise<any> {
        return this.PUT({
            uriPath: `pdm/fabs/${fabId}/std/codes/ordering`,
            params: params
        });
    }
}