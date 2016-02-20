(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, Pusher, Constants, Video, Speech, Api) {

            Pusher.setRoomId($stateParams.roomId);

            // Chat
            $scope.messages = [];
            //Api.getMessages({ second: $stateRoomId }, function(data) {
            //    $scope.messages = data;
                Pusher.getMessages(function (data) {
                    $scope.messages.push(data);
                });
            //});


            $scope.sendMessage = function (message) {
                $scope.messages.push(Pusher.sendMessage(message));
            };

            // Video
            Video.init($stateParams.roomId);

            // Speech
            Speech.init();

            // Translations
        });

}(angular.module('cahoots')));
