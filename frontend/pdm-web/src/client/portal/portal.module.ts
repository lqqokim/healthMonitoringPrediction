import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { COMPILER_PROVIDERS } from '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';

import { BISTEL_SDKModule } from '../sdk';
import { A3_CommonModule } from '../common';

/**
 * Dashboard
 */
import { DashboardsRootComponent } from './dashboard/dashboards-root.component';
import { DashboardsComponent } from './dashboard/dashboards.component';
import { DashboardsGuard } from './dashboard/dashboards.guard';
import { DashboardsService } from './dashboard/dashboards.service';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DashboardGridComponent } from './dashboard/dashboard/grid/dashboard-grid.component';
import { DashboardGridService } from './dashboard/dashboard/grid/dashboard-grid.service';
import { DashboardGridConfigService } from './dashboard/dashboard/grid/dashboard-grid-config.service';
import { WidgetContainerComponent } from './dashboard/widget/widget-container.component';
import { WidgetConfigurationContainerComponent } from './dashboard/widget/config/widget-configuration-container.component';
import { WidgetTitleComponent } from './dashboard/widget/title/widget-title.component';
import { WidgetContaierTitleComponent } from './dashboard/widget/title/widget-container-title.component';
import { WidgetConfigurationTitleComponent } from './dashboard/widget/title/widget-configuration-title.component';
import { WidgetContainerService } from './dashboard/widget/widget-container.service';

/**
 * Home
 */
// import { HomeRootComponent } from './home/home-root.component';
// import { HomeComponent } from './home/home.component';

/**
 * Navigation
 */
import { NavigationTitleComponent } from './navigation/navigation-title.component';
import { NavigationComponent } from './navigation/navigation.component';

/**
 * Router
 */
import { RouterService } from './router/router.service';

/**
 * Session
 */
import { UserCircleComponent } from './session/user-circle.component';
import { LoginComponent } from './session/login.component';
import { SessionGuard } from './session/session.guard';

/**
 * Sidebar
 */
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarService } from './sidebar/sidebar.service';
import { TaskerListService } from './sidebar/tasker-list/tasker-list.service';

/**
 * Widget Filter
 */
import { FilterContainerComponent } from './filter/filter-container.component';

/**
 * Workspace
 */
import { WorkspacesRootComponent } from './workspace/workspaces-root.component';
import { WorkspacesComponent } from './workspace/workspaces.component';
import { WorkspaceComponent } from './workspace/workspace/workspace.component';
// import { TaskerComponent } from './workspace/tasker/tasker.component';

import { WorkspaceService } from './workspace/workspace.service';
import { WorkspacesGuard } from './workspace/workspaces.guard';
import { TaskerContainerComponent } from './workspace/tasker/tasker-container.component';
import { TaskerContainerService } from './workspace/tasker/tasker-container.service';

/**
 * Configuration
 */
import { ConfigurationMenuService } from './configuration/configuration-menu.service';
import { ConfigurationBuilderService } from './configuration/configuration-builder.service';
import { ConfigurationBuilderComponent } from './configuration/configuration-builder.component';
import { UserConfigContainerComponent } from './configuration/user/userconfig-container.component';
import { AppConfigContainerComponent } from './configuration/application/appconfig-container.component';
import { GlobalConfigContainerComponent } from './configuration/global/globalconfig-container.component';

/**
 * Portal
 */
import { PortalComponent } from './portal.component';
import { A3PortalRoutes } from './router/app.routes';
import { BehaviorComponent } from './behavior/behavior.component';
import { BehaviorService } from './behavior/behavior.service';
import { PushService } from './push/push.service';

import '../operators';

@NgModule({
    imports: [
        BrowserModule,
        BISTEL_SDKModule,
        BISTEL_SDKModule.forRoot(),

        A3_CommonModule,
        A3_CommonModule.forRoot(),

        RouterModule.forRoot(A3PortalRoutes)
    ],
    declarations: [
        PortalComponent,

        ConfigurationBuilderComponent,UserConfigContainerComponent, AppConfigContainerComponent, GlobalConfigContainerComponent,

        DashboardsRootComponent, DashboardsComponent, DashboardComponent, DashboardGridComponent,
        WidgetContainerComponent, WidgetConfigurationContainerComponent,
        WidgetTitleComponent, WidgetConfigurationTitleComponent, WidgetContaierTitleComponent,

        // HomeComponent,

        NavigationComponent, NavigationTitleComponent,
        LoginComponent, UserCircleComponent,
        SidebarComponent,
        FilterContainerComponent,
		BehaviorComponent,

        WorkspacesRootComponent, WorkspacesComponent, WorkspaceComponent,
        TaskerContainerComponent
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: '<%= APP_BASE %>'
        },

        COMPILER_PROVIDERS,

        SessionGuard,
        // AppConfigsGuard,
        DashboardsGuard,
        WorkspacesGuard,

        DashboardGridService,
        DashboardGridConfigService,

        // AppConfigsService,
        DashboardsService,
        WidgetContainerService,
        TaskerContainerService,
        TaskerListService,
        WorkspaceService,
        RouterService,
		BehaviorService,
        SidebarService,

        PushService,
        ConfigurationMenuService,
        ConfigurationBuilderService
    ],
    entryComponents: [
        WidgetContainerComponent,
        TaskerContainerComponent
    ],
    bootstrap: [ PortalComponent ]
})
export class A3_PortalModule {}

