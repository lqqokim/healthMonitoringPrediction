import { ActionReducer } from '@ngrx/store';
import { CurrentModel } from './current/current.type';
import { DashboardModel } from './dashboard/dashboard.type';
import { WorkspaceModel } from './workspace/workspace.type';
import { RouterModel } from './router/router.type';
import { SidebarModel } from './sidebar/sidebar.type';
import { FilterModel } from './filter/filter.type';
import { CommunicationModel } from './communication/communication.type';
import { SyncConditionModel } from './sync-condition/sync-condition.type';
import { ContextMenuModel } from './context-menu/context-menu.type';
import { ModalModel } from './modal/modal.type';
import { PropertiesModel } from './properties/properties.type';
import { ConfigurationModel } from './configuration/configuration.type';
import { PushModel } from './push/push.type';
import { UserModel } from './user/user.type';
import { PageModel } from './page/page.type';
import { LinkModel } from './link/link.type';

export interface AppState {
    current: ActionReducer<CurrentModel>;
    // appconfig: ActionReducer<AppConfigModel>;
    configuration: ActionReducer<ConfigurationModel>;
    communication: ActionReducer<CommunicationModel>;
    properties: ActionReducer<PropertiesModel>;
    syncCondition: ActionReducer<SyncConditionModel>;
    contextMenu: ActionReducer<ContextMenuModel>;
    modal: ActionReducer<ModalModel>;

    dashboards: ActionReducer<DashboardModel[]>;
    workspaces: ActionReducer<WorkspaceModel[]>;

    sidebar: ActionReducer<SidebarModel>;
    filter: ActionReducer<FilterModel>;
    router: ActionReducer<RouterModel>;
    push: ActionReducer<PushModel>;
    user: ActionReducer<UserModel>;
    page: ActionReducer<PageModel>;
    link: ActionReducer<LinkModel>;
}
