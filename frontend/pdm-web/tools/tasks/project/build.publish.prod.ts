import * as gulp from 'gulp';
import { join } from 'path';
import { argv } from 'yargs';

import Config from '../../config';
const a3Config = require(join(process.cwd(), 'src/client/assets/config', 'a3-config-runtime.json'));

/**
 * Executes the build process, copying the `dist/prod` directory to the appropriate
 * publish directory.
 */
export = () => {
    let appBase = argv['base'] || a3Config.PROD.APP_BASE;
    let PUBLISH_DEST = join(`${Config.PROJECT_ROOT}/../backend/portal/src/main/webapp/resources`);

    return gulp.src(`${Config.PROD_DEST}/**`)
        .pipe(gulp.dest(PUBLISH_DEST));
};

/**
 // Original Code 
import * as gulp from 'gulp';

import Config from '../../config';

export = () => {
  return gulp.src(`${Config.PROD_DEST}/**`)
    .pipe(gulp.dest(Config.PUBLISH_DEST));
};

 */
