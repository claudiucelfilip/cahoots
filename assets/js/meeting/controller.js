(function(app) {
    'use strict';

    app.controller('MeetingCtrl', [
        function($scope, $state, $stateParams, Pusher, Constants) {

            // Chat
            $scope.messages = [];

            $scope.messagesChannel = Pusher.subscribe('private-room-' + $stateParams.roomId);
            $scope.messagesChannel.bind(Constants.events.messageCreated, function(data) {
                $scope.messages.push(data);

            });

            $scope.sendMessage = function() {
                $scope.messagesChannel.trigger(Constants.events.messageCreated, {
                    socketId: Pusher.socketId,
                    text: $scope.message,
                    date: new Date()
                })
            }

            // Video

            // Speech

            // Translations
        }
    ]);

}(angular.module('cahoots')));
