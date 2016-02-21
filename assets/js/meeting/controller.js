(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, $localStorage, Pusher, Constants, Video, Speech, Api, DataChan, Error, Utils, Room, roomDetails) {
            Room.setId($stateParams.roomId);

            Pusher.init(Room.getId());
            DataChan.init(Room.getId());


            // Chat
            $scope.messages = [];

            DataChan.on(Constants.events.message, function (data) {
                var index = _.findIndex($scope.messages, function (item) {
                    return item.id == data.id
                });
                if (index < 0) {
                    $scope.messages.push(data);
                } else {
                    $scope.messages[index] = data;
                }

                $scope.currentMessage = data.text;



                if (!$scope.$$phase) {
                    $scope.$digest();
                }

            });


            $scope.sendMessage = function (message) {
                var payload = {
                    id: Utils.generateId(),
                    text: message,
                    streamId: Video.myStream.id
                };
                DataChan.emit(Constants.events.message, payload);
            };



            // Video
            Video.init(Room.getId());

            $scope.recording = false;

            $scope.startRecording = function () {
                Video.startRecording();
                $scope.recording = true;
            };

            $scope.stopRecording = function () {
                Video.stopRecording();
                $scope.recording = false;
            };

            // Speech
            Speech.init();

            // Translations
        });

}(angular.module('cahoots')));
