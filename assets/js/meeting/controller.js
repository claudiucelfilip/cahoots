(function (app) {
    'use strict';

    app.controller('MeetingCtrl',
        function ($scope, $state, $stateParams, $localStorage, Pusher, Constants, Video, Speech, Api, Error) {

            $scope.joinRoom = function(userName) {
                Api.addUser({ second: $stateParams.roomId, name: userName },
                    function(response) {
                        if(typeof($localStorage.rooms) === 'undefined') {
                            $localStorage.rooms = [$stateParams.roomId];
                        } else {
                            $localStorage.rooms.push($stateParams.roomId);
                        }
                        $localStorage.userName = userName;
                        $localStorage.authToken = response.auth_token;
                    },
                    function(error) {
                        $scope.requestUserError = Error.handler(error);
                    }
                );
            };

            $scope.createRoom = function(userName) {
                $scope.needToCreateRoom = false;
                Api.createRoom({ name: $stateParams.roomId, user_name: userName },
                    function(response) {
                        $localStorage.userName = userName;
                        $localStorage.authToken = response.auth_token;

                        // Add to rooms
                        if(typeof($localStorage.rooms) === 'undefined') {
                            $localStorage.rooms = [response.name];
                        } else {
                            $localStorage.rooms.push(response.name);
                        }
                    },
                    function(error) {
                        $scope.error = Error.handler(error);
                    }
                );
            }

            // Room exists
            Api.getRoom({ second: $stateParams.roomId },
                function(response) {
                    // User exists
                    if($localStorage.userName) {

                        // Not joined
                        if ($localStorage.rooms && $localStorage.rooms.indexOf($stateParams.roomId) === -1) {
                            $scope.joinRoom($localStorage.userName);
                        }

                    } else {
                        $scope.requestUser = true;
                    }
                },

                function(response) {
                    // Room doesnt exist
                    if(response.status === 404) {

                        // User exists
                        if($localStorage.userName) {
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
