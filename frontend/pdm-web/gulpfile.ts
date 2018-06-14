import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as runSequence from 'run-sequence';
import { argv } from 'yargs';

import Config from './tools/config';
import { loadTasks } from './tools/utils';

loadTasks(Config.SEED_TASKS_DIR);
loadTasks(Config.PROJECT_TASKS_DIR);

// --------------
// Build plugin.
gulp.task('build.plugin', (done: any) =>
  runSequence('clean.plugin2',
              'copy.plugin2',
              'build.plugin2',
              done));

gulp.task('new', (done: any) =>
  runSequence('create.template',
              done));

// --------------
// Build dev.
gulp.task('build.dev', (done: any) =>
  runSequence(//'clean.dev',
//              'tslint',
//              'css-lint',
              'create.runtime-config.template',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.index.dev',
              done));

// --------------
// Build dev watch.
gulp.task('build.dev.watch', (done: any) =>
  runSequence('build.dev',
              'watch.dev',
              done));

// --------------
// Build prod.
gulp.task('build.prod', (done: any) =>
  runSequence('clean.prod',
              // 'tslint',
              // 'css-lint',
              'create.runtime-config.template',
              'build.assets.prod',
              'build.fonts',
              'build.fonts.local',
              'build.html_css',
              'copy.prod',
              'build.js.prod',
              'build.bundles',
              'build.bundles.app',
              //'minify.bundles',
              'build.index.prod',
              done));

// --------------
// Build prod.
gulp.task('build.prod.exp', (done: any) =>
  runSequence('clean.prod',
              // 'tslint',
              // 'css-lint',
              'build.assets.prod',
              'build.fonts',
              'build.fonts.local',
              'build.html_css',
              'copy.prod',
              'compile.ahead.prod',
              'build.js.prod.exp',
              'build.bundles',
              'build.bundles.app.exp',
              'minify.bundles',
              'build.index.prod',
              done));

// --------------
// Publish prod
gulp.task('publish.prod', (done: any) =>
  runSequence('clean.publish',
              'build.prod',
              'build.publish.prod',
              done));

// --------------
// Build test.
gulp.task('build.test', (done: any) =>
  runSequence('clean.once',
              'tslint',
              'build.assets.dev',
              'build.html_css',
              'build.js.dev',
              'build.js.test',
              'build.index.dev',
              done));

// --------------
// Build test watch.
gulp.task('test.watch', (done: any) =>
  runSequence('build.test',
              'watch.test',
              'karma.watch',
              done));

// --------------
// Build tools.
gulp.task('build.tools', (done: any) =>
  runSequence('clean.tools',
              'build.js.tools',
              done));

// --------------
// Docs
// gulp.task('docs', (done: any) =>
//   runSequence('build.docs',
//               'serve.docs',
//               done));

// --------------
// Serve dev
gulp.task('serve.start', (done: any) => 
  runSequence('server.start', done)
);

// --------------
// Serve dev
gulp.task('serve.dev', (done: any) =>
  runSequence('build.dev',
              'server.start',
              // 'watch.partial.dev',
              'watch.dev',
              done));

gulp.task('serve', (done: any) => {
      const config = argv['config-env'] || argv['env-config'] || 'dev';
      if (config && config === 'prod') {
        // not build and just run prod server
        return runSequence('server.prod', done); 
      } else {
        return runSequence('serve.dev', done);
      }
    });

gulp.task('serve.plugin', (done: any) =>
  runSequence('build.dev',
              'server.start',
              // 'watch.partial.dev',
              'watch.plugin2',
              done));

gulp.task('serve.watch', (done: any) =>
  runSequence('build.dev',
              'server.start',
              // 'watch.partial.dev',
              'watch.plugin2',
              done));

// --------------
// Serve prod
gulp.task('serve.prod', (done: any) =>
  runSequence('build.prod',
              'server.prod',
              done));

// --------------
// Serve prod exp
gulp.task('serve.prod.exp', (done: any) =>
  runSequence('build.prod.exp',
              'server.prod',
              done));

// --------------
// Test.
gulp.task('test', (done: any) =>
  runSequence('build.test',
              'karma.run',
              done));

// --------------
// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
gulp.task('clean.once', (done: any) => {
  if (firstRun) {
    firstRun = false;
    runSequence('clean.dev', 'clean.coverage', done);
  } else {
    util.log('Skipping clean on rebuild');
    done();
  }
});