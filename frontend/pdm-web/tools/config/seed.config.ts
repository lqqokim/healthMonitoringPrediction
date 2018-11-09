import { join } from 'path';
import * as express from 'express';
import * as slash from 'slash';
import { argv } from 'yargs';

import { BuildType, ExtendPackages, InjectableDependency } from './seed.config.interfaces';

import { getAPI } from '../utils/project/config_api';
import { getProxyMiddleware } from '../utils/project/proxy_server';

/*********************************************************************************************************************************************
 *
 * >> Production Build Script in Jenkins
 *    cd src/frontend && npm cache clean && npm install --no-optional && call gulp publish.prod --base=/portal3/ --env=prod -�config-env=prod
 *
 *
 * >> Jenkins Script
 *    gulp publish.prod --base=portal3/ --env=prod --config-env=prod --minify=false
 *
 *
 * >> Local prod serve : not working ^^;
 *    gulp build.prod --base=portal/ --env=prod --config-env=prod --minify=false
 *    gulp serve --config-env=prod
 *
 * by ysyun
 ********************************************************************************************************************************************/

/**
 * The enumeration of available BUILD_TYPES.
 * @type {BUILD_TYPES}
 */
export const BUILD_TYPES: BuildType = {
    DEVELOPMENT: 'dev',
    PRODUCTION: 'prod'
};

/**
 * This class represents the basic configuration of the seed.
 * It provides the following:
 * - Constants for directories, ports, versions etc.
 * - Injectable NPM dependencies
 * - Injectable application assets
 * - Temporary editor files to be ignored by the watcher and asset builder
 * - SystemJS configuration
 * - Autoprefixer configuration
 * - BrowserSync configuration
 * - Utilities
 */
export class SeedConfig {

    PROXY_SERVER = argv['proxy'] || 'http://localhost:8080';


    /**
     * The port where the application will run.
     * The default port is `5555`, which can be overriden by the  `--port` flag when running `npm start`.
     * @type {number}
     */
    PORT = argv['port'] || 5555;

    /**
     * The root folder of the project (up two levels from the current directory).
     */
    PROJECT_ROOT = join(__dirname, '../..');

    /**
     * The current build type.
     * The default build type is `dev`, which can be overriden by the `--build-type dev|prod` flag when running `npm start`.
     */
    BUILD_TYPE = getBuildType();

    /**
     * The current environment.
     * The default environment is `dev`, which can be overriden by the `--config-env ENV_NAME` flag when running `npm start`.
     */
    ENV = getBuildType();

    /**
     * The flag for the debug option of the application.
     * The default value is `false`, which can be overriden by the `--debug` flag when running `npm start`.
     * @type {boolean}
     */
    DEBUG = argv['debug'] || false;

    /**
     * The port where the documentation application will run.
     * The default docs port is `4003`, which can be overriden by the `--docs-port` flag when running `npm start`.
     * @type {number}
     */
    DOCS_PORT = argv['docs-port'] || 4003;

    /**
     * The port where the unit test coverage report application will run.
     * The default coverage port is `4004`, which can by overriden by the `--coverage-port` flag when running `npm start`.
     * @type {number}
     */
    COVERAGE_PORT = argv['coverage-port'] || 4004;

    /**
    * The path to the coverage output
    * NB: this must match what is configured in ./karma.conf.js
    */
    COVERAGE_DIR = 'coverage_js';
    COVERAGE_TS_DIR = 'coverage';

    /**
     * The path for the base of the application at runtime.
     * The default path is based on the environment '/',
     * which can be overriden by the `--base` flag when running `npm start`.
     * @type {string}
     */
    APP_BASE = argv['base'] || '/';

    /**
     * The base path of node modules.
     * @type {string}
     */
    NPM_BASE = slash(join('.', this.APP_BASE, 'node_modules/'));

