(function (app) {
    'use strict';
    app.controller('FrameCtrl',
        function ($scope, Pusher, $rootScope, Constants, $timeout, Video, Message) {

            $scope.frameUrl = 'http://';
            $scope.frameApi = Constants.api.url + 'proxy/';
            $scope.$watch('frameUrl', function(newValue, previousValue) {
                if (newValue !== previousValue) {
                    Pusher.emit(Constants.events.changeFrameLink, newValue);
                }
            });
            Pusher.on(Constants.events.changeFrameLink, function(data) {

                $scope.frameUrl = data;

                if (!$scope.$$phase) {
                    $scope.$digest();
                }
            });


        });
}(angular.module('cahoots')));