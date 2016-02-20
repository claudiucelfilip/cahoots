var COMMON = (function() {
    var roomId = location.pathname.replace('/', '') || 'test';

    return {
        roomId: roomId,
        socketId: null,
        events: {
            messageCreated: 'messageCreated'
        }
    }
})();