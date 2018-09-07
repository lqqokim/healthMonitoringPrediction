export interface EqpResponse {
    area_mst_rawid: number;
    area_name: string;
    data_type_cd: string;
    data_type_name: string;
    description: string;
    image: string;
    model_name: string;
    name: string;
    offline_yn: boolean;
    rawid: number;

    user_name?: string;
}

export interface Model {
    model_name: string;

    area_name?: string;
    area_mst_rawid?: number;
    data_type_cd?: string;
    data_type_name?: string;
    description?: string;
    image?: string;
    name?: string;
    offline_yn?: string;
    rawid?: number;
    user_name?: string;
}

export interface EqpRequest {
    areaId: number;
    dataType: string;
    description: string;
    eqpId: number;
    eqpName: string;
    image: string;
    model_name: string;
    offline_yn: string;
}

export interface FormData {
    areaName: string;
    eqpName: string;
    model_name: string;
    description: string;
    image: string;
    dataType: string;
    offline_yn: boolean;

    copyValue?: string;
}

export interface Eqp {
    eqpId: number;
    eqpName: string;
}

export interface Status {
    CREATE: string;
    MODIFY: string;
    DELETE: string;
    COPY: string;
    OK: string;
}

export interface Row {
    areaId: number;
    areaName: string;
    image: string;
    eqpId: number;
    eqpName: string;
    model_name: string;
    name: string;
    offline_yn: string;

    nodeId: number;
    nodeName: string;
    nodeType: string;
    iconClass: string;
    isChecked: boolean;
    sortOrder: number;
    userName: string;
    children: any[];
    dataType: string;
    dataTypeCd: string;
    description: string;

}

export interface NOTIFY {
    CREATE_SUCCESS: string;
    UPDATE_SUCCESS: string;
    REMOVE_SUCCESS: string;
    REMOVE_ITEM: string;
    ERROR: string;
    DUPLICATE_EQP: string;
}