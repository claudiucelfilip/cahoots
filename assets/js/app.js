(function(){
    'use strict';

    angular
        .module('cahoots', [
            'ui.router',
            'pusher-angular'
        ])
        .constant('Constants', {
            events: {
                messageCreated: 'client-messageCreated'
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
                        url: '/login',
                        controller: 'LoginCtrl',
                        templateUrl: 'assets/js/login/template.html'

                    }).state('meeting', {
                        url: '/:roomId',
                        controller: 'MeetingCtrl',
                        templateUrl: 'assets/js/meeting/template.html'
                    });

                $location.html5Mode(true);
                $urlRouterProvider.otherwise('/login');
            }
        ])
        .run(function(Speech, Translation, Video) {

        });
}());