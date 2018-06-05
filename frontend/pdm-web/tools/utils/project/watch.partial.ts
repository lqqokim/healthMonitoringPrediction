import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';
import * as runSequence from 'run-sequence';

import Config from '../../config';
import { notifyLiveReload } from '../../utils';

const plugins = <any>gulpLoadPlugins();

/**
 * Watches the task.
 * 
 */

var taskname: string;

export function watchPartial() {
  return function () {
    let paths:string[]=[
      join(Config.APP_SRC, 'assets', '**'),
      join(Config.APP_SRC, 'common', '**'),
      join(Config.APP_SRC, 'plugins', '**'),
      join(Config.APP_SRC, 'portal', '**'),
      join(Config.APP_SRC, 'sdk', '**'),
      join(Config.APP_SRC, 'index.ts'),
      join(Config.APP_SRC, 'portal.ts'),
      join(Config.APP_SRC, 'common.ts'),
      join(Config.APP_SRC, 'sdk.ts')
    ].concat(Config.TEMP_FILES.map((p) => { return '!'+p; }));

    plugins.watch(paths, (e:any) => {
      if (e.path.indexOf('/assets/') > -1) {
        taskname = 'assets';
        Config.RELOAD_SOURCE = e.path;
      } else {
        let matches = e.path.match(/\.([^\.]+)$/);
        if (matches) {
          if (matches[1] === 'ts') {
            runSequence(`build.js.dev`, () => notifyLiveReload(e));
            return;
          } else {
            taskname = 'assets';
          }
          Config.RELOAD_SOURCE = e.path;
        } else {
          Config.RELOAD_SOURCE = '';
          return;
        }
      }

      runSequence(`build.partial.${taskname}.dev`, () => notifyLiveReload(e));
    });
  };
}

