(function () {
    'use strict';

    angular
        .module('cahoots')
        .factory('Pusher', [
            '$pusher',
            function ($pusher) {
                var pusher;

                // Enable pusher logging - don't include this in production
                //Pusher.log = function(message) {
                //    if (window.console && window.console.log) {
                //        window.console.log(message);
                //    }
                //};

                pusher = $pusher(new Pusher('765cd15f07fbd9b7ec2a', { encrypted: true }));

                // Handle events
                pusher.connection.bind('error', function(error) {
                    console.error(error)
                });

                pusher.connection.bind('state_change', function(states) {
                    console.log(states.current)
                    switch (states.current) {
                        case 'connected':
                            pusher.socketId = pusher.connection.socked_id;
                            break;
                        case 'disconnected':
                        case 'failed':
                        case 'unavailable':
                            break;
                    }
                });

                return pusher;
            }
        ]);
}());
