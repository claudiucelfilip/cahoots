(function () {
    'use strict';

    angular
        .module('cahoots')
        .factory('Pusher', [
            '$pusher',
            'Constants',
            function ($pusher, Constants) {
                var pusher;
                var roomId;
                var channel;
                var channelServer;

                // Enable pusher logging - don't include this in production
                //Pusher.log = function(message) {
                //    if (window.console && window.console.log) {
                //        window.console.log(message);
                //    }
                //};

                pusher = $pusher(new Pusher('765cd15f07fbd9b7ec2a', {
                    encrypted: true,
                    authEndpoint: Constants.api.url + 'pusher/auth'
                }));


                // Handle events
                pusher.connection.bind('error', function(error) {
                    console.error(error)
                });

                pusher.connection.bind('state_change', function(states) {
                    switch (states.current) {
                        case 'connected':
                            pusher.socketId = pusher.connection.baseConnection.socket_id;
                            break;
                        case 'disconnected':
                        case 'failed':
                        case 'unavailable':
                            break;
                    }
                });

                function init(id) {
                    roomId = id;
                    channel = pusher.subscribe('private-room-' + roomId);
                    channelServer = pusher.subscribe('private-room-' + roomId + '-server');
                }

                function getRoomId() {
                    return roomId;
                }

                function on(event, callback) {
                    channel.bind(event, callback);
                }

                function emit(event, payload) {
                    channel.trigger(event, payload);
                    return payload;
                }

                function emitServer(payload) {
                    channel.trigger(Constants.events.activityEvent, payload);
                    channelServer.trigger(Constants.events.serverActivityEvent, payload);
                    return payload;
                }

                return {
                    init: init,
                    getRoomId: getRoomId,
                    emit: emit,
                    emitServer: emitServer,
                    on: on,
                    pusher: pusher
                };
            }
        ]);
}());
