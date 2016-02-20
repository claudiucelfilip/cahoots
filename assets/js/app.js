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
                        url: '/',
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
        .run(function() {

        });
}());