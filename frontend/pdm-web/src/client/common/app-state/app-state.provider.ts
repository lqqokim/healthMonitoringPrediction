import { provideStore } from '@ngrx/store';

import { CurrentReducer } from './current/current.reducer';
import { CurrentAction } from './current/current.action';
import { CommunicationReducer } from './communication/communication.reducer';
import { CommunicationAction } from './communication/communication.action';
import { SidebarReducer } from './sidebar/sidebar.reducer';
import { SidebarAction } from './sidebar/sidebar.action';
import { FilterReducer } from './filter/filter.reducer';
import { FilterAction } from './filter/filter.action';
import { DashboardReducer } from './dashboard/dashboard.reducer';
import { DashboardAction } from './dashboard/dashboard.action';
import { WorkspaceReducer } from './workspace/workspace.reducer';
import { WorkspaceAction } from './workspace/workspace.action';
import { RouterReducer } from './router/router.reducer';
import { RouterAction } from './router/router.action';
import { PropertiesReducer } from './properties/properties.reducer';
import { PropertiesAction } from './properties/properties.action';
import { SyncConditionReducer } from './sync-condition/sync-condition.reducer';
import { SyncConditionAction } from './sync-condition/sync-condition.action';
import { ContextMenuReducer } from './context-menu/context-menu.reducer';
import { ContextMenuAction } from './context-menu/context-menu.action';
import { ModalReducer } from './modal/modal.reducer';
import { ModalAction } from './modal/modal.action';
// import { AppConfigReducer } from './appconfig/appconfig.reducer';
// import { AppConfigAction } from './appconfig/appconfig.action';
import { PushReducer } from './push/push.reducer';
import { PushAction } from './push/push.action';
import { UserReducer } from './user/user.reducer';
import { UserAction } from './user/user.action';
import { PageReducer } from './page/page.reducer';
import { PageAction } from './page/page.action';
import { LinkReducer } from './link/link.reducer';
import { LinkAction } from './link/link.action';

import { ConfigurationReducer } from './configuration/configuration.reducer';
import { ConfigurationAction } from './configuration/configuration.action';

import { AppState } from './app-state.type';
import { StateManager } from './state-manager.service';

const applicationState: AppState = {
    current: CurrentReducer,
    // appconfig: AppConfigReducer,
    configuration: ConfigurationReducer,
    communication: CommunicationReducer,
    syncCondition: SyncConditionReducer,
    contextMenu: ContextMenuReducer,
    modal: ModalReducer,
    properties: PropertiesReducer,
    sidebar: SidebarReducer,
    filter: FilterReducer,
    dashboards: DashboardReducer,
    workspaces: WorkspaceReducer,
    router: RouterReducer,
    push: PushReducer,
    user: UserReducer,
    page: PageReducer,
    link: LinkReducer
};

// set store initState is the saved state like indexedDB or PouchDB
export const APP_STATE_PROVIDERS = (initState?: any) => {
    return [
        CurrentAction,
        // AppConfigAction,
        ConfigurationAction,
        CommunicationAction,
        SyncConditionAction,
        ContextMenuAction,
        ModalAction,
        PropertiesAction,
        SidebarAction,
        FilterAction,
        DashboardAction,
        WorkspaceAction,
        RouterAction,
        PushAction,
        UserAction,
        PageAction,
        LinkAction,

        StateManager,

        ...provideStore(applicationState, initState)
    ]
}