import { NgModule, ModuleWithProviders } from '@angular/core';

import { BISTEL_SDKModule } from '../sdk';

import { APP_STATE_PROVIDERS } from './app-state/app-state.provider';
import { ConditionService } from './condition/service/condition.service';
import { MccCommonService } from './service/mcc-common.service';
import { PlatformModelService } from './model/platform/platform-model.service';
import { MccModelService } from './model/app/mcc/mcc-model.service';
import { AppModelService } from './model/app/common/app-model.service';
import { FdcModelService } from './model/app/fdc/fdc-model.service';
import { WqpModelService } from './model/app/fdc/wqp-model.service';
import { TqpModelService } from './model/app/fdc/tqp-model.service';
import { PdmModelService } from './model/app/pdm/pdm-model.service';
import { UserModelService } from './model/app/auth/user-model.service';
import { ToolModelService } from './model/app/tool/tool-model.service';
import { ConfigModelService } from './model/platform/config-model.service';
import { DashboardModelService } from './model/platform/dashboard-model.service';
import { MapModelService } from './model/platform/map-model.service';
import { WorkspaceModelService } from './model/platform/workspace-model.service';
import { AppCommonService } from './service/app-common.service';
import { FdcCommonService } from './service/fdc-common.service';
import { PdmCommonService } from './service/pdm-common.service';

import { SessionService } from './session/session.service';
import { ConfigurationService } from './configuration/configuration.service';

import { WidgetBodyComponent } from './widget/widget-body.component';
import { WidgetHeaderComponent } from './widget/widget-header.component';
import { ContextMenuModule } from './popup/context-menu/context-menu.module';
import { ModalModule } from './popup/modal/modal.module';
import { WidgetConfigurationInfoComponent } from './widget/config-info/widget-configuration-info.component';

import { ModalApplier } from './popup/modal/templates/apply/modal-applier';
import { ScrollEventService } from './utils/scroll-event.service';
import { ValidationService } from './utils/validation.service';
import { PipesModule } from '../sdk/pipes/pipes.module';

import { NgTree } from 'ng.tree';


@NgModule({
	imports: [
		BISTEL_SDKModule,
		ContextMenuModule,
		ModalModule
	],
	declarations: [
		WidgetBodyComponent,
		WidgetHeaderComponent,
		WidgetConfigurationInfoComponent,
		NgTree
	],
	exports: [
		WidgetBodyComponent,
		WidgetHeaderComponent,
        WidgetConfigurationInfoComponent,
		ContextMenuModule,
		ModalModule,
		NgTree
	]
})
export class A3_CommonModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: A3_CommonModule,
			providers: [
				SessionService,
				ConfigurationService,
				ConditionService,
				AppModelService,
				FdcModelService,
				WqpModelService,
				TqpModelService,
				MccModelService,
				PdmModelService,
				ConfigModelService,
				DashboardModelService,
				MapModelService,
				PlatformModelService,
				WorkspaceModelService,
				AppCommonService,
				FdcCommonService,
				PdmCommonService,
				MccCommonService,
				UserModelService,
				ToolModelService,
				ModalApplier,
				ScrollEventService,
				ValidationService,

				...ModalModule.forProviders(),
				...APP_STATE_PROVIDERS()
			]
		}
	}
}
