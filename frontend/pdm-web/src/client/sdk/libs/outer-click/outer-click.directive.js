(function() {
    'use strict';

    angular
        .module('offClick', [])
        .directive('offClick', offClick);

    /* @ngInject */
    function offClick( $document, $parse ) {
        return {
            restrict: 'A',
            priority: 1,
            scope: { fn:'&offClick' },
            link: function (scope, element, attrs, group) {
                scope.$on('$destroy', function(ev) {
                    $('.'+parentDocument).off('click');
                    element.remove();
                });

                var clicked = false;
                var parent = element,
                    parentDocument = attrs.parentDocument;

                parent.click(function() {
                    clicked = true;
                });

                function callFn() {
                    scope.$apply(scope.fn());
                }

                $('.'+parentDocument).on('click', function(event) {
                    if (!clicked) {
                        callFn();
                    }
                    clicked = false;
                });

            }
        };
    }

})();
