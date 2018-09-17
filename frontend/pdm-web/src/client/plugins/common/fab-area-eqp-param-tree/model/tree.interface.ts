export interface Fab {
    fabId: number;
    fabName: string;
}

export interface Eqp {
    eqpId: number;
    eqpName: string;
}

export interface AreaResponse {
    areaId: number;
    areaName: string;
    description: string;
    children: any;
    parentId: number;
    sortOrder: number;

    userName: string;

    // description	null
    // userName	null
    // children[]
    // areaId	5
    // areaName	LAMI
    // parentId	1
    // sortOrder	null
}

export interface EqpsResponse {
    // description	null
    // userName	null
    // offline_yn	N
    // model_name	NEW_TOHS
    // image	null
    // eqpId	82
    // eqpName	TEST2
    // areaId	null
    // sortOrder	null
    // dataType	null
    // dataTypeCd	null
}

export interface NodeType {
    FAB: string,
    AREA: string,
    EQP: string,
    PARAMETER: string,
    PART: string
}