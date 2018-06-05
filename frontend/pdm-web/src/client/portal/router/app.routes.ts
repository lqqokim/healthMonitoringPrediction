import { Routes } from '@angular/router';

import { LoginComponent } from '../session/login.component';

// import { HomeComponent } from '../home/home.component';
// import { HomeRootComponent } from '../home/home-root.component';

import { DashboardsComponent } from '../dashboard/dashboards.component';
import { DashboardsRootComponent } from '../dashboard/dashboards-root.component';
import { DashboardsGuard } from '../dashboard/dashboards.guard';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';

// import { WorkspacesComponent } from '../workspace/workspaces.component';
import { WorkspacesRootComponent } from '../workspace/workspaces-root.component';
import { WorkspacesGuard } from '../workspace/workspaces.guard';
import { WorkspacesComponent } from '../workspace/workspaces.component';
import { WorkspaceComponent } from '../workspace/workspace/workspace.component';
// import { TaskerComponent } from '../workspace/tasker/tasker-container.component';

// import { AppConfigsRootComponent } from '../configuration/app/appconfigs-root.component';
// import { AppConfigsComponent } from '../configuration/app/appconfigs.component';
// import { AppConfigsGuard } from '../configuration/app/appconfigs.guard';
// import { AppConfigComponent } from '../configuration/app/config/appconfig.component';

import { SessionGuard } from '../session/session.guard';

export const A3PortalRoutes: Routes = [

    {
        path: '',
        redirectTo: '/dashboards',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: LoginComponent,
        canActivate: [SessionGuard]
    },

    // {
    //     path: 'appconfigs/:applicationId',
    //     component: AppConfigsRootComponent,
    //     canActivate: [AppConfigsGuard],
    //     children: [
    //         {
    //             path: '',
    //             component: AppConfigsComponent
    //         },
    //         {
    //             path: 'menus/:menuId',
    //             component: AppConfigComponent
    //         }
    //     ]
    // },

    {
        path: 'dashboards',
        component: DashboardsRootComponent,
        canActivate: [DashboardsGuard],
        children: [
            {
                path: '',
                component: DashboardsComponent
            },
            {
                path: ':dashboardId',
                component: DashboardComponent
            }
        ]
    },

    {
        path: 'workspaces/:workspaceId',
        component: WorkspacesRootComponent,
        canActivate: [WorkspacesGuard],
        children: [
            // {
            //     path: '',
            //     component: WorkspacesComponent,
            // },
            {
                path: 'taskers/:taskerId',
                component: WorkspaceComponent
            }
        ]
    }

];
