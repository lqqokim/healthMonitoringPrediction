import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';
import { makeTsProject, templateLocals } from '../../utils';

const plugins = <any>gulpLoadPlugins();

const INLINE_OPTIONS = {
  base: Config.TMP_DIR,
  useRelativePaths: true,
  removeLineBreaks: false,
  supportNonExistentFiles: true,
  templateProcessor: (path, ext, content, cb) => {
    try {
      // const minify = require('html-minifier').minify;
      // var html = minify(content, {
      //   collapseWhitespace: true,
      //   caseSensitive: true,
      //   removeComments: true,
      //   removeRedundantAttributes: true
      // });
      cb(null, content.replace(/(\.\.\/)*assets/g, Config.APP_BASE+'assets'));
    } catch (err) { cb(err); }
  },
  styleProcessor: (path, ext, content, cb) => {
    try {
        // const postcss = require('postcss');
        // const csso = require('csso');
        // const autoprefixer = require('autoprefixer');
        // const stylus = require('stylus');

        // var css = stylus.render(content);
        // css = postcss([autoprefixer]).process(css).css;
        // css = csso.minify(css).css;
      cb(null, content.replace(/(\.\.\/)*assets/g, Config.APP_BASE+'assets'));
      //cb(null, content.replace(/\\/g, '\\\\').replace(/(\.\.\/)*assets/g, Config.APP_BASE+'assets'));
    } catch (err) { cb(err); }
  }
};

/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */

export = () => {
  let tsProject = makeTsProject({}, Config.TMP_DIR);
  let src = [
    Config.TOOLS_DIR + '/manual_typings/**/*.d.ts',
    join(Config.TMP_DIR, '**/*.ts'),
    '!' + join(Config.TMP_DIR, `**/${Config.BOOTSTRAP_FACTORY_PROD_MODULE}.ts`)
  ];
  let result = gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
    .pipe(tsProject())
    .once('error', function(e: any) {
      this.once('finish', () => process.exit(1));
    });


  return result.js
    .pipe(plugins.template(templateLocals()))
    .pipe(gulp.dest(Config.TMP_DIR))
    .on('error', (e: any) => {
      console.log(e);
    });
};
