import { FdtaAppConfigModule } from './configurations/app/fdc/fdta/fdta-appconfig.module';
import { WqpAppConfigModule } from './configurations/app/fdc/wqp/wqp-appconfig.module';
import { UserListAppConfigModule } from './configurations/app/auth/user/user-list-appconfig.module';
import { GroupListAppConfigModule } from './configurations/app/auth/group/group-list-appconfig.module';
import { RoleListAppConfigModule } from './configurations/app/auth/role/role-list-appconfig.module';
import { LocationAppConfigModule } from './configurations/app/tools/location/location-appconfig.module';
import { ToolGroupAppConfigModule } from './configurations/app/tools/tool-group/tool-group-appconfig.module';
import { ToolModelAppConfigModule } from './configurations/app/tools/tool-model/tool-model-appconfig.module';
import { ToolInlineAppConfigModule } from './configurations/app/tools/tool-inline/tool-inline-appconfig.module';
import { ToolInlineGroupAppConfigModule } from './configurations/app/tools/tool-inline-group/tool-inline-group-appconfig.module';
import { ToolModuleGroupAppConfigModule } from './configurations/app/tools/tool-module-group/tool-module-group-appconfig.module';
import { ToolModuleTypeAppConfigModule } from './configurations/app/tools/module-type/module-type-appconfig.module';
import { MenuFunctionListAppConfigModule } from './configurations/app/auth/menu-function/menu-function-list-appconfig.module';
import { ProfileUserConfigModule } from './configurations/user/profile/profile-userconfig.module';
import { PasswordUserConfigModule } from './configurations/user/password/password-userconfig.module';
import { ParameterCategorizationAppConfigModule } from './configurations/app/tools/parameter-categorization/parameter-categorization-appconfig.module';
import { AreaGlobalConfigModule } from './configurations/global/pdm/area/area-globalconfig.module';
import { EqpGlobalConfigModule } from './configurations/global/pdm/eqp/eqp-globalconfig.module';
import { ParameterGlobalConfigModule } from './configurations/global/pdm/parameter/parameter-globalconfig.module';
import { BearingGlobalConfigModule } from './configurations/global/pdm/bearing/bearing-globalconfig.module';
import { PartGlobalConfigModule } from './configurations/global/pdm/part/part-globalconfig.module';
import { AutoModelingGlobalConfigModule } from './configurations/global/pdm/modeling/auto-modeling-globalconfig.module';
import { JobExecuteConfigModule } from './configurations/global/manual/job-execute/job-execute-config.module';
import { JobHistoryConfigModule } from './configurations/global/manual/job-history/job-history-config.module';
import { MasterInfoModule } from './configurations/global/pdm/master-info/master-info.module';
import { CodeModule } from './configurations/global/pdm/code/code-list.module';
import { CategoryModule } from './configurations/global/pdm/category/category-list.module';

export const getConfigurationClassInfo = (menuId: string): any => {

    switch (menuId) {
        case 'fdcFdta':
            return FdtaAppConfigModule;
        case 'fdcWqp':
            return WqpAppConfigModule;
        case 'userList':
            return UserListAppConfigModule;
        case 'groupList':
            return GroupListAppConfigModule;
        case 'roleList':
            return RoleListAppConfigModule;
        case 'menuFunctionList':
            return MenuFunctionListAppConfigModule;
        case 'location':
            return LocationAppConfigModule;
        case 'toolGroup':
            return ToolGroupAppConfigModule;
        case 'toolModel':
            return ToolModelAppConfigModule;
        case 'inlineTool':
            return ToolInlineAppConfigModule;
        case 'inlineGroup':
            return ToolInlineGroupAppConfigModule;
        case 'moduleGroup':
            return ToolModuleGroupAppConfigModule;
        case 'moduleType':
            return ToolModuleTypeAppConfigModule;
        case 'userProfile':
            return ProfileUserConfigModule;
        case 'userPassword':
            return PasswordUserConfigModule;
        case 'parameterCategory':
            return ParameterCategorizationAppConfigModule;
        case 'pdmArea':
            return AreaGlobalConfigModule;
        case 'pdmEqp':
            return EqpGlobalConfigModule;
        case 'pdmParameter':
            return ParameterGlobalConfigModule;
        case 'pdmBearing':
            return BearingGlobalConfigModule;
        case 'pdmPart':
            return PartGlobalConfigModule;
        case 'pdmAutoModeling':
            return AutoModelingGlobalConfigModule;
        case 'jobExecute':
            return JobExecuteConfigModule;
        case 'jobHistory':
            return JobHistoryConfigModule;
        case 'pdmMasterInfo':
            return MasterInfoModule;
        case 'pdmCategory':
            return CategoryModule;
        case 'pdmCode':
            return CodeModule;
        default:
            // TODO: change Module Empty chart
            return FdtaAppConfigModule;
    }
};
