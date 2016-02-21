(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, $localStorage, $rootScope, Pusher, Constants, Video, Speech, Api, DataChan, Error, Utils, Room, $timeout, roomDetails) {



            Room.setId($stateParams.roomId);

            Pusher.init(Room.getId());



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

            $scope.toggleSide = function(feature, force) {
                if (typeof force !== 'undefined') {
                    $scope.side.show = force;
                } else {
                    $scope.side.show = !$scope.side.show;
                }

                $scope.toggleFeature(feature);
            };

            $scope.toggleScreenShare = function() {
                var feature = 'screen-share';
                if (!$scope.isFeatureActive(feature)) {
                    Video.shareScreen(function(error) {
                        removeFeature(feature);
                    });
                    addFeature(feature);
                } else {
                    Video.stopScreen();
                    removeFeature(feature);
                }
            };

            $scope.toggleFeature = function(feature, force) {
                var index = $scope.side.activeFeatures.indexOf(feature);

                if (index === -1) {
                    $scope.side.activeFeatures.push(feature);
                } else {
                    $scope.side.activeFeatures.splice(index, 1);
                }
            };

            function addFeature(feature) {
                var index = $scope.side.activeFeatures.indexOf(feature);

                if (index === -1) {
                    $scope.side.activeFeatures.push(feature);
                }
            }

            function removeFeature(feature) {
                var index = $scope.side.activeFeatures.indexOf(feature);

                if (index !== -1) {
                    $scope.side.activeFeatures.splice(index, 1);
                }
            }


            $scope.toggleMuteAudio = function(feature) {
                Video.toggleMuteAudio();
                $scope.toggleFeature(feature);
            };

            $scope.toggleMuteVideo = function(feature) {
                Video.toggleMuteVideo();
                $scope.toggleFeature(feature);
            };

            $scope.isFeatureActive = function(feature) {
                return $scope.side.activeFeatures.indexOf(feature) !== -1;
            };
        });

}(angular.module('cahoots')));
