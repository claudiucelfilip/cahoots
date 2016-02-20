var CHAT = (function() {

    var pusher;
    var channel;

    // Enable pusher logging - don't include this in production
    Pusher.log = function(message) {
        if (window.console && window.console.log) {
            window.console.log(message);
        }
    };

     pusher = new Pusher('765cd15f07fbd9b7ec2a', { encrypted: true });

    // Handle events
    pusher.connection.bind('error', function(error) {
        console.error(error)
    });

    pusher.connection.bind('state_change', function(states) {
        console.log(states.current)
        switch (states.current) {
            case 'connected':
                COMMON.socketId = pusher.connection.socked_id;
                break;
            case 'disconnected':
            case 'failed':
            case 'unavailable':
                break;
        }
    });


    channel = pusher.subscribe('chat-' + COMMON.roomId);
    channel.bind(COMMON.events.messageCreated, function(data) {
        $('[data-remove]').remove();

    });


})();