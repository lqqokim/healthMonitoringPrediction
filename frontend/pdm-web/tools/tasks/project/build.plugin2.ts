import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as util from 'gulp-util';
import { argv } from 'yargs';
import { join/*, sep, relative*/ } from 'path';

import Config from '../../config';
import { makeTsProjectWithKey, templateLocals } from '../../utils';
import { TypeScriptTask } from '../typescript_task';

const plugins = <any>gulpLoadPlugins();
const jsonSystemConfig = JSON.stringify(Config.SYSTEM_CONFIG_DEV);
let typedBuildCounter = Config.TYPED_COMPILE_INTERVAL; // Always start with the typed build.

/**
 * Executes the build process, transpiling the TypeScript files (except the spec and e2e-spec files) for the development
 * environment.
 */
export =
    class BuildJsDev extends TypeScriptTask {
        run(done: any) {

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
                let tsProject = makeTsProject();
                compile(join('plugins', watchType, watchName), tsProject);
            } else if (watchConfig) {
                let idx: number = 0;
                let targetInfos = require(join(process.cwd(), watchConfig));
                targetInfos.forEach((wpath: string) => {
                    compile(wpath, makeTsProject(idx++));
                });
            } else if (watchPath) {
                let idx: number = 0;
                const watchPaths = watchPath.split(':');
                if (watchPath.indexOf(':') > 0 ) {
                    watchPaths.forEach((wpath: string) => {
                        compile(wpath, makeTsProject(idx++));
                    });
                } else {
                    compile(watchPath, makeTsProject());
                }
            }

            done();
        }
    };

function makeTsProject(no: number = 0) {
    let tsProject: any;
    if (typedBuildCounter < Config.TYPED_COMPILE_INTERVAL) {
        // tsProject = makeTsProject({ isolatedModules: true}, join(Config.APP_DEST, 'plugins', pluginName), 'tsconfig.es5.json');
        tsProject = makeTsProjectWithKey(no, { isolatedModules: true });
    } else {
        // tsProject = makeTsProject({}, join(Config.APP_DEST, 'plugins', pluginName), 'tsconfig.es5.json');
        tsProject = makeTsProjectWithKey(no, {});
    }
    return tsProject;
}

function compile(wpath: string, tsProject: any) {
    console.log('-- build watch files');
    console.log(' > wpath:', wpath);
    console.log(' > src:  ', join(Config.APP_SRC, wpath, '**', '*.ts'));
    console.log(' > dest: ', join(Config.APP_DEST, wpath));

    let typings = gulp.src([
        Config.TOOLS_DIR + '/manual_typings/**/*.d.ts'
    ]);
    let src = [
        join(Config.APP_SRC, wpath, '**', '*.ts'),
        '!' + join(Config.APP_SRC, '**/*.spec.ts'),
        '!' + join(Config.APP_SRC, '**/*.e2e-spec.ts'),
        '!' + join(Config.APP_SRC, `**/${Config.NG_FACTORY_FILE}.ts`)
    ];
    let projectFiles = gulp.src(src);
    let result: any;

    // Only do a typed build every X builds, otherwise do a typeless build to speed things up
    let isFullCompile = true;
    if (typedBuildCounter < Config.TYPED_COMPILE_INTERVAL) {
        isFullCompile = false;
        projectFiles = projectFiles.pipe(plugins.cached());
        util.log('Performing typeless TypeScript compile.');
    } else {
        projectFiles = merge(typings, projectFiles);
    }

    result = projectFiles
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject())
        .on('error', () => {
            typedBuildCounter = Config.TYPED_COMPILE_INTERVAL;
        });

    if (isFullCompile) {
        typedBuildCounter = 0;
    } else {
        typedBuildCounter++;
    }

    // return merge(result, result.js) // result is d.ts, result.js is js
    result.pipe(gulp.dest(join(Config.APP_DEST, wpath)));

    return result.js
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.template(Object.assign(
            templateLocals(), {
                SYSTEM_CONFIG_DEV: jsonSystemConfig
            }
        )))
        .pipe(gulp.dest(join(Config.APP_DEST, wpath)));
}
