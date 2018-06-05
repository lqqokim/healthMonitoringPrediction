import { Injectable, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Compiler } from '@angular/core';

import { ModalModel } from '../../app-state/modal/modal.type';
import { AlertModule } from './templates/alert/alert.module';
import { ApplyModule } from './templates/apply/apply.module';
import { ConfirmModule } from './templates/confirm/confirm.module';
import { ConfirmDeleteModule } from './templates/confirm-delete/confirm-delete.module';
import { ShareUserModule } from './templates/share-user/share-user.module';
import { EditWorkspaceModule } from './templates/edit-workspace/edit-workspace.module';

@Injectable()
export class ModalBehaviorService {
    
    constructor(
        private compiler: Compiler,
    ) {}

    alert(action: ModalModel, container: ViewContainerRef) {
        this._getDynamicModule(AlertModule, action, container);
    }

    confirm(action: ModalModel, container: ViewContainerRef) {
        this._getDynamicModule(ConfirmModule, action, container);
    }

    confirmDelete(action: ModalModel, container: ViewContainerRef) {
        this._getDynamicModule(ConfirmDeleteModule, action, container);
    }

    share(action: ModalModel, container: ViewContainerRef) {
        this._getDynamicModule(ShareUserModule, action, container);
    }

    edit(action: ModalModel, container: ViewContainerRef) {
        this._getDynamicModule(EditWorkspaceModule, action, container);
    }

    applyModule(action: ModalModel, container: ViewContainerRef) {
        this._getDynamicModule(ApplyModule, action, container);
    }

    configuration(action: ModalModel, container: ViewContainerRef) {
        this._getDynamicModule(action.module, action, container);
    }

    private _getDynamicModule(moduleType: any, action: ModalModel, container: ViewContainerRef) {
        this.compiler.compileModuleAndAllComponentsAsync(moduleType).then((mod)=> {
            let config = moduleType.config();
            let factory = mod.componentFactories.find((comp) =>
                comp.componentType === config.component
            );
            let component: ComponentRef<any> = container.createComponent(factory, 0, container.injector);
            let instance: any = component.instance;
            action.requester.setComponent(component);
            instance.setAction(action);
        });
    }
}