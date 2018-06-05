import { join } from 'path';
import * as Builder from 'systemjs-builder';

import { argv } from 'yargs';

import Config from '../../config';

// --minify=true
const isMinify = argv['minify'];
let minify: boolean = true;
if (isMinify === 'false' || isMinify === false) {
  console.log('>> minify is false')
  minify = false;
}

const BUNDLER_OPTIONS = {
  format: 'cjs',
  minify,
  mangle: false
};

/**
 * Executes the build process, bundling the JavaScript files using the SystemJS builder.
 */
export = (done: any) => {
  let builder = new Builder(Config.SYSTEM_BUILDER_CONFIG);
  builder
    .buildStatic(join(Config.TMP_DIR, Config.BOOTSTRAP_PROD_MODULE),
      join(Config.JS_DEST, Config.JS_PROD_APP_BUNDLE),
      BUNDLER_OPTIONS)
    .then(() => done())
    .catch((err: any) => done(err));
};