    /**
     * The build interval which will force the TypeScript compiler to perform a typed compile run.
     * Between the typed runs, a typeless compile is run, which is typically much faster.
     * For example, if set to 5, the initial compile will be typed, followed by 5 typeless runs,
     * then another typed run, and so on.
     * If a compile error is encountered, the build will use typed compilation until the error is resolved.
     * The default value is `0`, meaning typed compilation will always be performed.
     * @type {number}
     */
    TYPED_COMPILE_INTERVAL = 0;

    /**
     * The directory where the bootstrap file is located.
     * The default directory is `app`.
     * @type {string}
     */
    BOOTSTRAP_DIR = argv['app'] || '';

    /**
     * The directory where the client files are located.
     * The default directory is `client`.
     * @type {string}
     */
    APP_CLIENT = argv['client'] || 'client';

    /**
     * The bootstrap file to be used to boot the application. The file to be used is dependent if the hot-loader option is
     * used or not.
     * Per default (non hot-loader mode) the `index.ts` file will be used, with the hot-loader option enabled, the
     * `hot_loader_main.ts` file will be used.
     * @type {string}
     */
    BOOTSTRAP_MODULE = `${this.BOOTSTRAP_DIR}/index`;
    // BOOTSTRAP_MODULE = 'index';

    BOOTSTRAP_PROD_MODULE = `${this.BOOTSTRAP_DIR}/index`;

    NG_FACTORY_FILE = 'index-prod';

    BOOTSTRAP_FACTORY_PROD_MODULE = `${this.BOOTSTRAP_DIR}/${this.NG_FACTORY_FILE}`;
    /**
     * The default title of the application as used in the `<title>` tag of the
     * `index.html`.
     * @type {string}
     */
    APP_TITLE = 'Welcome to MIP';

    /**
       * mcc-plus, acubed
       **/
    A3_LOGO = 'MIP';

    /**
     * The base folder of the applications source files.
     * @type {string}
     */
    APP_SRC = `src/${this.APP_CLIENT}`;

    /**
     * The folder of the applications asset files.
     * @type {string}
     */
    ASSETS_SRC = `${this.APP_SRC}/assets`;

    /**
     * The folder of the applications css files.
     * @type {string}
     */
    CSS_SRC = `${this.ASSETS_SRC}/styles`;

    /**
     * The folder of the applications scss files.
     * @type {string}
     */
    SCSS_SRC = `${this.APP_SRC}/scss`;

    /**
     * The directory of the applications tools
     * @type {string}
     */
    TOOLS_DIR = 'tools';

