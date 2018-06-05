(function(window) {
    'use strict';

    var chartStyleUtil = {
        getDefaultColor : ['#2196f3', '#ff9800', '#4caf50', '#9c27b0', '#ffdf07', '#ff538d', '#795548', '#673ab7', '#00d2d4', '#ffc107', '#3f51b5', '#98d734', '#607d8b', '#9e9e9e'], //modify color
        // getDefaultColor : ['#5682c8', '#8b9c7e', '#c0afa1', '#5c6992', '#358ab1', '#b29b5e', '#8f9cdc', '#90c44f', '#6c5d9d', '#7c838a',
        //                   '#4e9f9b', '#c7c598', '#a5a064', '#9e6c94', '#4f6aa0', '#4ea9c4', '#5c9252', '#48b374', '#9b8241', '#c09a83'],
        rgb2hex : function (rgb){//rgb를 hex형으로 변환.
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
                   ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                   ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                   ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
        },
        rgba2rgb : function (r, g, b, a) {
            var r3 = Math.round(((1 - a) * 255) + (a * r))
            var g3 = Math.round(((1 - a) * 255) + (a * g))
            var b3 = Math.round(((1 - a) * 255) + (a * b))
            return "rgb("+r3+","+g3+","+b3+")";
        },
        hex2rgb : function (hex) {
            if( hex.length > 7 ) {//hex 형이 아니므로 변환한다.
                hex = chartStyleUtil.rgb2hex(hex);
            }

            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = String(hex).replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        colorLuminance : function (hex, lum) {//ex : hex code = #ffffff, lum = -0.4 - -40%
            if( hex.length > 7 ) {//hex 형이 아니므로 변환한다.
                hex = chartStyleUtil.rgb2hex(hex);
            }
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i*2,2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00"+c).substr(c.length);
            }
            return rgb;
        },
        getIndexColor : function ( index ) {//index 에 따라 color를 가져온다.
            var colors = chartStyleUtil.getDefaultColor;
            var colorindex = index > colors.length-1? index%colors.length:index;
            return colors[colorindex];
        },
        // getIndexColorForGanttLot : function ( index ) {
        //     var colors = ['#ff3d3d', '#ff5933', '#ff7633', '#ff9333', '#ffb847', '#ffd400', '#b3de00', '#66d200', '#25c500', '#21b100',
        //                   '#19baa1', '#00c7d1', '#00a7e8', '#3d7cff', '#6270f2', '#8e5def', '#ba3ed2', '#e14aa3', '#ff4b80', '#c1aa96'];
        //
        //     var colorindex = index > colors.length-1? index%colors.length:index;
        //     return colors[colorindex];
        // },
        // getIndexColorForGanttWafer : function ( index ) {
        //     var colors = ['#b3de00', '#66d200', '#25c500', '#21b100', '#19baa1', '#00c7d1', '#00a7e8', '#3d7cff', '#6270f2', '#8e5def'];
        //
        //     var colorindex = index > colors.length-1? index%colors.length:index;
        //     return colors[colorindex];
        // },
        getCommonColor : function ( data, index ) {//index 에 따라 color를 가져온다.
            var colors = chartStyleUtil.getDefaultColor;
            var colorindex = index > colors.length-1? index%colors.length:index;
            return colors[colorindex];
        },
        getStatusColor : function ( status ) {//status별로 color 가져온다.
            var color = '#5f7593';
            switch ( status ) {
                case 'active':
                    color = '#439ef4';
                    break;
                case 'safe':
                    color = '#07b528';
                    break;
                case 'comfortable':
                    color = '#85cd31';
                    break;
                case 'warning':
                    color = '#fff557';
                    break;
                case 'danger':
                    color = '#ff8d39';
                    break;
                case 'critical':
                    color = '#ff3a39';
                    break;
                case 'dead':
                    color = '#444444';
                    break;
                default:
                    color = '#5f7593';
                break;
            }
            return color;
        }
    }

    window.chartStyleUtil = chartStyleUtil ;

})(window);
