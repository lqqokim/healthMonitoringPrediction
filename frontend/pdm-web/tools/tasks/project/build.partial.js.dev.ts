import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';

import Config from '../../config';
import { makeTsProject, templateLocals } from '../../utils';

const plugins = <any>gulpLoadPlugins();

const jsonSystemConfig = JSON.stringify(Config.SYSTEM_CONFIG_DEV);

let typedBuildCounter = Config.TYPED_COMPILE_INTERVAL; // Always start with the typed build.

/**
 * Executes the build process, transpiling the TypeScript files (except the spec and e2e-spec files) for the development
 * environment.
 */
export = () => {
  if (Config.RELOAD_SOURCE.length === 0) {
    console.log('build.partial.js.dev: RELOAD_SOURCE config is empty');
    return;
  }
  let filePath = Config.RELOAD_SOURCE.replace(/\\/g, '/').split(Config.APP_SRC)[1];
  let path = filePath.replace(/(.*)(\/[^\/]+)$/, '$1');
  let src = [Config.APP_SRC+filePath];
  Config.RELOAD_SOURCE = '';
  let tsProject: any;
  let typings = gulp.src([
    Config.NPM_BASE + '/wijmo/*.d.ts',
    Config.TOOLS_DIR + '/manual_typings/**/*.d.ts'
  ]);
  // let src = [
  //   join(Config.APP_SRC, '**/*.ts'),
  //   '!' + join(Config.APP_SRC, '**/*.spec.ts'),
  //   '!' + join(Config.APP_SRC, '**/*.e2e-spec.ts'),
  //   '!' + join(Config.APP_SRC, `**/${Config.BOOTSTRAP_FACTORY_PROD_MODULE}.ts`)
  // ];

  let projectFiles = gulp.src(src);
  let result: any;
  let isFullCompile = false;

  // Only do a typed build every X builds, otherwise do a typeless build to speed things up
  tsProject = makeTsProject({
    noEmit: true
  });
  projectFiles = merge(typings, projectFiles);

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

  return result.js
    .pipe(plugins.sourcemaps.write())
// Use for debugging with Webstorm/IntelliJ
// https://github.com/mgechev/angular2-seed/issues/1220
//    .pipe(plugins.sourcemaps.write('.', {
//      includeContent: false,
//      sourceRoot: (file: any) =>
//        relative(file.path, PROJECT_ROOT + '/' + APP_SRC).replace(sep, '/') + '/' + APP_SRC
//    }))
    .pipe(plugins.template(Object.assign(
      templateLocals(), {
        SYSTEM_CONFIG_DEV: jsonSystemConfig
      }
     )))
    .pipe(gulp.dest(Config.APP_DEST+path));
};
