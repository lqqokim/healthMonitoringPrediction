export interface WorkspaceModel {
    workspaceId: number;
    taskers: TaskerModel[];
}

export interface TaskerModel {
    title: string;
    taskerId: number;
    workspaceId: number;
    taskerTypeId: number;
    taskerType: string;
    selected: boolean;
    selectedItems: any[];
    conditions: any[];
    originConditions: any[];
    filters?: any;    
}
