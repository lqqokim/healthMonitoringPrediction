import * as gulp from 'gulp';
import { argv } from 'yargs';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

const INLINE_OPTIONS = {
    base: Config.APP_SRC,
    target: 'es5',
    useRelativePaths: true,
    removeLineBreaks: true
};

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */
export = (done: any) => {
    // type
    let watchType = argv['type'];
    if (watchType === 'w') {
        watchType = 'widgets';
    } else if (watchType === 't') {
        watchType = 'taskers';
    }
    // name
    const watchName = argv['name'];
    // config file path
    const watchConfig = argv['config'];
    // path 
    const watchPath = argv['path'];

    if (watchType && watchName) {
        copy(join('plugins', watchType, watchName));
    } else if (watchConfig) {
        let targetInfos = require(join(process.cwd(), watchConfig));
        targetInfos.forEach((wpath: string) => {
            copy(wpath);
        });
    } else if (watchPath) {
        const watchPaths = watchPath.split(':');
        watchPaths.forEach((wpath: string) => {
            copy(wpath);
        });
    }

    done();
};

function copy(wpath: string) {
    const src = [
        join(Config.APP_SRC, wpath, '**', '*.html'),
        join(Config.APP_SRC, wpath, '**', '*.css'),
        '!' + join(Config.APP_SRC, wpath, '**', '*.json')
    ];
    gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(join(Config.APP_DEST, wpath)))
        .on('error', (e: any) => {
            console.log(e);
        });
}
