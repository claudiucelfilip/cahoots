(function(app) {
    'use strict';

    app.controller('LoginCtrl',
        function($scope, $state, $stateParams, $localStorage, Api, Error) {

            if(typeof($localStorage.userName) !== 'undefined') {
                $scope.userName = $localStorage.userName.name;
            }

            if(typeof($localStorage.recentRoom) !== 'undefined') {
                $scope.recentRoom = $localStorage.recentRoom;
            }

            $scope.error = $stateParams.errorExists;
            $scope.requestUser = $stateParams.requestUser;
            $scope.room = $stateParams.roomId;

            $scope.joinRoom = function() {
                Api.addUser({ second: $stateParams.roomId, name: $scope.user },
                    function (response) {
                        $localStorage.userName = response.users[response.users.length - 1];
                        $localStorage.recentRoom = response;

                        $state.go('meeting', { roomId: response.name, justCreated: true });
                    },
                    function (error) {
                        $scope.error = Error.handler(error);
                    }
                );
            };

            // Regular login (create room)
            $scope.createRoom = function() {

                Api.createRoom({ name: $scope.room, user_name: $scope.userName },
                    function(response) {
                        $localStorage.userName = response.users[0];
                        $localStorage.recentRoom = response;

                        Api.startListener({ second: response.name },
                            function(response) {
                                $state.go('meeting', { roomId: response.name, justCreated: true });
                            },
                            function(error) {
                                $scope.error = Error.handler(error);
                            }
                        );
                    },
                    function(error) {
                        $scope.error = Error.handler(error);
                    }
                );
            }
        }
    );

}(angular.module('cahoots')));
