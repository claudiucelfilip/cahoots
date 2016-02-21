(function(){
    'use strict';

    angular
        .module('cahoots', [
            'ui.router',
            'ngStorage',
            'ngResource',
            'pusher-angular'
        ])
        .constant('Constants', {
            api: {
                url: 'https://cahoots-be.dev/'
            },
            events: {
                caption: 'client-caption',
                captionLocal: 'local-caption',
                message: 'client-messageCreated'
            }
        })
        .config([
            '$locationProvider',
            '$stateProvider',
            '$urlRouterProvider',
            function($location, $stateProvider, $urlRouterProvider) {
                $location.hashPrefix('!');

                $stateProvider
                    .state('login', {
                        url: '/',
                        controller: 'LoginCtrl',
                        templateUrl: 'assets/js/login/template.html',
                        params: {
                            roomId: null,
                            requestUser: null,
                            errorExists: null
                        }
                    })
                    .state('privateMeeting', {
                        url: '/:roomId/:pin',
                        controller: 'MeetingCtrl',
                        templateUrl: 'assets/js/meeting/template.html'
                    })
                    .state('meeting', {
                        url: '/:roomId',
                        controller: 'MeetingCtrl',
                        templateUrl: 'assets/js/meeting/template.html',
                        params: {
                            justCreated: null
                        },
                        resolve: {
                            roomDetails: function($state, $stateParams, $q, $localStorage, Api, Error) {
                                var deferred = $q.defer();

                                // Room exists
                                Api.getRoom( { second: $stateParams.roomId },
                                    function(response) {

                                        // Move forward
                                        if($stateParams.justCreated) {
                                            deferred.resolve(response);
                                            return;
                                        }

                                        // Private room
                                        if(response.pin) {

                                        // Public room
                                        } else {

                                            // User exists
                                            if ($localStorage.userName) {

                                                // Add
                                                Api.addUser({ second: response.name, name: $localStorage.userName.name },
                                                    function (response) {
                                                        $localStorage.userName = response.users[response.users.length - 1];
                                                        $localStorage.recentRoom = response;

                                                        $state.go('meeting', { roomId: response.name, justCreated: true });
                                                    },
                                                    function (error) {
                                                        $state.go('login', { roomId: $stateParams.roomId, requestUser: true, errorExists: Error.handler(error) });
                                                    }
                                                );

                                            // Request user
                                            } else {
                                                $state.go('login', { roomId: $stateParams.roomId, requestUser: true });
                                            }
                                        }
                                    },
                                    function(response) {

                                        // Room doesnt exist
                                        if (response.status === 404) {

                                            // Create room
                                            if($localStorage.userName) {
                                                Api.createRoom({ name: $stateParams.roomId, user_name: $localStorage.userName.name },
                                                    function(response) {
                                                        $localStorage.userName = response.users[0];
                                                        $localStorage.recentRoom = response;

                                                        $state.go('meeting', { roomId: response.name, justCreated: true });
                                                    },
                                                    function(error) {
                                                        $state.go('login', { roomId: $stateParams.roomId, errorExists: Error.handler(error) });
                                                    }
                                                );

                                            // Back to login
                                            } else {
                                                $state.go('login', { roomId: $stateParams.roomId });
                                            }

                                        } else {
                                            $state.go('login', { roomId: $stateParams.roomId, errorExists: 'Not sure what happened.' });
                                        }

                                        deferred.resolve(false);
                                    }
                                );

                                return deferred.promise;
                            }
                        }
                    });

                $location.html5Mode(true);
                $urlRouterProvider.otherwise('/login');
            }
        ])
        .run(function($rootScope) {
            $rootScope.side = {
                show: false,
                activeFeatures: []
            };
        })
}());