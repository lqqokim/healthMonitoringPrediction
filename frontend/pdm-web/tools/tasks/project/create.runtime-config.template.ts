// import { createPlugin } from '../../utils';

// import Config from '../../config';
import * as gulp from 'gulp';
import { join } from 'path';
import { argv } from 'yargs';
import * as util from 'gulp-util';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import Config from '../../config';

const plugins = <any>gulpLoadPlugins();
const a3Config = require(join(process.cwd(), 'src/client/assets/config', 'a3-config-runtime.json'));

/**
 * Not Used
 */
// export = createPlugin();

export = (done: any) => {
    // let envMode: string = argv['config-env'] || argv['env-config'] || 'dev';
    // envMode = envMode.toUpperCase();
    let base = argv['base'] || a3Config.PROD.APP_BASE;
    let pdmUrl = argv['pdm'] || a3Config.PDM.URL;
    const dest = join(Config.APP_SRC, 'assets/config');

    Promise.resolve()
        .then(() => {
            gulp.src([
                join(process.cwd(), 'tools/config', 'a3-config-runtime-template.json')
            ])
                .pipe(plugins.replace('#APP_BASE#', base))
                .pipe(plugins.replace('#PDM_URL#', pdmUrl))
                .pipe(plugins.rename({ basename: 'a3-config-runtime', extname: '.json' }))
                .pipe(gulp.dest(dest));

            done();
        });
};
