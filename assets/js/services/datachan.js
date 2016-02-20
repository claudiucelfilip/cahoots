(function () {
    'use strict';

    angular
        .module('cahoots')
        .factory('DataChan',
            function (Pusher, Constants) {
                var dataChannel;

                function messageHandler(data) {

                    for (var i = 0; i < handlers.length; i++) {
                        if (handlers[i].event === data.event) {
                            handlers[i].callback(data.payload);
                        }
                    }

                }

                function init(roomId) {

                    dataChannel = new DataChannel(roomId);

                    dataChannel.onerror = function (error) {
                        console.log("Data Channel Error:", error);
                    };

                    dataChannel.onmessage = messageHandler;

                    dataChannel.onopen = function () {
                        console.log('The Data channel is opened');
                    };

                    dataChannel.onclose = function () {
                        console.log("The Data Channel is Closed");
                    };

                }

                function emit(event, payload) {

                    var data = {
                        event: event,
                        payload: payload
                    };
                    messageHandler(data);
                    dataChannel.send(data);
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
