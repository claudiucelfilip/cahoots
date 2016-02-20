(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, Pusher, Constants, Video, Speech, DataChan, Api) {

            Pusher.setRoomId($stateParams.roomId);
            DataChan.init($stateParams.roomId);

            // Chat
            $scope.messages = [];
            $scope.currentMessage;
            $scope.currentStreamId;

            Pusher.on(Constants.events.message, function(data) {
                var index = _.findIndex($scope.messages, function(item) {
                    return item.id == data.id
                });
                if (index < 0) {
                    $scope.messages.push(data);
                } else {
                    $scope.messages[index] = data;
                }

                $scope.currentMessage = data.text;
                $scope.currentStreamId = data.streamId;
                $scope.$digest();
            });


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
