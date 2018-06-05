import { NgModule } from '@angular/core';

import { A3_CommonModule } from '../../../../../common/common.module';
import { BISTEL_SDKModule } from '../../../../../sdk/sdk.module';

// import { LocationTreeviewComponent } from './location/location.treeview.component';
// import { LocationToolModuleComponent } from './location/location.tool.module.component';
// import { LocationModifyComponent } from './location/location.modify.component';

// import { ToolGroupListComponent } from './tool/tool.group.list.component';
// import { ToolGroupModifyComponent } from './tool/tool.group.modify.component';
// import { ToolModelListComponent } from './tool/tool.model.list.component';
// import { ToolModelModifyComponent } from './tool/tool.model.modify.component';
// import { ToolModelVersionModifyComponent } from './tool/tool.model.ver.modify.component';
// import { ToolModifyComponent } from './tool/tool.modify.component';

// import { ModuleGroupListComponent } from './module/module.group.list.component';
// import { ModuleGroupModifyComponent } from './module/module.group.modify.component';
// import { ModuleModifyComponent } from './module/module.modify.component';
// import { ModuleListComponent } from './module/module.list.component';

// import { InlineToolListComponent } from './inline/inline.tool.list.component';
// import { InlineToolModifyComponent } from './inline/inline.tool.modify.component';
// import { InlineGroupListComponent } from './inline/inline.group.list.component';
// import { InlineGroupModifyComponent } from './inline/inline.group.modify.component';

import { SelectListComponent } from './common/select.list.component';
import { TreeViewComponent } from './common/treeview.component';
import { TreeNodeComponent } from './common/treeview.node.component';

// import { ModuleTypeListComponent } from '../module-type/partial/module-type-list.component';
// import { ModuleTypeModifyComponent } from '../module-type/partial/modal/module-type-modify.component';

import { AuthCommonAppConfigModule } from './../../auth/component/common/common.module';





@NgModule({
    imports: [
        BISTEL_SDKModule,
        A3_CommonModule,
        AuthCommonAppConfigModule
    ],
    declarations: [
        // LocationTreeviewComponent,
        // LocationToolModuleComponent,
        // LocationModifyComponent,

        // ToolGroupListComponent,
        // ToolGroupModifyComponent,
        // ToolModelListComponent,
        // ToolModelModifyComponent,
        // ToolModelVersionModifyComponent,
        // ToolModifyComponent,


        // InlineToolListComponent,
        // InlineToolModifyComponent,
        // InlineGroupListComponent,
        // InlineGroupModifyComponent,

        // ModuleGroupListComponent,
        // ModuleGroupModifyComponent,
        // ModuleModifyComponent,
        // ModuleListComponent,



        SelectListComponent,
        TreeViewComponent,
        TreeNodeComponent,

        // ModuleTypeListComponent,
        // ModuleTypeModifyComponent



    ],
    exports: [
        // LocationTreeviewComponent,
        // LocationToolModuleComponent,
        // LocationModifyComponent,

        // ToolGroupListComponent,
        // ToolGroupModifyComponent,
        // ToolModelListComponent,
        // ToolModelModifyComponent,
        // ToolModelVersionModifyComponent,
        // ToolModifyComponent,

        // InlineToolListComponent,
        // InlineToolModifyComponent,
        // InlineGroupListComponent,
        // InlineGroupModifyComponent,


        // ModuleGroupListComponent,
        // ModuleGroupModifyComponent,
        // ModuleModifyComponent,
        // ModuleListComponent,

        SelectListComponent,
        TreeViewComponent,
        TreeNodeComponent,

        // ModuleTypeListComponent,
        // ModuleTypeModifyComponent


    ],
    // entryComponents: [
    //     LocationToolModuleComponent
    // ]
})
export class ToolsComponentModule {
}
