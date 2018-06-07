import { AppModelService, ConfigModelService, WqpModelService, PdmModelService } from '../../../common';
import { InjectorUtil } from '../../../sdk';


/*****************************************
 * 
 * Condition을 미리 설정하고 싶을 경우 정의한다. 
 * 
 *****************************************/
export const getPreConditionFromAjax = (cd: string): Promise<PreInitConditionType> => {
    switch (cd) {
        case CD.INLINE_GROUP:
            return _setInlineGroup(cd);
        case CD.INLINE_TOOL:
            return _setInlineTool(cd);
        case CD.LOCATION:
            return _setLocation(cd);
        case CD.PRODUCTS:
            return _setProduct(cd);
        case CD.PLANT:
            return _setPlant(cd);
        case CD.CUTOFF_TYPE_DAY:
            return _setCutoffTypeDay(cd);
        case CD.DAY_PERIOD_30:
            return _setDayPeriod30(cd);
        case CD.TIME_PERIOD_30:
            return _setTimePeriod30(cd);
        // case CD.RADAR_TYPE:
        //     return _setRadarType(cd);
        case CD.WORST_TOP:
            return _setWorstTop(cd);
        case CD.ANALYSIS_SPEC:
            return _setAnalysisSpec(cd);
        case CD.ANALYSIS_SPEC_VISIBLE:
            return _setAnalysisSpecVisible(cd);
        case CD.MONITORING:
            return _setMonitoring(cd);
        default:
            return _setDefault(cd);
    }
};

export interface PreInitConditionType {
    condition: string;
    data: any;
}


/*****************************************
 * 
 * Condition을 조회하는 내부 펑션들 
 * 
 *****************************************/
function _setInlineGroup(cd: string): Promise<PreInitConditionType> {
    // InjectorUtil 사용해 필요한 서비스를 주입받는다. 
    // 해당 서비스는 RootComponent의 Injector에 등록되어 있어야 한다. 
    let commonAppModel = InjectorUtil.getService(AppModelService);

    return commonAppModel
        .getInlineGroups()
        .then((response: Array<any>) => {
            // PreInitConditionType
            return {
                condition: cd,
                data: response[0]
            };
        }, (err: Error) => {
            console.log(`${cd} Condition pre init in setInlineGroup:`, err);
        });
}

function _setInlineTool(cd: string): Promise<PreInitConditionType> {
    // InjectorUtil 사용해 필요한 서비스를 주입받는다. 
    // 해당 서비스는 RootComponent의 Injector에 등록되어 있어야 한다. 
    let commonAppModel = InjectorUtil.getService(AppModelService);

    return commonAppModel
        .getInlineTools()
        .then((response: Array<any>) => {
            // PreInitConditionType
            return {
                condition: cd,
                data: response[0]
            };
        }, (err: Error) => {
            console.log(`${cd} Condition pre init in setInlineGroup:`, err);
        });
}

function _setLocation(cd: string): Promise<PreInitConditionType> {
    let configAppModel = InjectorUtil.getService(ConfigModelService);

    return configAppModel.getLocationTypes().then((locationTypes: any) => {
        return _getlocations('', locationTypes, []).then((response: any) => {
            return {
                condition: cd,
                data: response
            };
        });
    });
}

function _getlocations(parentId: any, locationTypes: any, resultLocation: any): Promise<any> {
    let configAppModel = InjectorUtil.getService(ConfigModelService);

    return configAppModel.getLocations(parentId).then((response: any) => {
        let typeObj: any = locationTypes[resultLocation.length],
            tempData = {
                locationId: undefined,
                locationLevel: typeObj.locationLevel,
                locationName: undefined,
                locationTypeId: typeObj.locationTypeId,
                locationTypeName: typeObj.name.toLowerCase()
            };

        if (response && response.length > 0) {
            parentId = response[0].locationId;

            tempData.locationId = parentId;
            tempData.locationName = response[0].name;
        }

        resultLocation.push(tempData);

        if (resultLocation.length === locationTypes.length) {
            return resultLocation;
        }

        return _getlocations(parentId, locationTypes, resultLocation);
    });
}

function _setProduct(cd: string): Promise<PreInitConditionType> {
    let appModel = InjectorUtil.getService(WqpModelService);

    return appModel.getProducts().then((items) => {
        return {
            condition: cd,
            data: items.length > 0 ? [items[0]] : []
        };
    });
}

function _setPlant(cd: string): Promise<PreInitConditionType> {
    let pdmModel = InjectorUtil.getService(PdmModelService);

    return pdmModel.getPlants().then((items) => {
        return {
            condition: cd,
            data: items.length > 0 ? items[0] : null
        };
    });
}

function _setCutoffTypeDay(cd: string): Promise<PreInitConditionType> {
    return Promise.resolve({
        condition: CD.CUTOFF_TYPE,
        data: 'DAY'
    });
}

function _setDayPeriod30(cd: string): Promise<PreInitConditionType> {
    return Promise.resolve({
        condition: CD.DAY_PERIOD,
        data: 30
    });
}

function _setTimePeriod30(cd: string): Promise<PreInitConditionType> {
    let now = Date.now();
    return Promise.resolve({
        condition: CD.TIME_PERIOD,
        data: {
            from: now - 86400000 * 30,
            to: now
        }
    });
}

function _setDefault(cd: string): Promise<PreInitConditionType> {
    console.warn(`There is no the pre init function for the ${cd} condition. Please check it out...`);
    return Promise.resolve({
        condition: 'empty',
        data: `There is no the pre init function for the ${cd} condition. Please check it out...`
    });
}

// function _setRadarType(cd: string): Promise<PreInitConditionType> {

//     return Promise.resolve({
//         condition: CD.RADAR_TYPE,
//         data: { typeId: 'AW', typeName: 'Alarm-Warning' } 
//     });
// }

function _setAnalysisSpec(cd: string): Promise<PreInitConditionType> {
    return Promise.resolve({
        condition: CD.ANALYSIS_SPEC,
        data: 100
    });
}

function _setAnalysisSpecVisible(cd: string): Promise<PreInitConditionType> {
    return Promise.resolve({
        condition: CD.ANALYSIS_SPEC_VISIBLE,
        data: false
    });
}

function _setWorstTop(cd: string): Promise<PreInitConditionType> {
    return Promise.resolve({
        condition: CD.WORST_TOP,
        data: 5
    });
}

function _setMonitoring(cd: string): Promise<PreInitConditionType> {
    let pdmModel = InjectorUtil.getService(PdmModelService);

    return pdmModel.getPlants().then((plants: any[]) => {
        return pdmModel.getMonitoring(plants[0].fabId).toPromise().then((monitorings: any[]) => {
            return {
                condition: cd,
                data: monitorings.length > 0 ? monitorings[0] : null
            };
        });
    });
}