    /**
     * The directory of the tasks provided by the seed.
     */
    SEED_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'seed');

    /**
     * The destination folder for the generated documentation.
     * @type {string}
     */
    DOCS_DEST = 'docs';

    /**
     * The base folder for built files.
     * @type {string}
     */
    DIST_DIR = 'dist';

    /**
     * The folder for built files in the `dev` environment.
     * @type {string}
     */
    DEV_DEST = `${this.DIST_DIR}/dev`;

    /**
     * The folder for the built files in the `prod` environment.
     * @type {string}
     */
    PROD_DEST = `${this.DIST_DIR}/prod`;

    /**
     * The folder for temporary files.
     * @type {string}
     */
    TMP_DIR = `${this.DIST_DIR}/tmp`;

    /**
     * The folder for the built files, corresponding to the current environment.
     * @type {string}
     */
    APP_DEST = this.ENV === BUILD_TYPES.DEVELOPMENT ? this.DEV_DEST : this.PROD_DEST;

    /**
     * The folder of the bundle asset files.
     * @type {string}
     */
    ASSETS_DEST = this.ENV === BUILD_TYPES.DEVELOPMENT ? this.ASSETS_SRC : `${this.PROD_DEST}/assets`;

    /**
     * The folder for the built CSS files.
     * @type {strings}
     */
    CSS_DEST = `${this.ASSETS_DEST}/styles`;

    /**
     * The folder for the built JavaScript files.
     * @type {string}
     */
    JS_DEST = `${this.APP_DEST}/js`;

    /**
     * The version of the application as defined in the `package.json`.
     */
    VERSION = appVersion();

    /**
     * The name of the bundle file to includes all CSS files.
     * @type {string}
     */
    CSS_PROD_BUNDLE = 'main.css';

    /**
     * The name of the bundle file to include all JavaScript shims.
     * @type {string}
     */
    JS_PROD_SHIMS_BUNDLE = 'shims.js';

    /**
     * The name of the bundle file to include all JavaScript application files.
     * @type {string}
     */
    JS_PROD_APP_BUNDLE = 'app.js';

    /**
     * The required NPM version to run the application.
     * @type {string}
     */
    VERSION_NPM = '2.14.2';

    /**
     * The required NodeJS version to run the application.
     * @type {string}
     */
    VERSION_NODE = '4.0.0';

    /**
     * The ruleset to be used by `codelyzer` for linting the TypeScript files.
     */
    CODELYZER_RULES = customRules();

    /**
     * The flag to enable handling of SCSS files
     * The default value is false. Override with the '--scss' flag.
     * @type {boolean}
     */
    ENABLE_SCSS = argv['scss'] || false;

    /**
     * The list of NPM dependcies to be injected in the `index.html`.
     * @type {InjectableDependency[]}
     */
    NPM_DEPENDENCIES: InjectableDependency[] = [
        { src: 'core-js/client/shim.min.js', inject: 'shims' },
        { src: 'zone.js/dist/zone.js', inject: 'libs' },
        { src: 'zone.js/dist/long-stack-trace-zone.js', inject: 'libs', buildType: BUILD_TYPES.DEVELOPMENT },
        { src: 'intl/dist/Intl.min.js', inject: 'shims' },
        { src: 'systemjs/dist/system.src.js', inject: 'shims', buildType: BUILD_TYPES.DEVELOPMENT },
        // Temporary fix. See https://github.com/angular/angular/issues/9359
        // { src: 'rxjs/bundles/Rx.min.js', inject: 'libs', buildType: BUILD_TYPES.DEVELOPMENT },
        { src: '.tmp/Rx.min.js', inject: 'libs', buildType: BUILD_TYPES.DEVELOPMENT },
    ];

    /**
     * The list of local files to be injected in the `index.html`.
     * @type {InjectableDependency[]}
     */
    APP_ASSETS: InjectableDependency[] = [
        { src: `${this.CSS_SRC}/main.${this.getInjectableStyleExtension()}`, inject: true, vendor: false },
    ];

    /**
     * The list of editor temporary files to ignore in watcher and asset builder.
     * @type {string[]}
     */
    TEMP_FILES: string[] = [
        '**/*___jb_tmp___',
        '**/*~',
    ];

    /**
     * Returns the array of injectable dependencies (npm dependencies and assets).
     * @return {InjectableDependency[]} The array of npm dependencies and assets.
     */
    get DEPENDENCIES(): InjectableDependency[] {
        return normalizeDependencies(this.NPM_DEPENDENCIES.filter(filterDependency.bind(null, this.BUILD_TYPE)))
            .concat(this.APP_ASSETS.filter(filterDependency.bind(null, this.BUILD_TYPE)));
    }

    /**
     * The configuration of SystemJS for the `dev` environment.
     * @type {any}
     */
    SYSTEM_CONFIG_DEV: any = {
        defaultJSExtensions: true,
        packageConfigPaths: [
            '/node_modules/*/package.json',
            '/node_modules/**/package.json',
            '/node_modules/@angular/*/package.json',
            '!/node_modules/.tmp/package.json',
            '!/node_modules/wijmo/package.json',
            '!/node_modules/@ngrx/package.json',
            '/node_modules/@ngrx/core/package.json',
            '/node_modules/@ngrx/store/package.json',
            '/node_modules/ng2-translate/package.json',
            '/node_modules/ng2-dnd/package.json',
            '/node_modules/ng2-toasty/package.json',
            '/node_modules/raphael/package.json',
            '/node_modules/stompjs/package.json',
            `/node_modules/mathjs/package.json`,
            `/node_modules/html2canvas/package.json`,
            `/node_modules/d3-contour/package.json`,
            `/node_modules/d3-selection/package.json`,
            `/node_modules/d3-scale/package.json`,
            `/node_modules/d3-geo/package.json`,
            `/node_modules/d3-scale-chromatic/package.json`,
            `/node_modules/d3-array/package.json`,
            `/node_modules/d3-interpolate/package.json`,
            `/node_modules/d3-color/package.json`,
            `/node_modules/d3-collection/package.json`,
            `/node_modules/d3-format/package.json`,
            `/node_modules/d3-time/package.json`,
            `/node_modules/d3-time-format/package.json`,
            // `!/node_modules/uuid/package.json`,
            // '!/node_modules/crypto/package.json',
            // '/node_modules/ng2-tree/package.json',
            // `/node_modules/localforage/package.json`
        ],
        paths: {
            [this.BOOTSTRAP_MODULE]: `${this.APP_BASE}${this.BOOTSTRAP_MODULE}`,
            '@angular/animations': 'node_modules/@angular/animations/bundles/animations.umd.js',
            '@angular/platform-browser/animations': 'node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/common': 'node_modules/@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'node_modules/@angular/compiler/bundles/compiler.umd.js',
            '@angular/core': 'node_modules/@angular/core/bundles/core.umd.js',
            '@angular/forms': 'node_modules/@angular/forms/bundles/forms.umd.js',
            '@angular/http': 'node_modules/@angular/http/bundles/http.umd.js',
            '@angular/platform-browser': 'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/router': 'node_modules/@angular/router/bundles/router.umd.js',
            '@angular/animations/browser': 'node_modules/@angular/animations/bundles/animations-browser.umd.js',

            '@angular/common/testing': 'node_modules/@angular/common/bundles/common-testing.umd.js',
            '@angular/compiler/testing': 'node_modules/@angular/compiler/bundles/compiler-testing.umd.js',
            '@angular/core/testing': 'node_modules/@angular/core/bundles/core-testing.umd.js',
            '@angular/http/testing': 'node_modules/@angular/http/bundles/http-testing.umd.js',
            '@angular/platform-browser/testing': 'node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js',
            '@angular/platform-browser-dynamic/testing': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
            '@angular/router/testing': 'node_modules/@angular/router/bundles/router-testing.umd.js',

            // 'rxjs/*': 'node_modules/rxjs/*',
            // 'plugins/*': `/plugins/*`,
            // 'common/*': `/common/*`,
            // 'portal/*': `/portal/*`,
            // 'sdk/*': `/sdk/*`,
            '@ngrx/core': 'node_modules/@ngrx/core/bundles/core.umd.js',
            '@ngrx/store': 'node_modules/@ngrx/store/bundles/store.umd.js',
            'angular2-cookie': 'node_modules/angular2-cookie/core.js',
            'ng2-translate': 'node_modules/ng2-translate/bundles/ng2-translate.umd.js',
            'ng2-dnd': 'node_modules/ng2-dnd/bundles/index.umd.js',
            'ng2-toasty': 'node_modules/ng2-toasty/bundles/index.umd.js',
            'wijmo/*': 'node_modules/wijmo/*',
            // 'raphael': 'node_modules/raphael/raphael.js',
            'stompjs': 'node_modules/stompjs/lib/stomp.js',
            'angular2-off-click': 'node_modules/angular2-off-click/dist/src/index.js',
            'rxjs': 'node_modules/.tmp/Rx.min.js',
            'mathjs': `node_modules/mathjs/dist/math.js`,
            'html2canvas': `node_modules/html2canvas/dist/html2canvas.js`,
            'd3-contour': `node_modules/d3-contour/build/d3-contour.js`,
            'd3-selection': `node_modules/d3-selection/dist/d3-selection.js`,
            'd3-scale': `node_modules/d3-scale/build/d3-scale.js`,
            'd3-geo': `node_modules/d3-geo/build/d3-geo.js`,
            'd3-scale-chromatic': `node_modules/d3-scale-chromatic/build/d3-scale-chromatic.js`,
            'd3-array': `node_modules/d3-array/build/d3-array.js`,
            'd3-color': `node_modules/d3-color/build/d3-color.js`,
            'd3-interpolate': `node_modules/d3-interpolate/build/d3-interpolate.js`,
            'd3-collection': `node_modules/d3-collection/build/d3-collection.js`,
            'd3-format': `node_modules/d3-format/build/d3-format.js`,
            'd3-time': `node_modules/d3-time/build/d3-time.js`,
            'd3-time-format': `node_modules/d3-time-format/build/d3-time-format.js`,
            'crypto': `sdk/libs/crypto/index.js`,
            // 'localforage': `node_modules/localforage/dist/localforage.js`,


            // 'fbp-graph': 'node_modules/fbp-graph/browser/fbp-graph.js',

            // For test config
            'dist/dev/*': '/base/dist/dev/*',
            '*': 'node_modules/*',
            /*       'stompjs': 'node_modules/stompjs/lib/stomp.min.js' */
        },
        // packages: {
        //     // rxjs: {
        //     //     defaultExtension: 'js'
        //     // },
        //     /*      'stompjs':{ format: 'cjs' } */
        // }
    };

    /**
     * The configuration of SystemJS of the application.
     * Per default, the configuration of the `dev` environment will be used.
     * @type {any}
     */
    SYSTEM_CONFIG: any = this.SYSTEM_CONFIG_DEV;

    /**
     * The system builder configuration of the application.
     * @type {any}
     */
    SYSTEM_BUILDER_CONFIG: any = {
        defaultJSExtensions: true,
        base: this.PROJECT_ROOT,
        // packageConfigPaths: [
        //   join('node_modules', '*', 'package.json'),
        //   join('node_modules', '@angular', '*', 'package.json'),
        //   join('node_modules', '@ngrx', 'core', 'package.json'),
        //   join('node_modules', '@ngrx', 'store', 'package.json')
        // ],
        paths: {
            [join(this.TMP_DIR, this.BOOTSTRAP_DIR, '*')]: `${this.TMP_DIR}/${this.BOOTSTRAP_DIR}/*`,
            '@angular/platform-browser/animations': 'node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/animations/browser': 'node_modules/@angular/animations/bundles/animations-browser.umd.js',
            'dist/tmp/node_modules/*': 'dist/tmp/node_modules/*',

            '@ngrx/core': 'node_modules/@ngrx/core/index.js',
            '@ngrx/store': 'node_modules/@ngrx/store/index.js',
            'ng2-translate': 'node_modules/ng2-translate/index.js',
            'ng2-dnd': 'node_modules/ng2-dnd/bundles/index.umd.js',
            'ng2-toasty': 'node_modules/ng2-toasty/bundles/index.umd.js',
            'stompjs': 'node_modules/stompjs/lib/stomp.js',
            'ng.tree': 'node_modules/ng.tree/ng.tree.js',
            'ng2-tree': 'node_modules/ng2-tree/index.js',
            'crypto-js': 'node_modules/crypto-js/crypto-js.js',
            'crypto': `src/client/sdk/libs/crypto/index.js`,
            'angular-split': 'node_modules/angular-split/bundles/angular-split.umd.js',
            'angular-plotly.js':'node_modules/angular-plotly.js/bundles/angular-plotly.js.umd.js',
            // 'plotly.js':'node_modules/plotly.js/dist/plotly.js',
            // 'localforage': `node_modules/localforage/dist/localforage.js`,
            // 'angular2-off-click': 'node_modules/angular2-off-click/dist/src/index.js',

            // 'fbp-graph': 'node_modules/fbp-graph/browser/fbp-graph.js',

            'node_modules/*': 'node_modules/*',
            '*': 'node_modules/*'
        },
        packages: {
            '@angular/animations': {
                main: 'bundles/animations.umd.js',
                defaultExtension: 'js'
            },
            '@angular/common': {
                main: 'bundles/common.umd.js',
                defaultExtension: 'js'
            },
            '@angular/compiler': {
                main: 'bundles/compiler.umd.js',
                defaultExtension: 'js'
            },
            '@angular/core/testing': {
                main: 'bundles/core-testing.umd.js',
                defaultExtension: 'js'
            },
            '@angular/core': {
                main: 'bundles/core.umd.js',
                defaultExtension: 'js'
            },
            '@angular/forms': {
                main: 'bundles/forms.umd.js',
                defaultExtension: 'js'
            },
            '@angular/http': {
                main: 'bundles/http.umd.js',
                defaultExtension: 'js'
            },
            '@angular/platform-browser': {
                main: 'bundles/platform-browser.umd.js',
                defaultExtension: 'js'
            },
            '@angular/platform-browser-dynamic': {
                main: 'bundles/platform-browser-dynamic.umd.js',
                defaultExtension: 'js'
            },
            '@angular/router': {
                main: 'bundles/router.umd.js',
                defaultExtension: 'js'
            },
            'rxjs': {
                main: 'Rx.js',
                defaultExtension: 'js'
            },
            '@ngrx/core': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            '@ngrx/store': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            'angular2-cookie': {
                main: 'core.js',
                defaultExtension: 'js'
            },
            'ng2-translate': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            'ng2-dnd': {
                main: 'bundles/index.umd.js',
                defaultExtension: 'js'
            },
            'ng2-toasty': {
                main: 'bundles/index.umd.js',
                defaultExtension: 'js'
            },
            'wijmo': {
                main: 'wijmo.js',
                defaultExtension: 'js'
            },
            'stompjs/lib': {
                main: 'stomp.js',
                defaultExtension: 'js'
            },
            'mathjs': {
                main: 'dist/math.js',
                defaultExtension: 'js'
            },
            'html2canvas': {
                main: 'dist/html2canvas.js',
                defaultExtension: 'js'
            },
            'd3-contour': {
                main: 'build/d3-contour.js',
                defaultExtension: 'js'
            },
            'd3-selection': {
                main: 'dist/d3-selection.js',
                defaultExtension: 'js'
            },
            'd3-scale': {
                main: 'build/d3-scale.js',
                defaultExtension: 'js'
            },
            'd3-geo': {
                main: 'build/d3-geo.js',
                defaultExtension: 'js'
            },
            'd3-scale-chromatic': {
                main: 'build/d3-scale-chromatic.js',
                defaultExtension: 'js'
            },
            'd3-array': {
                main: 'build/d3-array.js',
                defaultExtension: 'js'
            },
            'd3-color': {
                main: 'build/d3-color.js',
                defaultExtension: 'js'
            },
            'd3-interpolate': {
                main: 'build/d3-interpolate.js',
                defaultExtension: 'js'
            },
            'd3-collection': {
                main: 'build/d3-collection.js',
                defaultExtension: 'js'
            },
            'd3-format': {
                main: 'build/d3-format.js',
                defaultExtension: 'js'
            },
            'd3-time': {
                main: 'build/d3-time.js',
                defaultExtension: 'js'
            },
            'd3-time-format': {
                main: 'build/d3-time-format.js',
                defaultExtension: 'js'
            },
            // 'localforage': {
            //     main: 'dist/localforage.js',
            //     defaultExtension: 'js'
            // }
            // 'angular2-off-click': {
            //     main: 'dist/src/index.js',
            //     defaultExtension: 'js'
            // }

            // 'fbp-graph': {
            //     main: 'browser/fbp-graph.js',
            //     defaultExtension: 'js'
            // }
        }
    };

    /**
     * The Autoprefixer configuration for the application.
     * @type {Array}
     */
    BROWSER_LIST = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

    /**
     * White list for CSS color guard
     * @type {[string, string][]}
     */
    COLOR_GUARD_WHITE_LIST: [string, string][] = [
    ];

    /**
     * Configurations for NPM module configurations. Add to or override in project.config.ts.
     * If you like, use the mergeObject() method to assist with this.
     */
    // by ysyun
    path: string = join(this.PROJECT_ROOT, this.TOOLS_DIR, 'env');
    httpProxy = require('http-proxy');

    API: any = getAPI(this.path);
    PROXY: any = this.httpProxy.createProxyServer({
        target: this.PROXY_SERVER,
        timeout:3600000,
        proxyTimout:3600000
    });

    PLUGIN_CONFIGS: any = {
        /**
         * The BrowserSync configuration of the application.
         * The default open behavior is to open the browser. To prevent the browser from opening use the `--b`  flag when
         * running `npm start` (tested with serve.dev).
         * Example: `npm start -- --b`
         * @type {any}
         *
         * by ysyun
         */
        'browser-sync': {
            ui: false,
            middleware: [
                // by ysyun
                getProxyMiddleware(this.PROXY, this.API),
                // proxyMiddleware,
                // require('connect-history-api-fallback')({index: `index.html`})
                require('connect-history-api-fallback')({ index: `${this.APP_BASE.replace(/\/$/, '')}/index.html` })
            ],
            ws: true,
            port: this.PORT,
            startPath: this.APP_BASE,
            open: argv['b'] ? false : true,
            injectChanges: false,

            // prevent to the auto reload of browser-sync
            reloadDelay: 86400000,
            reloadDebounce: 86400000,
            codeSync: false,

            server: {
                baseDir: `${this.DIST_DIR}/empty/`,
                middleware: [],
                ws: true,
                routes: {
                    // [`${this.APP_BASE.replace(/\/$/, '')}/${this.APP_SRC}`]: this.APP_SRC,
                    [`${this.APP_BASE.replace(/\/$/, '')}/${this.APP_DEST}`]: this.APP_DEST,
                    [`${this.APP_BASE.replace(/\/$/, '')}/node_modules`]: 'node_modules',
                    [`${this.APP_BASE.replace(/\/$/, '')}`]: this.APP_DEST
                },

                 // prevent to the auto reload of browser-sync
                socket: {
                    clients: {
                        heartbeatTimeout: 86400000 //1000*60*60*24
                    }
                }
            }
        },

        // Note: you can customize the location of the file
        'environment-config': join(this.PROJECT_ROOT, this.TOOLS_DIR, 'env'),

        /**
         * The options to pass to gulp-sass (and then to node-sass).
         * Reference: https://github.com/sass/node-sass#options
         * @type {object}
         */
        'gulp-sass': {
            includePaths: ['./node_modules/']
        },

        /**
         * The options to pass to gulp-concat-css
         * Reference: https://github.com/mariocasciaro/gulp-concat-css
         * @type {object}
         */
        'gulp-concat-css': {
            targetFile: this.CSS_PROD_BUNDLE,
            options: {
                rebaseUrls: false
            }
        }
    };

    /**
     * Karma reporter configuration
     */
    getKarmaReporters(): any {
        return {
            preprocessors: {
                'dist/**/!(*spec|index|*.module|*.routes).js': ['coverage']
            },
            reporters: ['mocha', 'coverage', 'karma-remap-istanbul'],
            coverageReporter: {
                dir: this.COVERAGE_DIR + '/',
                reporters: [
                    { type: 'json', subdir: '.', file: 'coverage-final.json' },
                    { type: 'html', subdir: '.' }
                ]
            },
            remapIstanbulReporter: {
                reports: {
                    html: this.COVERAGE_TS_DIR
                }
            }
        };
    };

    /**
     * Recursively merge source onto target.
     * @param {any} target The target object (to receive values from source)
     * @param {any} source The source object (to be merged onto target)
     */
    mergeObject(target: any, source: any) {
        const deepExtend = require('deep-extend');
        deepExtend(target, source);
    }

    /**
     * Locate a plugin configuration object by plugin key.
     * @param {any} pluginKey The object key to look up in PLUGIN_CONFIGS.
     */
    getPluginConfig(pluginKey: string): any {
        if (this.PLUGIN_CONFIGS[pluginKey]) {
            return this.PLUGIN_CONFIGS[pluginKey];
        }
        return null;
    }

    getInjectableStyleExtension() {
        return this.ENV === BUILD_TYPES.PRODUCTION && this.ENABLE_SCSS ? 'scss' : 'css';
    }

    addPackageBundles(pack: ExtendPackages) {
        if (pack.path) {
            this.SYSTEM_CONFIG_DEV.paths[pack.name] = pack.path;
            this.SYSTEM_BUILDER_CONFIG.paths[pack.name] = pack.path;
        }

        if (pack.packageMeta) {
            this.SYSTEM_CONFIG_DEV.packages[pack.name] = pack.packageMeta;
            this.SYSTEM_BUILDER_CONFIG.packages[pack.name] = pack.packageMeta;
        }
    }

    addPackagesBundles(packs: ExtendPackages[]) {

        packs.forEach((pack: ExtendPackages) => {
            this.addPackageBundles(pack);
        });

    }

}

