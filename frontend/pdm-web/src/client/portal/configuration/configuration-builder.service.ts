import { Injectable, ViewContainerRef, Compiler } from '@angular/core';

import { StateManager } from '../../common';
import { getConfigurationClassInfo } from '../../plugins/configurations';

@Injectable()
export class ConfigurationBuilderService {
    
    constructor(
        private compiler: Compiler,
        private stateManager: StateManager
    ) { }
    
    createConfiguration(application: any, container: ViewContainerRef): any {
        const configModule = getConfigurationClassInfo(application.selectedMenuId );
        if (!configModule.config || typeof configModule.config !== 'function') {
            console.error('A static config() is not in configModule. Please setup static config()');
            return;
        }
        const config = configModule.config();

        return this.compiler
            .compileModuleAndAllComponentsAsync(configModule)
            .then((mod: any): any => {
                const factory = mod.componentFactories.find((comp) =>
                    comp.componentType === config.component
                );
                if (!factory) {
                    console.warn(`${configModule} Factory is null. Please check your appconfig module config.`);
                    return;
                }

                const cmp = container.createComponent(factory);
                return cmp;
            });
    }
}