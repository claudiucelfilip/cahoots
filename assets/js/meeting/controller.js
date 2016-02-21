(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, $localStorage, Pusher, Constants, Video, Speech, Api, DataChan, Error, Utils, Room, $timeout) {
            Room.setId($stateParams.roomId);

            $scope.joinRoom = function (userName) {
                Api.addUser({second: $stateParams.roomId, name: userName},
                    function (response) {
                        if (typeof($localStorage.rooms) === 'undefined') {
                            $localStorage.rooms = [$stateParams.roomId];
                        } else {
                            $localStorage.rooms.push($stateParams.roomId);
                        }
                        $localStorage.userName = userName;
                        $localStorage.authToken = response.auth_token;
                    },
                    function (error) {
                        $scope.requestUserError = Error.handler(error);
                    }
                );
            };

            $scope.createRoom = function (userName) {
                $scope.needToCreateRoom = false;
                Api.createRoom({name: $stateParams.roomId, user_name: userName},
                    function (response) {
                        $localStorage.userName = userName;
                        $localStorage.authToken = response.auth_token;

                        // Add to rooms
                        if (typeof($localStorage.rooms) === 'undefined') {
                            $localStorage.rooms = [response.name];
                        } else {
                            $localStorage.rooms.push(response.name);
                        }
                    },
                    function (error) {
                        $scope.error = Error.handler(error);
                    }
                );
            };

            // Room exists
            Api.getRoom({second: $stateParams.roomId},
                function (response) {
                    // User exists
                    if ($localStorage.userName) {

                        // Not joined
                        if ($localStorage.rooms && $localStorage.rooms.indexOf($stateParams.roomId) === -1) {
                            $scope.joinRoom($localStorage.userName);
                        }

                    } else {
                        $scope.requestUser = true;
                    }
                },

                function (response) {
                    // Room doesnt exist
                    if (response.status === 404) {

                        // User exists
                        if ($localStorage.userName) {
                            // Create
                            $scope.createRoom($localStorage.userName);

                        } else {
                            $scope.requestUser = true;
                            $scope.needToCreateRoom = true;
                        }
                    } else {
                        $scope.error = Error.handler(response);
                    }
                }
            );

            Pusher.init(Room.getId());
            DataChan.init(Room.getId());

            // Chat
            $scope.messages = [];
            var timeout;

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

                $timeout.cancel(timeout);
                timeout = $timeout(function() {
                    $scope.currentMessage = '';
                }, 1500);


                Video.setMainStreamById(data.streamId);


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

            $scope.toggleSide = function(feature, force) {
                if (typeof force !== 'undefined') {
                    $scope.side.show = force;
                } else {
                    $scope.side.show = !$scope.side.show;
                }

                $scope.toggleFeature(feature);
            };

            $scope.toggleScreenShare = function() {
                if ($scope.isFeatureActive('screen-share')) {
                    Video.shareScreen();
                } else {
                    Video.stopScreen();
                }
            };

            $scope.toggleFeature = function(feature) {
                var index = $scope.side.activeFeatures.indexOf(feature);
                if (index === -1) {
                    $scope.side.activeFeatures.push(feature);
                } else {
                    $scope.side.activeFeatures.splice(index, 1);
                }
            };

            $scope.isFeatureActive = function(feature) {
                return $scope.side.activeFeatures.indexOf(feature) !== -1;
            };
        });

}(angular.module('cahoots')));
