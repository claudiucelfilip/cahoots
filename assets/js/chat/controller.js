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

            $scope.langs = [
                {
                    label: 'Translate to English',
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

            $scope.handleCaption = function(event, data) {

                if(data) {

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

                } else {
                    $scope.$parent.currentMessage = event.text;

                    $timeout.cancel(timeout);
                    timeout = $timeout(function() { $scope.$parent.currentMessage = ''; }, 1500);

                    if(event.streamId) {
                        if(event.streamId !== Video.myStream.id){
                            Video.setMainStreamById(event.streamId);
                        }

                        // Move active class around
                        var index = _.findIndex(Video.streams, function(item) {
                            return item.id === event.streamId;
                        });

                        if(Video.streams[index]) {
                            $(Video.streams[index].el).addClass('active').siblings().removeClass('active');
                        }
                    }

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            };

            $scope.handleMessageLocal = function(event, data) {
                if(data) {
                    Pusher.emitServer(Constants.events.serverActivityEvent, data);
                    $scope.handleMessage(data);
                } else {
                    Pusher.emitServer(Constants.events.serverActivityEvent, event);
                    $scope.handleMessage(event);
                }

            };

            $scope.handleMessage = function(event, data) {
                var payload;

                if(data) {
                    payload = data;
                } else {
                    payload = event;
                }

                var message = new Message(payload);
                $scope.messages.push(message);

                message.translate();
            };

            Pusher.on(Constants.events.message, $scope.handleMessage);
            Pusher.on(Constants.events.caption, $scope.handleCaption);
            $rootScope.$on(Constants.events.captionLocal, $scope.handleCaption);
            $rootScope.$on(Constants.events.messageLocal, $scope.handleMessageLocal);

            $scope.sendMessage = function (message) {
                var payload = {
                    id: Utils.generateId(),
                    type: Constants.types.message,
                    text: message,
                    userName: $localStorage.userName,
                    created: new Date()
                };

                Pusher.emit(Constants.events.message, payload);
                $scope.handleMessageLocal(payload);
            };
        });
}(angular.module('cahoots')));