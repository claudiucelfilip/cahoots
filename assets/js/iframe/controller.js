(function (app) {
    'use strict';
    app.controller('FrameCtrl',
        function ($scope, Pusher, $rootScope, Constants, $timeout, Video, Message) {
            
            $scope.frameUrl = '';
            $scope.frameApi = Constants.api + '';

        });
}(angular.module('cahoots')));