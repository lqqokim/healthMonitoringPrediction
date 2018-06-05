(function() {
    'use strict';

    angular
        .module('multiCombo',  ['offClick'])
        .directive('a3pMultiCombo', a3pMultiCombo);

    /* @ngInject */
    function a3pMultiCombo( $document ) {
        return {
            restrict: 'EA',
            scope: {
                title: '=',
                isMultiple: '=',
                list: '=',
                idField: '=',
                labelField: '=',
                openEvent: '&',
                selectChange: '&',
                isShowSelectedList: '=',
                selectedList: '=',
                closeEvent: '&',
                autoFocus: '='
            },
            templateUrl: 'sdk/lib/multiselector/multi-selector.html',
            link: link,
            priority: 10,
            require: '?^a3pMultiComboGroup',
            controller: a3pMultiComboCtrl,
            controllerAs: 'a3pMultiCombo',
            bindToController: true
        };

        function link(scope, element, attrs, group) {
            scope.$on('$destroy', function(ev) {
                element.remove();
            });

            scope.focus = function focus(){
                var searchBox = element.find('input')[0];
                if (searchBox) {
                    if(scope.a3pMultiCombo.autoFocus) {
                        searchBox.focus();
                    }
                }
            };
        }
    }

    /* @ngInject */
    function a3pMultiComboCtrl($rootScope, $scope, $q, $filter, stateManager, ActionType, widgetConfiguration, $timeout) {
        var vm = this;
            vm.isDisabled = true,
            vm.originList = null,//original data
            vm.filterList = null,//filter 된 list
            vm.selectText = 'Select',//선택내용을 표시할 text
            vm.titleText = $scope.a3pMultiCombo.title, //label
            vm.isMulti = $scope.a3pMultiCombo.isMultiple, //다중선택 여부
            vm.datafield = 'id',
            vm.labelfield = 'name',
            vm.isShowList = true;

            //multi selection 관련
            vm.selectedItems = [];
            vm.tempSelectedItems = [];
            vm.showSelectedItems = [];

        var isLoad = false;

        _init();

        function _init() {
            vm.isAllChecked = false;
            if( $scope.a3pMultiCombo.isShowSelectedList === false ) {
                vm.isShowList = $scope.a3pMultiCombo.isShowSelectedList;
            }

            $scope.matchName = function(query) {
                return function(item) {
                    return item[vm.labelfield].match(query);
                }
            };

            $scope.$watch('a3pMultiCombo.list', function (newvalue, oldevalue) {
                if( newvalue && newvalue.length > 0 ) {
                    vm.isDisabled = false;
                    vm.originList = newvalue;
                    vm.filterList = vm.originList.slice(0);
                    //list 초기화시에는 모든 저장 데이터도 초기화 된다.
                    _clearData();
                    if( $scope.a3pMultiCombo.selectedList ) {//처음 로딩시 선택된 리스트가 있다면 반영해준다.
                        vm.tempSelectedItems = $scope.a3pMultiCombo.selectedList.slice(0);
                        $scope.a3pMultiCombo.selectedList = null;
                        _change(true);
                    }
                } else {
                    vm.originList = newvalue;
                    vm.filterList = newvalue;
                    _disable();
                }
            } );

            if( $scope.a3pMultiCombo.idField ) {
                vm.datafield = $scope.a3pMultiCombo.idField;
            }
            if( $scope.a3pMultiCombo.labelField ) {
                vm.labelfield = $scope.a3pMultiCombo.labelField;
            }

            $rootScope.$on('multi-selector-close', function( ev, data ){
                if(vm.open){
                    $timeout(function(){
                        vm.closeDropdown();
                    }, 100);
                }
            })
        }

        vm.closeDropdown = function () {
            if( vm.open === false ) return;
            vm.open = false;

            $rootScope.$broadcast('multi-selector-menu-close');
            if( $scope.a3pMultiCombo.closeEvent ){
                $scope.a3pMultiCombo.closeEvent();
            }
        }

        vm.openDropdown = function () {
            if(!vm.isDisabled){
                vm.open = !vm.open;
            }
            $scope.a3pMultiCombo.openEvent();
            $rootScope.$broadcast('multi-selector-menu-open');
            //if( vm.open ) $scope.focus();
        }

        vm.checkedAll = function () {
            vm.isAllChecked = !vm.isAllChecked;
            if( vm.isAllChecked ) {
                _selectAll();
            } else {
                _deselectAll();
            }
        }

        vm.removeItem = function(itemId) {
            var intIndex = -1;
            angular.forEach( vm.filterList, function (item, index) {
                if (item[vm.datafield] == itemId) {
                    intIndex = index;
                }
            });
            if (intIndex >= 0) {
                vm.tempSelectedItems.splice(intIndex, 1);
            }
            _change();
        }

        vm.showRemoveItem = function(selectedItem) {
            var intIndex = -1;
            angular.forEach( vm.tempSelectedItems, function (item, index) {
                if (item == selectedItem[vm.datafield]) {
                    intIndex = index;
                }
            });
            if (intIndex >= 0) {
                vm.tempSelectedItems.splice(intIndex, 1);
            } else {
                vm.tempSelectedItems.push(selectedItem[vm.datafield]);
            }
            _change();
            _updateCheckAll();
        }

        vm.toggleSelectItem = function (selectedItem) {
            if( vm.isMulti ) {
                var intIndex = -1;
                angular.forEach( vm.tempSelectedItems, function (item, index) {
                    if (item == selectedItem[vm.datafield]) {
                        intIndex = index;
                    }
                });
                if (intIndex >= 0) {
                    vm.tempSelectedItems.splice(intIndex, 1);
                } else {
                    vm.tempSelectedItems.push(selectedItem[vm.datafield]);
                }

                _updateCheckAll();
            } else {
                vm.tempSelectedItems = [];
                vm.tempSelectedItems.push(selectedItem[vm.datafield]);
                vm.closeDropdown();
            }
            _change();
        }

        vm.getClassName = function (selectedItem) {
            var varClassName = {visibility:'hidden'};
            if( vm.isMulti ) {
                angular.forEach( vm.tempSelectedItems, function (item, index) {
                    if (item == selectedItem[vm.datafield]) {
                        varClassName = {visibility:'visible'};
                    }
                });
            } else {
                if (vm.tempSelectedItems[0] == selectedItem[vm.datafield]) {
                    varClassName = {visibility:'visible'};
                }
            }
            return (varClassName);
        }

        function _updateCheckAll() {
            vm.isAllChecked = vm.tempSelectedItems.length === vm.filterList.length;
        }

        function _selectAll() {
            vm.isAllChecked = true;
            vm.tempSelectedItems = [];
            angular.forEach( vm.filterList, function (item, index) {
                vm.tempSelectedItems.push(item[vm.datafield]);
            });
            _change();
        }

        function _deselectAll() {
            vm.isAllChecked = false;
            vm.tempSelectedItems = [];
            _change();
        }

        function _disable() {
            vm.is_clearDatad = true;
            vm.open = false;
            vm.isDisabled = true;
            _clearData();
        }

        function _clearData() {
            vm.isAllChecked = false;
            vm.selectText = 'Select';
            vm.selectedItems = [];
            vm.tempSelectedItems = [];
            vm.showSelectedItems = [];
        }

        function _change( init ) {
            if( !vm.isDisabled ) {
                if( !vm.isMulti ) {//change function이 있다면 해당 function 실행.
                    vm.selectedItems = vm.tempSelectedItems.slice(0);
                    vm.selectText = _getItemLabel( vm.selectedItems[0] );
                    if( $scope.a3pMultiCombo.selectChange ) {
                        $scope.a3pMultiCombo.selectChange({ selectedItems: vm.selectedItems, isRead:init, alias: _getAlias( vm.originList, vm.selectedItems ), isOpen: vm.open });
                    }
                    return;
                }
                var isValue = true;
                if( vm.tempSelectedItems.length != vm.selectedItems.length ) {//사이즈가 다르면 무조건 반영.
                    isValue = false;
                } else {
                    for( var i = 0; i < vm.tempSelectedItems.length; i++ ) {
                        if( $.inArray( vm.selectedItems[i] , vm.tempSelectedItems ) != -1 ) {

                        } else {//하나라도 없으면 넣는다.
                            isValue = false;
                            break;
                        }
                    }
                }
                if( !isValue ) {
                    vm.selectedItems = vm.tempSelectedItems.slice(0);
                    if( vm.selectedItems.length > 0 ) {
                        vm.selectText = vm.selectedItems.length+' Select';
                        if( vm.selectedItems.length === vm.filterList.length ) {
                            vm.isAllChecked = true;
                        } else {
                            vm.isAllChecked = false;
                        }
                    } else {
                        vm.selectText = 'Select';
                    }
                }
                isLoad = false;
                if( $scope.a3pMultiCombo.selectChange ) {
                    $scope.a3pMultiCombo.selectChange({ selectedItems: vm.selectedItems, isRead:init, alias: _getAlias( vm.originList, vm.selectedItems ), isOpen: vm.open });
                }
                if( vm.isShowList ) {
                    vm.showSelectedItems = vm.originList.filter( function(d, i) {//선택된 것만 리스팅한다
                        var isData = false;
                        for( var j = 0; j < vm.selectedItems.length; j++ ) {
                            if( d[vm.datafield] === vm.selectedItems[j] ) {
                                isData = true;
                                break;
                            }
                        }
                        return isData});
                }
            }
        }

        function _getAlias( orgData, targetData ) {
            var returnList = [];
            if( targetData !== null ) {
                for( var i = 0; i < orgData.length; i++ ) {
                    for( var j = 0; j < targetData.length; j++ ){
                        if( orgData[i][vm.datafield] === targetData[j] ){
                            returnList.push( orgData[i][vm.labelfield] );
                            break;
                        }
                    }
                }
            }else{
                returnList = null;
            }
            return returnList;
        }

        function _getItemLabel( id ) {
            var returnLabel = '';
            for( var i = 0; i < vm.originList.length; i++ ) {
                if( vm.originList[i][vm.datafield] === id ) {
                    returnLabel = vm.originList[i][vm.labelfield];
                    break;
                }
            }
            return returnLabel;
        }
    }

})();
