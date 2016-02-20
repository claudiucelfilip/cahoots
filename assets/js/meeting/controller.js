(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, Pusher, Constants, Video, Speech) {

            // Chat
            $scope.messages = [];

            $scope.messagesChannel = Pusher.subscribe('private-room-' + $stateParams.roomId);
            $scope.messagesChannel.bind(Constants.events.messageCreated, function (data) {
                $scope.messages.push(data);

            });

            $scope.sendMessage = function () {
                $scope.messagesChannel.trigger(Constants.events.messageCreated, {
                    socketId: Pusher.socketId,
                    text: $scope.message,
                    date: new Date()
                })
            };

            // Video
            Video.init($stateParams.roomId);

            // Speech
            Speech.init();

            // Translations
        });

}(angular.module('cahoots')));
