import { join } from 'path';

import { SeedConfig } from './seed.config';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

    PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

    FONTS_DEST = `${this.ASSETS_DEST}/fonts`;
    FONTS_SRC = [
        `${this.CSS_SRC}/fonts/*`,
        `${this.CSS_SRC}/fonts/**`,
        `${this.APP_SRC}/sdk/libs/bootstrap/3.3.2/fonts/*`,
        `!${this.CSS_SRC}/fonts/verdana_regular.typeface.js.tf`,
        `!${this.CSS_SRC}/fonts/arial_regular.typeface.js.tf`
    ];

    // Desktop local file ACUBED-5838
    FONTS_LOCAL_DEST = `${this.ASSETS_DEST}/styles/fonts`;
    FONTS_LOCAL_SRC = [
        `${this.CSS_SRC}/fonts/verdana_regular.typeface.js.tf`,
        `${this.CSS_SRC}/fonts/arial_regular.typeface.js.tf`
    ];

    WIJMO_BASE = `${this.NPM_BASE}/wijmo`;

    /**
     * a3 configuration runtime
     * @type {string}
     */
    A3_CONFIGURATION = `${this.APP_BASE}assets/config/a3-config-runtime.json`;
    A3_CODE = `${this.APP_BASE}assets/config/a3-code.json`;

    /**
     * I18N prefix
     * @type {string}
     */
    I18N_PREFIX = `${this.APP_BASE}assets/i18n`;

    /**
     * I18N suffix
     * @type {string}
     */
    I18N_SUFFIX = `.json`;

    /**
     * Back-end dest
     * @type {string}
     */
    PUBLISH_DEST = `${this.PROJECT_ROOT}/../backend/portal/src/main/webapp/resources`;

    /**
     * Changed source for dev mode
     */
    RELOAD_SOURCE: string = '';

    constructor() {
        super();

        this.APP_TITLE = 'Manufacturing Intelligence 1.0​';

        /**
         * mcc-plus, acubed
         **/
        this.A3_LOGO = 'acubed';

        /* Enable typeless compiler runs (faster) between typed compiler runs. */
        // this.TYPED_COMPILE_INTERVAL = 5;

        // Add `NPM` third-party libraries to be injected/bundled.
        this.NPM_DEPENDENCIES = [
            ...this.NPM_DEPENDENCIES,
            //   {src: 'd3/d3.js', inject: 'libs'}
            // {src: 'lodash/lodash.min.js', inject: 'libs'},
        ];

        // Add `local` third-party libraries to be injected/bundled.
        // ${this.APP_SRC} === /src/client/
        // ${this.CSS_SRC} === /src/client/assets/styles
        this.APP_ASSETS = [
            ...this.APP_ASSETS,
            // ---------------------------
            // Common Base Libraries
            // ---------------------------
            {src: `${this.APP_SRC}/sdk/libs/jquery/dist/jquery.min.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/jquery-ui/jquery-ui.min.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/jquery-resize/jquery.resize.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/jquery-contextmenu/dist/jquery.contextMenu.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/jquery-contextmenu/dist/jquery.ui.position.js`, inject: true, vendor: false},
            //Duplicate jquery.resize.
            // {src: `${this.APP_SRC}/sdk/libs/resize/jquery.resize.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/bootstrap/3.3.2/js/bootstrap.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/underscore/underscore-min.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/underscore.string/lib/underscore.string.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/numeraljs/min/numeral.min.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/moment/min/moment.min.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/qtip2/jquery.qtip.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/notifyjs/notify.js`, inject: true, vendor: false},
            //NOT USED
            // {src: `${this.APP_SRC}/sdk/libs/css-element-queries/ResizeSensor.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/libs/slidable/slidable.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/gridster/jquery.gridster.js`, inject: true, vendor: false},
            // use websocket for Stomp
            {src: `${this.APP_SRC}/sdk/libs/socketjs/sockjs.min.js`, inject: true, vendor: false},

            // ---------------------------
            // Common Chart Libraries
            // ---------------------------
            {src: `${this.APP_SRC}/sdk/libs/bistel-chart/bistel.jqplot.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/d3/d3.min.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/c3/c3.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/re-tree/re-tree.min.js`, inject: true, vendor: false},
            //Use in ACubed Map
            // {src: `${this.APP_SRC}/sdk/libs/vis/vis.js`, inject: true, vendor: false},
            //Use thses in 3D Wafer
            // {src: `${this.APP_SRC}/sdk/libs/threejs/build/three.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/libs/threejs/examples/js/controls/OrbitConstols.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/libs/threejs/examples/js/libs/dat.gui.min.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/libs/rainbowvis/rainbowvis.js`, inject: true, vendor: false},
            //Use it in guage-donut.js
            // {src: `${this.APP_SRC}/sdk/libs/raphael/raphael.js`, inject: true, vendor: false},
            //NOT USED
            // {src: `${this.APP_SRC}/sdk/libs/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/datetimepicker/bootstrap-datetimepicker.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/datetimepicker/locales/bootstrap-datetimepicker.ja.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/datetimepicker/locales/bootstrap-datetimepicker.kr.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/datetimepicker/locales/bootstrap-datetimepicker.zh-TW.js`, inject: true, vendor: false},

            {src: `${this.APP_SRC}/sdk/libs/nouislider/nouislider.js`, inject: true, vendor: false},

            {src: `${this.APP_SRC}/sdk/libs/arboreal/arboreal.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/fault-detail-lib/amanageInst.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/fault-detail-lib/barAndLineChart.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/fault-detail-lib/hirerarchicaBarChart.js`, inject: true, vendor: false},
            //NOT USED
            // {src: `${this.APP_SRC}/sdk/libs/multi-select-dropdown/multiselect.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/rangeslider/rangeslider.js`, inject: true, vendor: false},
            //NOT USED
            // {src: `${this.APP_SRC}/sdk/libs/gridstack/gridstack.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/onepage-scroll/jquery.onepage-scroll.js`, inject: true, vendor: false},

            // the-graph
            {src: `${this.APP_SRC}/sdk/libs/the-graph/react/react.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/the-graph/react/react-dom.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/the-graph/react/ease-component.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/the-graph/react/react.animate.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/the-graph/klay-noflo/klay-noflo.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/the-graph/hammerjs/hammer.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/the-graph/the-graph.js`, inject: true, vendor: false},

            // Custom Chart libraries
            {src: `${this.APP_SRC}/sdk/charts/lib/axis.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/lib/chartAxis.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/lib/d3Zoom.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/lib/event-area.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/lib/guide-area.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/lib/guide-line.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/lib/styleUtils.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/libs/c3/c3.js`, inject: true, vendor: false},

           {src: `${this.APP_SRC}/sdk/charts/c3-chart/c3.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/libs/c3-chart/c3.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/bar/bar.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/block/block.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/charts/boxplot/boxfield.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/charts/boxplot/boxplot.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/bullet-bar/bullet-bar.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/bullet-bar/d3.bulletbar.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/bullet-time/bullet-time.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/bullet-time/d3.bullettime.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/column/column-series.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/column/column.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/column-area/column-area-series.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/column-area/column-area.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/gantt/gantt.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/gauge-donut/gauge-donut.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/line/line.js`, inject: true, vendor: false},
            //NOT USED
            // {src: `${this.APP_SRC}/sdk/charts/multi-tree/multi-tree.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/d3pie/d3pie.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/pie/pie.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/charts/sankey2/sankey2.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/scatter-plot/scatter-plot.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/single-column/single-column.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/jquery.cookie/jquery.cookie.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/dynatree/jquery.dynatree.js`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/localforage/localforage.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/charts/three-d-wafer-map/three-d-wafer-map.js`, inject: true, vendor: false},
            //Use in ACubed Map
            // {src: `${this.APP_SRC}/sdk/charts/vis-map/vis-map.js`, inject: true, vendor: false},
            // {src: `${this.APP_SRC}/sdk/charts/hitmap/hitmap.js`, inject: true, vendor: false},




            // ---------------------------
            // for ACubed CSS
            // ---------------------------
            {src: `${this.APP_SRC}/assets/styles/main.css`, inject: false, vendor: false},
            {src: `${this.APP_SRC}/assets/styles/ng.tree/tree.css`, inject: true, vendor: false},

            {src: `${this.APP_SRC}/sdk/libs/jquery-contextmenu/dist/jquery.contextMenu.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/bistel-chart/bistel.jqplot.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/c3/c3.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/jquery-ui/themes/base/resizable.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/bootstrap/3.3.2/css/bootstrap.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/gridster/jquery.gridster.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/rangeslider/rangeslider.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/datetimepicker/bootstrap-datetimepicker.min.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/onepage-scroll/onepage-scroll.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/nouislider/nouislider.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/wijmo.css`, inject: true, vendor: false},
            // the-graph
            {src: `${this.APP_SRC}/sdk/libs/the-graph/the-graph-dark.css`, inject: true, vendor: false},
            //NOT USED
            // {src: `${this.APP_SRC}/sdk/libs/gridstack/gridstack.css`, inject: true, vendor: false},

            {src: `${this.APP_SRC}/sdk/charts/lib/guide-area.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/bullet-bar/bullet-bar.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/bullet-time/bullet-time.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/c3-chart/c3.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/column/column.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/boxplot/boxplot.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/charts/single-column/single-column.css`, inject: true, vendor: false},

            {src: `${this.APP_SRC}/sdk/popup/notify/style.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/popup/notify/style-bootstrap.css`, inject: true, vendor: false},
            {src: `${this.APP_SRC}/sdk/libs/dynatree/skin/ui.dynatree.css`, inject: true, vendor: false},

            {src: `${this.CSS_SRC}/qtip2-menu.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/size.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/acubed.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/animate.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/app-list.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/charts.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/configuration.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/cubenet.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/custom-carousel.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/dashboard-list.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/datetimepicker.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/fonts-css/font-awesome.min.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/fonts-css/pe-icon-7-stroke.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/fonts-css/a3-font.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/layer.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/login.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/map.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/notification.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/preloader-cube.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/sidebar.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/spinner.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/tasker.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/qtip2-menu.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/tooltip.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/widget-setup.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/toasty.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/authority.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/tools.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/user-information.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/list.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/filter.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/global-configuration.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/widget-pdm.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/category-configuration.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/table-div.css`, inject: true, vendor: false},
            {src: `${this.CSS_SRC}/pdm-global-style.css`, inject: true, vendor: false}
        ];

        /* Add to or override NPM module configurations: */
        // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
    }

}
