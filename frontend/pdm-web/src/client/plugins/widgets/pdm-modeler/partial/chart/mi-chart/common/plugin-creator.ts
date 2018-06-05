/**
 * Created by airnold on 2017. 6. 23..
 */

import { ChartException } from './error/index';
import { DragBase } from './plugin/index';
import { TextLabel } from './plugin/component-plugin/text-label';
import { MultiBrushPlugin } from './plugin/brush/multi-brush-plugin';
import { SpecLinePlugin } from './plugin/component-plugin/spec-line';
import { SplitLinePlugin } from './plugin/split-line/split-line-plugin';


export class PluginCreator {
    plugins: any;

    constructor() {
        this._settingPlugins();
    }

    _settingPlugins() {
        this.plugins = {
            DragBase: DragBase,
            TextLabel: TextLabel,
            MultiBrushPlugin: MultiBrushPlugin,
            SpecLinePlugin: SpecLinePlugin,
            SplitLinePlugin: SplitLinePlugin
        };
    }

    _getPlugin( name: string ): any {
        const plugin: any = this.plugins[name];
        if (!plugin) {
            return null;
        } else {
            return plugin;
        }
    }

    // name: string ,config: any, target: any, pluginConfiguration: any
    pluginFactory(name: string, target: any, pluginConfiguration: any): any {
        const plugin: any = this._getPlugin(name);
        let classInstance: any;
        if (!plugin) {
            throw new ChartException(404, {message: `not found ${name} plugin `});
        }
        classInstance = new plugin(target, pluginConfiguration);
        return classInstance;
    }

}


