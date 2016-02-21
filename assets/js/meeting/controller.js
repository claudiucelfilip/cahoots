(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, $localStorage, $rootScope, Pusher, Constants, Video, Speech, Api, DataChan, Error, Utils, Room, $timeout, roomDetails) {

            var timeout;

            Room.setId($stateParams.roomId);

            Pusher.init(Room.getId());

            // Modal
            $scope.showModal = false;
            $scope.toggleModal = function(){
                $scope.showModal = !$scope.showModal;
            };


            // Chat Handle Events
            $scope.messages = [];

            $scope.handleCaption = function(event, data) {
                if(data) {
                    $scope.currentMessage = data.text;

                    $timeout.cancel(timeout);
                    timeout = $timeout(function() { $scope.currentMessage = ''; }, 1500);

                    if(data.streamId) {
                        if(data.streamId !== Video.myStream.id){
                            Video.setMainStreamById(data.streamId);
                        }

                        // Move active class around
                        var index = _.findIndex(Video.streams, function(item) {
                            return item.id === data.streamId;
                        });

                        if(Video.streams[index]) {
                            $(Video.streams[index].el).addClass('active').siblings().removeClass('active');
                        }
                    }

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }

                } else {
                    $scope.currentMessage = event.text;

                    $timeout.cancel(timeout);
                    timeout = $timeout(function() { $scope.currentMessage = ''; }, 1500);

                    if(event.streamId) {
                        if(event.streamId !== Video.myStream.id){
                            Video.setMainStreamById(event.streamId);
                        }

                        // Move active class around
                        var index = _.findIndex(Video.streams, function(item) {
                            return item.id === event.streamId;
                        });

                        if(Video.streams[index]) {
                            $(Video.streams[index].el).addClass('active').siblings().removeClass('active');
                        }
                    }

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                }
            };

            $scope.handleMessage = function(event, data) {
                if(data) {
                    $scope.messages.push(data);
                } else {
                    $scope.messages.push(event);
                }
            };

            Pusher.on(Constants.events.message, $scope.handleMessage);
            Pusher.on(Constants.events.caption, $scope.handleCaption);
            $rootScope.$on(Constants.events.captionLocal, $scope.handleCaption);
            $rootScope.$on(Constants.events.message, $scope.handleMessage);

            $scope.sendMessage = function (message) {
                var payload = {
                    id: Utils.generateId(),
                    text: message,
                    userName: $localStorage.userName
                };

                Pusher.emit(Constants.events.message, payload);
                $scope.handleMessage(payload);
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
