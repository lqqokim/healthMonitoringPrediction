(function (window, d3) {
    'use strict';

    var ThreeDWaferMap = {
        // TODO set version (OPTION)
        version: '0.0.1',
        chart: {
            fn: Chart.prototype,
            internal: {
                fn: ChartInternal.prototype
            }
        }
    };

    var chart_fn = ThreeDWaferMap.chart.fn,
        chart_internal_fn = ThreeDWaferMap.chart.internal.fn,
        chart_internal_val = null;

    ThreeDWaferMap.generate = function (config) {
        return new Chart(config);
    };

    function Chart(config) {
        var $$ = this.internal = new ChartInternal(this);
        $$.loadConfig(config);
        $$.init();

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
        $$.chart_internal_val = {
            // common object
            renderer: null,
            scene: null,
            camera: null,
            controls: null,

            // common option variable
            backgroundClearColor: 0xf5f5f5,
            backgroundAlpha: 0.0,
            // lightFromCamera: true,     
            phongMaterialSpecular: 0xFFFFFF,
            phongMaterialShininess: 100,
            cameraFov: 45,
            
            // cylinder
            cylinder: null,
            cylinderColor: 0xcfcfcf,
            cylinderThickness: 1,
            cylinderMaterialType: 'phong',  // basic, lambert, phong

            // triangle
            triangle: null,
            triangleColor: 0xffff00,
            triangleThickness: 1,
            triangleSize: 10.0,
            
            // box
            box: [],
            boxOutline: [],
            boxOutlineEnable: true,
            boxOutlineThickness: 0.01,
            boxOutlineColor: 0x888888,
            boxMaterialType: 'basic',  // basic, lambert, phong
            boxBreadthScale: 0.9,
            boxHeightScale: 0.1,
            maxBoxHeight: 90,
            minBoxHeight: 1,
            boxHeightSegment: 20,
            boxGradientSmoothed: 50,
            boxGradientColors: ['ff3a39', 'ff8d39', 'fff557', '85cd31', '07b528', '439ef4'],
            boxGradientColorsString: 'ff3a39, ff8d39, fff557, 85cd31, 07b528, 439ef4',

            // animation
            aniFps: 60,
            requestId: null,
            speed: 0.04,
            accel: 0,

            // text
            text: [],
            enableText: true,
            textMaterialType: 'basic',  // basic, lambert, phong
            indexTextOption: {
                size: 4,
                height: 1,
                curveSegment: 1,
                font: 'Verdana',
                weight: 'regular',
                style: 'normal',
                bevelEnabled: false,
                bevelThickness: 0.1,
                bevelSize: 0.1
            },
            valueTextOption: {
                size: 44/13,
                height: 1,
                curveSegment: 1,
                font: 'Verdana',
                weight: 'regular',
                style: 'normal',
                bevelEnabled: false,
                bevelThickness: 0.1,
                bevelSize: 0.1
            },
            textColor: 0x000000,

            // light
            light: [null, null, null, null],
            lightOn: [true, true, true, false],
            lightIntensity: [0.7, 0.7, 0.7, 0.7],
            lightPosition: [[0, 500, 1000], [-600, 500, -800], [600, 500, -800], [0, 0, 0]],
            lightColor: 0xffffff,

            // debug
            gui: null,
            stats: null
        };
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
            config = $$.config,
            that = $$.chart_internal_val;

        that.width = size.width;
        that.height = size.height;

        if(that.renderer !== null) {
            // that.camera.setSize(size.width, size.height);

            // that.camera.left = -size.width/2;
            // that.camera.right = size.width/2;
            // that.camera.top = size.height/2;
            // that.camera.bottom = -size.height/2;

            var cameraBoundary = _getOrthographicCameraLRTB($$);
            that.camera.left = cameraBoundary.left;
            that.camera.right = cameraBoundary.right;
            that.camera.top = cameraBoundary.top;
            that.camera.bottom = cameraBoundary.bottom;

            that.camera.updateProjectionMatrix();

            that.renderer.setSize(size.width, size.height);
        }

        $$.sizeSetting();
        _drawMesh($$);
    };

    chart_fn.data = function() {
        var $$ = this.internal,
            config = $$.config;
        return config.data;
    };

    chart_fn.setData = function(data) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        config.data = data;
    }

    chart_fn.setSpinner = function(type, func) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        if(type === 'show') {
            config.spinner_show = func;
        } else if(type === 'hide') {
            config.spinner_hide = func;
        }
    }

    chart_fn.load = function (data) {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        // TODO your coding area (OPTION)
        // .... load data and draw. It is option
        if(data !== null) {
            config.data = data;

            _drawMesh($$);
        } else {
            _removeMesh($$);
        }
    };

    chart_fn.destroy = function() {
        var $$ = this.internal,
            config = $$.config,
            that = $$.chart_internal_val;

        if(config.data) {
            config.data = null;
        }

        // remove DAT.GUI
        if(that.gui !== null) {
            that.gui.domElement.remove();
        }

        // remove stats
        if(that.stats !== null) {
            that.stats.domElement.remove()
        }

        // remove 3d objects
        that.box = null;
        that.boxOutline = null;
        that.text = null;
    };

    // internal fn : configuration, init
    chart_internal_fn.getDefaultConfig = function() {
        // TODO your coding area (OPTION)
        // you must set => <name>_<name>_<name>: value
        var config = {
            bindto: '#chart',
            data: null,
            // data_rows: undefined,
            // data_columns: undefined,
            // data_columnAliases: undefined,
            size_width: 200,
            size_height: 100,
            isDebugging: false,
            // data_onclick: function() {},
            // data_onmouseover: function() {},
            // data_onmouseout: function() {},
            // data_onselected: function() {},
            // data_onunselected: function() {},
            // tooltip_show: function() {},
            // tooltip_hide: function() {}
            spinner_hide: function() {},
            spinner_show: function() {}
        };

        return config;
    };

    chart_internal_fn.init = function() {
        var $$ = this,
            config = $$.config;

        // TODO your coding area (OPTION)
        // ....
        $$.sizeSetting();

        _drawChart($$);
    };

    chart_internal_fn.sizeSetting = function() {
        var $$ = this,
            config = $$.config,
            that = $$.chart_internal_val;

        var parent_node = $($$.config.bindto).parent();

        if( parent_node.width() > 0 ) $$.config.size_width = parent_node.width();
        if( parent_node.height() > 0 ) $$.config.size_height = parent_node.height();

        that.width = $$.config.size_width,
        that.height = $$.config.size_height;
    };

    ///////////////////////////////
    // TODO your coding area (MUST)
    // .... LINE TEST CODE
    function _drawChart(chart) {
        var $$ = chart;
        var that = $$.chart_internal_val;
        var raycaster, mouse;

        _setupRenderer();
        _setupScene();
        _setupCamera();
        _setupLight();
        _drawMesh($$);
        _setupControl();
        _setClickEvent();

        // for test //
        if($$.config.isDebugging) {
            // _setupStats();
            _setupDatGui($$);
            that.scene.add( new THREE.AxisHelper(1000) );
        }
        // that.scene.add( new THREE.AxisHelper(1000) );
        //////////////

        _render();

        function _setupRenderer() {
            // USING 2D CANVAS WHEN THE BROWSER IS NOT SUPPORT WEBGL ///////////////////
            var test_canvas = document.createElement('canvas'),
                gl = null;
            try {
                gl = (test_canvas.getContext('webgl') || test_canvas.getContext('experimental-webgl'));
            } catch(e) {}

            if(gl) {
                that.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
                // console.log('webgl renderer.');
            } else {
                that.renderer = new THREE.CanvasRenderer();
                // console.log('canvas renderer: no webgl renderer.');
            }
            ////////////////////////////////////////////////////////////////////////////


            // that.renderer = new THREE.WebGLRenderer({antialias: true});
            that.renderer.setClearColor(that.backgroundClearColor, 0);
            that.renderer.setSize(that.width, that.height);
            var bindCanvas = $$.config.bindto;
            $(bindCanvas)[0].appendChild(that.renderer.domElement);
        }

        function _setupScene() {
            that.scene = new THREE.Scene();
        }

        function _setupCamera() {
            // that.camera = new THREE.CombinedCamera(that.width, that.height, that.cameraFov, 1, 1000, -500, 1000);
            // that.camera.toOrthographic();

            // // variable
            // var width = that.width,
            //     height = that.height,
            //     aspect = that.width / that.height,
            //     hyperFocus,
            //     halfHeight, halfWidth, planeHeight, planeWidth;

            // // constant
            // var near = 1,
            //     far = 1000,
            //     fov = that.cameraFov,
            //     orthoNear = -500,
            //     orthoFar = 1000;

            // hyperFocus = ( near + far ) / 2;

            // halfHeight = Math.tan( fov * Math.PI / 180 / 2 ) * hyperFocus;
            // planeHeight = 2 * halfHeight;
            // planeWidth = planeHeight * aspect;
            // halfWidth = planeWidth / 2;

            var cameraBoundary = _getOrthographicCameraLRTB($$);

            that.camera = new THREE.OrthographicCamera(cameraBoundary.left, cameraBoundary.right, cameraBoundary.top, cameraBoundary.bottom, -500, 1000);
            that.camera.updateProjectionMatrix();

            that.camera.position.set(65, 272, -219);

            that.camera.lookAt(that.scene.position);
            that.scene.add(that.camera);
        }

        function _setupControl() {
            that.controls = new THREE.OrbitControls(that.camera, that.renderer.domElement);
            that.controls.enableKeys = false;
            that.controls.addEventListener('change', _textRotate);
            that.controls.addEventListener('change', _render);
            // that.controls.addEventListener('change', that.lightUpdate);
        }

        function _setupLight() {            
            // remove light
            for(var i=0 ; i<that.light.length ; i++) {
                if(that.light[i] !== null) {
                    that.scene.remove(that.light[i]);
                }
            }

            // attach light
            for(var i=0 ; i<that.light.length ; i++) {
                if(that.lightOn[i]) {
                    that.light[i] = new THREE.DirectionalLight(that.lightColor, that.lightIntensity[i]);
                    that.light[i].position.set(that.lightPosition[i][0], that.lightPosition[i][1], that.lightPosition[i][2]);
                    that.scene.add(that.light[i]);
                }
            }
        }

        // function lightUpdate() {
        //     if(that.lightFromCamera) {
        //         that.light.position.copy(that.camera.position);
        //     }
        // }

        function _textRotate() {
            if(that.enableText) {
                var textLength = $$.config.data.dataSet.rows.length;
                for(var i=0 ; i<textLength ; i++) {
                    that.text[i].rotation.x = that.camera.rotation.x;
                    that.text[i].rotation.y = that.camera.rotation.y;
                    that.text[i].rotation.z = that.camera.rotation.z;
                }
            }
        }

        function _setClickEvent() {
            var drawScope = $($$.config.bindto)[0];

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            drawScope.addEventListener('mousedown', _onMouseDown, false);
            drawScope.addEventListener('touchstart', _onTouchStart, false);
        }

        function _onTouchStart(event) {
            event.preventDefault();

            event.clientX = event.touches[0].clientX;
            event.clientY = event.touches[0].clientY;
            _onMouseDown(event);
        }

        function _onMouseDown(event) {
            var intersects;

            event.preventDefault();

            mouse.x = ( event.offsetX / that.width/*renderer.domElement.clientWidth*/ )*2-1;
            mouse.y = -( event.offsetY / that.height/*renderer.domElement.clientHeight*/ )*2+1;

            raycaster.setFromCamera(mouse, that.camera);

            that.box = that.box.filter(function(box) {return box});
            intersects = raycaster.intersectObjects(that.box);

            if(intersects.length > 0) {
                var box = that.box.filter(function(box, ind) {
                    if(box === intersects[0].object) {
                        console.log(ind);
                        return true;
                    }
                    else {
                        return false;
                    }
                })
                // console.log(box);
            }
        }

        function _render() {
            that.renderer.render(that.scene, that.camera);
        }

        function _setupStats() {
            that.stats = new Stats();

            that.stats.setMode(0);

            that.stats.domElement.style.position = 'absolute';
            that.stats.domElement.style.left = '220px';
            that.stats.domElement.style.top = '91px';

            document.body.appendChild( that.stats.domElement );

            var update = function() {
                that.stats.begin();
                that.stats.end();

                requestAnimationFrame( update );
            };

            requestAnimationFrame( update );
        }

        function _setupDatGui(chart) {
            var $$ = chart,
            that = $$.chart_internal_val;

            that.gui = new dat.GUI();
            that.gui.width = 400;
            that.gui.domElement.parentElement.style.top = '91px';

            that.gui.open();

            var commonFor = that.gui.addFolder('common');
            var waferFor = that.gui.addFolder('wafer');
            var shotFor = that.gui.addFolder('shot data');
            var textFor = that.gui.addFolder('label');
            var lightsFor = that.gui.addFolder('lights');

            commonFor.close();
            waferFor.close();
            shotFor.close();
            lightsFor.close();

            commonFor.addColor(that, 'backgroundClearColor').name('Background Color').onChange(function(color) {
                var newColor = new THREE.Color(color);
                that.renderer.setClearColor(newColor, that.backgroundAlpha);

                that.renderer.render(that.scene, that.camera);
            });

            commonFor.add(that, 'backgroundAlpha', 0, 1).name('Background Alpha').step(0.01).onChange(function() {
                that.renderer.setClearColor(that.backgroundClearColor, that.backgroundAlpha);

                that.renderer.render(that.scene, that.camera);
            });

            // commonFor.add(that, 'lightFromCamera').name('Light from Camera').onChange(function() {
            //     that.light.position.copy(that.camera.position);

            //     that.renderer.render(that.scene, that.camera);
            // });

            commonFor.addColor(that, 'phongMaterialSpecular').name('phong material specular').onChange(function() {
                _drawCylinder($$);
                _drawBoxs($$);
                
                that.renderer.render(that.scene, that.camera);
            });

            commonFor.add(that, 'phongMaterialShininess', 0, 100).name('phong material shininess').onChange(function() {
                _drawCylinder($$);
                _drawBoxs($$);
                
                that.renderer.render(that.scene, that.camera);
            });

            commonFor.add(that, 'cameraFov', -100, 100).name('camera fov').onChange(function() {
                that.camera.setFov(that.cameraFov);
                
                that.renderer.render(that.scene, that.camera);
            });

            waferFor.add(that, 'cylinderMaterialType', ['basic', 'lambert', 'phong']).name('Cylinder Material Type').onChange(function() {
                _drawCylinder($$);

                that.renderer.render(that.scene, that.camera);
            });

            waferFor.addColor(that, 'cylinderColor').name('Wafer Color').onChange(function() {
                _drawCylinder($$);

                that.renderer.render(that.scene, that.camera);
            });

            waferFor.add(that, 'cylinderThickness', 1, 30).name('Wafer Thickness').step(0.1).onChange(function() {
                _drawCylinder($$);

                that.renderer.render(that.scene, that.camera);
            });

            shotFor.add(that, 'boxMaterialType', ['basic', 'lambert', 'phong']).name('Box Material Type').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            shotFor.add(that, 'boxBreadthScale', 0, 1).name('Shot Data Breadth Scale').step(0.01).onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            shotFor.add(that, 'boxHeightScale', 0.01, 1).listen().name('Shot Data Height Scale').step(0.01).onChange(function() {
                for(var i=0 ; i<that.box.length ; i++) {
                    that.box[i].position.y = that.box[i].geometry.parameters.height * that.boxHeightScale / 2;
                    that.box[i].scale.y = that.boxHeightScale
                }

                that.renderer.render(that.scene, that.camera);
            });

            shotFor.add(that, 'maxBoxHeight', 1, 500).name('Max Shot Data Height').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            shotFor.add(that, 'boxOutlineEnable').name('Shot Data Outline Enabled').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            shotFor.add(that, 'boxOutlineThickness', 0, 0.1).step(0.001).name('Shot Data Outline Thickness').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            shotFor.addColor(that, 'boxOutlineColor').name('Shot Data Outline Color').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            var shotColor = shotFor.addFolder('Shot Data Color(RGB)');
            shotColor.close();

            shotColor.add(that, 'boxGradientColorsString').name('Gradient Colors').onChange(function() {
                var colorStrings = that.boxGradientColorsString.replace(/\s+/g, ''),
                    colors;
                
                if(colorStrings[colorStrings.length-1] === ',')
                    return;

                colors = colorStrings.split(',');
                if(colors.filter(function(d) {return d.length!==6}).length > 0)
                    return;

                that.boxGradientColors = colors;

                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            shotColor.add(that, 'boxGradientSmoothed', 2, 10000).name('Gradient Color Smoothed').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            textFor.add(that, 'enableText').name('Showing Texts').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            // textFor.add(that.textOption, 'size', 1, 30).step(0.1).name('Size').onChange(function() {
            //     _drawBoxs($$);

            //     that.renderer.render(that.scene, that.camera);
            // });

            // textFor.add(that.textOption, 'height', 1, 30).step(0.1).name('Thickness').onChange(function() {
            //     _drawBoxs($$);

            //     that.renderer.render(that.scene, that.camera);
            // });

            // textFor.add(that.textOption, 'curveSegment', 1, 30).step(1).name('Curve Segment').onChange(function() {
            //     _drawBoxs($$);

            //     that.renderer.render(that.scene, that.camera);
            // });

            // textFor.add(that.textOption, 'bevelEnabled').name('Bevel Enabled').onChange(function() {
            //     _drawBoxs($$);

            //     that.renderer.render(that.scene, that.camera);
            // });

            // textFor.add(that.textOption, 'bevelThickness', 0.1, 3).step(0.01).name('Bevel Thickness').onChange(function() {
            //     _drawBoxs($$);

            //     that.renderer.render(that.scene, that.camera);
            // });

            // textFor.add(that.textOption, 'bevelSize', 0.1, 3).step(0.01).name('Bevel Size').onChange(function() {
            //     _drawBoxs($$);

            //     that.renderer.render(that.scene, that.camera);
            // });

            textFor.addColor(that, 'textColor').name('Color').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            textFor.add(that, 'textMaterialType', ['basic', 'lambert', 'phong']).name('Text Material Type').onChange(function() {
                _drawBoxs($$);

                that.renderer.render(that.scene, that.camera);
            });

            for(var i=0 ; i<that.light.length ; i++) {
                var lightFor = lightsFor.addFolder('light ' + (i+1));

                lightFor.add(that.lightOn, i).name('Turn On Light').onChange(function() {
                    _drawBoxs($$);
                    _drawCylinder($$);
                    _setupLight();

                    that.renderer.render(that.scene, that.camera);
                });

                lightFor.add(that.lightIntensity, i, 0, 1).step(0.1).name('Light Intensity').onChange(function() {
                   _setupLight();

                    that.renderer.render(that.scene, that.camera); 
                });

                lightFor.add(that.lightPosition[i], 0, -1000, 1000).step(1).name('X position').onChange(function() {
                   _setupLight();

                    that.renderer.render(that.scene, that.camera); 
                });
                lightFor.add(that.lightPosition[i], 1, -1000, 1000).step(1).name('Y position').onChange(function() {
                   _setupLight();

                    that.renderer.render(that.scene, that.camera); 
                });
                lightFor.add(that.lightPosition[i], 2, -1000, 1000).step(1).name('Z position').onChange(function() {
                   _setupLight();

                    that.renderer.render(that.scene, that.camera); 
                });
            }
            lightsFor.addColor(that, 'lightColor').name('Color').onChange(function() {
               _setupLight();

                that.renderer.render(that.scene, that.camera); 
            });
        }
    };

    function _getOrthographicCameraLRTB(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        var returnValue = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };

        // variable
        var width = that.width,
            height = that.height,
            aspect = that.width / that.height,
            hyperFocus,
            halfHeight, halfWidth, planeHeight, planeWidth;

        // constant
        var near = 1,
            far = 1000,
            fov = that.cameraFov,
            orthoNear = -500,
            orthoFar = 1000;

        hyperFocus = ( near + far ) / 2;

        halfHeight = Math.tan( fov * Math.PI / 180 / 2 ) * hyperFocus;
        planeHeight = 2 * halfHeight;
        planeWidth = planeHeight * aspect;
        halfWidth = planeWidth / 2;

        returnValue.left = - halfWidth;
        returnValue.right = halfWidth;
        returnValue.top = halfHeight;
        returnValue.bottom = - halfHeight;

        return returnValue;
    }

    function _drawMesh(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        if(that.renderer !== null && $$.config.data !== null && $$.config.data !== undefined && Object.keys($$.config.data).length > 0) {
            var fontLoader = new THREE.FontLoader();
                
            fontLoader.load('assets/styles/fonts/verdana_regular.typeface.js.tf', function(font) {
                that.indexTextOption.font = font;
                that.valueTextOption.font = font;
                
                $$.config.spinner_show();
            
                _drawCylinder($$);
                _drawBoxs($$);
                that.boxHeightScale = 0.1;

                $$.config.spinner_hide();

                _animation($$);
            });
        }
    }

    function _removeMesh(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        // remove cylinder
        if(that.cylinder !== null) {
            that.scene.remove(that.cylinder);
            that.cylinder = null;
        }

        // remove boxes, outlines and texts
        for(var i=0 ; i<that.box.length ; i++) {
            if(that.box[i] !== null) {
                that.scene.remove(that.box[i]);
                that.box[i] = null;
            }

            if(that.boxOutline[i] !== null) {
                that.scene.remove(that.boxOutline[i]);
                that.boxOutline[i] = null;
            }

            if(that.text[i] !== null) {
                that.scene.remove(that.text[i]);
                that.text[i] = null;
            }
        }
        that.box = [];
        that.boxOutline = [];
        that.text = [];

        that.renderer.render(that.scene, that.camera);
    }

    function _drawCylinder(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        var positionX = $$.config.data.dataSet.rows.map(function(d) {return d[$$.config.data.dataSet.columns.indexOf('x')]}),
            positionY = $$.config.data.dataSet.rows.map(function(d) {return -d[$$.config.data.dataSet.columns.indexOf('y')]}),
            // circleRadius = _getCylinderRadius($$),
            circleRadius = 150.0,
            cylinderGeometry = new THREE.CylinderGeometry(circleRadius, circleRadius, that.cylinderThickness, 50),
            cylinderMaterial;
        
        switch(that.cylinderMaterialType) {
            case 'basic':
                cylinderMaterial = new THREE.MeshBasicMaterial({ color: that.cylinderColor });
                break;
            case 'lambert':
                cylinderMaterial = new THREE.MeshLambertMaterial({ color: that.cylinderColor });
                break;
            case 'phong':
                cylinderMaterial = new THREE.MeshPhongMaterial({ color: that.cylinderColor, specular:that.phongMaterialSpecular, shininess:that.phongMaterialShininess });
                break;
            default:
                console.log('error: no existed material type');
                break;
        }
        
        if(that.cylinder !== null) {
            that.scene.remove(that.cylinder);
            that.cylinder = null;
        }

        if(that.triangle !== null) {
            that.scene.remove(that.triangle);
            that.triangle = null;
        }

        // draw triangle ///////////////
        var triangleGeometry = new THREE.Geometry(),
            triangleMatrial = null,
            triangleVertexPoints = [[0, 0], [0, 0], [0, 0]],
            triangleCenterPoint = [0, 0],
            isTriangle = true,
            triangleSize = $$.config.data.shotHeight / 2,
            basePosition = -1,
            trianglePosition = -1,
            trianglePositionRadius = -1,
            basePoints = [
                {
                    x: $$.config.data.dataSet.rows[0][$$.config.data.dataSet.columns.indexOf('x')],
                    y: $$.config.data.dataSet.rows[0][$$.config.data.dataSet.columns.indexOf('y')]
                },
                {
                    x: $$.config.data.dataSet.rows[1][$$.config.data.dataSet.columns.indexOf('x')],
                    y: $$.config.data.dataSet.rows[1][$$.config.data.dataSet.columns.indexOf('y')]
                }
            ];

        switch(that.cylinderMaterialType) {
            case 'basic':
                triangleMatrial = new THREE.MeshBasicMaterial({ color: that.triangleColor, side: THREE.DoubleSide });
                break;
            case 'lambert':
                triangleMatrial = new THREE.MeshLambertMaterial({ color: that.triangleColor, side: THREE.DoubleSide });
                break;
            case 'phong':
                triangleMatrial = new THREE.MeshPhongMaterial({ color: that.triangleColor, specular:that.phongMaterialSpecular, shininess:that.phongMaterialShininess, side: THREE.DoubleSide });
                break;
            default:
                console.log('error: no existed material type');
                break;
        }

        // calculate trianglePosition ///////////////
        // if(basePoints[0].x === basePoints[1].x) {
        //     // base point is 3 or 9
        //     if(basePoints[0].x > 0) {
        //         basePosition = 3;
        //     } else {
        //         basePosition = 9;
        //     }
        // } else if(basePoints[0].y === basePoints[1].y) {
        //     // base point is 12 or 6
        //     if(basePoints[0].y > 0) {
        //         basePosition = 12;
        //     } else {
        //         basePosition = 6;
        //     }
        // }

        // trianglePosition = basePosition !== -1 ? (basePosition + $$.config.data.waferRotation*3/90) % 12 : -1;
        trianglePosition = $$.config.data.waferRotation;
        // trianglePositionRadius = circleRadius + triangleSize*Math.sqrt(3)/2;
        trianglePositionRadius = _getTrianglePositionRadius($$, trianglePosition) + triangleSize;
        /////////////////////////////////////////////

        switch(trianglePosition) {
            case 180: //0
                triangleCenterPoint[0] = 0;
                triangleCenterPoint[1] = Math.sqrt(Math.pow(trianglePositionRadius, 2)+Math.pow(triangleSize/2 ,2)) - triangleSize*Math.sqrt(3)/4;

                triangleVertexPoints[0] = [0, triangleSize*Math.sqrt(3)/4];
                triangleVertexPoints[1] = [-triangleSize/2, -triangleSize*Math.sqrt(3)/4];
                triangleVertexPoints[2] = [triangleSize/2, -triangleSize*Math.sqrt(3)/4];
                break;
            case 270: //3
                triangleCenterPoint[0] = Math.sqrt(Math.pow(trianglePositionRadius, 2)+Math.pow(triangleSize/2 ,2)) - triangleSize*Math.sqrt(3)/4;
                triangleCenterPoint[1] = 0;

                triangleVertexPoints[0] = [-triangleSize*Math.sqrt(3)/4, 0];
                triangleVertexPoints[1] = [triangleSize*Math.sqrt(3)/4, -triangleSize/2];
                triangleVertexPoints[2] = [triangleSize*Math.sqrt(3)/4, triangleSize/2];
                break;
            case 0: //6
                triangleCenterPoint[0] = 0;
                triangleCenterPoint[1] = -(Math.sqrt(Math.pow(trianglePositionRadius, 2)+Math.pow(triangleSize/2 ,2)) - triangleSize*Math.sqrt(3)/4);

                triangleVertexPoints[0] = [0, -triangleSize*Math.sqrt(3)/4];
                triangleVertexPoints[1] = [-triangleSize/2, triangleSize*Math.sqrt(3)/4];
                triangleVertexPoints[2] = [triangleSize/2, triangleSize*Math.sqrt(3)/4];
                break;
            case 90: //9
                triangleCenterPoint[0] = -(Math.sqrt(Math.pow(trianglePositionRadius, 2)+Math.pow(triangleSize/2 ,2)) - triangleSize*Math.sqrt(3)/4);
                triangleCenterPoint[1] = 0;

                triangleVertexPoints[0] = [triangleSize*Math.sqrt(3)/4, 0];
                triangleVertexPoints[1] = [-triangleSize*Math.sqrt(3)/4, -triangleSize/2];
                triangleVertexPoints[2] = [-triangleSize*Math.sqrt(3)/4, triangleSize/2];
                break;
            default:
                isTriangle = false;
                break;
        }

        if(isTriangle) {
            triangleGeometry.vertices.push(
                new THREE.Vector3(triangleVertexPoints[0][0], 0, triangleVertexPoints[0][1]),
                new THREE.Vector3(triangleVertexPoints[2][0], 0, triangleVertexPoints[2][1]),
                new THREE.Vector3(triangleVertexPoints[1][0], 0, triangleVertexPoints[1][1]),
                new THREE.Vector3(triangleVertexPoints[0][0], that.triangleThickness, triangleVertexPoints[0][1]),
                new THREE.Vector3(triangleVertexPoints[2][0], that.triangleThickness, triangleVertexPoints[2][1]),
                new THREE.Vector3(triangleVertexPoints[1][0], that.triangleThickness, triangleVertexPoints[1][1])
            );
            triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
            triangleGeometry.faces.push(new THREE.Face3(3, 4, 5));
            triangleGeometry.faces.push(new THREE.Face3(0, 1, 4));
            triangleGeometry.faces.push(new THREE.Face3(0, 3, 4));
            triangleGeometry.faces.push(new THREE.Face3(1, 2, 4));
            triangleGeometry.faces.push(new THREE.Face3(2, 4, 5));
            triangleGeometry.faces.push(new THREE.Face3(0, 2, 5));
            triangleGeometry.faces.push(new THREE.Face3(0, 3, 5));
            triangleGeometry.computeFaceNormals();

            that.triangle = new THREE.Mesh(triangleGeometry, triangleMatrial);
            that.triangle.position.set(triangleCenterPoint[0], 0, -triangleCenterPoint[1]);

            that.scene.add(that.triangle);
        }
        ////////////////////////////////

        that.cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        that.cylinder.position.set(0, -that.cylinderThickness/2, 0);
        that.scene.add(that.cylinder);

        that.renderer.render(that.scene, that.camera);
    }

    function _getTrianglePositionRadius(chart, trianglePosition) {
        var $$ = chart,
            that = $$.chart_internal_val;

        var targetPoints = [],
            returnVal = null,
            cellHeight = null;

        if(trianglePosition === 180 || trianglePosition === 0) {
            targetPoints = $$.config.data.dataSet.rows.map(function(d) {return d[$$.config.data.dataSet.columns.indexOf('y')]});
            cellHeight = $$.config.data.shotHeight/2;
        } else if(trianglePosition === 270 || trianglePosition === 90) {
            targetPoints = $$.config.data.dataSet.rows.map(function(d) {return d[$$.config.data.dataSet.columns.indexOf('x')]});
            cellHeight = $$.config.data.shotWidth/2;
        }

        targetPoints.sort(function(a, b) {return a-b});

        if(trianglePosition === 180 || trianglePosition === 270) {
            returnVal = Math.abs(targetPoints[targetPoints.length-1]) + cellHeight;
        } else if(trianglePosition === 0 || trianglePosition === 90) {
            returnVal = Math.abs(targetPoints[0]) + cellHeight;
        }

        return returnVal;
    }

    function _getCylinderRadius(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        var preYPoint = null,
            filteredPoints = [],
            diameters = [];

        $$.config.data.dataSet.rows.forEach(function(row, ind, rows) {
            if(ind === 0) {
                preYPoint = row[2];
                filteredPoints.push(rows[ind]);
            } else if(ind === rows.length-1) {
                filteredPoints.push(rows[ind]);
            } else {
                if(row[2] !== preYPoint) {
                    filteredPoints.push(rows[ind-1]);
                    filteredPoints.push(rows[ind]);

                    preYPoint = row[2];
                }
            }
        });

        diameters = filteredPoints.map(function(point) {
            return Math.sqrt(Math.pow(Math.abs(point[$$.config.data.dataSet.columns.indexOf('x')]) + $$.config.data.shotWidth/2, 2) + Math.pow(Math.abs(point[$$.config.data.dataSet.columns.indexOf('y')]) + $$.config.data.shotHeight/2, 2));
        });

        return Math.max.apply(null, diameters);
    }

    function _drawBoxs(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        var positionX = $$.config.data.dataSet.rows.map(function(d) {return d[$$.config.data.dataSet.columns.indexOf('x')]}),
            positionY = $$.config.data.dataSet.rows.map(function(d) {return -d[$$.config.data.dataSet.columns.indexOf('y')]}),
            values = $$.config.data.dataSet.rows.map(function(d) {return d[$$.config.data.dataSet.columns.indexOf('value')]}),
            dataLen = positionX.length,
            gridRowSize = $$.config.data.shotWidth,
            gridColSize = $$.config.data.shotHeight,
            boxRowSize = that.boxBreadthScale * gridRowSize,
            boxColSize = that.boxBreadthScale * gridColSize,
            dataMaxVal = Math.max.apply(null, values),
            dataMinVal = Math.min.apply(null, values),
            faceIndices = ['a', 'b', 'c', 'd'], rainbow, color, face, numberOfSides, vertexIndex;
        var boxGeometry, boxMaterial, boxHeight;

        // if all value is equal...
        if(dataMaxVal === dataMinVal) {
            dataMaxVal = dataMinVal + 10;
        }

        // TEXT
        var indexTextGeometry, valueTextGeometry, indexTextMaterial, valueTextMaterial, indexLabelMesh, valueLabelMesh,
            scanDirctionLabel = null,
            indexLabel = $$.config.data.dataSet.rows.map(function(d) { return d[$$.config.data.dataSet.columns.indexOf('index')];}),
            valueLabel = $$.config.data.dataSet.rows.map(function(d) { return d[$$.config.data.dataSet.columns.indexOf('value')];});

        if($$.config.data.scanDirections) {
            scanDirctionLabel = $$.config.data.scanDirections.rows.map(function(d) {return d[$$.config.data.scanDirections.columns.indexOf('value')];});
        }

        rainbow = new Rainbow();
        rainbow.setSpectrumByArray(that.boxGradientColors);
        rainbow.setNumberRange(0, that.boxGradientSmoothed-1);

        for(var i=0 ; i<that.box.length ; i++) {
            if(that.box[i] !== null) {
                that.scene.remove(that.box[i]);
                that.box[i] = null;
            }

            if(that.boxOutline[i] !== null) {
                that.scene.remove(that.boxOutline[i]);
                that.boxOutline[i] = null;
            }

            if(that.text[i] !== null) {
                that.scene.remove(that.text[i]);
                that.text[i] = null;
            }
        }

        for(var i=0 ; i<positionX.length ; i++) {
            // if(that.box[i] !== null) {
            //     that.scene.remove(that.box[i]);
            //     that.box[i] = null;
            // }
            // if(that.boxOutline[i] !== null) {
            //     that.scene.remove(that.boxOutline[i]);
            //     that.boxOutline[i] = null;
            // }

            // // TEXT ///////////////////
            // if(that.text[i] !== null) {
            //     that.scene.remove(that.text[i]);
            //     that.text[i] = null;
            // }
            // ///////////////////////////
            
            // draw box
            boxHeight = (values[i] - dataMinVal) * (that.maxBoxHeight - that.minBoxHeight) / (dataMaxVal - dataMinVal) + that.minBoxHeight;
            boxGeometry = new THREE.BoxGeometry(boxRowSize, boxHeight, boxColSize, 1, that.boxHeightSegment, 1);
            switch(that.boxMaterialType) {
                case 'basic':
                    boxMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
                    break;
                case 'lambert':
                    boxMaterial = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors });
                    break;
                case 'phong':
                    boxMaterial = new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, specular:that.phongMaterialSpecular, shininess:that.phongMaterialShininess });
                    break;
                default:
                    console.log('error: no existed material type');
                    break;
            }

            // set color
            for(var j=0 ; j<boxGeometry.vertices.length ; j++) {
                var realPoint = boxGeometry.vertices[j].y + boxHeight/2;
                var vertexColor = rainbow.colourAt((that.boxGradientSmoothed - 1) * (realPoint - that.maxBoxHeight) / (that.minBoxHeight - that.maxBoxHeight));
                boxGeometry.colors[j] = new THREE.Color('#' + vertexColor);
            }
            for(var j=0 ; j<boxGeometry.faces.length ; j++) {
                face = boxGeometry.faces[j];
                numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
                for( var k = 0; k<numberOfSides; k++ ) {
                    vertexIndex = face[faceIndices[k]];
                    face.vertexColors[k] = boxGeometry.colors[vertexIndex];
                }
            }

            // create Mesh
            that.box[i] = new THREE.Mesh(
                boxGeometry,
                boxMaterial
            );

            that.box[i].position.set(
                positionX[i],
                boxHeight/2,
                positionY[i]
            );

            // outline
            if(that.boxOutlineEnable) {
                var outlineMaterial = new THREE.MeshBasicMaterial( { color: that.boxOutlineColor, side: THREE.BackSide } );
                that.boxOutline[i] = new THREE.Mesh( boxGeometry, outlineMaterial );
                that.boxOutline[i].position.set(
                    that.box[i].position.x,
                    that.box[i].position.y,
                    that.box[i].position.z
                );
                that.boxOutline[i].scale.multiplyScalar(1 + that.boxOutlineThickness);
                that.scene.add( that.boxOutline[i] );
            }

            // TEXT ////////////////////////////////////////////////
            if(that.enableText) {
                if(scanDirctionLabel) {
                    indexTextGeometry = new THREE.TextGeometry(indexLabel[i] + ' ' + scanDirctionLabel[i], that.indexTextOption);
                } else {
                    indexTextGeometry = new THREE.TextGeometry(indexLabel[i], that.indexTextOption);
                }

                indexTextGeometry.center();

                valueTextGeometry = new THREE.TextGeometry(valueLabel[i], that.valueTextOption);
                valueTextGeometry.center();
                
                var valCol = new THREE.Color(boxGeometry.colors[0]);
                valCol.setHSL(valCol.getHSL().h, valCol.getHSL().s, valCol.getHSL().l/2);

                switch(that.textMaterialType) {
                    case 'basic':
                        indexTextMaterial = new THREE.MeshBasicMaterial({ color: that.textColor });
                        valueTextMaterial = new THREE.MeshBasicMaterial({ color: valCol });
                        break;
                    case 'lambert':
                        indexTextMaterial = new THREE.MeshLambertMaterial({ color: that.textColor });
                        valueTextMaterial = new THREE.MeshLambertMaterial({ color: valCol });
                        break;
                    case 'phong':
                        indexTextMaterial = new THREE.MeshPhongMaterial({ color: that.textColor, specular:that.phongMaterialSpecular, shininess:that.phongMaterialShininess });
                        valueTextMaterial = new THREE.MeshPhongMaterial({ color: valCol, specular:that.phongMaterialSpecular, shininess:that.phongMaterialShininess });
                        break;
                    default:
                        console.log('error: no existed material type');
                        break;
                }

                // create Mesh
                that.text[i] = new THREE.Group();
                indexLabelMesh = new THREE.Mesh(indexTextGeometry, indexTextMaterial);
                valueLabelMesh = new THREE.Mesh(valueTextGeometry, valueTextMaterial);

                indexLabelMesh.position.set(
                    0, that.indexTextOption.size*3/4, 0
                );
                valueLabelMesh.position.set(
                    0, -that.valueTextOption.size*3/4, 0
                );

                that.text[i].add(indexLabelMesh);
                that.text[i].add(valueLabelMesh);

                that.text[i].rotation.x = that.camera.rotation.x;
                that.text[i].rotation.y = that.camera.rotation.y;
                that.text[i].rotation.z = that.camera.rotation.z;

                that.text[i].position.set(positionX[i], boxHeight + that.indexTextOption.size*2, positionY[i]);

                that.scene.add(that.text[i]);
            }
            ////////////////////////////////////////////////////////

            that.scene.add(that.box[i]);
            that.renderer.render(that.scene, that.camera);
        }
    }

    function _animation(chart) {
        var $$ = chart,
            that = $$.chart_internal_val;

        var aniVar;
        var boxLength = $$.config.data.dataSet.rows.length;

        if(that.boxHeightScale >=1) {
            that.boxHeightScale = 1;
            aniVar = Math.sin((Math.PI/2) * that.boxHeightScale);
            for(var i=0 ; i<boxLength ; i++) {

                that.box[i].position.y = that.box[i].geometry.parameters.height * aniVar / 2;
                that.box[i].scale.y = aniVar;

                if(that.boxOutlineEnable) {
                    that.boxOutline[i].position.y = that.boxOutline[i].geometry.parameters.height * aniVar / 2;
                    that.boxOutline[i].scale.y = aniVar;
                }

                if(that.enableText) {
                    that.text[i].position.y = that.box[i].geometry.parameters.height * aniVar + that.indexTextOption.size*2;
                }
            }

            that.renderer.render(that.scene, that.camera);
            window.cancelAnimationFrame(that.requestId);
            that.requestId = null;
        } else {
            aniVar = Math.sin((Math.PI/2) * that.boxHeightScale);
            for(var i=0 ; i<boxLength ; i++) {
                that.box[i].position.y = that.box[i].geometry.parameters.height * aniVar / 2;
                that.box[i].scale.y = aniVar;
                
                if(that.boxOutlineEnable) {
                    that.boxOutline[i].position.y = that.boxOutline[i].geometry.parameters.height * aniVar / 2;
                    that.boxOutline[i].scale.y = aniVar;
                }

                if(that.enableText) {
                    that.text[i].position.y = that.box[i].geometry.parameters.height * aniVar + that.indexTextOption.size*2;
                }
            }
            that.boxHeightScale += that.speed;
            that.speed += that.accel;

            that.renderer.render(that.scene, that.camera);

            setTimeout(function() {
                that.requestId = requestAnimationFrame(function(){
                    _animation($$);
                });
            }, 1000/that.aniFps);
        }
    }

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
        define('ThreeDWaferMap', ['d3'], ThreeDWaferMap);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = ThreeDWaferMap;
    } else {
        window.ThreeDWaferMap = ThreeDWaferMap;
    }

})(window, window.d3);
