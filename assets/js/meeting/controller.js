(function(app) {
    'use strict';

    app.controller('MeetingCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        function($scope, $state, $stateParams) {
            console.log($stateParams)
        }
    ]);

}(angular.module('cahoots')));
