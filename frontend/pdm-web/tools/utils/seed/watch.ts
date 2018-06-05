import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';
import * as runSequence from 'run-sequence';
import * as path from 'path';

import Config from '../../config';
import { changeFileManager } from './code_change_tools';
import { notifyLiveReload } from '../../utils';

const plugins = <any>gulpLoadPlugins();

/**
 * Watches the task with the given taskname.
 * @param {string} taskname - The name of the task.
 * 
 * watch excluding assets folder 
 * by ysyun 
 */
export function watch(taskname: string, isExcludePlugin: boolean = false) {
    return function () {
        let paths: string[];

        if (!isExcludePlugin) {
            paths = [
                join(Config.APP_SRC, 'common', '**'),
                join(Config.APP_SRC, 'plugins', '**'),
                join(Config.APP_SRC, 'portal', '**'),
                join(Config.APP_SRC, 'sdk', '**'),
                join(Config.APP_SRC, 'index.ts'),
                join(Config.APP_SRC, 'portal.ts'),
                join(Config.APP_SRC, 'common.ts'),
                join(Config.APP_SRC, 'sdk.ts')
            ].concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));
            console.log('--- Including plugins folder about watching files');
        } else {
            paths = [
                join(Config.APP_SRC, 'common', '**'),
                join(Config.APP_SRC, 'portal', '**'),
                join(Config.APP_SRC, 'sdk', '**'),
                join(Config.APP_SRC, 'index.ts'),
                join(Config.APP_SRC, 'portal.ts'),
                join(Config.APP_SRC, 'common.ts'),
                join(Config.APP_SRC, 'sdk.ts')
            ].concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));
            console.log('--- Excluding plugins folder about watching files');
        }

        plugins.watch(paths, (e: any) => {
            changeFileManager.addFile(e.path);


            // Resolves issue in IntelliJ and other IDEs/text editors which
            // save multiple files at once.
            // https://github.com/mgechev/angular-seed/issues/1615 for more details.
            setTimeout(() => {

                runSequence(taskname, () => {
                    changeFileManager.clear();
                    notifyLiveReload(e);
                });

            }, 100);
        });
    };
}

export function watchPlugin(pluginType: string, pluginName: string) {
    return function () {
        let paths: string[] = [
            join(Config.APP_SRC, 'plugins', pluginType, pluginName, '**')
        ].concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));

        plugins.watch(paths, (e: any) => {
            changeFileManager.addFile(e.path);


            // Resolves issue in IntelliJ and other IDEs/text editors which
            // save multiple files at once.
            // https://github.com/mgechev/angular-seed/issues/1615 for more details.
            setTimeout(() => {

                runSequence('build.plugin', () => {
                    changeFileManager.clear();
                    notifyLiveReload(e);
                });

            }, 100);
        });
    };
}

export function watchFiles(watchConfig: any) {

    return function () {
        let paths: string[] = [];
        // 권장사항: tools/config/watch.config.json
        let targetInfos = require(path.join(process.cwd(), watchConfig));
        console.log(' -- watch target');
        targetInfos.forEach((watchPath: string) => {
            if (watchPath.indexOf('.ts') > 0 || watchPath.indexOf('.css') > 0 || watchPath.indexOf('.html') > 0) {
                // file level
                console.log(' >', join(Config.APP_SRC, watchPath));
                paths.push(join(Config.APP_SRC, watchPath));
            } else {
                // folder level
                console.log(' >', join(Config.APP_SRC, watchPath, '**'));
                paths.push(join(Config.APP_SRC, watchPath, '**'));
            }
        });
        paths.concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));

        plugins.watch(paths, (e: any) => {
            changeFileManager.addFile(e.path);
            // Resolves issue in IntelliJ and other IDEs/text editors which
            // save multiple files at once.
            // https://github.com/mgechev/angular-seed/issues/1615 for more details.
            setTimeout(() => {

                runSequence('build.plugin', () => {
                    changeFileManager.clear();
                    notifyLiveReload(e);
                });

            }, 100);
        });
    };
}

export function watchPath(watchPath: string) {
    return function () {
        let paths: string[] = [];
        let watchPaths = watchPath.split(':');
        watchPaths.forEach((watchPath: string) => {
            if (watchPath.indexOf('.ts') > 0 || watchPath.indexOf('.css') > 0 || watchPath.indexOf('.html') > 0) {
                // file level
                console.log(' >', join(Config.APP_SRC, watchPath));
                paths.push(join(Config.APP_SRC, watchPath));
            } else {
                // folder level
                console.log(' >', join(Config.APP_SRC, watchPath, '**'));
                paths.push(join(Config.APP_SRC, watchPath, '**'));
            }
        });
        paths.concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));

        plugins.watch(paths, (e: any) => {
            changeFileManager.addFile(e.path);


            // Resolves issue in IntelliJ and other IDEs/text editors which
            // save multiple files at once.
            // https://github.com/mgechev/angular-seed/issues/1615 for more details.
            setTimeout(() => {

                runSequence('build.plugin', () => {
                    changeFileManager.clear();
                    notifyLiveReload(e);
                });

            }, 100);
        });
    };
}
