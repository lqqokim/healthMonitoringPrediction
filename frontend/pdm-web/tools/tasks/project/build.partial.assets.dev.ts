import * as gulp from 'gulp';
import { join } from 'path';

import Config from '../../config';

/**
 * Executes the build process, copying the assets located in `src/client` over to the appropriate
 * `dist/dev` directory.
 */
export = () => {
  if (Config.RELOAD_SOURCE.length === 0) {
    console.log('build.partial.assets.dev: RELOAD_SOURCE is empty');
    return;
  }
  let filePath = Config.RELOAD_SOURCE.replace(/\\/g, '/').split(Config.APP_SRC)[1];
  let path = filePath.replace(/(.*)(\/[^\/]+)$/, '$1');
  let src = [Config.APP_SRC+filePath];
  Config.RELOAD_SOURCE = '';

  return gulp.src(src)
    .pipe(gulp.dest(Config.APP_DEST+path));
};
