(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, $localStorage, $rootScope, Pusher, Constants, Video, Speech, Api, DataChan, Error, Utils, Room, $timeout, $sce, roomDetails) {

            $scope.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

            Room.setId($stateParams.roomId);

            Pusher.init(Room.getId());

            // Modal
            $scope.showModal = false;
            $scope.toggleModal = function() {
                $scope.showModal = !$scope.showModal;
            };

            // Smart sharing
            function getFrameTargetElement(objI) {
                var objFrame = objI.contentWindow;
                if(window.pageYOffset == undefined) {
                    objFrame = (objFrame .document.documentElement) ? objFrame .document.documentElement : objFrame =document.body;
                }
                return objFrame ;
            }

            $('#ifr').load(function () {
                var frame = getFrameTargetElement(document.getElementById('ifr'));

                frame.onclick = function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                }

                frame.onscroll = function () {
                    console.log(frame.scrollX);
                    console.log(frame.scrollY);
                }
            });

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

            // Actions
            $scope.toggleSide = function(feature, force) {
                if (typeof force !== 'undefined') {
                    $scope.side.show = force;
                } else {
                    $scope.side.show = !$scope.side.show;
                }

                $scope.toggleFeature(feature);
            };

            $scope.toggleScreenShare = function(feature) {

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

            $scope.showFrame = false;
            $scope.toggleFrame = function(feature, force, isEvent) {
                if (!$scope.isFeatureActive(feature) || force) {
                    $scope.showFrame = true;
                    addFeature(feature);
                    if (!isEvent) {
                        Pusher.emit(Constants.events.shareLink, 'ok');
                    }
                } else {
                    $scope.showFrame = false;
                    removeFeature(feature);
                }


            };
            Pusher.on(Constants.events.shareLink, function() {
                $scope.toggleFrame('share-link', true, true);
            });

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
