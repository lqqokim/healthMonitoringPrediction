export interface DashboardModel {
    title: string;
    home: boolean;
    predefined?: string;
    dashboardOrder: number;
    dashboardId: number;
    userId: string;
    widgets: WidgetModel[];
    currentPage: number;
    page: number;
}

export interface WidgetModel {
    title: string;
    widgetId: number;
    x: number;
    y: number;
    width: number;
    height: number;
    properties: any;
    dashboardId?: number;
    selected?: boolean;
    selectedItems?: any[];
    widgetTypeId?: string;
    createDtts?: any;
    form?: any;
    isDashboardOwner?: boolean;
    isPredefined?: boolean;
    filters?: any;
    page: number;
    stateProperties?: any;
}