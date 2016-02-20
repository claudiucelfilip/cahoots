(function(app) {
    'use strict';

    app.controller('MeetingCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'Pusher',
        'Constants',
        function($scope, $state, $stateParams, Pusher, Constants) {

            // Chat
            $scope.channel = Pusher.subscribe('chat-' + $stateParams.roomId);
            $scope.channel.bind(Constants.events.messageCreated, function(data) {
                $('[data-remove]').remove();

            });
        }
    ]);

}(angular.module('cahoots')));