/**
 * Normalizes the given `deps` to skip globs.
 * @param {InjectableDependency[]} deps - The dependencies to be normalized.
 */
export function normalizeDependencies(deps: InjectableDependency[]) {
    deps
        .filter((d: InjectableDependency) => !/\*/.test(d.src)) // Skip globs
        .forEach((d: InjectableDependency) => d.src = require.resolve(d.src));
    return deps;
}

/**
 * Returns if the given dependency is used in the given environment.
 * @param  {string}               env - The environment to be filtered for.
 * @param  {InjectableDependency} d   - The dependency to check.
 * @return {boolean}                    `true` if the dependency is used in this environment, `false` otherwise.
 */
function filterDependency(type: string, d: InjectableDependency): boolean {
    const t = d.buildType || d.env;
    d.buildType = t;
    if (!t) {
        d.buildType = Object.keys(BUILD_TYPES).map(k => BUILD_TYPES[k]);
    }
    if (!(d.buildType instanceof Array)) {
        (<any>d).env = [d.buildType];
    }
    return d.buildType.indexOf(type) >= 0;
}

/**
 * Returns the applications version as defined in the `package.json`.
 * @return {number} The applications version.
 */
function appVersion(): number | string {
    var pkg = require('../../package.json');
    return pkg.version;
}

/**
 * Returns the linting configuration to be used for `codelyzer`.
 * @return {string[]} The list of linting rules.
 */
function customRules(): string[] {
    var lintConf = require('../../tslint.json');
    return lintConf.rulesDirectory;
}

/**
 * Returns the environment of the application.
 */
function getBuildType() {
    // �무 값도 �다��default Development env �정�다
    let type = (argv['build-type'] || argv['config-env'] || argv['env-config'] || argv['env'] || 'dev').toLowerCase();
    // console.log('>> Environment Type:', type);
    let base: string[] = argv['_'];
    let prodKeyword = !!base.filter(o => o.indexOf(BUILD_TYPES.PRODUCTION) >= 0).pop();
    let env = (argv['env'] || '').toLowerCase();
    if ((base && prodKeyword) || type === BUILD_TYPES.PRODUCTION) {
        return BUILD_TYPES.PRODUCTION;
    } else {
        return BUILD_TYPES.DEVELOPMENT;
    }
}
