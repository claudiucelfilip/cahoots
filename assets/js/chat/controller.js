(function (app) {
    'use strict';
    app.controller('ChatCtrl',
        function ($scope, Pusher, $stateParams, $rootScope, $localStorage, Constants, $timeout, Video, Message, Error, Api, Utils) {
            var timeout;
            var translate = function() {
                Message.lang = $scope.currentLang.value;

                for (var i = 0; i < $scope.messages.length; i++) {
                    $scope.messages[i].translate().then(function() {

                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                }
            };
            $scope.message = '';

            $scope.langs = [
                {
                    label: 'Do not translate',
                    value: 'en'
                },
                {
                    label: 'Translate to French',
                    value: 'fr'
                },
                {
                    label: 'Translate to Spanish',
                    value: 'es'
                },
                {
                    label: 'Translate to German',
                    value: 'de'
                },
                {
                    label: 'Translate to Romanian',
                    value: 'ro'
                }
            ];
            $scope.currentLang = $scope.langs[0];
            $scope.setLang = function(val) {
                var index = _.findIndex($scope.langs, function(item) {
                    return item.value == val;
                });

                $scope.currentLang = $scope.langs[index];
                translate();
            };

            // Chat Handle Events
            $scope.messages = [];
            Api.getActivity({ second: $stateParams.roomId },
                function(response) {
                    angular.forEach(response, function(mess) {
                        $scope.messages.push(new Message(mess));
                    });
                },
                function(error) {
                    $scope.error = Error.handler(error);
                }
            );

            $scope.searchTerm = '';


            // Activity local
            $scope.activityLocal = function(event, data) {
                var message = new Message(data);
                $scope.messages.push(message);
                message.translate();

                Pusher.emitServer(data);
            };

            // Activity received
            $scope.activityReceived = function(data) {

                var message = new Message(data);
                $scope.messages.push(message);
                message.translate();
            };

            // Caption receive
            $scope.captionReceive = function(data) {
                $scope.$parent.currentMessage = data.text;

                $timeout.cancel(timeout);
                timeout = $timeout(function() { $scope.$parent.currentMessage = ''; }, 1500);

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
                    $scope.$apply();
                }
            };

            // Caption local
            $scope.captionLocal = function(event, data) {
                $scope.captionReceive(data);

                Pusher.emit(Constants.events.caption, data);
            };

            // Voice message
            $scope.voiceMessageLocal = function(event, data) {
                data.type = Constants.types.messageVoice;

                Pusher.emitServer(data, 'onlyServer');


                var message = new Message(data);
                $scope.messages.push(message);

                message.translate();
            };

            // Button
            $scope.sendMessage = function () {

                if (!$scope.message.length ) {
                    return false;
                }
                var payload = {
                    id: Utils.generateId(),
                    type: Constants.types.messageText,
                    text: $scope.message,
                    userName: $localStorage.userName,
                    created: new Date()
                };

                Pusher.emitServer(payload);

                var message = new Message(payload);
                $scope.messages.push(message);

                message.translate();
                $scope.message = '';
            };


            Pusher.on(Constants.events.caption, $scope.captionReceive);
            Pusher.on(Constants.events.activityEvent, $scope.activityReceived);

            $rootScope.$on(Constants.events.captionLocal, $scope.captionLocal);
            $rootScope.$on(Constants.events.messageLocal, $scope.voiceMessageLocal);
            $rootScope.$on(Constants.events.activityEvent, $scope.activityLocal);

            var $chatMessages = $('.chat-messages');

            function getToLast() {
                var offsetTop;

                offsetTop = $chatMessages[0].scrollHeight;

                $chatMessages.animate({scrollTop: offsetTop});
            }
            $scope.$watchCollection('messages', function(newValue, oldValue) {

                if (newValue.length != oldValue.length) {
                    getToLast();
                }
            });
            getToLast();
        });
}(angular.module('cahoots')));