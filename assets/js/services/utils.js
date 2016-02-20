(function () {
    'use strict';

    angular
        .module('cahoots')
        .service('Utils',
            function () {
                this.generateId = function () {
                    return Math.floor(Math.random() * 10000) + '';
                }
            }
        );
}());
