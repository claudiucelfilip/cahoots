(function(app) {
    'use strict';

    app.controller('LoginCtrl',
        function($scope, $state, $localStorage, Api, Error) {

            if(typeof($localStorage.userName) !== 'undefined') {
                $scope.userName = $localStorage.userName;
            }

            if(typeof($localStorage.rooms) !== 'undefined') {
                $scope.recentRooms = $localStorage.rooms.slice(Math.max($localStorage.rooms.length - 1, 1));
            }

            $scope.createRoom = function() {


                Api.createRoom({ name: $scope.room, user_name: $scope.userName },
                    function(response) {
                        $localStorage.userName = $scope.name;
                        $localStorage.authToken = response.auth_token;

                        if(typeof($localStorage.rooms) === 'undefined') {
                            $localStorage.rooms = [response.name];
                        } else {
                            $localStorage.rooms.push(response.name);
                        }

                        $state.go('meeting', { roomId: response.name });

                    },
                    function(error) {
                        $scope.error = Error.handler(error);
                    }
                );
            }
        }
    );

}(angular.module('cahoots')));
