(function (window, d3) {
   'use strict';

   var Pie = {
      // TODO set version (OPTION)
      version: "0.0.1",
      chart: {
         fn: Chart.prototype,
         internal: {
            fn: ChartInternal.prototype
         }
      }
   };

   var chart_fn = Pie.chart.fn,
   chart_internal_fn = Pie.chart.internal.fn;

   Pie.generate = function (config) {
      return new Chart(config);
   };

   function Chart(config) {
      var $$ = this.internal = new ChartInternal(this);
      $$.loadConfig(config);
      $$.init(config);

      // bind "this" to nested API
      (function bindThis(fn, target, argThis) {
         Object.keys(fn).forEach(function (key) {
            target[key] = fn[key].bind(argThis);
            if (Object.keys(fn[key]).length > 0) {
               bindThis(fn[key], target[key], argThis);
            }
         });
      })(chart_fn, this, this);
   }

   function ChartInternal(api) {
      var $$ = this;
      $$.api = api;
      $$.config = $$.getDefaultConfig();
      // $$.data = {};
      // $$.cache = {};
      $$.chart_internal_val = {
         pie: null,
         svg: null,
         width: 0,
         height: 0,
         margin: null,
         groups: null,
         xScale: null,
         yScale: null,
         selectItem: null,
         isResize: false,
         isApplyEv: false,
         isSelected: false
      }
   }

   chart_internal_fn.loadConfig = function (config) {
      var this_config = this.config,
      target, keys, read;

      function find() {
         var key = keys.shift();
         // console.log("key =>", key, ", target =>", target);
         if (key && target && typeof target === 'object' && key in target) {
            target = target[key];
            return find();
         } else if (!key) {
            return target;
         } else {
            return undefined;
         }
      }
      Object.keys(this_config).forEach(function (key) {
         target = config;
         keys = key.split('_');
         read = find();
         // console.log("CONFIG : ", key, read);
         if (isDefined(read)) {
            this_config[key] = read;
         }
      });
   };

   ///////////////////////////////////////////////////////////////////////////
   //
   // START: Define Area
   //
   ///////////////////////////////////////////////////////////////////////////
   // export API
   chart_fn.resize = function (size) {
      var $$ = this.internal,
      config = $$.config;

      // TODO your coding area (OPTION)
      // .... resize and draw
      config.size.canvasHeight = size ? size.height : null;
      config.size.canvasWidth = size ? size.width : null;
      $$.draw(config);
   };

   chart_fn.load = function (data) {
      var $$ = this.internal,
      config = $$.config;

      // TODO your coding area (OPTION)
      // .... load data and draw. It is option
      config.data = data;
      $$.draw(config);
   };

   chart_fn.destroy = function () {
      var $$ = this.internal,
      config = $$.config,
      that = $$.chart_internal_val;

      // TODO release memory (OPTION)
      // ....
      if(config.data) {
         config.data = undefined;
      }
      that.pie.destroy();
   };

   // internal fn : configuration, init
   chart_internal_fn.getDefaultConfig = function () {
      // TODO your coding area (OPTION)
      // you must set => <name>_<name>_<name>: value
      var config = {
         bindto: '#chart',
         data: undefined,
         data_rows: undefined,
         data_columns: undefined,
         data_columnAliases: undefined,
         size_width: 400,
         size_height: 300,
         size: undefined,
         labels: undefined,
         effects: undefined,
         misc: undefined,
         callbacks: {},
         data_onclick: function() {},
         data_onmouseover: function() {},
         data_onmouseout: function() {},
         data_onselected: function() {},
         data_onunselected: function() {},
         tooltip_show: function() {},
         tooltip_hide: function() {}
      };

      return config;
   };

   chart_internal_fn.init = function (config) {
      var $$ = this;
      // config = $$.config;

      // TODO your coding area (OPTION)
      // ....
      $$.draw(config);
   };

   ///////////////////////////////
   // TODO your coding area (MUST)
   // .... LINE TEST CODE
   chart_internal_fn.draw = function (config) {

      var $$ = this,
      properties = null,
      that = $$.chart_internal_val;

      if( !that.svg ) {
         var pie = new d3pie( config.bindto, config );
         that.svg = pie.svg;
         that.pie = pie;

      } else {
         that.pie.options.size.canvasHeight = config.size.canvasHeight;
         that.pie.options.size.canvasWidth = config.size.canvasWidth;
         return that.pie.redraw();

      }

   };

   ///////////////////////////////////////////////////////////////////////////
   //
   // END: Define Area
   //
   ///////////////////////////////////////////////////////////////////////////

   // utils
   var isValue = chart_internal_fn.isValue = function (v) {
      return v || v === 0;
   },
   isFunction = chart_internal_fn.isFunction = function (o) {
      return typeof o === 'function';
   },
   isString = chart_internal_fn.isString = function (o) {
      return typeof o === 'string';
   },
   isUndefined = chart_internal_fn.isUndefined = function (v) {
      return typeof v === 'undefined';
   },
   isDefined = chart_internal_fn.isDefined = function (v) {
      return typeof v !== 'undefined';
   };

   // Support AMD, CommonJS, window
   if (typeof define === 'function' && define.amd) {
      // only d3.js
      define('Pie', ['d3'], Pie);
   } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
      module.exports = Pie;
   } else {
      window.Pie = Pie;
   }

})(window, window.d3);
