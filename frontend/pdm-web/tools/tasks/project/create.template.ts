// import { createPlugin } from '../../utils';

// import Config from '../../config';
import * as gulp from 'gulp';
import { join } from 'path';
import { argv } from 'yargs';
import * as util from 'gulp-util';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import Config from '../../config';

const camelCase = require('camelcase');
const capitalize = require('capitalize');
const plugins = <any>gulpLoadPlugins();

/**
 * Not Used
 */
// export = createPlugin();

export = (done: any) => {
    let name = argv['name'] || 'widget-name';
    let type = argv['type'] || 'widget';
    let dest: string;
    if (type === 'w') {
        type = 'widget';
        dest = join(Config.APP_SRC, Config.BOOTSTRAP_DIR, 'plugins/widgets', name);
    } else if (type === 't') {
        type = 'tasker';
        dest = join(Config.APP_SRC, Config.BOOTSTRAP_DIR, 'plugins/taskers', name);
    }
    console.log('-- create type:', type, ' , file path:', dest);

    Promise.resolve()
        .then(() => {
            gulp.src([
                join(process.cwd(), 'tools/templates', type, '**', '*.ts'),
                join(process.cwd(), 'tools/templates', type, '**', '*.scss'),
                join(process.cwd(), 'tools/templates', type, '**', '*.css'),
                join(process.cwd(), 'tools/templates', type, '**', '*.html')
            ])
                .pipe(plugins.replace('#FILE_NAME#', name))
                .pipe(plugins.replace('#NAME#', capitalize(camelCase(name))))
                .pipe(plugins.rename({ prefix: name + '.' }))
                .pipe(gulp.dest(dest));

            done();
        });
};
