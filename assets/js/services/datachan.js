(function () {
    'use strict';

    angular
        .module('cahoots')
        .factory('DataChan',
            function (Pusher, Constants) {
                var dataChannel;

                function init(roomId) {

                    dataChannel = new DataChannel(roomId);

                    dataChannel.onerror = function (error) {
                        console.log("Data Channel Error:", error);
                    };

                    dataChannel.onmessage = function (data) {
                        for (var i = 0; i < handlers; i++) {
                            if (handlers[i].event === data.event) {
                                handlers[i].callback(data.payload);
                            }
                        }
                    };

                    dataChannel.onopen = function () {
                        console.log('The Data channel is opened');
                    };

                    dataChannel.onclose = function () {
                        console.log("The Data Channel is Closed");
                    };


                    dataChannel.openSignalingChannel = function(config) {

                        Pusher.on(Constants.events.message, config.onmessage);

                        Pusher.pusher.send = function (data) {
                            Pusher.emit(Constants.events.message, data);
                        };

                        if (config.onopen) setTimeout(config.onopen, 1);
                        return Pusher.pusher;
                    }


                }

                function emit(event, payload) {
                    debugger;
                    dataChannel.send({
                        event: event,
                        payload: payload
                    });
                }

                var handlers = [];

                function on(event, callback) {

                    handlers.push({
                        event: event,
                        callback: callback
                    });
                }

                return {
                    init: init,
                    emit: emit,
                    on: on
                };
            });
}());
