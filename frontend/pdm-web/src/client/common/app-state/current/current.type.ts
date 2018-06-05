export interface CurrentModel {
    actionType: string;
    homeType: string;
    // dashboard
    dashboardId: number;
    currentPage: number;
    widgetId: number;
    // workspace 
    workspaceId: number;
    taskerId: number;
    // application configuration 
    applicationId: any;
    menuId: any;
    isDashboard: () => {};
}