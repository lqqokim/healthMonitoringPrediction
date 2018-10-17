export interface type {
    FAB: string;
    AREA: string;
    EQP: string;
    PARAMETER: string;
    PART: string;
}

export interface Fab {
    fabId: number;
    fabName: string;
}

export interface Area {
    areaId: number;
    areaName: string;
}

export interface InitTree {
    areaId: number;
    areaName: string;
    children: InitTree[];
    parentId: number;
    sortOrder: number;
    userName: string;
    description: string;

    nodeId: number;
    nodeName: string;
    nodeType: string;
    name: string;

    iconClass: string;
    isChecked: boolean;
    isOpen: boolean;
    isChildLoaded?: boolean;
}

export interface MasterAreasResponse {
    areaId: number;
    areaName: string;
    children: MasterAreasResponse[];
    parentId: number;

    sortOrder: number;
    userName: string;
    description: string;
}

export interface MasterEqpResponse {
    eqpId: number;
    eqpName: string;
    areaId: number;
    offline_yn: boolean;
    model_name: string;
    image: string;
    dataType: string;
    dataTypeCd: string;

    sortOrder: number;
    description: string;
    userName: string;
}

export interface TreeEvent {
    treeview: Treeview;
}

export interface Treeview {
    areaId: number;
    areaName: string;
    children: Treeview[];
    iconClass: string;
    isChecked: boolean;
    isChildLoaded: boolean;
    isOpen: boolean;
    name: string;
    nodeId: number;
    nodeName: string;
    nodeType: string;
    parentId: number;

    //EQP
    eqpId?: number;
    eqpName?: string;
    image?: string;
    model_name?: string;
    offline_yn?: boolean;
    dataType?: string;
    dataTypeCd?: string;

    description: string;
    userName: string;
    sortOrder: number;
}

export interface AreaList {
    areas: InitTree[];
    areaList: [MasterAreasResponse];
    fabId: Fab['fabId'];
    areaId: Area['areaId'];
}

export interface EqpList {
    eqps: Treeview[];
    fabId: Fab['fabId'];
    areaId: Area['areaId'];
    areaName: Area['areaName'];
}

// export interface PartList {
// }

// export interface ParameterList {
// }
